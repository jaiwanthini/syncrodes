"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Moon, Search, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/components/layout/ThemeProvider";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/incidents": "Incidents",
  "/chat": "AI Chat",
  "/settings": "Settings",
  "/predictions": "Predictions",
};

export function Topbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");

  const title = useMemo(() => {
    if (pathname.startsWith("/incidents/")) return "Incident Details";
    return PAGE_TITLES[pathname] ?? "Syncrodes";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Overview</p>
        <h1 className="text-sm font-semibold">{title}</h1>
      </div>

      <div className="hidden max-w-md flex-1 md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search incidents, services, recommendations..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Avatar>
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
