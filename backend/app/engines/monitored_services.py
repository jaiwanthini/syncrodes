MONITORED_SERVICES = [
    {"name": "payment-service", "cloudwatch_namespace": "Syncrodes/Payment", "metric_name": "error_rate"},
    {"name": "checkout-service", "cloudwatch_namespace": "Syncrodes/Checkout", "metric_name": "latency_p99_ms"},
]