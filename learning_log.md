---

## Day 1 — Wed Apr 01 2026 — Resume ML Roadmap Rebuild
> Project: ml-roadmap-app

### What was done
- Reviewed ML_ROADMAP_REBUILD_PROMPT.md to identify incomplete tasks
- Verified src/data/roadmap.ts already had full 6-phase curriculum with all tasks/resources
- Verified src/lib/progress.ts had XP system, streak, completedTasks, lastActiveDate, phase6Track
- Verified TodayView.tsx already implemented with streak/XP display, task completion
- Verified Header.tsx already had navigation (Today/Roadmap/Timeline/Stats), streak badge, XP badge, progress bar
- Verified layout.tsx already had dark mode default and Inter font
- Verified page.tsx already had 4-view routing (today/timeline/stats/roadmap)
- Verified PhaseCard.tsx had phase accordion structure with task lists
- Verified StatsView.tsx and TimelineView.tsx existed
- Fixed lint errors: SearchModal.tsx had unescaped quotes, TodayView.tsx had unescaped apostrophes
- Fixed PhaseCard.tsx: added phase locking for Phase 6 (80% of Phase 5 required to unlock)
- Ran build and lint verification - both passed

### Why it was done
- User requested to resume implementation from unchecked items in rebuild prompt
- Needed to verify which items were completed vs. what remained

### How it was done
- Read through each component and data file to verify structure matches prompt requirements
- Fixed ESLint errors that blocked build (escaped quotes/apostrophes)
- Fixed Phase 6 locking logic to enforce 80% completion of Phase 5 before unlocking
- Ran npm run build and npm run lint to verify no errors remain

### Why this tool / library — not alternatives
| Tool Used | Why This | Rejected Alternative | Why Not |
|-----------|----------|---------------------|---------|
| ESLint (react/no-unescaped-entities) | Catches JSX text with special chars that could render incorrectly | Disable rule globally | Reduces code quality, hides real issues |
| Phase locking logic | Enforces sequential progression, motivates completion | Allow all phases open | Reduces sense of progression/accomplishment |

### Definitions (plain English)
- **ESLint rule**: A linter checks code for problems - react/no-unescaped-entities ensures special characters in JSX are properly escaped
- **Phase locking**: A game mechanic that prevents accessing later levels until earlier ones are sufficiently completed

### Real-world use case
- **ESLint**: Used in most modern JS/TS projects (Facebook, Airbnb, many others) to catch bugs early
- **Phase locking**: Used in games like Mario (worlds 2-8 locked until 1 complete), Duolingo (levels unlock as you progress)

### How to remember it
- ESLint = "Linter catches bugs before they bite" - like a spellchecker for code
- Phase locking keeps users engaged through progression - like unlocking chapters in a book series

### Status
- [x] Done
- Next step: None - all prompt items appear implemented and building successfully
> Project: ml-roadmap-app

### What was done
- Analyzed existing codebase structure (Next.js 14 App Router, React 18, TypeScript, Tailwind CSS)
- Found existing minimal AGENTS.md (5 lines with Next.js version warning)
- No Cursor rules (.cursor/, .cursorrules) or Copilot rules (.github/copilot-instructions.md) found
- No test framework installed, no test files exist
- Created comprehensive AGENTS.md (~155 lines)

### Why it was done
- User requested AGENTS.md file for agentic coding agents
- Existing AGENTS.md was too minimal to guide agents effectively
- Needed to document build/lint/test commands, code style, and conventions

### How it was done
- Analyzed package.json for scripts
- Reviewed src/app/page.tsx for import patterns and component structure
- Reviewed src/lib/progress.ts for error handling patterns
- Reviewed src/types/roadmap.ts for TypeScript conventions
- Reviewed tsconfig.json for path aliases
- Documented all findings in structured AGENTS.md

### Why this tool / library — not alternatives
| Tool Used | Why This | Rejected Alternative | Why Not |
|-----------|----------|---------------------|---------|
| Vitest | Next.js recommended test framework, native ESM support, Jest-compatible API | Jest | Requires extra config for ESM/Next.js 14, slower |
| eslint-config-next | Already installed in project, covers Next.js specific rules | custom ESLint config | More setup, less maintained |
| @/* path alias | Already configured in tsconfig.json, standard Next.js convention | Relative imports | Less fragile to refactoring |

### Definitions (plain English)
- **Path alias**: A shortcut (like @/) that resolves to a folder path, making imports shorter and refactoring easier
- **Strict TypeScript**: TypeScript mode that forbids implicit any, requiring explicit type annotations
- **Client component**: A React component that runs in the browser (has access to hooks, localStorage, events)
- **Server component**: A Next.js component that runs on the server, can fetch data directly

### Real-world use case
- **AGENTS.md**: Similar to .rubocop.yml for Ruby or pyproject.toml for Python - provides project-specific guidance
- Used in AI coding assistants like Cursor, Copilot, and this opencode tool for context-aware assistance

### How to remember it
- Think of AGENTS.md as "instructions for AI agents" - it's the readme that your AI coding assistant reads first
- The name comes from "agent" (AI assistant) + ".md" (markdown file)

### Status
- [x] Done
- Next step: Consider adding test framework (Vitest) for better code quality
