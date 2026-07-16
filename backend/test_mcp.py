import sys
import traceback

try:
    from app.mcp.client import mcp_client
    print("Registered connectors:", mcp_client.list_connectors())
    print("CloudWatch connector:", mcp_client.get_connector("cloudwatch"))
except Exception as e:
    traceback.print_exc()
