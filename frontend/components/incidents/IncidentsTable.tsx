"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Filter, Search } from "lucide-react";
import { Incident, IncidentSeverity, IncidentStatus } from "@/types/incident";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/EmptyState";
import { severityBadgeVariant, statusBadgeVariant } from "@/lib/incident-display";
import { formatDateTime } from "@/lib/dashboard-metrics";
import { cn } from "@/lib/utils";

const SEVERITIES: IncidentSeverity[] = ["critical", "high", "medium", "low"];
const STATUSES: IncidentStatus[] = ["open", "investigating", "resolved", "closed"];

const GRID_COLS = "grid-cols-[1fr_110px_130px_140px]";

interface IncidentsTableProps {
  incidents: Incident[];
  variant?: "full" | "compact";
  emptyTitle?: string;
  emptyDescription?: string;
}

function FilterGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: T[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="space-y-1.5">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              aria-pressed={active}
              className={cn(
                "flex w-full items-center justify-between rounded-md border px-2.5 py-1.5 text-left text-xs capitalize transition-colors",
                active
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/40"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function IncidentsTable({
  incidents,
  variant = "full",
  emptyTitle = "No incidents found",
  emptyDescription = "Your incident queue is clear.",
}: IncidentsTableProps) {
  const isCompact = variant === "compact";
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity[]>([]);
  const [statusFilter, setStatusFilter] = useState<IncidentStatus[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return incidents.filter((incident) => {
      const matchesQuery =
        !q ||
        incident.title.toLowerCase().includes(q) ||
        (incident.description ?? "").toLowerCase().includes(q);
      const matchesSeverity = severityFilter.length === 0 || severityFilter.includes(incident.severity);
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(incident.status);
      return matchesQuery && matchesSeverity && matchesStatus;
    });
  }, [incidents, query, severityFilter, statusFilter]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [filtered]
  );

  const rows = isCompact ? sorted.slice(0, 8) : sorted;
  const activeFilterCount = severityFilter.length + statusFilter.length;

  function toggleSeverity(value: IncidentSeverity) {
    setSeverityFilter((cur) => (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]));
  }

  function toggleStatus(value: IncidentStatus) {
    setStatusFilter((cur) => (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]));
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
        <div className="relative min-w-[180px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search incidents..."
            className="h-8 pl-8 text-sm"
          />
        </div>
        {!isCompact && (
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
            className="relative h-8"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
            {activeFilterCount > 0 && (
              <Badge className="ml-1 h-4 min-w-4 justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}
        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
          {rows.length} of {incidents.length}
        </span>
      </div>

      <div className="flex overflow-hidden">
        {!isCompact && (
          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 190, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="shrink-0 overflow-hidden border-r border-border"
              >
                <div className="w-[190px] space-y-4 p-3">
                  <FilterGroup label="Severity" options={SEVERITIES} selected={severityFilter} onToggle={toggleSeverity} />
                  <FilterGroup label="Status" options={STATUSES} selected={statusFilter} onToggle={toggleStatus} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <div className="min-w-0 flex-1 overflow-x-auto">
          {rows.length === 0 ? (
            <div className="p-6">
              <EmptyState title={emptyTitle} description={emptyDescription} />
            </div>
          ) : (
            <div className="min-w-[560px]">
              <div
                className={cn(
                  "grid items-center gap-3 border-b border-border px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground",
                  GRID_COLS
                )}
              >
                <span>Title</span>
                <span>Severity</span>
                <span>Status</span>
                <span>Created</span>
              </div>
              {rows.map((incident) => {
                const expanded = expandedId === incident.id;
                return (
                  <Fragment key={incident.id}>
                    <div
                      role={isCompact ? undefined : "button"}
                      tabIndex={isCompact ? undefined : 0}
                      onClick={() => !isCompact && setExpandedId((cur) => (cur === incident.id ? null : incident.id))}
                      className={cn(
                        "grid items-center gap-3 border-b border-border/60 px-3 py-2.5 text-sm last:border-0",
                        !isCompact && "cursor-pointer hover:bg-muted/40",
                        GRID_COLS
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        {!isCompact && (
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
                              expanded && "rotate-180"
                            )}
                          />
                        )}
                        <Link
                          href={`/incidents/${incident.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="truncate font-medium hover:text-primary"
                        >
                          {incident.title}
                        </Link>
                      </div>
                      <Badge variant={severityBadgeVariant(incident.severity)}>{incident.severity}</Badge>
                      <Badge variant={statusBadgeVariant(incident.status)}>{incident.status}</Badge>
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatDateTime(incident.created_at)}
                      </span>
                    </div>
                    {!isCompact && (
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden border-b border-border/60 bg-muted/30"
                          >
                            <p className="px-3 py-3 text-sm text-muted-foreground">
                              {incident.description || "No description provided."}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
