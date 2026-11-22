import { cache } from "react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { CurrentUser } from "@/types/users";

// The signed-in user, loaded from the database. Null when signed out, or when the
// session outlives the account (e.g. deleted on another device).
// cache() dedupes the lookup when a layout and page both call it in one request.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true, createdAt: true, password: true },
  });
  if (!user) return null;

  // The password hash never leaves this function; callers only need to know whether one exists.
  const { password, ...rest } = user;
  return { ...rest, hasPassword: password !== null };
});
