from typing import TypedDict
import os
# pyrefly: ignore [missing-import]
from groq import Groq
from app.mcp.client import mcp_client

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class OrchestratorState(TypedDict):
    question: str
    context: dict
    intent: str
    tools_needed: list[str]
    tool_results: dict
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
        "failure": ["cloudwatch", "kubernetes", "github"],
        "deployment": ["github", "jenkins"],
        "performance": ["cloudwatch", "kubernetes"],
        "general": ["slack", "jira"],
    }
    state["tools_needed"] = intent_to_tools.get(state["intent"], ["cloudwatch"])
    return state

def mcp_executor(state: OrchestratorState) -> OrchestratorState:
    results = {}
    resource_context = state.get("context", {})
    for tool_name in state["tools_needed"]:
        try:
            connector = mcp_client.get_connector(tool_name)
            if not connector:
                results[tool_name] = {"error": f"Connector {tool_name} not found"}
                continue
            kwargs = resource_context.get(tool_name, {})
            results[tool_name] = {
                "logs": connector.fetch_logs(**kwargs),
                "events": connector.fetch_events(**kwargs),
            }
        except Exception as exc:
            results[tool_name] = {"error": str(exc)}
    state["tool_results"] = results
    return state

def response_synthesizer(state: OrchestratorState) -> OrchestratorState:
    context_text = "\n".join(f"{tool}: {data}" for tool, data in state["tool_results"].items())
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a DevOps incident assistant. Answer using only the provided tool data."},
            {"role": "user", "content": f"Question: {state['question']}\n\nTool data:\n{context_text}"},
        ],
    )
    state["answer"] = completion.choices[0].message.content
    state["sources"] = list(state["tool_results"].keys())
    return state