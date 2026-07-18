from fastapi import APIRouter, Depends
from uuid import UUID
from pydantic import BaseModel

from app.core.auth import get_current_user
from app.engines.memory import find_similar_incidents, store_incident_memory

router = APIRouter(prefix="/api/incidents", tags=["memory"])


class MemoryStoreRequest(BaseModel):
    summary: str
    resolution: str


@router.get("/{incident_id}/similar")
def similar_incidents(incident_id: UUID, description: str, user=Depends(get_current_user)):
    return find_similar_incidents(description)


@router.post("/{incident_id}/memory")
def save_memory(incident_id: UUID, payload: MemoryStoreRequest, user=Depends(get_current_user)):
    store_incident_memory(str(incident_id), payload.summary, payload.resolution)
    return {"status": "stored"}