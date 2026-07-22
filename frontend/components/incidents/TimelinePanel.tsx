import { getTimeline } from "@/lib/timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDateTime } from "@/lib/dashboard-metrics";

interface TimelinePanelProps {
  incidentId: string;
}

export async function TimelinePanel({ incidentId }: TimelinePanelProps) {
  let events: Awaited<ReturnType<typeof getTimeline>> = [];
  try {
    events = await getTimeline(incidentId);
  } catch {
    events = [];
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <EmptyState title="No timeline events" description="Activity for this incident will appear here." />
        ) : (
          <ol className="relative space-y-4 border-l border-border pl-4">
            {events.map((event, index) => (
              <li key={`${event.timestamp}-${index}`} className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{event.type}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDateTime(event.timestamp)}</span>
                </div>
                <p className="mt-1 text-sm">{event.label}</p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
