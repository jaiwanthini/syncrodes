import { Incident } from "@/types/incident";
import { Prediction } from "@/types/predictions";

export function countResolvedToday(incidents: Incident[]): number {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return incidents.filter((incident) => {
    if (!incident.resolved_at) return false;
    return new Date(incident.resolved_at) >= start;
  }).length;
}

export function buildIncidentTrend(incidents: Incident[]): { date: string; count: number }[] {
  const buckets = new Map<string, number>();
  for (const incident of incidents) {
    const date = new Date(incident.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    buckets.set(date, (buckets.get(date) ?? 0) + 1);
  }
  return Array.from(buckets.entries())
    .map(([date, count]) => ({ date, count }))
    .slice(-7);
}

export function buildSeverityDistribution(incidents: Incident[]) {
  const order = ["critical", "high", "medium", "low"] as const;
  const counts: Record<(typeof order)[number], number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  for (const incident of incidents) {
    counts[incident.severity] += 1;
  }
  return order.map((severity) => ({ severity, count: counts[severity] }));
}

export function buildIncidentsByService(incidents: Incident[], services: string[]) {
  const buckets = new Map<string, number>();
  for (const incident of incidents) {
    const haystack = `${incident.title} ${incident.description ?? ""}`.toLowerCase();
    const matched = services.find((service) => haystack.includes(service.toLowerCase()));
    const key = matched ?? "Other";
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([service, count]) => ({ service, count }));
}

export function buildPredictionConfidence(predictions: Prediction[]) {
  return predictions.map((prediction) => ({
    service: prediction.service,
    confidence: prediction.risk_level === "high" ? 88 : 68,
    risk: prediction.risk_level,
  }));
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
