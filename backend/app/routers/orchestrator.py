# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
# pyrefly: ignore [missing-import]
from pydantic import BaseModel

from app.core.auth import get_current_user
from app.orchestrator.graph import orchestrator_graph

router = APIRouter(prefix="/api/orchestrator", tags=["orchestrator"])

class OrchestratorQuery(BaseModel):
    question: str
    context: dict = {}

class OrchestratorResponse(BaseModel):
    answer: str
    sources: list[str]

@router.post("/query", response_model=OrchestratorResponse)
def run_query(payload: OrchestratorQuery, user=Depends(get_current_user)):
    result = orchestrator_graph.invoke({
        "question": payload.question,
        "context": payload.context,
        "intent": "",
        "tools_needed": [],
        "tool_results": {},
        "answer": "",
        "sources": [],
    })
    return {"answer": result["answer"], "sources": result["sources"]}