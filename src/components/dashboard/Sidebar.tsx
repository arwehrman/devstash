"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Folder, Layers, Settings, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getItemTypeIcon } from "@/lib/item-type-icons";
import { cn } from "@/lib/utils";
import type { SidebarCollections } from "@/types/collections";
import type { ItemTypeWithCount } from "@/types/items";
import type { SidebarUser } from "@/types/users";

export interface SidebarData {
  itemTypes: ItemTypeWithCount[];
  collections: SidebarCollections;
  user: SidebarUser | null;
}

interface SidebarProps {
  data: SidebarData;
  onNavigate?: () => void;
}

const PRO_TYPE_NAMES = new Set(["file", "image"]);

interface SidebarLinkProps {
  href: string;
  active: boolean;
  onNavigate?: () => void;
  children: React.ReactNode;
}

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

function SidebarLink({ href, active, onNavigate, children }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active && "bg-sidebar-accent text-sidebar-accent-foreground"
      )}
    >
      {children}
    </Link>
  );
}

function SidebarSection({ title, children }: SidebarSectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <section className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        {title}
        <ChevronDown
          className={cn("size-3.5 transition-transform", !open && "-rotate-90")}
        />
      </button>
      {open && children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 px-2 text-[0.7rem] font-medium tracking-wider text-muted-foreground/70 uppercase">
      {children}
    </p>
  );
}

function formatTypeName(name: string) {
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}s`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Sidebar({ data, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { itemTypes, collections, user } = data;

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 shrink-0 items-center gap-2 px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-white">
          <Layers className="size-4" />
        </div>
        <span className="text-lg font-semibold">DevStash</span>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-2 py-4">
        <SidebarSection title="Types">
          {itemTypes.map((type) => {
            const Icon = getItemTypeIcon(type.icon);
            const href = `/items/${type.name}`;
            return (
              <SidebarLink
                key={type.id}
                href={href}
                active={pathname === href}
                onNavigate={onNavigate}
              >
                <Icon
                  className="size-4 shrink-0"
                  style={{ color: type.color ?? undefined }}
                />
                <span className="flex-1 truncate">
                  {formatTypeName(type.name)}
                </span>
                {PRO_TYPE_NAMES.has(type.name) && (
                  <Badge
                    variant="outline"
                    className="h-4 px-1.5 text-[0.6rem] tracking-wider text-muted-foreground uppercase"
                  >
                    Pro
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">{type.count}</span>
              </SidebarLink>
            );
          })}
        </SidebarSection>

        <SidebarSection title="Collections">
          <SubHeading>Favorites</SubHeading>
          {collections.favorites.map((collection) => {
            const href = `/collections/${collection.id}`;
            return (
              <SidebarLink
                key={collection.id}
                href={href}
                active={pathname === href}
                onNavigate={onNavigate}
              >
                <Folder className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{collection.name}</span>
                <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
              </SidebarLink>
            );
          })}

          <SubHeading>Recent</SubHeading>
          {collections.recent.map((collection) => {
            const href = `/collections/${collection.id}`;
            return (
              <SidebarLink
                key={collection.id}
                href={href}
                active={pathname === href}
                onNavigate={onNavigate}
              >
                <span
                  className="mx-1 size-2 shrink-0 rounded-full bg-muted-foreground"
                  style={{ backgroundColor: collection.types[0]?.color ?? undefined }}
                />
                <span className="flex-1 truncate">{collection.name}</span>
                <span className="text-xs text-muted-foreground">
                  {collection.itemCount}
                </span>
              </SidebarLink>
            );
          })}

          <Link
            href="/collections"
            onClick={onNavigate}
            className="mt-1 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            View all collections
          </Link>
        </SidebarSection>
      </nav>

      <div className="flex shrink-0 items-center gap-3 border-t p-3">
        {user && (
          <>
            <Avatar>
              {user.image && <AvatarImage src={user.image} alt="" />}
              <AvatarFallback>{getInitials(user.name ?? user.email)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user.name ?? user.email}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          className="ml-auto"
          aria-label="Settings"
        >
          <Settings />
        </Button>
      </div>
    </div>
  );
}
