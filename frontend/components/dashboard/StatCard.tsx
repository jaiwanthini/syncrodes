import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  indicatorClassName: string;
}

export function StatCard({ label, value, icon: Icon, indicatorClassName }: StatCardProps) {
  return (
    <Card className="glass overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
          </div>
          <div className="rounded-lg bg-secondary p-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", indicatorClassName)} />
          <span className="text-xs text-muted-foreground">Live from incidents API</span>
        </div>
      </CardContent>
    </Card>
  );
}
