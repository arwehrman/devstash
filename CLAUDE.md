# Devstash

A developer knowledge hub for snippets, commands, prompts, notes,files, images, links and custom types.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md
- @context/screenshots/dashboard-ui-drawer.png
- @context/screenshots/dashboard-ui-main.png

## Commands

- `npm run dev`: start the dev server at http://localhost:3000
- `npm run build`: production build (also type-checks)
- `npm run start`: serve the production build
- `npm run lint`: ESLint (flat config using `eslint-config-next` core-web-vitals + typescript)

No test framework is configured yet.

## Neon Database (MCP)

When using the Neon MCP tools, always target:

- **Project:** `devstash` (id: `proud-art-60881350`)
- **Branch:** `development` (id: `br-ancient-breeze-b5xfq5k2`)

Rules:

- Always pass `project_id` and `branch_id` explicitly on every Neon MCP call. Never leave `branch_id` out, because the default branch is **production**.
- **Never touch the `production` branch** (id: `br-restless-resonance-b5uyreuh`) unless I explicitly say "production" in my message. That includes reads, writes, migrations, branch resets and schema changes.
- If a request is ambiguous about which branch to use, use `development`, or ask.
- Ask before running any destructive SQL (DELETE, DROP, TRUNCATE, UPDATE without WHERE) or any branch, database or role deletion, even on `development`.
- Schema changes go through `prisma migrate dev`, not raw DDL through the MCP (see Database in coding-standards.md).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
