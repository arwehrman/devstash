# Current Feature: Add Pro Badge to Sidebar

## Status

In Progress

## Goals

- Show a "PRO" badge next to the File and Image item types in the sidebar
- Use the shadcn/ui Badge component
- Keep the badge clean and subtle
- Show the badge text in uppercase ("PRO")

## Notes

- Spec: `context/features/add-pro-badge-sidebar.md`
- File uploads and custom types are Pro features (see Monetization in `project-overview.md`)
- The shadcn Badge component isn't installed yet (`src/components/ui/` only has avatar, button, input, kbd and sheet)

## History

- 2026-10-18: Dashboard UI Phase 1 completed. Set up shadcn/ui (button, input, kbd), made dark mode the default, added the `/dashboard` route with a top bar (search, New Collection, New Item) and placeholders for the sidebar and main area.
- 2026-10-18: Dashboard UI Phase 2 completed. Added a collapsible sidebar (toggle in the top bar, always a drawer on mobile) with item type links to `/items/[type]`, favorite and recent collections, and a user avatar area. Added shadcn sheet and avatar, an item type icon map, and `updatedAt` on mock collections.
- 2026-10-18: Dashboard UI Phase 3 completed. Built the main dashboard area with 4 stats cards (items, collections, favorite items, favorite collections), a recent collections grid, pinned items and 10 recent items, using mock data.
- 2026-10-18: Prisma + Neon PostgreSQL setup completed. Installed Prisma 7 (`prisma-client` generator output to `src/generated/prisma`, `prisma.config.ts` with dotenv, Neon driver adapter, ESM). Added the full schema with NextAuth models, indexes and cascade deletes, the initial `init` migration, a Prisma client singleton in `src/lib/prisma.ts` and a `scripts/test-db.ts` connection test.
- 2026-10-18: Seed data completed. Added `prisma/seed.ts` (re-runnable) with a demo user (`demo@devstash.io`, bcryptjs-hashed password), the 7 system item types and 5 collections with 18 items. Registered the seed in `prisma.config.ts`, added `npm run db:seed`, and extended `scripts/test-db.ts` to display and verify the seeded data.
- 2026-10-18: Dashboard collections completed. Replaced mock collections in the dashboard main area with Prisma data. Added `src/lib/db/collections.ts` (`getRecentCollections`, `getCollectionStats`), a temporary `getDemoUser` in `src/lib/db/users.ts` until auth exists, and collection types in `src/types/collections.ts`. Card border color comes from the collection's most-used item type, with icons for all its types. Collection stats are real; item stats, pinned/recent items and the sidebar still use mock data.
- 2026-10-18: Dashboard items completed. Replaced mock pinned items, recent items and item stats in the dashboard main area with Prisma data. Added `src/lib/db/items.ts` (`getPinnedItems`, `getRecentItems`, `getItemStats`) and item types in `src/types/items.ts`. Item card icon and border color come from the item's type, and tags come from the database. The pinned section is hidden when nothing is pinned. Removed the mock-based `getItemType` helper. The sidebar still uses mock data.
- 2026-10-18: Stats & Sidebar completed. Replaced the sidebar's mock item types, collections and user with Prisma data. Added `getSystemItemTypes` (system types with per-user item counts, fixed order) to `src/lib/db/items.ts` and `getSidebarCollections` (favorites plus 5 recent non-favorites) to `src/lib/db/collections.ts`, sharing a query helper with `getRecentCollections`. The dashboard layout fetches the sidebar data and passes it through `DashboardShell`. Type links go to `/items/[typename]` (singular, e.g. `/items/snippet`), recent collections show a colored circle for their most-used type, and a "View all collections" link was added. `getDemoUser` now returns name, email and image for the sidebar user area. Removed `src/lib/mock-data.ts`.
