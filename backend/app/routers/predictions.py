# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.engines.predictive import get_predictions
from app.engines.monitored_services import MONITORED_SERVICES

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

@router.get("")
def list_predictions(user=Depends(get_current_user)):
    return get_predictions(MONITORED_SERVICES)