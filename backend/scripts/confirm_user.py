import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_KEY:
    print("Missing env vars")
    exit(1)

email = "syncrodes-test-user@gmail.com"
headers = {
    "apiKey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}

# Look up user
resp = requests.get(
    f"{SUPABASE_URL}/auth/v1/admin/users",
    params={"email": email},
    headers=headers,
)
print("Lookup status:", resp.status_code)
print("Lookup body:", resp.text[:500])

users = resp.json().get("users", [])
if not users:
    print("User not found!")
    exit(1)

user_id = users[0]["id"]
print(f"User ID: {user_id}")

# Confirm the user
resp2 = requests.put(
    f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}",
    headers=headers,
    json={"email_confirm": True},
)
print("Confirm status:", resp2.status_code)
print("Confirm body:", resp2.text[:500])
