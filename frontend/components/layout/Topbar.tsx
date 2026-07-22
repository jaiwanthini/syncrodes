"use client";

export function Topbar() {
  return (
    <header className="h-14 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between px-5">
      <div className="text-sm text-neutral-400">Incident Overview</div>
      <div className="flex items-center gap-3">
        {/* Dev B (Phase 15): render <NotificationBell /> here, to the left of the dot below.
            Pull latest main first -- this is Dev A's file, you are adding one component. */}
        <div className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="text-xs font-mono text-neutral-500">All systems monitored</span>
      </div>
    </header>
  );
}