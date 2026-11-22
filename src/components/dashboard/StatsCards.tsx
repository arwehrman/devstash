import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
}

interface StatsCardsProps {
  stats: Stat[];
  className?: string;
}

export function StatsCards({ stats, className }: StatsCardsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm">{label}</span>
            <Icon className="size-4" />
          </div>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}
