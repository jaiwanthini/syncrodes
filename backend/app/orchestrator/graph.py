# pyrefly: ignore [missing-import]
from langgraph.graph import StateGraph, END
from app.orchestrator.nodes import (
    OrchestratorState,
    intent_parser,
    tool_selector,
    mcp_executor,
    response_synthesizer,
)

def build_orchestrator_graph():
    graph = StateGraph(OrchestratorState)
    graph.add_node("intent_parser", intent_parser)
    graph.add_node("tool_selector", tool_selector)
    graph.add_node("mcp_executor", mcp_executor)
    graph.add_node("response_synthesizer", response_synthesizer)

    graph.set_entry_point("intent_parser")
    graph.add_edge("intent_parser", "tool_selector")
    graph.add_edge("tool_selector", "mcp_executor")
    graph.add_edge("mcp_executor", "response_synthesizer")
    graph.add_edge("response_synthesizer", END)

    return graph.compile()

orchestrator_graph = build_orchestrator_graph()