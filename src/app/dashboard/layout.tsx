import { connection } from "next/server";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { SidebarData } from "@/components/dashboard/Sidebar";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSystemItemTypes } from "@/lib/db/items";
import { getDemoUser } from "@/lib/db/users";

const SIDEBAR_RECENT_COLLECTIONS_LIMIT = 5;

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  await connection();

  const user = await getDemoUser();
  let sidebar: SidebarData = {
    itemTypes: [],
    collections: { favorites: [], recent: [] },
    user: null,
  };

  if (user) {
    const [itemTypes, collections] = await Promise.all([
      getSystemItemTypes(user.id),
      getSidebarCollections(user.id, SIDEBAR_RECENT_COLLECTIONS_LIMIT),
    ]);
    const { name, email, image } = user;
    sidebar = { itemTypes, collections, user: { name, email, image } };
  }

  return <DashboardShell sidebar={sidebar}>{children}</DashboardShell>;
}
