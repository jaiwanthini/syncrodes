import os
import json
# pyrefly: ignore [missing-import]
from groq import Groq

# Initialize the Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class RCAEngine:
    def __init__(self):
        # Using the supported model name (llama3-8b-8192 is decommissioned)
        self.model = "llama-3.1-8b-instant"

    def analyze_incident(self, logs: list[dict], metrics: list[dict]) -> dict:
        """
        Analyzes raw log entries and metric telemetry data to determine 
        the definitive root cause of an infrastructure anomaly.
        """
        # Format input data streams cleanly for LLM digestion
        logs_str = "\n".join([f"[{l.get('timestamp')}] {l.get('message')}" for l in logs])
        metrics_str = json.dumps(metrics, indent=2)

        prompt = f"""
        You are an expert Senior Site Reliability Engineer (SRE). 
        Analyze the system logs and metric telemetry below to determine the definitive root cause of the incident.
        
        LOG DATA:
        {logs_str}
        
        METRIC TELEMETRY:
        {metrics_str}
        
        You must output your findings in a strict JSON format matching this exact schema:
        {{
            "root_cause": "Clear, precise one-sentence description of the root failure.",
            "confidence_score": 0.85,
            "impacted_components": ["list", "of", "services", "affected"],
            "summary": "A detailed technical breakdown of the timeline, cascading failures, and system state."
        }}
        """

        try:
            response = client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,  # Low temperature ensures deterministic, structured analysis
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            return {
                "error": "RCA analysis failed execution",
                "details": str(e)
            }