import { apiFetch } from "@/lib/api";
import { OrchestratorQuery, OrchestratorResponse } from "@/types/orchestrator";

export async function askOrchestrator(query: OrchestratorQuery): Promise<OrchestratorResponse> {
  return apiFetch<OrchestratorResponse>("/api/orchestrator/query", {
    method: "POST",
    body: JSON.stringify(query),
  });
}
