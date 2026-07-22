import Link from "next/link";
import { Incident } from "@/types/incident";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { severityBadgeVariant, statusBadgeVariant } from "@/lib/incident-display";
import { formatDateTime } from "@/lib/dashboard-metrics";
import { EmptyState } from "@/components/common/EmptyState";

interface RecentIncidentsTableProps {
  incidents: Incident[];
}

export function RecentIncidentsTable({ incidents }: RecentIncidentsTableProps) {
  const recent = [...incidents]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  return (
    <Card className="glass h-full">
      <CardHeader>
        <CardTitle>Recent Incidents</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {recent.length === 0 ? (
          <EmptyState title="No incidents" description="New incidents will appear here." />
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
              {recent.map((incident) => (
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
