from __future__ import annotations
import os
import requests
from typing import Any
from app.mcp.connectors.base import MCPConnector

class GitHubConnector(MCPConnector):
    name = "github"

    def __init__(self):
        self.token = os.environ.get("GITHUB_TOKEN")
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
        }
        if self.token:
            self.headers["Authorization"] = f"token {self.token}"

    def fetch_logs(self, repo: str, **kwargs) -> list[dict[str, Any]]:
        # For GitHub, "logs" could be commit history or action logs
        response = requests.get(f"{self.base_url}/repos/{repo}/commits", headers=self.headers)
        response.raise_for_status()
        commits = response.json()
        return [{"timestamp": c["commit"]["author"]["date"], "message": c["commit"]["message"]} for c in commits[:10]]

    def fetch_events(self, repo: str, **kwargs) -> list[dict[str, Any]]:
        # Fetching recent events (issues, PRs, etc.)
        response = requests.get(f"{self.base_url}/repos/{repo}/events", headers=self.headers)
        response.raise_for_status()
        events = response.json()
        return [{"timestamp": e["created_at"], "type": e["type"]} for e in events[:10]]

    def fetch_metadata(self, repo: str, **kwargs) -> dict[str, Any]:
        response = requests.get(f"{self.base_url}/repos/{repo}", headers=self.headers)
        if response.status_code == 200:
            return response.json()
        return {}
