export interface SimilarIncident {
  id: string;
  incident_id: string;
  summary: string;
  resolution: string | null;
  similarity?: number;
  created_at?: string;
}
