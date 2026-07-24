from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.supabase_client import supabase
from app.core.auth import get_current_user
from app.models.schemas import IncidentCreate, IncidentUpdate, IncidentOut
from app.notifications.dispatcher import dispatch_notification

router = APIRouter(
    prefix="/api/incidents",
    tags=["incidents"]
)


@router.get("", response_model=list[IncidentOut])
def list_incidents(user=Depends(get_current_user)):
    res = (
        supabase.table("incidents")
        .select("*")
        .eq("org_id", str(user.id))
        .order("created_at", desc=True)
        .execute()
    )
    return res.data


@router.post(
    "",
    response_model=IncidentOut,
    status_code=status.HTTP_201_CREATED,
)
def create_incident(payload: IncidentCreate, user=Depends(get_current_user)):
    row = {
        **payload.model_dump(),
        "org_id": str(user.id),
    }

    res = supabase.table("incidents").insert(row).execute()

    if not res.data:
        raise HTTPException(
            status_code=500,
            detail="Failed to create incident",
        )

    incident = res.data[0]
    channels = ["in_app", "slack"] if incident["severity"] in ("high", "critical") else ["in_app"]
    dispatch_notification(
        user_id=str(user.id),
        notif_type="incident",
        message=f"New {incident['severity']} incident: {incident['title']}",
        channels=channels,
    )

    return incident


@router.get("/{incident_id}", response_model=IncidentOut)
def get_incident(incident_id: UUID, user=Depends(get_current_user)):
    res = (
        supabase.table("incidents")
        .select("*")
        .eq("id", str(incident_id))
        .eq("org_id", str(user.id))
        .execute()
    )

    if not res.data:
        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )

    return res.data[0]


@router.patch("/{incident_id}", response_model=IncidentOut)
def update_incident(
    incident_id: UUID,
    payload: IncidentUpdate,
    user=Depends(get_current_user),
):
    updates = payload.model_dump(exclude_none=True)

    res = (
        supabase.table("incidents")
        .update(updates)
        .eq("id", str(incident_id))
        .eq("org_id", str(user.id))
        .execute()
    )

    if not res.data:
        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )

    return res.data[0]