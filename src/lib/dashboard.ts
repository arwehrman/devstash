import { itemTypes } from "@/lib/mock-data";

export type ItemType = (typeof itemTypes)[number];

const ITEM_TYPES_BY_ID = new Map(itemTypes.map((type) => [type.id, type]));

export function getItemType(typeId: string): ItemType | undefined {
  return ITEM_TYPES_BY_ID.get(typeId);
}

export function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
