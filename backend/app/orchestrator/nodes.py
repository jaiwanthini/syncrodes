from typing import TypedDict
import logging
import os
# pyrefly: ignore [missing-import]
from groq import Groq
from app.mcp.client import mcp_client
from app.engines.memory import find_similar_incidents

logger = logging.getLogger(__name__)
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Fallback resource identifiers when the caller doesn't pass explicit context.
# Fill in real values for whichever sources you want the orchestrator to query.
DEFAULT_CONTEXT = {
    "github": {"owner": "YOUR_GITHUB_USERNAME", "repo": "YOUR_REPO_NAME"},
    "jira": {"project": "KAN"},
    "slack": {"channel": "YOUR_SLACK_CHANNEL_ID"},
}

class OrchestratorState(TypedDict):
    question: str
    context: dict
    intent: str
    tools_needed: list[str]
    tool_results: dict
    similar_incidents: list[dict]
    answer: str
    sources: list[str]

def intent_parser(state: OrchestratorState) -> OrchestratorState:
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "Classify the DevOps question intent in one word: failure, deployment, performance, or general."},
            {"role": "user", "content": state["question"]},
        ],
    )
    state["intent"] = completion.choices[0].message.content.strip().lower()
    return state

def tool_selector(state: OrchestratorState) -> OrchestratorState:
    intent_to_tools = {
        "failure": ["github", "jira", "slack"],
        "deployment": ["github", "jenkins"],
        "performance": ["github"],
        "general": ["slack", "jira"],
    }
    state["tools_needed"] = intent_to_tools.get(state["intent"], ["github"])
    return state

def mcp_executor(state: OrchestratorState) -> OrchestratorState:
    results = {}
    resource_context = state.get("context", {})
    for tool_name in state["tools_needed"]:
        try:
            connector = mcp_client.get_connector(tool_name)
            if not connector:
                results[tool_name] = {"error": "unavailable"}
                continue
            kwargs = resource_context.get(tool_name) or DEFAULT_CONTEXT.get(tool_name, {})

            logs, events = [], []
            try:
                logs = connector.fetch_logs(**kwargs)
            except Exception:
                pass
            try:
                events = connector.fetch_events(**kwargs)
            except Exception:
                pass

            if not logs and not events:
                results[tool_name] = {"error": "unavailable"}
            else:
                results[tool_name] = {"logs": logs, "events": events}
        except Exception as exc:
            logger.warning("MCP tool %r failed in orchestrator: %s", tool_name, exc)
            results[tool_name] = {"error": "unavailable"}
    state["tool_results"] = results
    return state

def memory_retriever(state: OrchestratorState) -> OrchestratorState:
    try:
        state["similar_incidents"] = find_similar_incidents(state["question"], match_count=3)
    except Exception:
        state["similar_incidents"] = []
    return state

def response_synthesizer(state: OrchestratorState) -> OrchestratorState:
    available = {
        tool: data for tool, data in state["tool_results"].items() if "error" not in data
    }
    unavailable_tools = [tool for tool in state["tool_results"] if tool not in available]

    context_text = "\n".join(f"{tool}: {data}" for tool, data in available.items())
    if not context_text:
        context_text = "(none)"

    similar = state.get("similar_incidents") or []
    memory_text = "\n".join(
        f"- {item.get('summary')} (resolution: {item.get('resolution') or 'unknown'})"
        for item in similar
    )

    user_content = f"Question: {state['question']}\n\nAvailable tool data:\n{context_text}"
    if unavailable_tools:
        user_content += f"\n\nData sources with no data for this question: {', '.join(unavailable_tools)}"
    if memory_text:
        user_content += f"\n\nSimilar past incidents from memory:\n{memory_text}"

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a DevOps incident assistant. Answer using only the available tool "
                    "data. If a data source had no data for this question, acknowledge the gap in "
                    "one plain sentence and suggest what would help (e.g. a specific service or "
                    "time range) — do not speculate about why it had no data. "
                    "If similar past incidents are provided, use them to inform your answer and "
                    "mention when a past resolution is relevant."
                ),
            },
            {"role": "user", "content": user_content},
        ],
    )
    state["answer"] = completion.choices[0].message.content
    sources = list(state["tool_results"].keys())
    if similar:
        sources.append("memory")
    state["sources"] = sources
    return state