import { apiFetch } from "@/lib/api";
import { Notification, NotificationPreferences } from "@/types/notification";

export async function getNotifications(): Promise<Notification[]> {
  return apiFetch<Notification[]>("/api/notifications", { method: "GET" });
}

export async function markNotificationRead(notificationId: string): Promise<{ status: string }> {
  return apiFetch(`/api/notifications/${notificationId}/read`, { method: "POST" });
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return apiFetch<NotificationPreferences>("/api/notifications/preferences", { method: "GET" });
}

export async function updateNotificationPreferences(
  payload: NotificationPreferences
): Promise<{ status: string }> {
  return apiFetch("/api/notifications/preferences", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
