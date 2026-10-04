// Temporary mock data for the dashboard UI. Replace with Prisma queries once the database is set up.

export const currentUser = {
  id: 'user_1',
  name: 'John Doe',
  email: 'demo@devstash.com',
  image: null,
  isPro: false
}

export const itemTypes = [
  {
    id: 'type_snippet',
    name: 'Snippets',
    icon: 'Code',
    color: '#3b82f6',
    isSystem: true,
    count: 24
  },
  {
    id: 'type_prompt',
    name: 'Prompts',
    icon: 'Sparkles',
    color: '#8b5cf6',
    isSystem: true,
    count: 18
  },
  {
    id: 'type_command',
    name: 'Commands',
    icon: 'Terminal',
    color: '#f97316',
    isSystem: true,
    count: 15
  },
  {
    id: 'type_note',
    name: 'Notes',
    icon: 'StickyNote',
    color: '#fde047',
    isSystem: true,
    count: 12
  },
  {
    id: 'type_file',
    name: 'Files',
    icon: 'File',
    color: '#6b7280',
    isSystem: true,
    count: 5
  },
  {
    id: 'type_image',
    name: 'Images',
    icon: 'Image',
    color: '#ec4899',
    isSystem: true,
    count: 3
  },
  {
    id: 'type_url',
    name: 'Links',
    icon: 'Link',
    color: '#10b981',
    isSystem: true,
    count: 8
  }
]

export const collections = [
  {
    id: 'col_react',
    name: 'React Patterns',
    description: 'Common React patterns and hooks',
    isFavorite: true,
    itemCount: 12,
    typeIds: ['type_snippet', 'type_note', 'type_url']
  },
  {
    id: 'col_python',
    name: 'Python Snippets',
    description: 'Useful Python code snippets',
    isFavorite: false,
    itemCount: 8,
    typeIds: ['type_snippet', 'type_note']
  },
  {
    id: 'col_context',
    name: 'Context Files',
    description: 'AI context files for projects',
    isFavorite: true,
    itemCount: 5,
    typeIds: ['type_file', 'type_note']
  },
  {
    id: 'col_interview',
    name: 'Interview Prep',
    description: 'Technical interview preparation',
    isFavorite: false,
    itemCount: 24,
    typeIds: ['type_note', 'type_snippet', 'type_url', 'type_prompt']
  },
  {
    id: 'col_git',
    name: 'Git Commands',
    description: 'Frequently used git commands',
    isFavorite: true,
    itemCount: 15,
    typeIds: ['type_command', 'type_note']
  },
  {
    id: 'col_ai',
    name: 'AI Prompts',
    description: 'Curated AI prompts for coding',
    isFavorite: false,
    itemCount: 18,
    typeIds: ['type_prompt', 'type_snippet', 'type_note']
  }
]

export const items = [
  {
    id: 'item_1',
    title: 'useAuth Hook',
    description: 'Custom authentication hook for React applications',
    contentType: 'TEXT',
    content:
      'export function useAuth() {\n  const [user, setUser] = useState(null);\n  // ...\n  return { user, setUser };\n}',
    language: 'typescript',
    typeId: 'type_snippet',
    collectionIds: ['col_react'],
    tags: ['react', 'auth', 'hooks'],
    isFavorite: true,
    isPinned: true,
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'item_2',
    title: 'API Error Handling Pattern',
    description: 'Fetch wrapper with exponential backoff retry logic',
    contentType: 'TEXT',
    content:
      'async function fetchWithRetry(url: string, retries = 3) {\n  // ...\n}',
    language: 'typescript',
    typeId: 'type_snippet',
    collectionIds: ['col_react', 'col_interview'],
    tags: ['api', 'fetch', 'error-handling'],
    isFavorite: false,
    isPinned: true,
    createdAt: '2026-01-12T10:00:00Z'
  },
  {
    id: 'item_3',
    title: 'PR Security Review',
    description: 'Prompt for reviewing pull requests for security issues',
    contentType: 'TEXT',
    content:
      'Review this PR for security issues. Focus on auth checks, input validation and secrets.',
    language: null,
    typeId: 'type_prompt',
    collectionIds: ['col_ai'],
    tags: ['review', 'security'],
    isFavorite: true,
    isPinned: false,
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'item_4',
    title: 'Docker Compose Rebuild',
    description: 'Rebuild and start containers in the background',
    contentType: 'TEXT',
    content: 'docker compose up -d --build',
    language: 'bash',
    typeId: 'type_command',
    collectionIds: [],
    tags: ['docker'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-01-08T10:00:00Z'
  },
  {
    id: 'item_5',
    title: 'Undo Last Commit',
    description: 'Undo the last commit but keep the changes staged',
    contentType: 'TEXT',
    content: 'git reset --soft HEAD~1',
    language: 'bash',
    typeId: 'type_command',
    collectionIds: ['col_git'],
    tags: ['git'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-01-06T10:00:00Z'
  },
  {
    id: 'item_6',
    title: 'Big O Cheat Sheet',
    description: 'Time complexity notes for common data structures',
    contentType: 'TEXT',
    content: '## Arrays\n- Access: O(1)\n- Search: O(n)',
    language: null,
    typeId: 'type_note',
    collectionIds: ['col_interview'],
    tags: ['algorithms', 'interview'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-01-05T10:00:00Z'
  },
  {
    id: 'item_7',
    title: 'CLAUDE.md Template',
    description: 'Starter context file for AI coding assistants',
    contentType: 'FILE',
    fileUrl: '/mock/CLAUDE.md',
    fileName: 'CLAUDE.md',
    fileSize: 2048,
    typeId: 'type_file',
    collectionIds: ['col_context'],
    tags: ['ai', 'context'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-01-04T10:00:00Z'
  },
  {
    id: 'item_8',
    title: 'React Docs',
    description: 'Official React documentation',
    contentType: 'URL',
    url: 'https://react.dev',
    typeId: 'type_url',
    collectionIds: ['col_react'],
    tags: ['react', 'docs'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-01-03T10:00:00Z'
  }
]
