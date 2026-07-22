export interface OrchestratorQuery {
  question: string;
  context?: Record<string, Record<string, unknown>>;
}

export interface OrchestratorResponse {
  answer: string;
  sources: string[];
}
