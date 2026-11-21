import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CollectionItemType,
  CollectionStats,
  DashboardCollection,
  SidebarCollections,
} from "@/types/collections";

const SIDEBAR_FAVORITES_LIMIT = 20;

interface TypeCountRow {
  collectionId: string;
  typeId: string;
  count: number;
}

// One aggregate query for all collections: item counts per (collection, type).
async function getTypeCounts(collectionIds: string[]): Promise<TypeCountRow[]> {
  return prisma.$queryRaw<TypeCountRow[]>`
    SELECT ic."collectionId", i."typeId", COUNT(*)::int AS "count"
    FROM "ItemCollection" ic
    JOIN "Item" i ON i."id" = ic."itemId"
    WHERE ic."collectionId" IN (${Prisma.join(collectionIds)})
    GROUP BY ic."collectionId", i."typeId"
  `;
}

async function findCollections(
  args: Pick<Prisma.CollectionFindManyArgs, "where" | "orderBy" | "take">
): Promise<DashboardCollection[]> {
  const collections = await prisma.collection.findMany({
    ...args,
    select: { id: true, name: true, description: true, isFavorite: true },
  });
  if (collections.length === 0) return [];

  const typeCounts = await getTypeCounts(collections.map((c) => c.id));
  const itemTypes = await prisma.itemType.findMany({
    where: { id: { in: [...new Set(typeCounts.map((row) => row.typeId))] } },
    select: { id: true, name: true, icon: true, color: true },
  });
  const typesById = new Map(itemTypes.map((type) => [type.id, type]));

  const typesByCollection = new Map<string, CollectionItemType[]>();
  for (const { collectionId, typeId, count } of typeCounts) {
    const type = typesById.get(typeId);
    if (!type) continue;
    const list = typesByCollection.get(collectionId) ?? [];
    list.push({ ...type, count });
    typesByCollection.set(collectionId, list);
  }

  return collections.map((collection) => {
    const types = (typesByCollection.get(collection.id) ?? []).sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name)
    );
    return {
      ...collection,
      itemCount: types.reduce((sum, type) => sum + type.count, 0),
      types,
    };
  });
}

export async function getRecentCollections(
  userId: string,
  limit: number
): Promise<DashboardCollection[]> {
  return findCollections({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export async function getSidebarCollections(
  userId: string,
  recentLimit: number
): Promise<SidebarCollections> {
  const [favorites, recent] = await Promise.all([
    findCollections({
      where: { userId, isFavorite: true },
      orderBy: { name: "asc" },
      take: SIDEBAR_FAVORITES_LIMIT,
    }),
    findCollections({
      where: { userId, isFavorite: false },
      orderBy: { updatedAt: "desc" },
      take: recentLimit,
    }),
  ]);

  return { favorites, recent };
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
