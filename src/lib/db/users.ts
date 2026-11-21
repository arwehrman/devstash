import { cache } from "react";

import { prisma } from "@/lib/prisma";

// Temporary until auth is added: the dashboard shows the seeded demo user's data.
const DEMO_USER_EMAIL = "demo@devstash.io";

// cache() dedupes the lookup when the layout and page both call it in one request.
export const getDemoUser = cache(async () => {
  return prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true, name: true, email: true, image: true },
  });
});
