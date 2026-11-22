import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type { ProfileUser } from "@/types/users";

// Temporary until auth is added: the dashboard shows the seeded demo user's data.
export const DEMO_USER_EMAIL = "demo@devstash.io";

// cache() dedupes the lookup when the layout and page both call it in one request.
export const getDemoUser = cache(async () => {
  return prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true, name: true, email: true, image: true },
  });
});

// The password hash never leaves this function; the page only needs to know whether one exists.
export async function getProfileUser(userId: string): Promise<ProfileUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true, createdAt: true, password: true },
  });
  if (!user) return null;

  const { password, ...profile } = user;
  return { ...profile, hasPassword: password !== null };
}
