# Current Feature

Create seed script

## Status

In Progress

## Goals

Create a seed script at `prisma/seed.ts` that fills the database with sample data for development and demos. Full spec: @context/features/seed-spec.md

- **Demo user**
  - Email `demo@devstash.io`, name `Demo User`
  - Password `12345678`, hashed with `bcryptjs` (12 rounds)
  - `isPro: false`, `emailVerified` set to the current date
- **System item types** (`isSystem: true`, `userId: null`)
  - snippet (`Code`, `#3b82f6`)
  - prompt (`Sparkles`, `#8b5cf6`)
  - command (`Terminal`, `#f97316`)
  - note (`StickyNote`, `#fde047`)
  - file (`File`, `#6b7280`)
  - image (`Image`, `#ec4899`)
  - link (`Link`, `#10b981`)
- **Collections and items** (all owned by the demo user)
  - **React Patterns** ("Reusable React patterns and hooks"): 3 TypeScript snippets covering custom hooks (useDebounce, useLocalStorage), component patterns (context providers, compound components) and utility functions
  - **AI Workflows** ("AI prompts and workflow automations"): 3 prompts for code review, documentation generation and refactoring help
  - **DevOps** ("Infrastructure and deployment resources"): 1 snippet (Docker or CI/CD config), 1 command (deployment script) and 2 links to real documentation URLs
  - **Terminal Commands** ("Useful shell commands for everyday development"): 4 commands for git, Docker, process management and package managers
  - **Design Resources** ("UI/UX resources and references"): 4 links to real URLs for CSS/Tailwind references, component libraries, design systems and icon libraries
- Register the seed command in `prisma.config.ts` (`migrations.seed`) and add an `npm run db:seed` script

## Notes

- Install `bcryptjs`. `tsx` is already a dev dependency for running the script.
- Make the script safe to re-run. Clear the demo user's data (cascade deletes handle items, collections and join rows), then recreate it.
- Upsert system types with `findFirst` + create/update, not `upsert` on `@@unique([userId, name])`. Postgres treats `NULL` userIds as distinct, so that unique key doesn't match system types.
- Text items (snippet, prompt, command) use `contentType: TEXT` and `content`. Snippets set `language` (e.g. `typescript`, `dockerfile`, `yaml`) and commands use `bash`. Link items use `contentType: URL` and `url`.
- Link each item to its collection through `ItemCollection`.
- Reuse the Prisma client setup from `src/lib/prisma.ts` (Neon adapter) and disconnect when the script finishes.
- Verify with `npx prisma db seed`, then check the rows with `scripts/test-db.ts` or Prisma Studio.

## History

- 2026-10-18: Dashboard UI Phase 1 completed. Set up shadcn/ui (button, input, kbd), made dark mode the default, added the `/dashboard` route with a top bar (search, New Collection, New Item) and placeholders for the sidebar and main area.
- 2026-10-18: Dashboard UI Phase 2 completed. Added a collapsible sidebar (toggle in the top bar, always a drawer on mobile) with item type links to `/items/[type]`, favorite and recent collections, and a user avatar area. Added shadcn sheet and avatar, an item type icon map, and `updatedAt` on mock collections.
- 2026-10-18: Dashboard UI Phase 3 completed. Built the main dashboard area with 4 stats cards (items, collections, favorite items, favorite collections), a recent collections grid, pinned items and 10 recent items, using mock data.
- 2026-10-18: Prisma + Neon PostgreSQL setup completed. Installed Prisma 7 (`prisma-client` generator output to `src/generated/prisma`, `prisma.config.ts` with dotenv, Neon driver adapter, ESM). Added the full schema with NextAuth models, indexes and cascade deletes, the initial `init` migration, a Prisma client singleton in `src/lib/prisma.ts` and a `scripts/test-db.ts` connection test.
