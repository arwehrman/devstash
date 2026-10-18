# Current Feature

## Status

Completed

## Goals

## Notes

## History

- 2026-10-18: Dashboard UI Phase 1 completed. Set up shadcn/ui (button, input, kbd), made dark mode the default, added the `/dashboard` route with a top bar (search, New Collection, New Item) and placeholders for the sidebar and main area.
- 2026-10-18: Dashboard UI Phase 2 completed. Added a collapsible sidebar (toggle in the top bar, always a drawer on mobile) with item type links to `/items/[type]`, favorite and recent collections, and a user avatar area. Added shadcn sheet and avatar, an item type icon map, and `updatedAt` on mock collections.
- 2026-10-18: Dashboard UI Phase 3 completed. Built the main dashboard area with 4 stats cards (items, collections, favorite items, favorite collections), a recent collections grid, pinned items and 10 recent items, using mock data.
- 2026-10-18: Prisma + Neon PostgreSQL setup completed. Installed Prisma 7 (`prisma-client` generator output to `src/generated/prisma`, `prisma.config.ts` with dotenv, Neon driver adapter, ESM). Added the full schema with NextAuth models, indexes and cascade deletes, the initial `init` migration, a Prisma client singleton in `src/lib/prisma.ts` and a `scripts/test-db.ts` connection test.
- 2026-10-18: Seed data completed. Added `prisma/seed.ts` (re-runnable) with a demo user (`demo@devstash.io`, bcryptjs-hashed password), the 7 system item types and 5 collections with 18 items. Registered the seed in `prisma.config.ts`, added `npm run db:seed`, and extended `scripts/test-db.ts` to display and verify the seeded data.
