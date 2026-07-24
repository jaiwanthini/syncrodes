import { apiFetchServer } from "@/lib/api-server";
import { SimilarIncident } from "@/types/memory";

export async function getSimilarIncidents(
  incidentId: string,
  description: string
): Promise<SimilarIncident[]> {
  const params = new URLSearchParams({ description });
  return apiFetchServer<SimilarIncident[]>(
    `/api/incidents/${incidentId}/similar?${params.toString()}`,
    { method: "GET" }
  );
}
