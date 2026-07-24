import { getIncidents } from "@/lib/incidents";
import { IncidentsTable } from "@/components/incidents/IncidentsTable";

export const dynamic = "force-dynamic";

export default async function IncidentsPage() {
  const incidents = await getIncidents().catch(() => []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">All Incidents</h1>
        <p className="text-sm text-muted-foreground">
          Search, filter, and drill into every incident tracked by the platform.
        </p>
      </div>
      <IncidentsTable incidents={incidents} variant="full" />
    </div>
  );
}
