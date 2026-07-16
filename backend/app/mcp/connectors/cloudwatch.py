from __future__ import annotations
import os
import boto3
from datetime import datetime, timedelta, timezone
from app.mcp.connectors.base import MCPConnector

class CloudWatchConnector(MCPConnector):
    name = "cloudwatch"

    def __init__(self):
        region = os.environ.get("AWS_REGION", "us-east-1")
        self.client = boto3.client("logs", region_name=region)
        self.metrics_client = boto3.client("cloudwatch", region_name=region)

    def fetch_logs(self, log_group: str, minutes: int = 30, **kwargs) -> list[dict]:
        start_time = int((datetime.now(timezone.utc) - timedelta(minutes=minutes)).timestamp() * 1000)
        response = self.client.filter_log_events(logGroupName=log_group, startTime=start_time)
        return [{"timestamp": e["timestamp"], "message": e["message"]} for e in response.get("events", [])]

    def fetch_events(self, namespace: str, metric_name: str, minutes: int = 30, **kwargs) -> list[dict]:
        end = datetime.now(timezone.utc)
        start = end - timedelta(minutes=minutes)
        response = self.metrics_client.get_metric_statistics(
            Namespace=namespace,
            MetricName=metric_name,
            StartTime=start,
            EndTime=end,
            Period=60,
            Statistics=["Average", "Maximum"],
        )
        return sorted(response.get("Datapoints", []), key=lambda d: d["Timestamp"])

    def fetch_metadata(self, log_group: str, **kwargs) -> dict:
        response = self.client.describe_log_groups(logGroupNamePrefix=log_group)
        groups = response.get("logGroups", [])
        return groups[0] if groups else {}