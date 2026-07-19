print(">>> recommendations router loaded <<<")
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from app.core.auth import get_current_user
from app.core.supabase_client import supabase

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.get("/incident/{incident_id}")
def list_recommendations(incident_id: UUID, user=Depends(get_current_user)):
    res = supabase.table("recommendations").select("*").eq("incident_id", str(incident_id)).execute()
    return res.data


@router.post("/{recommendation_id}/approve")
def approve_recommendation(recommendation_id: UUID, user=Depends(get_current_user)):
    res = supabase.table("recommendations").update({
        "approved": True,
        "approved_by": str(user.id),
    }).eq("id", str(recommendation_id)).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    _log_audit(recommendation_id, user.id, "approved")
    return res.data[0]


@router.post("/{recommendation_id}/execute")
def execute_recommendation(recommendation_id: UUID, user=Depends(get_current_user)):
    rec_res = supabase.table("recommendations").select("*").eq("id", str(recommendation_id)).execute()
    if not rec_res.data:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    rec = rec_res.data[0]
    if not rec["approved"]:
        raise HTTPException(status_code=400, detail="Recommendation must be approved before execution")

    _execute_action(rec["action_type"], rec["incident_id"])
    _log_audit(recommendation_id, user.id, "executed")
    return {"status": "executed", "action_type": rec["action_type"]}


def _execute_action(action_type: str, incident_id: str) -> None:
    # Wire to real infra calls (Kubernetes/Jenkins connectors) as needed.
    print(f"Executing {action_type} for incident {incident_id}")


def _log_audit(recommendation_id: UUID, user_id: str, action: str) -> None:
    supabase.table("notifications").insert({
        "user_id": user_id,
        "type": "recommendation",
        "message": f"Recommendation {recommendation_id} {action}",
    }).execute()