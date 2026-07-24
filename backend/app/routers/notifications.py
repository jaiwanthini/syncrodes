from fastapi import APIRouter, Depends
from uuid import UUID

from app.core.auth import get_current_user
from app.core.supabase_client import supabase

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("")
def list_notifications(user=Depends(get_current_user)):
    res = supabase.table("notifications").select("*").eq("user_id", user.id).order("created_at", desc=True).execute()
    return res.data


@router.post("/{notification_id}/read")
def mark_read(notification_id: UUID, user=Depends(get_current_user)):
    supabase.table("notifications").update({"read": True}).eq("id", str(notification_id)).eq("user_id", user.id).execute()
    return {"status": "ok"}


@router.get("/preferences")
def get_preferences(user=Depends(get_current_user)):
    try:
        res = supabase.table("user_preferences").select("*").eq("user_id", user.id).execute()
    except Exception:
        return {"slack_enabled": False, "email_enabled": True}
    return res.data[0] if res.data else {"slack_enabled": False, "email_enabled": True}


@router.put("/preferences")
def update_preferences(payload: dict, user=Depends(get_current_user)):
    payload["user_id"] = str(user.id)
    supabase.table("user_preferences").upsert(payload).execute()
    return {"status": "saved"}