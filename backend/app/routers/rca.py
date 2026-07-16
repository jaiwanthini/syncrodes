from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict

from app.core.auth import get_current_user
from app.engines.rca import RCAEngine

router = APIRouter(prefix="/api/rca", tags=["rca"])
engine = RCAEngine()

class RCAQuery(BaseModel):
    logs: List[Dict]
    metrics: List[Dict]

@router.post("")
def run_rca(payload: RCAQuery, user=Depends(get_current_user)):
    return engine.analyze_incident(payload.logs, payload.metrics)
