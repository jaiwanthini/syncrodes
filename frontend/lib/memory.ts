import { apiFetch } from "@/lib/api";
import { SimilarIncident } from "@/types/memory";

export async function getSimilarIncidents(
  incidentId: string,
  description: string
): Promise<SimilarIncident[]> {
  const params = new URLSearchParams({ description });
  return apiFetch<SimilarIncident[]>(
    `/api/incidents/${incidentId}/similar?${params.toString()}`,
    { method: "GET" }
  );
}
