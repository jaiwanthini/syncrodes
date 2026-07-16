import sys
import traceback
# pyrefly: ignore [missing-import]
from fastapi.testclient import TestClient
from datetime import datetime, timezone

try:
    from app.mcp.client import mcp_client

    # Mock the cloudwatch connector to simulate an incident
    cloudwatch = mcp_client.get_connector("cloudwatch")
    
    def mock_fetch_events(namespace: str, metric_name: str, minutes: int = 30, **kwargs):
        now = datetime.now(timezone.utc)
        if metric_name == "error_rate":
            # High risk: > 5.0
            return [{"Timestamp": now, "Average": 7.5}]
        elif metric_name == "latency_p99_ms":
            # Medium risk: > 800 * 0.8 (640)
            return [{"Timestamp": now, "Average": 700.0}]
        return []

    if cloudwatch:
        cloudwatch.fetch_events = mock_fetch_events

    # We might need to mock get_current_user if it's there
    from app.routers.predictions import router
    # pyrefly: ignore [missing-import]
    from fastapi import FastAPI
    app = FastAPI()
    app.include_router(router)
    
    # override dependency
    from app.core.auth import get_current_user
    app.dependency_overrides[get_current_user] = lambda: {"user": "test"}

    client = TestClient(app)
    response = client.get("/api/predictions")
    print("Status:", response.status_code)
    import json
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    traceback.print_exc()
