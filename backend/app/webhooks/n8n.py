import os

from fastapi import APIRouter, Header, HTTPException, status

from app.core.supabase_client import supabase
from app.models.schemas import IncidentCreate
from app.notifications.dispatcher import dispatch_notification

router = APIRouter(prefix="/api/webhooks/n8n", tags=["webhooks"])


class N8nIncidentPayload(IncidentCreate):
    org_id: str


def _verify_secret(x_webhook_secret: str | None) -> None:
    expected = os.environ.get("N8N_WEBHOOK_SECRET")
    if not expected or x_webhook_secret != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing webhook secret",
        )


@router.post("/incidents", status_code=status.HTTP_201_CREATED)
def create_incident_from_workflow(
    payload: N8nIncidentPayload,
    x_webhook_secret: str | None = Header(default=None),
):
    """Lets an n8n automation workflow create an incident from an external
    alert (e.g. a monitoring tool with no native MCP connector)."""
    _verify_secret(x_webhook_secret)

    res = supabase.table("incidents").insert(payload.model_dump()).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create incident",
        )

    incident = res.data[0]
    channels = ["in_app", "slack"] if incident["severity"] in ("high", "critical") else ["in_app"]
    dispatch_notification(
        user_id=incident["org_id"],
        notif_type="incident",
        message=f"New {incident['severity']} incident (via n8n): {incident['title']}",
        channels=channels,
    )
    return incident
