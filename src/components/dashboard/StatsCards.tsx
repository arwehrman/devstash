import type { LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
}

interface StatsCardsProps {
  stats: Stat[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
