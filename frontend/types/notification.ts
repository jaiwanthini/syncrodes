export type NotificationType = "incident" | "recommendation" | "system";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  created_at: string;
}

export interface NotificationPreferences {
  slack_enabled: boolean;
  email_enabled: boolean;
  user_id?: string;
}
