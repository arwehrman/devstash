import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add it to .env");
  }

  const [{ version }] = await prisma.$queryRaw<{ version: string }[]>`SELECT version()`;
  console.log("✅ Connected:", version);

  const counts = {
    users: await prisma.user.count(),
    itemTypes: await prisma.itemType.count(),
    items: await prisma.item.count(),
    collections: await prisma.collection.count(),
    tags: await prisma.tag.count(),
  };
  console.table(counts);
}

main()
  .catch((error: unknown) => {
    console.error("❌ Database test failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
