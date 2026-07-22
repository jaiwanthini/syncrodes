import { apiFetch } from "@/lib/api";
import { TimelineEvent } from "@/types/timeline";

export async function getTimeline(incidentId: string): Promise<TimelineEvent[]> {
  return apiFetch<TimelineEvent[]>(`/api/incidents/${incidentId}/timeline`, {
    method: "GET",
  });
}
