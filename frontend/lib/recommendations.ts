import { apiFetch } from "@/lib/api";
import { Recommendation } from "@/types/recommendation";

export async function getRecommendations(incidentId: string): Promise<Recommendation[]> {
  return apiFetch<Recommendation[]>(`/api/recommendations/incident/${incidentId}`, {
    method: "GET",
  });
}

export async function approveRecommendation(recommendationId: string): Promise<Recommendation> {
  return apiFetch<Recommendation>(`/api/recommendations/${recommendationId}/approve`, {
    method: "POST",
  });
}

export async function executeRecommendation(recommendationId: string): Promise<{ status: string; action_type: string }> {
  return apiFetch(`/api/recommendations/${recommendationId}/execute`, {
    method: "POST",
  });
}
