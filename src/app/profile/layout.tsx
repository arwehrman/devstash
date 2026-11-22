import { redirect } from "next/navigation";
import { connection } from "next/server";

import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SIGN_IN_PATH } from "@/lib/auth-redirect";
import { getSidebarData } from "@/lib/db/sidebar";

export default async function ProfileLayout({ children }: LayoutProps<"/profile">) {
  await connection();

  // The proxy already guards /profile; this also covers a session that expired mid-request.
  const session = await auth();
  if (!session?.user?.email) redirect(SIGN_IN_PATH);

  const { name, email, image } = session.user;
  const sidebar = await getSidebarData({ name: name ?? null, email, image: image ?? null });

  return <DashboardShell sidebar={sidebar}>{children}</DashboardShell>;
}
