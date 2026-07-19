from fastapi import APIRouter, Depends
from fastapi.responses import Response
from uuid import UUID

from app.core.auth import get_current_user
from app.reports.generator import build_report, to_json, to_pdf

router = APIRouter(prefix="/api/incidents", tags=["reports"])


@router.get("/{incident_id}/report")
def get_report(incident_id: UUID, format: str = "json", user=Depends(get_current_user)):
    report = build_report(str(incident_id))
    if format == "pdf":
        return Response(content=to_pdf(report), media_type="application/pdf")
    return Response(content=to_json(report), media_type="application/json")