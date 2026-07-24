import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  indicatorClassName: string;
}

export function StatCard({ label, value, icon: Icon, indicatorClassName }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <span className={cn("h-2 w-2 shrink-0 rounded-full", indicatorClassName)} />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold tabular-nums">{value}</p>
      </div>
      <Icon className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
    </div>
  );
}
