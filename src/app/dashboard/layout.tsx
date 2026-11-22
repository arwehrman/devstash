import { redirect } from "next/navigation";
import { connection } from "next/server";

import { auth } from "@/auth";
import { SIGN_IN_PATH } from "@/lib/auth-redirect";

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

  // The proxy already guards /dashboard; this also covers a session that expired mid-request.
  const session = await auth();
  if (!session?.user?.email) redirect(SIGN_IN_PATH);

  const { name, email, image } = session.user;
  let sidebar: SidebarData = {
    itemTypes: [],
    collections: { favorites: [], recent: [] },
    user: { name: name ?? null, email, image: image ?? null },
  };

  // Item types and collections still come from the demo user until the data is scoped to the session.
  const demoUser = await getDemoUser();
  if (demoUser) {
    const [itemTypes, collections] = await Promise.all([
      getSystemItemTypes(demoUser.id),
      getSidebarCollections(demoUser.id, SIDEBAR_RECENT_COLLECTIONS_LIMIT),
    ]);
    sidebar = { ...sidebar, itemTypes, collections };
  }

  return <DashboardShell sidebar={sidebar}>{children}</DashboardShell>;
}
