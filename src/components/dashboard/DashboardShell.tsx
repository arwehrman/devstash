"use client";

import { useState } from "react";

import { Sidebar, type SidebarData } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  sidebar: SidebarData;
  children: React.ReactNode;
}

export function DashboardShell({ sidebar, children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <aside
        className={cn(
          "hidden shrink-0 overflow-hidden border-r transition-[width] duration-200 md:block",
          collapsed ? "w-0 border-r-0" : "w-64"
        )}
        aria-hidden={collapsed}
        inert={collapsed}
      >
        <div className="h-full w-64">
          <Sidebar data={sidebar} />
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 gap-0 p-0 md:hidden">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar
            data={sidebar}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
