import Link from "next/link";
import { getIncident } from "@/lib/incidents";
import { RootCausePanel } from "@/components/incidents/RootCausePanel";
import { SimilarIncidentsPanel } from "@/components/incidents/SimilarIncidentsPanel";
import { RemediationPanel } from "@/components/incidents/RemediationPanel";
import { TimelinePanel } from "@/components/incidents/TimelinePanel";
import { ReportExportButton } from "@/components/incidents/ReportExportButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { severityBadgeVariant, statusBadgeVariant } from "@/lib/incident-display";
import { formatDateTime } from "@/lib/dashboard-metrics";

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const incident = await getIncident(id);

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="glass">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-xl">{incident.title}</CardTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={severityBadgeVariant(incident.severity)}>{incident.severity}</Badge>
              <Badge variant={statusBadgeVariant(incident.status)}>{incident.status}</Badge>
            </div>
          </div>
          <ReportExportButton incidentId={incident.id} />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{incident.description ?? "No description provided."}</p>
          <p className="mt-3 text-xs text-muted-foreground">Created {formatDateTime(incident.created_at)}</p>
          <Link href="/incidents" className="mt-4 inline-block text-sm text-primary hover:underline">
            Back to incidents
          </Link>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Incident Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Organization:</span> {incident.org_id}
              </p>
              <p>
                <span className="text-muted-foreground">Status:</span> {incident.status}
              </p>
              <p>
                <span className="text-muted-foreground">Severity:</span> {incident.severity}
              </p>
              {incident.resolved_at ? (
                <p>
                  <span className="text-muted-foreground">Resolved:</span> {formatDateTime(incident.resolved_at)}
                </p>
              ) : null}
            </CardContent>
          </Card>
          <RootCausePanel rootCause={incident.root_cause} confidenceScore={incident.confidence_score} />
          <SimilarIncidentsPanel
            incidentId={incident.id}
            description={incident.description || incident.title}
          />
        </div>
        <div className="space-y-4">
          <TimelinePanel incidentId={incident.id} />
          <RemediationPanel incidentId={incident.id} />
        </div>
      </div>
    </div>
  );
}
