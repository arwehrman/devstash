import { redirect } from "next/navigation";
import { connection } from "next/server";

import { auth } from "@/auth";
import { SIGN_IN_PATH } from "@/lib/auth-redirect";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getSidebarData } from "@/lib/db/sidebar";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  await connection();

  // The proxy already guards /dashboard; this also covers a session that expired mid-request.
  const session = await auth();
  if (!session?.user?.email) redirect(SIGN_IN_PATH);

  const { name, email, image } = session.user;
  const sidebar = await getSidebarData({ name: name ?? null, email, image: image ?? null });

  return <DashboardShell sidebar={sidebar}>{children}</DashboardShell>;
}
