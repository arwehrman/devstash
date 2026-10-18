import { FolderPlus, PanelLeft, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";

interface TopBarProps {
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
}

export function TopBar({ onToggleSidebar, onOpenMobileSidebar }: TopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b px-4">
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:inline-flex"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <PanelLeft />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenMobileSidebar}
        aria-label="Open sidebar"
      >
        <PanelLeft />
      </Button>
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search items..."
          className="h-9 pr-12 pl-9"
          aria-label="Search items"
        />
        <Kbd className="absolute top-1/2 right-2 -translate-y-1/2">⌘K</Kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline">
          <FolderPlus />
          <span className="hidden sm:inline">New Collection</span>
        </Button>
        <Button>
          <Plus />
          <span className="hidden sm:inline">New Item</span>
        </Button>
      </div>
    </header>
  );
}
