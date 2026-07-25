"""Seed sample incidents and prediction data into Supabase."""
import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_KEY:
    print("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    exit(1)

supabase = create_client(SUPABASE_URL, SERVICE_KEY)

# The user ID from the authenticated test account
USER_ID = "612ed140-9372-4a71-85bb-041807b7150c"
now = datetime.now(timezone.utc)

# ── Sample Incidents ──────────────────────────────────────────────
sample_incidents = [
    {
        "org_id": USER_ID,
        "title": "Payment service error rate spike",
        "description": "Error rate on payment-service jumped to 12% after the latest deployment. Affecting ~1,200 transactions per minute.",
        "status": "open",
        "severity": "critical",
        "root_cause": None,
        "confidence_score": None,
        "created_at": (now - timedelta(minutes=15)).isoformat(),
    },
    {
        "org_id": USER_ID,
        "title": "Checkout latency degradation",
        "description": "p99 latency on checkout-service exceeded 2.3s during peak traffic window. User complaints about slow checkout flow.",
        "status": "investigating",
        "severity": "high",
        "root_cause": "Potential database connection pool exhaustion on checkout-db-primary",
        "confidence_score": 72.5,
        "created_at": (now - timedelta(hours=2)).isoformat(),
    },
    {
        "org_id": USER_ID,
        "title": "Deployment failure on staging environment",
        "description": "Canary deployment v2.14.3 failed health checks on staging. Rolled back automatically.",
        "status": "resolved",
        "severity": "high",
        "root_cause": "Missing environment variable DATABASE_URL in deployment manifest",
        "confidence_score": 95.0,
        "resolved_at": (now - timedelta(hours=1)).isoformat(),
        "created_at": (now - timedelta(hours=3)).isoformat(),
    },
    {
        "org_id": USER_ID,
        "title": "Disk space warning on log aggregator",
        "description": "Log aggregation node logs-01 is at 82% disk usage. Projected to fill within 48 hours at current rate.",
        "status": "open",
        "severity": "medium",
        "root_cause": None,
        "confidence_score": None,
        "created_at": (now - timedelta(hours=5)).isoformat(),
    },
    {
        "org_id": USER_ID,
        "title": "SSL certificate expiry imminent",
        "description": "Wildcard SSL certificate for *.syncrodes.io expires in 5 days. Auto-renewal flag is disabled.",
        "status": "open",
        "severity": "medium",
        "root_cause": "Auto-renewal not configured in certificate manager",
        "confidence_score": 100.0,
        "created_at": (now - timedelta(days=2)).isoformat(),
    },
    {
        "org_id": USER_ID,
        "title": "Memory leak in api-gateway",
        "description": "Memory usage on api-gateway pods grows ~150MB/hour. Identified via gradual OOM kill trend over last 24h.",
        "status": "resolved",
        "severity": "critical",
        "root_cause": "Unclosed gRPC streams in connection pool library v1.5.2",
        "confidence_score": 88.3,
        "resolved_at": (now - timedelta(hours=12)).isoformat(),
        "created_at": (now - timedelta(hours=36)).isoformat(),
    },
]

print("=" * 60)
print("Seeding incidents...")
for i, incident in enumerate(sample_incidents, 1):
    res = supabase.table("incidents").insert(incident).execute()
    if res.data:
        print(f"  [{i}] OK  {incident['title']}  ({incident['severity']}/{incident['status']})")
    else:
        print(f"  [{i}] FAIL  {incident['title']} -- failed")

# ── Sample Notifications ──────────────────────────────────────────
print("\nSeeding notifications...")
sample_notifications = [
    {"user_id": USER_ID, "type": "incident", "message": "Critical: Payment service error rate spike", "read": False},
    {"user_id": USER_ID, "type": "incident", "message": "High: Checkout latency degradation", "read": False},
    {"user_id": USER_ID, "type": "system", "message": "Deployment v2.14.3 rolled back automatically", "read": True},
]
for i, notif in enumerate(sample_notifications, 1):
    res = supabase.table("notifications").insert(notif).execute()
    if res.data:
        print(f"  [{i}] OK  Notification: {notif['message'][:50]}...")
    else:
        print(f"  [{i}] FAIL  Notification failed")

print("\nSeeding complete!")
print(f"   - {len(sample_incidents)} incidents inserted")
print(f"   - {len(sample_notifications)} notifications inserted")
