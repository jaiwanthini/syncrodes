import os
import sys
import json
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()
os.environ.setdefault("GROQ_API_KEY", "dummy-key-for-testing")

from app.engines.rca import RCAEngine

def test_rca_engine():
    print("Initializing RCA Engine...")
    engine = RCAEngine()

    dummy_logs = [
        {"timestamp": "2026-07-16T10:00:00Z", "message": "Starting database connection pool"},
        {"timestamp": "2026-07-16T10:00:05Z", "message": "WARN: High latency detected on primary DB instance"},
        {"timestamp": "2026-07-16T10:00:15Z", "message": "ERROR: Database connection timeout. Connection refused by host 10.0.1.45:5432"},
        {"timestamp": "2026-07-16T10:00:20Z", "message": "FATAL: Application crashing due to inability to establish database session"}
    ]
    
    dummy_metrics = []

    print("Feeding dummy database timeout logs to RCAEngine...")
    try:
        result = engine.analyze_incident(dummy_logs, dummy_metrics)
        print("\n--- RCA ENGINE RESULT ---")
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"\nError executing RCA Engine: {e}")

if __name__ == "__main__":
    test_rca_engine()
