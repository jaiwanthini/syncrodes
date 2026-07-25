import os, sys, json, requests
from dotenv import load_dotenv

sys.path.insert(0, os.path.join(os.path.dirname(__file__), os.pardir))
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_KEY:
    print("Missing env vars")
    exit(1)

# Login to get a valid auth token
resp = requests.post(
    f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
    headers={"apikey": SERVICE_KEY, "Content-Type": "application/json"},
    json={"email": "syncrodes-test-user@gmail.com", "password": "anubts17"}
)

if resp.status_code != 200:
    print("Login failed:", resp.text[:300])
    exit(1)

token = resp.json()["access_token"]
print("Got token:", token[:40] + "...")

# Test orchestrator
payload = {
    "question": "What caused the payment service error rate spike? Check recent incidents and deployment history.",
    "context": {}
}

orch_resp = requests.post(
    "http://127.0.0.1:8000/api/orchestrator/query",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json=payload
)

print("Orchestrator status:", orch_resp.status_code)
if orch_resp.status_code == 200:
    data = orch_resp.json()
    print("=== ANSWER ===")
    print(data["answer"])
    print()
    print("=== SOURCES ===")
    print(json.dumps(data["sources"], indent=2))
    if data.get("similar_incidents"):
        print("=== SIMILAR INCIDENTS ===")
        for inc in data["similar_incidents"]:
            summary = inc.get("summary", "N/A")[:80]
            print(f"  - {summary}")
else:
    print("Error:", orch_resp.text[:1000])
