export type ActionType = "rollback" | "restart" | "scale" | "other";

export interface Recommendation {
  id: string;
  incident_id: string;
  action_type: ActionType;
  description: string;
  confidence_score: number | null;
  approved: boolean;
  approved_by: string | null;
  created_at: string;
}
