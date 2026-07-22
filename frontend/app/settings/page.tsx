"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/Spinner";
import { ErrorState } from "@/components/common/ErrorState";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/notifications";
import { NotificationPreferences } from "@/types/notification";

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const data = await getNotificationPreferences();
        setPrefs(data);
      } catch {
        setError("Could not load notification preferences.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave() {
    if (!prefs) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateNotificationPreferences(prefs);
      setSaved(true);
    } catch {
      setError("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Spinner className="py-20" label="Loading settings..." />;
  }

  if (error && !prefs) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  if (!prefs) return null;

  return (
    <Card className="glass max-w-2xl">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="flex items-center justify-between rounded-lg border border-border p-3">
          <span className="text-sm">Email notifications</span>
          <input
            type="checkbox"
            checked={prefs.email_enabled}
            onChange={(e) => setPrefs({ ...prefs, email_enabled: e.target.checked })}
            className="h-4 w-4 accent-[hsl(var(--primary))]"
          />
        </label>
        <label className="flex items-center justify-between rounded-lg border border-border p-3">
          <span className="text-sm">Slack notifications</span>
          <input
            type="checkbox"
            checked={prefs.slack_enabled}
            onChange={(e) => setPrefs({ ...prefs, slack_enabled: e.target.checked })}
            className="h-4 w-4 accent-[hsl(var(--primary))]"
          />
        </label>
        <div className="flex items-center gap-3">
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? "Saving..." : "Save preferences"}
          </Button>
          {saved ? <span className="text-sm text-success">Saved</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}
