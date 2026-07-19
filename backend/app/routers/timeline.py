from fastapi import APIRouter, Depends
from uuid import UUID

from app.core.auth import get_current_user
from app.core.supabase_client import supabase

router = APIRouter(prefix="/api/incidents", tags=["timeline"])


@router.get("/{incident_id}/timeline")
def get_timeline(incident_id: UUID, user=Depends(get_current_user)):
    incident = supabase.table("incidents").select("*").eq("id", str(incident_id)).execute().data[0]
    recommendations = supabase.table("recommendations").select("*").eq("incident_id", str(incident_id)).execute().data
    chat = supabase.table("chat_history").select("*").eq("session_id", str(incident_id)).execute().data

    events = [{"type": "created", "timestamp": incident["created_at"], "label": "Incident created"}]
    if incident.get("root_cause"):
        events.append({"type": "root_cause", "timestamp": incident["created_at"], "label": f"Root cause identified: {incident['root_cause']}"})
    for rec in recommendations:
        events.append({"type": "recommendation", "timestamp": rec["created_at"], "label": f"Suggested: {rec['action_type']}"})
    for msg in chat:
        events.append({"type": "chat", "timestamp": msg["created_at"], "label": msg["content"][:80]})
    if incident.get("resolved_at"):
        events.append({"type": "resolved", "timestamp": incident["resolved_at"], "label": "Incident resolved"})

    events.sort(key=lambda e: e["timestamp"])
    return events