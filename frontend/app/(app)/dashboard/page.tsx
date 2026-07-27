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
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";

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
      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StaggerItem>
          <StatCard label="Open Incidents" value={open} icon={Siren} indicatorClassName="bg-destructive" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Critical Incidents" value={critical} icon={AlertTriangle} indicatorClassName="bg-warning" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Investigating" value={investigating} icon={Radar} indicatorClassName="bg-primary" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Resolved Today" value={resolvedToday} icon={CheckCircle2} indicatorClassName="bg-success" />
        </StaggerItem>
      </StaggerContainer>

      <FadeIn delay={0.15} className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentIncidentsTable incidents={incidents} />
        </div>
        <PredictionsPanel />
      </FadeIn>

      <FadeIn delay={0.25}>
        <DashboardCharts
          trend={buildIncidentTrend(incidents)}
          severity={buildSeverityDistribution(incidents)}
          byService={buildIncidentsByService(incidents, serviceNames)}
          confidence={buildPredictionConfidence(predictions)}
        />
      </FadeIn>

      <FadeIn delay={0.35} className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <RecentRcaWidget incidents={incidents} />
        <AiRecommendationsWidget incidents={incidents} />
        <LearnedMemoryWidget incidents={incidents} />
      </FadeIn>
    </div>
  );
}