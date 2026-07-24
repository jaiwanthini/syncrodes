import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getIncident } from "@/lib/incidents";
import { RootCausePanel } from "@/components/incidents/RootCausePanel";
import { SimilarIncidentsPanel } from "@/components/incidents/SimilarIncidentsPanel";
import { RemediationPanel } from "@/components/incidents/RemediationPanel";
import { TimelinePanel } from "@/components/incidents/TimelinePanel";
import { ReportExportButton } from "@/components/incidents/ReportExportButton";
import { Badge } from "@/components/ui/badge";
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
      <div>
        <Link
          href="/incidents"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to incidents
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">{incident.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={severityBadgeVariant(incident.severity)}>{incident.severity}</Badge>
            <Badge variant={statusBadgeVariant(incident.status)}>{incident.status}</Badge>
            <span className="text-xs text-muted-foreground">
              Created {formatDateTime(incident.created_at)}
            </span>
            {incident.resolved_at ? (
              <span className="text-xs text-muted-foreground">
                &middot; Resolved {formatDateTime(incident.resolved_at)}
              </span>
            ) : null}
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {incident.description ?? "No description provided."}
          </p>
        </div>
        <ReportExportButton incidentId={incident.id} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
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
