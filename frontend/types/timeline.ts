export type TimelineEventType =
  | "created"
  | "root_cause"
  | "recommendation"
  | "chat"
  | "resolved";

export interface TimelineEvent {
  type: TimelineEventType;
  timestamp: string;
  label: string;
}
