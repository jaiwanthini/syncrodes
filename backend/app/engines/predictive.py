from app.mcp.client import mcp_client

RISK_THRESHOLDS = {
    "cpu_utilization": 80.0,
    "error_rate": 5.0,
    "latency_p99_ms": 800.0,
}

def get_predictions(services: list[dict]) -> list[dict]:
    predictions = []
    cloudwatch = mcp_client.get_connector("cloudwatch")

    if not cloudwatch:
        return predictions

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

    return predictions