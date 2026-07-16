import sys
import os
from dotenv import load_dotenv

# Ensure backend directory is in the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables from .env
load_dotenv()

# Set a dummy API key if not in .env for compilation testing
os.environ.setdefault("OPENAI_API_KEY", "dummy-key-for-testing")

from app.orchestrator.graph import orchestrator_graph

def main():
    print("Invoking orchestrator graph...")
    try:
        result = orchestrator_graph.invoke({
            "question": "Why is my kubernetes deployment failing in us-east-1?",
            "context": {},
            "intent": "",
            "tools_needed": [],
            "tool_results": {},
            "answer": "",
            "sources": [],
        })
        
        print("\n--- RESULTS ---")
        print(f"Determined Intent: {result['intent']}")
        print(f"Tools Used: {result['tools_needed']}")
        print(f"Sources: {result['sources']}")
        print(f"\nFinal Answer:\n{result['answer']}")
        print("\nSmoke test PASSED.")
        
    except Exception as e:
        print(f"\nSmoke test FAILED: {e}")

if __name__ == "__main__":
    main()
