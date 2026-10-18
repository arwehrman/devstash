import { createElement } from "react";
import { Pin, Star } from "lucide-react";

import { formatShortDate } from "@/lib/dashboard";
import { getItemTypeIcon } from "@/lib/item-type-icons";
import type { DashboardItem } from "@/types/items";

interface ItemRowProps {
  item: DashboardItem;
}

export function ItemRow({ item }: ItemRowProps) {
  const color = item.type.color ?? undefined;

  return (
    <article
      className="flex items-start gap-4 rounded-xl border border-l-2 bg-card p-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        {createElement(getItemTypeIcon(item.type.icon), {
          className: "size-4",
          style: { color },
          "aria-label": item.type.name,
        })}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium">{item.title}</h3>
          {item.isPinned && (
            <Pin className="size-3.5 shrink-0 text-muted-foreground" aria-label="Pinned" />
          )}
          {item.isFavorite && (
            <Star
              className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400"
              aria-label="Favorite"
            />
          )}
        </div>
        {item.description && (
          <p className="truncate text-sm text-muted-foreground">
            {item.description}
          </p>
        )}
        {item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <time
        dateTime={item.createdAt.toISOString()}
        className="shrink-0 text-xs text-muted-foreground"
      >
        {formatShortDate(item.createdAt)}
      </time>
    </article>
  );
}
