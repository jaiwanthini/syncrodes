import { API_BASE } from "@/lib/api-config";
import { createClient } from "@/lib/supabase/client";

export async function downloadIncidentReport(
  incidentId: string,
  format: "json" | "pdf" = "json"
): Promise<Blob> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers();
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  const response = await fetch(
    `${API_BASE}/api/incidents/${incidentId}/report?format=${format}`,
    { method: "GET", headers }
  );
  if (!response.ok) {
    throw new Error(`Report download failed: ${response.status}`);
  }
  return response.blob();
}
