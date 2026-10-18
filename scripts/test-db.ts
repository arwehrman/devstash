import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

const DEMO_EMAIL = "demo@devstash.io";
const DEMO_PASSWORD = "12345678";

const EXPECTED = {
  systemTypes: 7,
  collections: 5,
  items: 18,
};

const failures: string[] = [];

function check(label: string, passed: boolean) {
  console.log(`${passed ? "✅" : "❌"} ${label}`);
  if (!passed) failures.push(label);
}

async function showCounts() {
  const counts = {
    users: await prisma.user.count(),
    itemTypes: await prisma.itemType.count(),
    items: await prisma.item.count(),
    collections: await prisma.collection.count(),
    tags: await prisma.tag.count(),
  };
  console.table(counts);
}

async function showSystemTypes() {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true, userId: null },
    orderBy: { name: "asc" },
    select: { name: true, icon: true, color: true },
  });

  console.log("\n🧩 System item types");
  console.table(types);
  check(`${EXPECTED.systemTypes} system item types`, types.length === EXPECTED.systemTypes);
}

async function showDemoUser() {
  const user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });

  console.log("\n👤 Demo user");
  check(`Demo user ${DEMO_EMAIL} exists`, user !== null);
  if (!user) return null;

  console.table({
    name: user.name,
    email: user.email,
    isPro: user.isPro,
    emailVerified: user.emailVerified?.toISOString() ?? null,
  });

  const passwordMatches = !!user.password && (await bcrypt.compare(DEMO_PASSWORD, user.password));
  check("Password hash matches demo password", passwordMatches);
  check("Email is verified", user.emailVerified !== null);

  return user;
}

async function showCollections(userId: string) {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: {
      items: {
        include: { item: { include: { type: true } } },
        orderBy: { addedAt: "asc" },
      },
    },
  });

  console.log("\n📚 Collections");
  for (const collection of collections) {
    const star = collection.isFavorite ? " ⭐" : "";
    console.log(`\n${collection.name}${star} — ${collection.description ?? ""}`);
    console.table(
      collection.items.map(({ item }) => ({
        type: item.type.name,
        title: item.title,
        detail: item.url ?? item.language ?? "",
        favorite: item.isFavorite,
        pinned: item.isPinned,
      })),
    );
  }

  const itemCount = collections.reduce((sum, c) => sum + c.items.length, 0);
  check(`${EXPECTED.collections} collections`, collections.length === EXPECTED.collections);
  check(`${EXPECTED.items} items linked to collections`, itemCount === EXPECTED.items);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add it to .env");
  }

  const [{ version }] = await prisma.$queryRaw<{ version: string }[]>`SELECT version()`;
  console.log("✅ Connected:", version);

  await showCounts();
  await showSystemTypes();

  const user = await showDemoUser();
  if (user) await showCollections(user.id);

  if (failures.length > 0) {
    throw new Error(`${failures.length} check(s) failed. Run \`npm run db:seed\` first.`);
  }
  console.log("\n🎉 All checks passed");
}

main()
  .catch((error: unknown) => {
    console.error("❌ Database test failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
