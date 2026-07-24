import { AlertTriangle, CheckCircle2, Radar, Siren } from "lucide-react";
import { getIncidents } from "@/lib/incidents";
import { getPredictions } from "@/lib/predictions";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentIncidentsTable } from "@/components/dashboard/RecentIncidentsTable";
import { PredictionsPanel } from "@/components/predictions/PredictionsPanel";
import { DashboardCharts } from "@/components/charts/DashboardCharts";
import {
  AiRecommendationsWidget,
  LearnedMemoryWidget,
  RecentRcaWidget,
} from "@/components/dashboard/AiWidgets";
import {
  buildIncidentTrend,
  buildIncidentsByService,
  buildPredictionConfidence,
  buildSeverityDistribution,
  countResolvedToday,
} from "@/lib/dashboard-metrics";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [incidents, predictions] = await Promise.all([
    getIncidents().catch(() => []),
    getPredictions().catch(() => []),
  ]);

  const open = incidents.filter((incident) => incident.status === "open").length;
  const critical = incidents.filter((incident) => incident.severity === "critical").length;
  const investigating = incidents.filter((incident) => incident.status === "investigating").length;
  const resolvedToday = countResolvedToday(incidents);

  const serviceNames = predictions.map((prediction) => prediction.service);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Open Incidents"
          value={open}
          icon={Siren}
          indicatorClassName="bg-destructive"
        />
        <StatCard
          label="Critical Incidents"
          value={critical}
          icon={AlertTriangle}
          indicatorClassName="bg-warning"
        />
        <StatCard
          label="Investigating"
          value={investigating}
          icon={Radar}
          indicatorClassName="bg-primary"
        />
        <StatCard
          label="Resolved Today"
          value={resolvedToday}
          icon={CheckCircle2}
          indicatorClassName="bg-success"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentIncidentsTable incidents={incidents} />
        </div>
        <PredictionsPanel />
      </div>

      <DashboardCharts
        trend={buildIncidentTrend(incidents)}
        severity={buildSeverityDistribution(incidents)}
        byService={buildIncidentsByService(incidents, serviceNames)}
        confidence={buildPredictionConfidence(predictions)}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <RecentRcaWidget incidents={incidents} />
        <AiRecommendationsWidget incidents={incidents} />
        <LearnedMemoryWidget incidents={incidents} />
      </div>
    </div>
  );
}
