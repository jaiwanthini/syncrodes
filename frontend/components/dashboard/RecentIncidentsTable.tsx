import { Incident } from "@/types/incident";
import { IncidentsTable } from "@/components/incidents/IncidentsTable";

interface RecentIncidentsTableProps {
  incidents: Incident[];
}

export function RecentIncidentsTable({ incidents }: RecentIncidentsTableProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <h2 className="text-sm font-semibold">Recent Incidents</h2>
      <IncidentsTable
        incidents={incidents}
        variant="compact"
        emptyTitle="No incidents"
        emptyDescription="New incidents will appear here."
      />
    </div>
  );
}
