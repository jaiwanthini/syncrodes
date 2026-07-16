from __future__ import annotations
import os
from kubernetes import client, config
from typing import Any
from app.mcp.connectors.base import MCPConnector

class KubernetesConnector(MCPConnector):
    name = "kubernetes"

    def __init__(self):
        try:
            # Tries to load in-cluster config or local kubeconfig
            config.load_kube_config()
        except Exception:
            pass
        self.v1 = client.CoreV1Api()

    def fetch_logs(self, namespace: str, pod_name: str, **kwargs) -> list[dict[str, Any]]:
        try:
            logs = self.v1.read_namespaced_pod_log(name=pod_name, namespace=namespace)
            return [{"timestamp": "N/A", "message": line} for line in logs.splitlines()[-10:]]
        except Exception:
            return []

    def fetch_events(self, namespace: str, **kwargs) -> list[dict[str, Any]]:
        try:
            events = self.v1.list_namespaced_event(namespace)
            return [{"timestamp": str(e.last_timestamp), "type": e.type, "message": e.message} for e in events.items[-10:]]
        except Exception:
            return []

    def fetch_metadata(self, namespace: str, **kwargs) -> dict[str, Any]:
        try:
            ns = self.v1.read_namespace(name=namespace)
            return {"name": ns.metadata.name, "status": ns.status.phase}
        except Exception:
            return {}
