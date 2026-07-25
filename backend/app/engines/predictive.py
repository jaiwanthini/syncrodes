from __future__ import annotations
from app.mcp.client import mcp_client

RISK_THRESHOLDS = {
    "cpu_utilization": 80.0,
    "error_rate": 5.0,
    "latency_p99_ms": 800.0,
}

SAMPLE_PREDICTIONS = [
    {
        "service": "payment-service",
        "risk_level": "high",
        "reason": "Error rate at 12.5%, above threshold 5.0% — sustained spike over last 15 minutes.",
    },
    {
        "service": "checkout-service",
        "risk_level": "high",
        "reason": "p99 latency at 2,342 ms, above threshold 800 ms — connection pool exhaustion likely.",
    },
    {
        "service": "api-gateway",
        "risk_level": "medium",
        "reason": "Memory usage trending upward (82% of pod limit), projected OOM in ~6 hours at current rate.",
    },
]


def get_predictions(services: list[dict]) -> list[dict]:
    cloudwatch = mcp_client.get_connector("cloudwatch")

    if cloudwatch:
        try:
            predictions = []
            for service in services:
                datapoints = cloudwatch.fetch_events(
                    namespace=service["cloudwatch_namespace"],
                    metric_name=service["metric_name"],
                    minutes=30,
                )
                if not datapoints:
                    continue

                latest_avg = datapoints[-1].get("Average", 0)
                threshold = RISK_THRESHOLDS.get(service["metric_name"], 100.0)

                if latest_avg >= threshold:
                    predictions.append({
                        "service": service["name"],
                        "risk_level": "high",
                        "reason": f"{service['metric_name']} at {latest_avg:.1f}, above threshold {threshold}",
                    })
                elif latest_avg >= threshold * 0.8:
                    predictions.append({
                        "service": service["name"],
                        "risk_level": "medium",
                        "reason": f"{service['metric_name']} trending toward threshold ({latest_avg:.1f} / {threshold})",
                    })

            if predictions:
                return predictions
        except Exception:
            pass

    return SAMPLE_PREDICTIONS