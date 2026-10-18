# Current Feature

Dashboard UI Phase 3

## Status

Completed

## Goals

- Build the main area to the right of the sidebar
- Recent collections
- Pinned items
- 10 recent items
- 4 stats cards at the top: number of items, collections, favorite items and favorite collections (not in screenshot)

## Notes

- Phase 3 of 3 for the dashboard UI layout.
- Use @context/screenshots/dashboard-ui-main.png as the visual reference.
- Import data directly from @src/lib/mock-data.js until the database is implemented.
- References: @context/project-overview.md, @context/features/dashboard-phase-1-spec.md, @context/features/dashboard-phase-2-spec.md

## History

- 2026-10-18: Dashboard UI Phase 1 completed. Set up shadcn/ui (button, input, kbd), made dark mode the default, added the `/dashboard` route with a top bar (search, New Collection, New Item) and placeholders for the sidebar and main area.
- 2026-10-18: Dashboard UI Phase 2 completed. Added a collapsible sidebar (toggle in the top bar, always a drawer on mobile) with item type links to `/items/[type]`, favorite and recent collections, and a user avatar area. Added shadcn sheet and avatar, an item type icon map, and `updatedAt` on mock collections.
- 2026-10-18: Dashboard UI Phase 3 completed. Built the main dashboard area with 4 stats cards (items, collections, favorite items, favorite collections), a recent collections grid, pinned items and 10 recent items, using mock data.
