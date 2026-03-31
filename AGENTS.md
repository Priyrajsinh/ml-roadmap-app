# AGENTS.md - Development Guide for ML Roadmap App

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## Project Overview

This is a Next.js 14 App Router application - a 12-month ML Engineer roadmap with progress tracking, timeline view, projects, German university information, and resources.

**Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS

---

## Build / Lint / Test Commands

```bash
# Development
npm run dev                    # Start dev server (port 3000)
npm run build                  # Production build
npm run start                  # Start production server

# Linting
npm run lint                   # Run ESLint
npm run lint -- --fix          # Auto-fix lint issues

# Testing (if vitest added - see below)
npm test                       # Run all tests
npm run test -- src/lib/progress.test.ts   # Run single test file
npm run test -- --watch        # Watch mode
npm run test -- --ui           # UI mode
```

### Recommended Test Setup

This project currently has no test framework. Add Vitest for testing:

```bash
npm install -D vitest @vitejs/plugin-react jsdom
```

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts` in project root:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
```

---

## Code Style Guidelines

### Imports

- **Always use path alias** `@/*` for internal imports
- **Correct:** `import { Header } from '@/components/Header'`
- **Avoid:** `import { Header } from '../components/Header'`

Group imports in this order:
1. React hooks (`useState`, `useEffect`)
2. External libraries (`lucide-react`)
3. Internal path aliases (`@/components/*`, `@/lib/*`, `@/types/*`)
4. Static data (`@/data/*`)

### TypeScript

- **Strict mode enabled** - no implicit `any`, no `as` casting without justification
- Use **interfaces** for object shapes
- Use **types** for unions/intersections
- Extract reusable types to `@/types/` directory
- Avoid inline types - define them at module level

### Component Structure

```typescript
'use client';  // Required for client-side interactivity

import { useState } from 'react';
import { SomeIcon } from 'lucide-react';
import { ComponentProps } from '@/types/component';

interface Props {
  title: string;
  onAction: () => void;
}

export function ComponentName({ title, onAction }: Props) {
  const [state, setState] = useState(false);
  
  return (
    <div className="component-class">
      {title}
    </div>
  );
}
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `PhaseCard`, `SearchModal` |
| Functions | camelCase | `toggleTopic`, `getProgress` |
| Variables | camelCase | `sidebarOpen`, `activeView` |
| Types/Interfaces | PascalCase | `ProgressState`, `RoadmapPhase` |
| Files (components) | PascalCase | `Header.tsx`, `Timeline.tsx` |
| Files (utilities) | kebab-case | `progress.ts`, `roadmap.ts` |
| Constants | UPPER_SNAKE | `STORAGE_KEY` |

### Error Handling

- Always wrap `localStorage` and `JSON.parse` in try/catch
- Use `console.error` for logging (no custom loggers)
- Never let errors propagate silently - provide fallback values
- Check `typeof window === 'undefined'` for SSR compatibility

```typescript
export function getProgress(): ProgressState {
  if (typeof window === 'undefined') return defaultProgress;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load progress:', e);
  }
  return defaultProgress;
}
```

### Tailwind CSS

- Use utility classes consistently (4px base unit)
- Prefer `className` over inline styles
- Group related utilities together
- Use responsive prefixes: `md:`, `lg:`, `xl:`
- Example: `<div className="p-4 lg:p-8 space-y-4">`

---

## Next.js App Router Conventions

### File Structure

```
src/
├── app/
│   ├── layout.tsx     # Root layout (providers, fonts, metadata)
│   ├── page.tsx      # Home page ('use client')
│   └── (routes)/     # Route groups
├── components/       # React components
├── data/             # Static data (roadmap.ts)
├── lib/              # Utilities (progress.ts, context)
└── types/            # TypeScript interfaces
```

### Server vs Client Components

- **Server Components** (default): No 'use client', async by default
- **Client Components**: Add `'use client'` at top for:
  - useState, useEffect usage
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage)
  - Custom hooks using above

### Patterns Used in This Project

- `'use client'` on all component files (interactive UI)
- Progress stored in localStorage via context
- Keyboard shortcuts (Cmd/Ctrl+K for search)
- Sidebar overlay for mobile navigation

---

## Path Aliases Reference

| Alias | Resolution |
|-------|------------|
| `@/*` | `./src/*` |
| `@/components/*` | `./src/components/*` |
| `@/lib/*` | `./src/lib/*` |
| `@/types/*` | `./src/types/*` |
| `@/data/*` | `./src/data/*` |

---

## Common Tasks

### Adding a New Phase/Topic
1. Edit `src/data/roadmap.ts` - add to `phases` array
2. Types already defined in `src/types/roadmap.ts`

### Adding a New Component
1. Create `src/components/NewComponent.tsx`
2. Use `'use client'` directive
3. Export as named export
4. Import in page: `import { NewComponent } from '@/components/NewComponent'`

### Modifying Progress System
1. Edit `src/lib/progress.ts` for utility functions
2. Edit `src/lib/ProgressContext.tsx` for React context
3. Types in `src/lib/progress.ts` interface `ProgressState`

---

## Lint Rules

ESLint is configured with `eslint-config-next`. Key rules:
- No console.log (use console.error for errors)
- Prefer named exports
- No unused variables
- JSX uses `className` not `class`