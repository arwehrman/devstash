import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
import { UsageStats } from "@/components/profile/UsageStats";
import { UserAvatar } from "@/components/user/UserAvatar";
import { SIGN_IN_PATH } from "@/lib/auth-redirect";
import { formatLongDate } from "@/lib/dashboard";
import { getCollectionStats } from "@/lib/db/collections";
import { getItemStats, getSystemItemTypes } from "@/lib/db/items";
import { getProfileUser } from "@/lib/db/users";

export const metadata: Metadata = { title: "Profile · Devstash" };

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect(SIGN_IN_PATH);

  const [user, itemStats, collectionStats, itemTypes] = await Promise.all([
    getProfileUser(userId),
    getItemStats(userId),
    getCollectionStats(userId),
    getSystemItemTypes(userId),
  ]);
  // The session can outlive the account, e.g. after it was deleted on another device.
  if (!user) redirect(SIGN_IN_PATH);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <header>
        <h1 className="text-3xl font-semibold">Profile</h1>
        <p className="mt-1 text-muted-foreground">Your account and usage</p>
      </header>

      <section className="flex items-center gap-4 rounded-xl border bg-card p-6">
        <UserAvatar
          name={user.name}
          email={user.email}
          image={user.image}
          className="size-16 **:data-[slot=avatar-fallback]:text-xl"
        />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{user.name ?? user.email}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Member since {formatLongDate(user.createdAt)}
          </p>
        </div>
      </section>

      <UsageStats
        totalItems={itemStats.total}
        totalCollections={collectionStats.total}
        itemTypes={itemTypes}
      />

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Account</h2>
        <div className="divide-y rounded-xl border bg-card">
          {user.hasPassword && (
            <div className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">
                  Change the password you use to sign in.
                </p>
              </div>
              <ChangePasswordDialog email={user.email} />
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-destructive">Delete account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and everything in it.
              </p>
            </div>
            <DeleteAccountDialog />
          </div>
        </div>
      </section>
    </div>
  );
}
