import sys
import os

# Ensure backend directory is in the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.mcp.client import MCPClient

def main():
    print("Initializing MCPClient registry...")
    try:
        client = MCPClient()
    except Exception as e:
        print(f"FAILED: Error initializing client: {e}")
        sys.exit(1)

    expected_connectors = ["cloudwatch", "github", "jira", "slack", "kubernetes", "jenkins"]
    registered = client.list_connectors()
    
    print(f"Registered connectors: {registered}")

    success = True
    for name in expected_connectors:
        connector = client.get_connector(name)
        if connector:
            print(f"SUCCESS: Successfully resolved '{name}' connector.")
        else:
            print(f"FAILED: Could not resolve '{name}' connector.")
            success = False

    if success:
        print("\nAll connectors instantiated and registered successfully! Smoke test PASSED.")
    else:
        print("\nSmoke test FAILED.")
        sys.exit(1)

if __name__ == "__main__":
    main()
