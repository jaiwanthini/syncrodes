import { IncidentSeverity, IncidentStatus } from "@/types/incident";
import { BadgeProps } from "@/components/ui/badge";

export function severityBadgeVariant(severity: IncidentSeverity): BadgeProps["variant"] {
  switch (severity) {
    case "critical":
      return "destructive";
    case "high":
      return "warning";
    case "medium":
      return "secondary";
    default:
      return "outline";
  }
}

export function statusBadgeVariant(status: IncidentStatus): BadgeProps["variant"] {
  switch (status) {
    case "resolved":
    case "closed":
      return "success";
    case "investigating":
      return "warning";
    case "open":
      return "destructive";
    default:
      return "outline";
  }
}

export function riskBadgeVariant(risk: "high" | "medium"): BadgeProps["variant"] {
  return risk === "high" ? "destructive" : "warning";
}
