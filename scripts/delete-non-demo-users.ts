import "dotenv/config";
import { prisma } from "../src/lib/prisma";

// Deletes every user except the demo user, along with all their content.
// Items, collections, tags, custom item types, accounts and sessions are removed by
// the schema's cascade deletes. Verification tokens aren't linked to users, so they're
// deleted by email. System item types (no owner) are left alone.
//
// Dry run by default. Pass --confirm to actually delete:
//   npm run db:cleanup-users              (shows what would be deleted)
//   npm run db:cleanup-users -- --confirm (deletes)

const DEMO_EMAIL = "demo@devstash.io";
const confirmed = process.argv.includes("--confirm");

function databaseHost(): string {
  try {
    return new URL(process.env.DATABASE_URL ?? "").host;
  } catch {
    return "unknown";
  }
}

async function main() {
  console.log(`Database: ${databaseHost()}`);

  // A missing demo user suggests the wrong database, and every user would be deleted.
  const demo = await prisma.user.findUnique({ where: { email: DEMO_EMAIL }, select: { id: true } });
  if (!demo) {
    console.error(`❌ ${DEMO_EMAIL} not found. Aborting without deleting anything.`);
    process.exitCode = 1;
    return;
  }

  const users = await prisma.user.findMany({
    where: { id: { not: demo.id } },
    select: { email: true, _count: { select: { items: true, collections: true } } },
    orderBy: { createdAt: "asc" },
  });
  const tokenWhere = { identifier: { not: DEMO_EMAIL } };
  const tokenCount = await prisma.verificationToken.count({ where: tokenWhere });

  if (users.length === 0 && tokenCount === 0) {
    console.log(`Nothing to delete. Only ${DEMO_EMAIL} exists.`);
    return;
  }

  console.log(`\nUsers to delete (${users.length}):`);
  for (const user of users) {
    console.log(`  - ${user.email} (${user._count.items} items, ${user._count.collections} collections)`);
  }
  console.log(`Verification tokens to delete: ${tokenCount}`);

  if (!confirmed) {
    console.log("\nDry run. Nothing was deleted. Re-run with --confirm to delete.");
    return;
  }

  const [deletedUsers, deletedTokens] = await prisma.$transaction([
    prisma.user.deleteMany({ where: { id: { not: demo.id } } }),
    prisma.verificationToken.deleteMany({ where: tokenWhere }),
  ]);
  console.log(`\n✅ Deleted ${deletedUsers.count} users and ${deletedTokens.count} verification tokens.`);
}

main()
  .catch((error) => {
    console.error("❌ Cleanup failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
