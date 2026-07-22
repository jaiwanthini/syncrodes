import { getIncident } from "@/lib/incidents";
import { RootCausePanel } from "@/components/incidents/RootCausePanel";
import { SimilarIncidentsPanel } from "@/components/incidents/SimilarIncidentsPanel";
import { RemediationPanel } from "@/components/incidents/RemediationPanel";
import { TimelinePanel } from "@/components/incidents/TimelinePanel";
import { ReportExportButton } from "@/components/incidents/ReportExportButton";

/* Final version -- replaces the stub Dev A created in Phase 3. */

export default async function IncidentDetailPage({ params }: { params: { id: string } }) {
  const incident = await getIncident(params.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-6">
        <div>
          <h1 className="text-lg font-semibold">{incident.title}</h1>
          <p className="mt-2 text-sm text-neutral-400">{incident.description}</p>
        </div>
        <ReportExportButton incidentId={incident.id} />
      </div>

      <RootCausePanel incidentId={incident.id} />
      <SimilarIncidentsPanel incidentId={incident.id} description={incident.description || incident.title} />
      <RemediationPanel incidentId={incident.id} />
      <TimelinePanel incidentId={incident.id} />
    </div>
  );
}