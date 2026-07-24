"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Siren,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/layout/SidebarProvider";
import { Button } from "@/components/ui/button";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/incidents", label: "Incidents", icon: Siren },
  { href: "/predictions", label: "Predictions", icon: Activity },
  { href: "/chat", label: "AI Chat", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "relative flex min-h-screen shrink-0 flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Syncrodes
            </p>
            <p className="text-sm font-semibold">DevOps AI</p>
          </div>
        ) : (
          <div className="mx-auto h-8 w-8 rounded-lg bg-primary/20 text-center text-sm font-bold leading-8 text-primary">
            S
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={toggle} className="shrink-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 pb-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative">
              {active ? (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary/15"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              ) : null}
              <span
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed ? item.label : null}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
