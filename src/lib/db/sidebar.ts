import type { SidebarData } from "@/components/dashboard/Sidebar";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSystemItemTypes } from "@/lib/db/items";
import { getDemoUser } from "@/lib/db/users";
import type { SidebarUser } from "@/types/users";

const SIDEBAR_RECENT_COLLECTIONS_LIMIT = 5;

// Shared by every layout that renders the dashboard shell.
export async function getSidebarData(user: SidebarUser): Promise<SidebarData> {
  const sidebar: SidebarData = {
    itemTypes: [],
    collections: { favorites: [], recent: [] },
    user,
  };

  // Item types and collections still come from the demo user until the data is scoped to the session.
  const demoUser = await getDemoUser();
  if (!demoUser) return sidebar;

  const [itemTypes, collections] = await Promise.all([
    getSystemItemTypes(demoUser.id),
    getSidebarCollections(demoUser.id, SIDEBAR_RECENT_COLLECTIONS_LIMIT),
  ]);
  return { ...sidebar, itemTypes, collections };
}
