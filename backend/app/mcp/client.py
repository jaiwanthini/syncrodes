from __future__ import annotations
from typing import Dict, Optional
from app.mcp.connectors.base import MCPConnector
from app.mcp.connectors.cloudwatch import CloudWatchConnector
from app.mcp.connectors.github import GitHubConnector
from app.mcp.connectors.jira import JiraConnector
from app.mcp.connectors.slack import SlackConnector
from app.mcp.connectors.kubernetes import KubernetesConnector
from app.mcp.connectors.jenkins import JenkinsConnector

class MCPClient:
    """Central registry for all MCP connectors."""

    def __init__(self):
        self._connectors: Dict[str, MCPConnector] = {}
        self._register_default_connectors()

    def _register_default_connectors(self):
        """Automatically registers all known connectors."""
        connectors = [
            CloudWatchConnector(),
            GitHubConnector(),
            JiraConnector(),
            SlackConnector(),
            KubernetesConnector(),
            JenkinsConnector()
        ]
        for connector in connectors:
            self.register_connector(connector)

    def register_connector(self, connector: MCPConnector):
        """Register a single connector instance."""
        self._connectors[connector.name] = connector

    def get_connector(self, name: str) -> Optional[MCPConnector]:
        """Retrieve a connector by its name identifier."""
        return self._connectors.get(name)

    def list_connectors(self) -> list[str]:
        """Return a list of all registered connector names."""
        return list(self._connectors.keys())
mcp_client = MCPClient()        
