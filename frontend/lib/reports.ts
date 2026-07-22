import { API_BASE } from "@/lib/api-config";

export async function downloadIncidentReport(
  incidentId: string,
  format: "json" | "pdf" = "json"
): Promise<Blob> {
  const response = await fetch(
    `${API_BASE}/api/incidents/${incidentId}/report?format=${format}`,
    { method: "GET" }
  );
  if (!response.ok) {
    throw new Error(`Report download failed: ${response.status}`);
  }
  return response.blob();
}
