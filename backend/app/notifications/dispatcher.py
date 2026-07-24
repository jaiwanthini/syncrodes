from app.core.supabase_client import supabase
from app.mcp.client import mcp_client


def dispatch_notification(user_id: str, notif_type: str, message: str, channels: list[str] | None = None) -> None:
    channels = channels or ["in_app"]

    supabase.table("notifications").insert({
        "user_id": user_id,
        "type": notif_type,
        "message": message,
    }).execute()

    if "slack" in channels:
        prefs = get_user_preferences(user_id)
        if prefs.get("slack_enabled") and prefs.get("slack_channel"):
            slack = mcp_client.get_connector("slack")
            if slack:
                slack.send_message(channel=prefs["slack_channel"], text=message)


def get_user_preferences(user_id: str) -> dict:
    try:
        res = supabase.table("user_preferences").select("*").eq("user_id", user_id).execute()
    except Exception:
        return {}
    return res.data[0] if res.data else {}
