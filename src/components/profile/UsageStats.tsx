import { Folder, Layers } from "lucide-react";

import { StatsCards } from "@/components/dashboard/StatsCards";
import { formatTypeName } from "@/lib/dashboard";
import { getItemTypeIcon } from "@/lib/item-type-icons";
import type { ItemTypeWithCount } from "@/types/items";

interface UsageStatsProps {
  totalItems: number;
  totalCollections: number;
  itemTypes: ItemTypeWithCount[];
}

export function UsageStats({ totalItems, totalCollections, itemTypes }: UsageStatsProps) {
  const stats = [
    { label: "Items", value: totalItems, icon: Layers },
    { label: "Collections", value: totalCollections, icon: Folder },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Usage</h2>
      <StatsCards stats={stats} className="lg:grid-cols-2" />
      <div className="rounded-xl border bg-card">
        <h3 className="border-b px-4 py-3 text-sm font-medium text-muted-foreground">
          Items by type
        </h3>
        <ul className="grid sm:grid-cols-2">
          {itemTypes.map((type) => {
            const Icon = getItemTypeIcon(type.icon);
            return (
              <li key={type.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <Icon className="size-4 shrink-0" style={{ color: type.color ?? undefined }} />
                <span className="flex-1">{formatTypeName(type.name)}</span>
                <span className="font-medium tabular-nums">{type.count}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
