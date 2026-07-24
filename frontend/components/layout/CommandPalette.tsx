"use client";

import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Activity, Bot, LayoutDashboard, Settings, Siren } from "lucide-react";

const PAGES = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/incidents", label: "Incidents", icon: Siren },
  { href: "/chat", label: "AI Chat", icon: Bot },
  { href: "/predictions", label: "Predictions", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  function go(href: string) {
    router.push(href);
    onOpenChange(false);
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command menu"
      overlayClassName="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
      className="overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
    >
      <Command.Input
        placeholder="Jump to a page..."
        className="w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
      />
      <Command.List className="max-h-72 overflow-y-auto p-2">
        <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
          No matches found.
        </Command.Empty>
        <Command.Group
          heading="Pages"
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground"
        >
          {PAGES.map((page) => (
            <Command.Item
              key={page.href}
              onSelect={() => go(page.href)}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
            >
              <page.icon className="h-4 w-4 text-muted-foreground" />
              {page.label}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
