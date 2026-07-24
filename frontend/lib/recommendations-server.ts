import { apiFetchServer } from "@/lib/api-server";
import { Recommendation } from "@/types/recommendation";

export async function getRecommendations(incidentId: string): Promise<Recommendation[]> {
  return apiFetchServer<Recommendation[]>(`/api/recommendations/incident/${incidentId}`, {
    method: "GET",
  });
}
