import { apiFetch } from "@/lib/api";
import { Incident } from "@/types/incident";

export async function getIncidents(): Promise<Incident[]> {
  return apiFetch<Incident[]>("/api/incidents", { method: "GET" });
}

export async function getIncident(id: string): Promise<Incident> {
  return apiFetch<Incident>(`/api/incidents/${id}`, { method: "GET" });
}

export async function createIncident(payload: {
  title: string;
  description?: string;
  severity?: Incident["severity"];
}): Promise<Incident> {
  return apiFetch<Incident>("/api/incidents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}