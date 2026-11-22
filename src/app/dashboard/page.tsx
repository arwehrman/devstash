import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Clock, Folder, FolderHeart, Layers, Pin, Star } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ItemRow } from "@/components/dashboard/ItemRow";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { SIGN_IN_PATH } from "@/lib/auth-redirect";
import { getCollectionStats, getRecentCollections } from "@/lib/db/collections";
import { getItemStats, getPinnedItems, getRecentItems } from "@/lib/db/items";
import { getCurrentUser } from "@/lib/db/users";

const RECENT_COLLECTIONS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

export default async function DashboardPage() {
  await connection();

  // Pages render alongside their layout, so the page checks the user too.
  const user = await getCurrentUser();
  if (!user) redirect(SIGN_IN_PATH);

  const [recentCollections, collectionStats, pinnedItems, recentItems, itemStats] =
    await Promise.all([
      getRecentCollections(user.id, RECENT_COLLECTIONS_LIMIT),
      getCollectionStats(user.id),
      getPinnedItems(user.id),
      getRecentItems(user.id, RECENT_ITEMS_LIMIT),
      getItemStats(user.id),
    ]);

  const stats = [
    { label: "Items", value: itemStats.total, icon: Layers },
    { label: "Collections", value: collectionStats.total, icon: Folder },
    { label: "Favorite Items", value: itemStats.favorites, icon: Star },
    {
      label: "Favorite Collections",
      value: collectionStats.favorites,
      icon: FolderHeart,
    },
  ];

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
        {recentCollections.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recentCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No collections yet"
            description="Collections group related items, like React Patterns or Interview Prep."
          />
        )}
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
        {recentItems.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No items yet"
            description="Save snippets, prompts, commands, notes and links to see them here."
          />
        )}
      </section>
    </div>
  );
}
