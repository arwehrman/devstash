import Link from "next/link";
import { MoreHorizontal, Star } from "lucide-react";

import { getItemTypeIcon } from "@/lib/item-type-icons";
import type { DashboardCollection } from "@/types/collections";

interface CollectionCardProps {
  collection: DashboardCollection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const { types } = collection;
  const accent = types[0]?.color ?? undefined;

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group relative flex flex-col gap-3 rounded-xl border border-l-2 bg-card p-5 transition-colors hover:bg-accent/40"
      style={{ borderLeftColor: accent }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 font-medium">
            <span className="truncate">{collection.name}</span>
            {collection.isFavorite && (
              <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            {collection.itemCount} items
          </p>
        </div>
        <MoreHorizontal className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">
        {collection.description}
      </p>

      <div className="flex items-center gap-2">
        {types.map((type) => {
          const Icon = getItemTypeIcon(type.icon);
          return (
            <Icon
              key={type.id}
              className="size-4"
              style={{ color: type.color ?? undefined }}
              aria-label={type.name}
            />
          );
        })}
      </div>
    </Link>
  );
}
