from __future__ import annotations
import os
import jenkins
from typing import Any
from app.mcp.connectors.base import MCPConnector

class JenkinsConnector(MCPConnector):
    name = "jenkins"

    def __init__(self):
        self.url = os.environ.get("JENKINS_URL", "http://localhost:8080")
        self.user = os.environ.get("JENKINS_USER")
        self.token = os.environ.get("JENKINS_TOKEN")
        if self.user and self.token:
            self.server = jenkins.Jenkins(self.url, username=self.user, password=self.token)
        else:
            self.server = jenkins.Jenkins(self.url)

    def fetch_logs(self, job_name: str, **kwargs) -> list[dict[str, Any]]:
        try:
            build_info = self.server.get_job_info(job_name)
            last_build_number = build_info['lastCompletedBuild']['number']
            console = self.server.get_build_console_output(job_name, last_build_number)
            return [{"timestamp": "N/A", "message": line} for line in console.splitlines()[-10:]]
        except Exception:
            return []

    def fetch_events(self, job_name: str, **kwargs) -> list[dict[str, Any]]:
        try:
            build_info = self.server.get_job_info(job_name)
            builds = build_info.get("builds", [])
            return [{"timestamp": "N/A", "type": "build", "number": b.get("number")} for b in builds[:10]]
        except Exception:
            return []

    def fetch_metadata(self, job_name: str, **kwargs) -> dict[str, Any]:
        try:
            info = self.server.get_job_info(job_name)
            return {"name": info.get("name"), "description": info.get("description")}
        except Exception:
            return {}
