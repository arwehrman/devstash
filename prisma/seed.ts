import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { ContentType } from "../src/generated/prisma/client";

const DEMO_USER = {
  email: "demo@devstash.io",
  name: "Demo User",
  password: "12345678",
};

const SYSTEM_ITEM_TYPES = [
  { name: "snippet", icon: "Code", color: "#3b82f6" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "command", icon: "Terminal", color: "#f97316" },
  { name: "note", icon: "StickyNote", color: "#fde047" },
  { name: "file", icon: "File", color: "#6b7280" },
  { name: "image", icon: "Image", color: "#ec4899" },
  { name: "link", icon: "Link", color: "#10b981" },
] as const;

type SystemTypeName = (typeof SYSTEM_ITEM_TYPES)[number]["name"];

interface SeedItem {
  type: SystemTypeName;
  title: string;
  description: string;
  content?: string;
  language?: string;
  url?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
}

interface SeedCollection {
  name: string;
  description: string;
  isFavorite?: boolean;
  items: SeedItem[];
}

const COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    isFavorite: true,
    items: [
      {
        type: "snippet",
        title: "useDebounce & useLocalStorage hooks",
        description: "Debounce a changing value and persist state to localStorage",
        language: "typescript",
        isPinned: true,
        isFavorite: true,
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      },
      {
        type: "snippet",
        title: "Context provider with compound components",
        description: "Typed context provider powering a compound Tabs component",
        language: "typescript",
        content: `import { createContext, useContext, useState, type ReactNode } from "react";

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used inside <Tabs>");
  return ctx;
}

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
}

Tabs.Trigger = function TabsTrigger({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  return (
    <button aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs();
  return active === id ? <div>{children}</div> : null;
};`,
      },
      {
        type: "snippet",
        title: "cn and formatRelative utilities",
        description: "Class name merging and relative date formatting helpers",
        language: "typescript",
        content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatRelative(date: Date): string {
  const diffDays = Math.round((date.getTime() - Date.now()) / 86_400_000);
  if (Math.abs(diffDays) < 1) return "today";
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day");
  return date.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    isFavorite: true,
    items: [
      {
        type: "prompt",
        title: "Code review",
        description: "Thorough PR review focused on bugs, security and readability",
        isPinned: true,
        content: `Review the following code changes as a senior engineer.

Focus on, in order:
1. Correctness bugs and unhandled edge cases
2. Security issues (auth checks, input validation, injection, secrets)
3. Performance problems (N+1 queries, unnecessary re-renders)
4. Readability and consistency with the surrounding code

For each finding, give the file and line, explain the problem, and suggest a fix.
Skip style nitpicks a linter would catch.

<diff>
{{paste diff here}}
</diff>`,
      },
      {
        type: "prompt",
        title: "Generate documentation",
        description: "Write README-style docs for a module or function",
        isFavorite: true,
        content: `Write documentation for the code below for developers who are new to this codebase.

Include:
- A one-paragraph overview of what it does and when to use it
- Parameters and return values with types
- One or two realistic usage examples
- Gotchas, side effects or error cases

Use Markdown. Keep it concise and don't restate what the code obviously does.

<code>
{{paste code here}}
</code>`,
      },
      {
        type: "prompt",
        title: "Refactoring assistant",
        description: "Refactor code for clarity without changing behavior",
        content: `Refactor the following code to improve readability and maintainability.

Rules:
- Do not change external behavior or public function signatures
- Prefer small, well-named functions over long ones
- Remove duplication and dead code
- Keep the existing style and conventions

First list the changes you plan to make and why, then show the refactored code.

<code>
{{paste code here}}
</code>`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        type: "snippet",
        title: "Next.js multi-stage Dockerfile",
        description: "Small production image using Next.js standalone output",
        language: "dockerfile",
        content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        type: "command",
        title: "Deploy to production",
        description: "Apply migrations, then deploy to Vercel production",
        language: "bash",
        content: `npx prisma migrate deploy && vercel deploy --prod`,
      },
      {
        type: "link",
        title: "Docker documentation",
        description: "Official Docker docs and Dockerfile reference",
        url: "https://docs.docker.com/",
      },
      {
        type: "link",
        title: "GitHub Actions documentation",
        description: "Workflows, runners and CI/CD with GitHub Actions",
        url: "https://docs.github.com/en/actions",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    items: [
      {
        type: "command",
        title: "Undo last commit, keep changes",
        description: "Soft reset the last commit and keep changes staged",
        language: "bash",
        isPinned: true,
        content: `git reset --soft HEAD~1`,
      },
      {
        type: "command",
        title: "Clean up Docker",
        description: "Remove stopped containers, unused images, networks and build cache",
        language: "bash",
        content: `docker system prune -a --volumes`,
      },
      {
        type: "command",
        title: "Kill process on a port",
        description: "Find and kill whatever is listening on port 3000",
        language: "bash",
        isFavorite: true,
        content: `lsof -ti tcp:3000 | xargs kill -9`,
      },
      {
        type: "command",
        title: "Find outdated npm packages",
        description: "List outdated dependencies and update within semver ranges",
        language: "bash",
        content: `npm outdated && npm update`,
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        type: "link",
        title: "Tailwind CSS documentation",
        description: "Utility classes and v4 theme configuration reference",
        url: "https://tailwindcss.com/docs",
      },
      {
        type: "link",
        title: "shadcn/ui",
        description: "Copy-paste accessible components built on Tailwind",
        url: "https://ui.shadcn.com",
        isFavorite: true,
      },
      {
        type: "link",
        title: "Material Design 3",
        description: "Google's open-source design system and guidelines",
        url: "https://m3.material.io",
      },
      {
        type: "link",
        title: "Lucide icons",
        description: "Open-source icon library used for DevStash item types",
        url: "https://lucide.dev/icons",
      },
    ],
  },
];

async function seedSystemItemTypes() {
  const typeIds = {} as Record<SystemTypeName, string>;

  for (const type of SYSTEM_ITEM_TYPES) {
    // findFirst instead of upsert: NULL userIds are distinct in the
    // @@unique([userId, name]) index, so it can't match system types.
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, userId: null },
    });

    const saved = existing
      ? await prisma.itemType.update({
          where: { id: existing.id },
          data: { icon: type.icon, color: type.color, isSystem: true },
        })
      : await prisma.itemType.create({ data: { ...type, isSystem: true } });

    typeIds[type.name] = saved.id;
  }

  return typeIds;
}

async function seedDemoUser() {
  await prisma.user.deleteMany({ where: { email: DEMO_USER.email } });

  return prisma.user.create({
    data: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      password: await bcrypt.hash(DEMO_USER.password, 12),
      isPro: false,
      emailVerified: new Date(),
    },
  });
}

function toItemData(item: SeedItem) {
  return {
    title: item.title,
    description: item.description,
    content: item.content,
    language: item.language,
    url: item.url,
    isFavorite: item.isFavorite ?? false,
    isPinned: item.isPinned ?? false,
    contentType: item.url ? ContentType.URL : ContentType.TEXT,
  };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add it to .env");
  }

  const typeIds = await seedSystemItemTypes();
  const user = await seedDemoUser();

  for (const collection of COLLECTIONS) {
    await prisma.collection.create({
      data: {
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite ?? false,
        userId: user.id,
        items: {
          create: collection.items.map((item) => ({
            item: {
              create: {
                ...toItemData(item),
                userId: user.id,
                typeId: typeIds[item.type],
              },
            },
          })),
        },
      },
    });
  }

  const itemCount = COLLECTIONS.reduce((sum, c) => sum + c.items.length, 0);
  console.log(
    `✅ Seeded ${SYSTEM_ITEM_TYPES.length} system types, demo user ${user.email}, ` +
      `${COLLECTIONS.length} collections and ${itemCount} items`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
