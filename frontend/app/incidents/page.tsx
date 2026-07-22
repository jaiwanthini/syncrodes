import Link from "next/link";
import { getIncidents } from "@/lib/incidents";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { severityBadgeVariant, statusBadgeVariant } from "@/lib/incident-display";
import { formatDateTime } from "@/lib/dashboard-metrics";
import { EmptyState } from "@/components/common/EmptyState";

export const dynamic = "force-dynamic";

export default async function IncidentsPage() {
  const incidents = await getIncidents().catch(() => []);

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>All Incidents</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {incidents.length === 0 ? (
          <EmptyState title="No incidents found" description="Your incident queue is clear." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 pr-3 font-medium">Title</th>
                <th className="pb-3 pr-3 font-medium">Severity</th>
                <th className="pb-3 pr-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} className="group border-b border-border/60 last:border-0">
                  <td className="py-3 pr-3">
                    <Link
                      href={`/incidents/${incident.id}`}
                      className="font-medium transition-colors group-hover:text-primary"
                    >
                      {incident.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-3">
                    <Badge variant={severityBadgeVariant(incident.severity)}>{incident.severity}</Badge>
                  </td>
                  <td className="py-3 pr-3">
                    <Badge variant={statusBadgeVariant(incident.status)}>{incident.status}</Badge>
                  </td>
                  <td className="py-3 text-muted-foreground">{formatDateTime(incident.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
