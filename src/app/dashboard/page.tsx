import Link from "next/link";
import { Clock, Folder, FolderHeart, Layers, Pin, Star } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { ItemRow } from "@/components/dashboard/ItemRow";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { collections, items } from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

export default function DashboardPage() {
  const stats = [
    { label: "Items", value: items.length, icon: Layers },
    { label: "Collections", value: collections.length, icon: Folder },
    {
      label: "Favorite Items",
      value: items.filter((i) => i.isFavorite).length,
      icon: Star,
    },
    {
      label: "Favorite Collections",
      value: collections.filter((c) => c.isFavorite).length,
      icon: FolderHeart,
    },
  ];

  const recentCollections = [...collections]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, RECENT_COLLECTIONS_LIMIT);
  const pinnedItems = items.filter((i) => i.isPinned);
  const recentItems = [...items]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, RECENT_ITEMS_LIMIT);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Your developer knowledge hub</p>
      </header>

      <StatsCards stats={stats} />

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Collections</h2>
          <Link
            href="/collections"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {pinnedItems.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-muted-foreground">
            <Pin className="size-4" />
            Pinned
          </h2>
          <div className="flex flex-col gap-3">
            {pinnedItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4" />
          Recent Items
        </h2>
        <div className="flex flex-col gap-3">
          {recentItems.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
