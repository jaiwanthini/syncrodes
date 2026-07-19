from fastapi import APIRouter, Depends
from uuid import UUID
from pydantic import BaseModel

from app.core.auth import get_current_user
from app.engines.remediation import generate_remediation_suggestions

router = APIRouter(prefix="/api/incidents", tags=["remediation-suggestions"])


class SuggestRequest(BaseModel):
    root_cause: str


@router.post("/{incident_id}/suggestions")
def suggest_remediation(incident_id: UUID, payload: SuggestRequest, user=Depends(get_current_user)):
    return generate_remediation_suggestions(str(incident_id), payload.root_cause)