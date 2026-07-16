from __future__ import annotations
import os
from jira import JIRA
from typing import Any
from app.mcp.connectors.base import MCPConnector

class JiraConnector(MCPConnector):
    name = "jira"

    def __init__(self):
        self.server = os.environ.get("JIRA_SERVER", "https://your-domain.atlassian.net")
        self.email = os.environ.get("JIRA_EMAIL")
        self.api_token = os.environ.get("JIRA_API_TOKEN")
        
        # We handle initialization gracefully for testing purposes if env vars are missing
        if self.email and self.api_token:
            self.client = JIRA(server=self.server, basic_auth=(self.email, self.api_token))
        else:
            self.client = None

    def fetch_logs(self, project_key: str, **kwargs) -> list[dict[str, Any]]:
        if not self.client: return []
        issues = self.client.search_issues(f'project={project_key} ORDER BY created DESC', maxResults=10)
        return [{"timestamp": issue.fields.created, "message": issue.fields.summary} for issue in issues]

    def fetch_events(self, project_key: str, **kwargs) -> list[dict[str, Any]]:
        if not self.client: return []
        issues = self.client.search_issues(f'project={project_key} ORDER BY updated DESC', maxResults=10)
        return [{"timestamp": issue.fields.updated, "type": "issue_updated"} for issue in issues]

    def fetch_metadata(self, project_key: str, **kwargs) -> dict[str, Any]:
        if not self.client: return {}
        try:
            project = self.client.project(project_key)
            return {"name": getattr(project, 'name', ''), "key": project_key}
        except Exception:
            return {}
