# User-Scoped Data

## Overview

Replace the temporary demo user with the signed-in user, so the dashboard and sidebar show each user's own data.

## Requirements

- Add a cached `getCurrentUser()` in `src/lib/db/users.ts` that reads the user id from the session and loads the user from the database (returns `null` if signed out or the account no longer exists)
- Dashboard and profile layouts use `getCurrentUser()`, redirect to sign-in when it returns `null`, and pass the user to `getSidebarData`
- `getSidebarData` (`src/lib/db/sidebar.ts`) loads item types and collections for the passed-in user
- Dashboard page (`src/app/dashboard/page.tsx`) loads stats, collections, pinned and recent items for the current user
- Profile page can use `getCurrentUser()` in place of its separate lookup
- Remove `getDemoUser` and the "demo account can't be deleted" guard in `src/actions/profile.ts`
- Add simple empty states to the dashboard (collections grid, recent items) for new users

## Notes

- `session.user.id` is the database user id for both GitHub and email sign-ins (JWT sessions with the Prisma adapter, set from `token.sub`)
- Checking the user exists also fixes deleted accounts that are still signed in on another device
- `DEMO_USER_EMAIL` stays in the seed; the demo account becomes a normal test account
