import { prisma } from "@/lib/prisma";
import type {
  CollectionItemType,
  CollectionStats,
  DashboardCollection,
} from "@/types/collections";

type TypeSummary = Omit<CollectionItemType, "count">;

function summarizeTypes(types: TypeSummary[]): CollectionItemType[] {
  const counts = new Map<string, CollectionItemType>();

  for (const type of types) {
    const existing = counts.get(type.id);
    if (existing) existing.count += 1;
    else counts.set(type.id, { ...type, count: 1 });
  }

  return [...counts.values()].sort((a, b) => b.count - a.count);
}

export async function getRecentCollections(
  userId: string,
  limit: number
): Promise<DashboardCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      items: {
        select: {
          item: {
            select: {
              type: { select: { id: true, name: true, icon: true, color: true } },
            },
          },
        },
      },
    },
  });

  return collections.map(({ items, ...collection }) => ({
    ...collection,
    itemCount: items.length,
    types: summarizeTypes(items.map(({ item }) => item.type)),
  }));
}

export async function getCollectionStats(
  userId: string
): Promise<CollectionStats> {
  const [total, favorites] = await Promise.all([
    prisma.collection.count({ where: { userId } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);

  return { total, favorites };
}
