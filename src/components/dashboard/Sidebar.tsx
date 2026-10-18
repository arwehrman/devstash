"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Folder, Layers, Settings, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getItemTypeIcon } from "@/lib/item-type-icons";
import { collections, currentUser, itemTypes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const RECENT_COLLECTIONS_LIMIT = 5;

interface SidebarProps {
  onNavigate?: () => void;
}

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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections
    .filter((c) => !c.isFavorite)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, RECENT_COLLECTIONS_LIMIT);

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
            const href = `/items/${type.name.toLowerCase()}`;
            return (
              <SidebarLink
                key={type.id}
                href={href}
                active={pathname === href}
                onNavigate={onNavigate}
              >
                <Icon className="size-4 shrink-0" style={{ color: type.color }} />
                <span className="flex-1 truncate">{type.name}</span>
                <span className="text-xs text-muted-foreground">{type.count}</span>
              </SidebarLink>
            );
          })}
        </SidebarSection>

        <SidebarSection title="Collections">
          <SubHeading>Favorites</SubHeading>
          {favoriteCollections.map((collection) => {
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
          {recentCollections.map((collection) => {
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
                <span className="text-xs text-muted-foreground">
                  {collection.itemCount}
                </span>
              </SidebarLink>
            );
          })}
        </SidebarSection>
      </nav>

      <div className="flex shrink-0 items-center gap-3 border-t p-3">
        <Avatar>
          {currentUser.image && <AvatarImage src={currentUser.image} alt="" />}
          <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{currentUser.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {currentUser.email}
          </p>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="Settings">
          <Settings />
        </Button>
      </div>
    </div>
  );
}
