export interface OrchestratorQuery {
  question: string;
  context?: Record<string, Record<string, unknown>>;
}

export interface OrchestratorSimilarIncident {
  id: string;
  incident_id: string;
  summary: string;
  resolution: string | null;
  similarity?: number;
}

export interface OrchestratorResponse {
  answer: string;
  sources: string[];
  similar_incidents: OrchestratorSimilarIncident[];
}
