export type IncidentStatus = "open" | "investigating" | "resolved" | "closed";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export interface Incident {
  id: string;
  org_id: string;
  title: string;
  description: string | null;
  status: IncidentStatus;
  severity: IncidentSeverity;
  root_cause: string | null;
  confidence_score: number | null;
  created_at: string;
  resolved_at: string | null;
}