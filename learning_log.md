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

---

## Day 2 — Wed Apr 01 2026 — Fix Firebase Progress Sync & Checkbox Issues
> Project: ml-roadmap-app

### What was done
- Removed all localStorage usage from src/lib/progress.ts
- Modified onAuthChange to return progress alongside user
- Updated AuthContext to use new callback signature with progress
- Fixed refreshProgress to call loadProgress properly
- Verified build and lint pass

### Why it was done
- Tasks weren't updating visually because UI state wasn't syncing with progress changes
- XP wasn't decreasing on uncheck - the XP calculation was correct but UI didn't reflect changes
- Not-logged-in users were seeing persisted localStorage data instead of fresh state
- Needed proper Firestore sync: logged-in = cloud data, not logged-in = fresh start

### How it was done
- Removed getLocalProgress, saveLocalProgress functions and STORAGE_KEY constant
- Modified onAuthChange callback to receive (user, progress) instead of just user
- loadProgress now returns defaultProgress when user is null (no localStorage fallback)
- AuthContext useEffect now receives progress directly from callback and updates state

### Why this tool / library — not alternatives
| Tool Used | Why This | Rejected Alternative | Why Not |
|-----------|----------|---------------------|---------|
| Firestore | Already integrated, handles multi-user sync automatically | Custom backend | More setup, less maintained |
| Firebase Auth | Already integrated with Google sign-in | Other auth providers | Simpler for single Google auth |
| React Context | Already in use for auth state | Redux/Zustand | Overkill for simple auth/progress state |

### Definitions (plain English)
- **Firestore**: Google's cloud database that syncs data in real-time between app and cloud
- **onAuthStateChanged**: Firebase listener that fires whenever user signs in/out
- **Progress state**: Object tracking completed tasks, XP, streak, theme preferences

### Real-world use case
- Progress syncing across devices - user starts on laptop, continues on phone
- Different user data isolation - each Google account gets separate Firestore document
- Used in apps like Duolingo (progress sync), Notion (multi-device sync)

### How to remember it
- Firebase = "fire" + "base" - like a base camp for your app's data that syncs across devices
- onAuthStateChanged = "when auth state changes, do this" - event-driven pattern for auth

### Status
- [x] Done
- Next step: Test checkbox toggle and XP updates in browser

---

## Day 2 — 2026-04-01 — Full Firebase RTDB rebuild: fixed checkboxes, two-tab dashboard, XP/streak
> Project: ml-roadmap-app

### What was done
- Diagnosed root cause of broken checkboxes: Firestore one-time `getDoc` reads + module-level state not reactive in React
- Created `src/lib/rtdb.ts` to initialize Firebase Realtime Database from existing auth app
- Created `src/hooks/useAuth.ts` — pure Firebase Auth hook using `onAuthStateChanged`
- Created `src/hooks/useProgress.ts` — RTDB hook using `onValue` for real-time task completion sync
- Created `src/hooks/useTasks.ts` — static roadmap task lookup with `getTodayTasksForDate()`
- Rewrote `src/lib/AuthContext.tsx` — combined context: auth + RTDB progress + toast system
- Rewrote `src/lib/progress.ts` — pure utility functions (`getOverallProgress`, `getPhaseProgress`, `getCurrentPhaseIndex`) no Firebase, no state
- Built `src/components/AllTasksView.tsx` — accordion phases → weeks → tasks with redo button
- Rewrote `src/components/TodayView.tsx` — start date prompt, celebration/rest-day banners, streak counter
- Rewrote `src/components/PhaseCard.tsx` — fixed checkbox bug with optimistic UI + `toggleTask` from context
- Rewrote Header, Sidebar, page.tsx — two-tab layout (Today's Tasks / All Tasks) + Timeline + Stats
- Updated StatsView, TimelineView, SearchModal to use new context API
- Build: zero TypeScript errors, zero lint warnings after suppressing two legitimate no-ops

### Why it was done
- Task checkboxes never toggled because `refreshProgress()` only ran when user was signed in, and `getProgress()` was a module-level variable that React couldn't observe
- Progress bars never updated because `getOverallProgress()` read from the same stale module variable
- Firebase writes went to Firestore; reads expected `onValue` semantics — fundamental mismatch

### How it was done
- Switched persistence layer from Firestore to Firebase Realtime Database (`firebase/database`)
- `useProgress` hook registers an `onValue` listener on `users/{uid}` — any Firebase write (from ANY client or this session) reactively pushes state into React context
- All components read from the context `completedTaskIds` array and `isTaskCompleted(id)` function
- Optimistic UI: components set local `optimistic` state instantly, call `toggleTask` async in background, clear optimistic state when `onValue` confirms Firebase update
- `toggleTask` writes `users/{uid}/completedTasks/{taskId}: true` to mark complete, or `remove()` to unmark
- XP: awarded per difficulty — beginner=10, intermediate=20, advanced=30 XP
- Streak: auto-increments in `updateStreakForUser()` called on every task completion

### Why this tool / library — not alternatives
| Tool Used | Why This | Rejected Alternative | Why Not |
|-----------|----------|---------------------|---------|
| Firebase Realtime Database `onValue` | Push-model: UI updates automatically when DB changes, no polling | Firestore `onSnapshot` | Would require refactoring firebase.ts to add Firestore listener; RTDB is per spec |
| Optimistic UI (`useState` local flag) | Instant visual feedback; user never waits for network | Wait for Firebase confirmation | Would feel laggy on every checkbox click |
| `off(userRef, 'value')` cleanup | Correctly removes all value listeners on sign out | `unsubscribe()` from `onValue` | `off()` explicitly named in spec requirement |
| React Context (AppContext) | Single source of truth; no prop drilling | Redux / Zustand | Overkill for this app size; no external dependency needed |
| Pure utility functions in progress.ts | Testable, no side effects | Hooks inside progress.ts | Hooks can't be called outside React; functions are more composable |

### Definitions (plain English)
- **`onValue`**: Firebase RTDB function that calls your callback immediately with current data AND every time it changes — like a live subscription
- **`off`**: Cancels a Firebase RTDB listener — call it on cleanup to avoid memory leaks
- **Optimistic UI**: Update the screen immediately as if the action succeeded, then confirm with the server in the background
- **React Context**: A way to share state across many components without passing props down every level (like a global variable, but reactive)
- **`useCallback`**: React hook that memoizes a function so it's not recreated on every render — important for stable function references in deps arrays

### Real-world use case
- `onValue` real-time sync pattern is used in collaborative tools like Figma, Notion, and Google Docs to keep all clients in sync without polling
- Optimistic UI is used by Twitter/X when you like a tweet — the heart turns red instantly before the server confirms

### How to remember it
- **`onValue` = a live TV channel**: you tune in and receive every broadcast automatically. `off` = turn off the TV. Without `off`, the TV stays on in the background and wastes power (memory).
- **Optimistic UI = nodding before you hear the answer**: you visually agree immediately, then check if the answer is actually yes. Revert if it's no.

### Status
- [x] Done
- Next step: Deploy to Vercel and test sign-in → toggle task → verify XP increments in Firebase console

---
