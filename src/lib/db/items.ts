import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  DashboardItem,
  ItemStats,
  ItemTypeWithCount,
} from "@/types/items";

// System types have no sort column, so the sidebar uses this fixed order.
const SYSTEM_TYPE_ORDER = [
  "snippet",
  "prompt",
  "command",
  "note",
  "file",
  "image",
  "link",
];

const DASHBOARD_ITEM_SELECT = {
  id: true,
  title: true,
  description: true,
  isFavorite: true,
  isPinned: true,
  createdAt: true,
  type: { select: { id: true, name: true, icon: true, color: true } },
  tags: { select: { tag: { select: { name: true } } } },
} satisfies Prisma.ItemSelect;

type DashboardItemRow = Prisma.ItemGetPayload<{
  select: typeof DASHBOARD_ITEM_SELECT;
}>;

function toDashboardItem({ tags, ...item }: DashboardItemRow): DashboardItem {
  return { ...item, tags: tags.map(({ tag }) => tag.name) };
}

export async function getPinnedItems(userId: string): Promise<DashboardItem[]> {
  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { createdAt: "desc" },
    select: DASHBOARD_ITEM_SELECT,
  });

  return items.map(toDashboardItem);
}

export async function getRecentItems(
  userId: string,
  limit: number
): Promise<DashboardItem[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: DASHBOARD_ITEM_SELECT,
  });

  return items.map(toDashboardItem);
}

export async function getItemStats(userId: string): Promise<ItemStats> {
  const [total, favorites] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
  ]);

  return { total, favorites };
}

export async function getSystemItemTypes(
  userId: string
): Promise<ItemTypeWithCount[]> {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    select: {
      id: true,
      name: true,
      icon: true,
      color: true,
      _count: { select: { items: { where: { userId } } } },
    },
  });

  return types
    .map(({ _count, ...type }) => ({ ...type, count: _count.items }))
    .sort(
      (a, b) =>
        SYSTEM_TYPE_ORDER.indexOf(a.name) - SYSTEM_TYPE_ORDER.indexOf(b.name)
    );
}
