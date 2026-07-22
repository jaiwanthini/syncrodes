import Link from "next/link";
import { Incident } from "@/types/incident";
import { Recommendation } from "@/types/recommendation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRecommendations } from "@/lib/recommendations";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDateTime } from "@/lib/dashboard-metrics";

interface RecentRcaWidgetProps {
  incidents: Incident[];
}

export function RecentRcaWidget({ incidents }: RecentRcaWidgetProps) {
  const withRca = incidents
    .filter((incident) => incident.root_cause)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Recent Root Cause Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {withRca.length === 0 ? (
          <EmptyState title="No RCA yet" description="Root causes will appear once incidents are analyzed." />
        ) : (
          withRca.map((incident) => (
            <Link
              key={incident.id}
              href={`/incidents/${incident.id}`}
              className="block rounded-lg border border-border/70 p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{incident.title}</p>
                {incident.confidence_score != null ? (
                  <Badge variant="secondary">{Math.round(incident.confidence_score)}%</Badge>
                ) : null}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{incident.root_cause}</p>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface AiRecommendationsWidgetProps {
  incidents: Incident[];
}

export async function AiRecommendationsWidget({ incidents }: AiRecommendationsWidgetProps) {
  const recent = [...incidents]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const recommendationGroups = await Promise.all(
    recent.map(async (incident) => {
      try {
        const items = await getRecommendations(incident.id);
        return { incident, items };
      } catch {
        return { incident, items: [] as Recommendation[] };
      }
    })
  );

  const flat = recommendationGroups.flatMap((group) =>
    group.items.map((item) => ({ ...item, incidentTitle: group.incident.title }))
  );

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>AI Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {flat.length === 0 ? (
          <EmptyState title="No recommendations" description="Recommendations will appear for active incidents." />
        ) : (
          flat.slice(0, 5).map((rec) => (
            <div key={rec.id} className="rounded-lg border border-border/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{rec.incidentTitle}</p>
                <Badge variant="outline">{rec.action_type}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{rec.description}</p>
              {rec.confidence_score != null ? (
                <p className="mt-2 text-xs text-muted-foreground">Confidence: {Math.round(rec.confidence_score)}%</p>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface LearnedMemoryWidgetProps {
  incidents: Incident[];
}

export function LearnedMemoryWidget({ incidents }: LearnedMemoryWidgetProps) {
  const learned = incidents
    .filter((incident) => incident.root_cause && incident.resolved_at)
    .sort((a, b) => new Date(b.resolved_at ?? b.created_at).getTime() - new Date(a.resolved_at ?? a.created_at).getTime())
    .slice(0, 4);

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Recently Learned Memory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {learned.length === 0 ? (
          <EmptyState title="No learned memory yet" description="Resolved incidents with RCA feed organizational memory." />
        ) : (
          learned.map((incident) => (
            <div key={incident.id} className="rounded-lg border border-border/70 p-3">
              <p className="text-sm font-medium">{incident.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{incident.root_cause}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Resolved {formatDateTime(incident.resolved_at ?? incident.created_at)}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
