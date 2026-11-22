import type { SidebarData } from "@/components/dashboard/Sidebar";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSystemItemTypes } from "@/lib/db/items";
import type { CurrentUser } from "@/types/users";

const SIDEBAR_RECENT_COLLECTIONS_LIMIT = 5;

// Shared by every layout that renders the dashboard shell.
export async function getSidebarData(user: CurrentUser): Promise<SidebarData> {
  const [itemTypes, collections] = await Promise.all([
    getSystemItemTypes(user.id),
    getSidebarCollections(user.id, SIDEBAR_RECENT_COLLECTIONS_LIMIT),
  ]);

  // Only the fields the sidebar shows are sent to the client.
  const { name, email, image } = user;
  return { itemTypes, collections, user: { name, email, image } };
}
