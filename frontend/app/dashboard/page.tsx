import { PredictionsPanel } from "@/components/predictions/PredictionsPanel";
import { getIncidents } from "@/lib/incidents";

export default async function DashboardPage() {
  const incidents = await getIncidents();
  const open = incidents.filter((i) => i.status === "open").length;
  const investigating = incidents.filter((i) => i.status === "investigating").length;
  const critical = incidents.filter((i) => i.severity === "critical").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Open" value={open} />
        <StatCard label="Investigating" value={investigating} />
        <StatCard label="Critical" value={critical} />
      </div>
      <PredictionsPanel />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5">
      <div className="text-xs font-mono uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}