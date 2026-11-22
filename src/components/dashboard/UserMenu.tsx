"use client";

import { useTransition } from "react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

import { signOutUser } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user/UserAvatar";
import type { SidebarUser } from "@/types/users";

interface UserMenuProps {
  user: SidebarUser;
  onNavigate?: () => void;
}

export function UserMenu({ user, onNavigate }: UserMenuProps) {
  const [signingOut, startSignOut] = useTransition();
  const displayName = user.name ?? user.email;

  return (
    <DropdownMenu>
      {/* No aria-label: the visible name and email are the accessible name, and the trigger already announces itself as a menu button. */}
      <DropdownMenuTrigger
        className="flex min-w-0 flex-1 items-center gap-3 rounded-md p-1 text-left outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring"
      >
        <UserAvatar name={user.name} email={user.email} image={user.image} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-56">
        <DropdownMenuLinkItem render={<Link href="/profile" onClick={onNavigate} />}>
          <User />
          Profile
        </DropdownMenuLinkItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={signingOut}
          onClick={() => startSignOut(() => signOutUser())}
        >
          <LogOut />
          {signingOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
