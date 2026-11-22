import { redirect } from "next/navigation";
import { connection } from "next/server";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SIGN_IN_PATH } from "@/lib/auth-redirect";
import { getSidebarData } from "@/lib/db/sidebar";
import { getCurrentUser } from "@/lib/db/users";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  await connection();

  // The proxy already guards /dashboard; this also covers an expired session or a deleted account.
  const user = await getCurrentUser();
  if (!user) redirect(SIGN_IN_PATH);

  const sidebar = await getSidebarData(user);

  return <DashboardShell sidebar={sidebar}>{children}</DashboardShell>;
}
