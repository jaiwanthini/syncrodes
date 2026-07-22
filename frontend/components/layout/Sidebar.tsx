"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/incidents", label: "Incidents" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-neutral-800 bg-neutral-950 min-h-screen">
      <div className="px-5 py-4 text-sm font-mono tracking-widest text-neutral-400 uppercase">
        Syncrodes
      </div>
      <nav className="mt-2 flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                (active
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200")
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

/* Dev B (Phase 9 / Phase 15): add "Chat" and "Predictions" entries to NAV_ITEMS above, e.g.:
   { href: "/chat", label: "Chat" },
   { href: "/predictions", label: "Predictions" },
   Pull latest main first -- this is Dev A's file, you are only adding two lines to the array. */