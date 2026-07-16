from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any

class MCPConnector(ABC):
    """Common interface every MCP-connected tool integration must implement."""

    name: str

    @abstractmethod
    def fetch_logs(self, **kwargs) -> list[dict[str, Any]]:
        raise NotImplementedError

    @abstractmethod
    def fetch_events(self, **kwargs) -> list[dict[str, Any]]:
        raise NotImplementedError

    @abstractmethod
    def fetch_metadata(self, **kwargs) -> dict[str, Any]:
        raise NotImplementedError