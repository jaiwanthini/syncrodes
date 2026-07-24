from __future__ import annotations
import os
# pyrefly: ignore [missing-import]
from slack_sdk import WebClient
# pyrefly: ignore [missing-import]
from slack_sdk.errors import SlackApiError
from typing import Any
from app.mcp.connectors.base import MCPConnector

class SlackConnector(MCPConnector):
    name = "slack"

    def __init__(self):
        self.token = os.environ.get("SLACK_BOT_TOKEN")
        self.client = WebClient(token=self.token) if self.token else None

    def fetch_logs(self, channel_id: str, **kwargs) -> list[dict[str, Any]]:
        if not self.client: return []
        try:
            result = self.client.conversations_history(channel=channel_id, limit=10)
            messages = result.get("messages", [])
            return [{"timestamp": m.get("ts"), "message": m.get("text")} for m in messages]
        except SlackApiError:
            return []

    def fetch_events(self, channel_id: str, **kwargs) -> list[dict[str, Any]]:
        # Map message events 
        if not self.client: return []
        try:
            result = self.client.conversations_history(channel=channel_id, limit=10)
            return [{"timestamp": m.get("ts"), "type": m.get("type")} for m in result.get("messages", [])]
        except SlackApiError:
            return []

    def fetch_metadata(self, channel_id: str, **kwargs) -> dict[str, Any]:
        if not self.client: return {}
        try:
            result = self.client.conversations_info(channel=channel_id)
            channel = result.get("channel", {})
            return {"id": channel.get("id"), "name": channel.get("name")}
        except SlackApiError:
            return {}

    def send_message(self, channel: str, text: str) -> bool:
        if not self.client:
            return False
        try:
            self.client.chat_postMessage(channel=channel, text=text)
            return True
        except SlackApiError:
            return False
