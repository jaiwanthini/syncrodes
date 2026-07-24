import { apiFetchServer } from "@/lib/api-server";
import { TimelineEvent } from "@/types/timeline";

export async function getTimeline(incidentId: string): Promise<TimelineEvent[]> {
  return apiFetchServer<TimelineEvent[]>(`/api/incidents/${incidentId}/timeline`, {
    method: "GET",
  });
}
