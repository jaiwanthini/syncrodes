import json
from io import BytesIO
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas

from app.core.supabase_client import supabase


def build_report(incident_id: str) -> dict:
    incident = supabase.table("incidents").select("*").eq("id", incident_id).execute().data[0]
    recommendations = supabase.table("recommendations").select("*").eq("incident_id", incident_id).execute().data

    return {
        "executive_summary": f"Incident '{incident['title']}' ({incident['severity']}) -- status: {incident['status']}.",
        "root_cause": incident.get("root_cause"),
        "confidence_score": incident.get("confidence_score"),
        "recommendations": recommendations,
        "created_at": incident["created_at"],
        "resolved_at": incident.get("resolved_at"),
    }


def to_json(report: dict) -> bytes:
    return json.dumps(report, indent=2, default=str).encode("utf-8")


def to_pdf(report: dict) -> bytes:
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=LETTER)
    y = 750
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, "Incident Report")
    y -= 30
    pdf.setFont("Helvetica", 10)
    for label, value in [
        ("Executive Summary", report["executive_summary"]),
        ("Root Cause", report.get("root_cause") or "Not yet determined"),
        ("Confidence Score", str(report.get("confidence_score") or "N/A")),
    ]:
        pdf.drawString(50, y, f"{label}: {value}")
        y -= 20
    y -= 10
    pdf.drawString(50, y, "Recommendations:")
    y -= 20
    for rec in report["recommendations"]:
        pdf.drawString(60, y, f"- [{rec['action_type']}] {rec['description']}")
        y -= 18
    pdf.save()
    buffer.seek(0)
    return buffer.read()