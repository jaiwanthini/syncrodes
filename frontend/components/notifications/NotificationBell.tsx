"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getNotifications, markNotificationRead } from "@/lib/notifications";
import { Notification } from "@/types/notification";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/dashboard-metrics";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const unread = items.filter((item) => !item.read).length;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleRead(id: string) {
    await markNotificationRead(id);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)} aria-label="Notifications">
        <Bell className="h-4 w-4" />
        {unread > 0 ? (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        ) : null}
      </Button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-80 rounded-xl border border-border bg-card p-2 shadow-xl">
          <div className="mb-2 flex items-center justify-between px-2 py-1">
            <p className="text-sm font-medium">Notifications</p>
            {unread > 0 ? <Badge variant="destructive">{unread} new</Badge> : null}
          </div>
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {loading ? <p className="px-2 py-4 text-sm text-muted-foreground">Loading...</p> : null}
            {!loading && items.length === 0 ? (
              <p className="px-2 py-4 text-sm text-muted-foreground">No notifications yet.</p>
            ) : null}
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void handleRead(item.id)}
                className={cn(
                  "w-full rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent",
                  !item.read && "bg-accent/40"
                )}
              >
                <p className="text-xs uppercase text-muted-foreground">{item.type}</p>
                <p className="text-sm">{item.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(item.created_at)}</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
