export interface RootCauseResult {
    root_cause: string;
    confidence_score: number;
    evidence: { source: string; detail: unknown }[];
  }