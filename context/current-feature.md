# Current Feature

Prisma + Neon PostgreSQL Setup

## Status

Completed

## Goals

- Set up Prisma 7 ORM with Neon PostgreSQL (serverless)
- Create the initial schema based on the data models in @context/project-overview.md (this will evolve)
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Create the initial migration with `prisma migrate dev`

## Notes

- `DATABASE_URL` points to the Neon development branch; there is a separate production branch.
- ALWAYS create migrations; never use `db push` unless specified.
- Use Prisma 7, which has breaking changes. Read the upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Setup guide: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
- References: @context/features/database-spec.md, @context/project-overview.md, @context/coding-standards.md

## History

- 2026-10-18: Dashboard UI Phase 1 completed. Set up shadcn/ui (button, input, kbd), made dark mode the default, added the `/dashboard` route with a top bar (search, New Collection, New Item) and placeholders for the sidebar and main area.
- 2026-10-18: Dashboard UI Phase 2 completed. Added a collapsible sidebar (toggle in the top bar, always a drawer on mobile) with item type links to `/items/[type]`, favorite and recent collections, and a user avatar area. Added shadcn sheet and avatar, an item type icon map, and `updatedAt` on mock collections.
- 2026-10-18: Dashboard UI Phase 3 completed. Built the main dashboard area with 4 stats cards (items, collections, favorite items, favorite collections), a recent collections grid, pinned items and 10 recent items, using mock data.
- 2026-10-18: Prisma + Neon PostgreSQL setup completed. Installed Prisma 7 (`prisma-client` generator output to `src/generated/prisma`, `prisma.config.ts` with dotenv, Neon driver adapter, ESM). Added the full schema with NextAuth models, indexes and cascade deletes, the initial `init` migration, a Prisma client singleton in `src/lib/prisma.ts` and a `scripts/test-db.ts` connection test.
