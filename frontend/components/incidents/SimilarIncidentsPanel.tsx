import { getSimilarIncidents } from "@/lib/memory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";

interface SimilarIncidentsPanelProps {
  incidentId: string;
  description: string;
}

export async function SimilarIncidentsPanel({ incidentId, description }: SimilarIncidentsPanelProps) {
  let similar: Awaited<ReturnType<typeof getSimilarIncidents>> = [];
  try {
    similar = await getSimilarIncidents(incidentId, description);
  } catch {
    similar = [];
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Similar Incidents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {similar.length === 0 ? (
          <EmptyState title="No similar incidents" description="Memory engine did not find close matches yet." />
        ) : (
          similar.map((item) => (
            <div key={item.id} className="rounded-lg border border-border/70 p-3">
              <p className="text-sm font-medium">{item.summary}</p>
              {item.resolution ? (
                <p className="mt-2 text-sm text-muted-foreground">Resolution: {item.resolution}</p>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
