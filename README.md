# ML Roadmap App

An interactive 12-month ML Engineer roadmap built with Next.js, Firebase, and Tailwind CSS.

This app is designed to feel like a guided learning workspace, not a static checklist. Each roadmap task can now carry nested checklist steps, exact study links, expected outputs, and GitHub showcase guidance so the learner always knows what to do, what to open, what to produce, and how to package it publicly.

Live app: [ml-roadmap-app-six.vercel.app](https://ml-roadmap-app-six.vercel.app)

## What This App Contains

- A 12-month ML Engineer roadmap split into 6 major phases
- Weekly topics with detailed task cards instead of shallow task rows
- Nested checklist steps inside tasks
- Exact resource links attached to the relevant learning step
- Deliverables for each task, such as notebooks, scripts, notes, README updates, or repo folders
- GitHub showcase guidance for where work should live and how it should be presented
- Guide sections for repo setup, daily non-negotiables, Sunday review, and portfolio README expectations
- A `Today's Tasks` study cockpit tied to the learner's roadmap start date
- An `All Tasks` explorer for the full roadmap with milestones and deeper task detail
- A `Timeline` view for phase and milestone visibility
- A `Stats` view that tracks both task completion and checklist-step depth
- Google authentication with Firebase Auth
- Realtime progress sync with Firebase Realtime Database

## Core Experience

The app is built around three ideas:

1. A long-term roadmap should still feel concrete on any given day.
2. Every meaningful task should explain the exact path from study to output.
3. Progress should persist across devices and preserve older users' completed work.

Once a user signs in and sets a start date, the app calculates the active roadmap week and shows the current week's guided tasks in `Today's Tasks`.

Behavior of `Today's Tasks`:

- If the current week has unfinished tasks, those tasks are shown
- One focus task is expanded with step-by-step guidance
- Parent task completion is automatic when all nested checklist steps are completed
- If the current week is already fully completed, the app moves forward to the next unfinished week
- If an earlier week becomes incomplete again because checklist steps are reset, that week can appear again
- If all roadmap weeks are complete, the roadmap reaches a finished state

## Roadmap Overview

| Phase | Months | Focus |
| --- | --- | --- |
| 1 | 1-2 | Python, NumPy, linear algebra, statistics, calculus |
| 2 | 3-4 | Classical machine learning, sklearn workflow, supervised and unsupervised learning |
| 3 | 5-6 | Deep learning fundamentals, PyTorch, CNNs |
| 4 | 7-8 | NLP, transformers, Hugging Face, LLM basics |
| 5 | 9-10 | MLOps, experiment tracking, deployment, CI/CD, monitoring |
| 6 | 11-12 | Specialization track and final capstone |

## What's New in the Guided Workspace

- Tasks are no longer just one checkbox with a couple of links
- Each task can include:
  - a learning goal
  - why the task matters
  - nested checklist steps
  - exact links per step
  - expected outputs
  - GitHub showcase instructions
- Guide sections make portfolio work part of the roadmap:
  - repo structure
  - daily consistency habits
  - Sunday cleanup/review
  - README expectations
- Legacy top-level task completion is migrated into the new nested checklist model automatically

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Firebase Auth
- Firebase Realtime Database
- Lucide React
- Vitest
- Vercel

## Main Views

### `Today's Tasks`

- Shows the active roadmap week based on start date
- Highlights one main focus task with expanded steps
- Includes exact study links, deliverables, and GitHub actions

### `All Tasks`

- Full roadmap explorer by phase and week
- Milestones and capstone framing
- Deep task cards with checklist detail

### `Timeline`

- Phase-level journey map
- Progress bars
- Topic milestones and capstone outcomes

### `Stats`

- Task completion
- Checklist-step completion
- XP and streak
- Guide/portfolio support visibility

## Progress Tracking Model

The app now tracks progress at the checklist-item level.

- Nested checklist steps are the real persisted unit
- Parent tasks are derived from step completion
- XP remains task-level to avoid inflating rewards
- Old `completedTasks` data is migrated into `completedItems` so earlier progress still counts

## Local Development

Clone and install:

```bash
git clone https://github.com/Priyrajsinh/ml-roadmap-app
cd ml-roadmap-app
npm install
```

Start the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

Tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com
```

Notes:

- `NEXT_PUBLIC_FIREBASE_DATABASE_URL` is important for Realtime Database connectivity
- If you omit it, the app will try the default `https://{projectId}-default-rtdb.firebaseio.com` pattern
- Using the explicit env var is safer, especially for deployment

## Firebase Setup

### 1. Create a Firebase project

Create a project in the Firebase Console.

### 2. Add a Web App

Register a web app inside Firebase and copy the client config values into `.env.local` or Vercel environment variables.

### 3. Enable Google Authentication

Go to:

`Authentication` -> `Sign-in method` -> `Google`

Enable Google sign-in.

### 4. Create Realtime Database

Go to:

`Realtime Database` -> `Create Database`

Choose a region and finish setup.

### 5. Apply Realtime Database Rules

Use these rules so each signed-in user can access only their own progress:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## Data Shape

The app stores user progress like this:

```text
users/
  {uid}/
    completedItems/
      {checklistItemId}: true
    startDate: "YYYY-MM-DD"
    streak: 5
    lastCompletedDate: "YYYY-MM-DD"
    totalXP: 150
```

Legacy users may also still have old `completedTasks` data in RTDB. That data is migrated forward into nested checklist progress when loaded.

## Project Structure

```text
src/
  app/
    layout.tsx
    page.tsx
  components/
    AllTasksView.tsx
    Header.tsx
    SearchModal.tsx
    Sidebar.tsx
    StatsView.tsx
    TaskChecklistCard.tsx
    TimelineView.tsx
    TodayView.tsx
  data/
    roadmap-content.ts
    roadmap-guides.ts
    roadmap-overrides.ts
    roadmap.ts
  hooks/
    useAuth.ts
    useProgress.ts
    useTasks.ts
  lib/
    AuthContext.tsx
    firebase.ts
    progress.ts
    progress-model.ts
    rtdb.ts
  types/
    roadmap.ts
```

## Validation

Current validation flow:

- `npm run lint`
- `npm test`
- `npm run build`

Unit tests cover:

- item-level completion derivation
- parent task auto-completion
- migration from legacy task-only progress
- roadmap week calculations
- search/index and detailed task content expectations

## Deployment

Deploying on Vercel:

1. Push the repo to GitHub
2. Import the project into Vercel
3. Add all Firebase environment variables in Vercel Project Settings
4. Make sure `NEXT_PUBLIC_FIREBASE_DATABASE_URL` is present
5. Deploy

If Firebase rules are too strict or RTDB is not created, sign-in may work while progress still fails to save. In that case, check:

- Realtime Database exists
- database rules are published
- Vercel env vars are correct

## Troubleshooting

### Sign-in works but progress does not save

Check these first:

- Realtime Database was created
- RTDB rules were published
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL` exists in local or Vercel env vars
- the user is signed in

### Old users lost progress after the nested checklist update

They should not. The app migrates legacy `completedTasks` into `completedItems` during load. If something looks wrong, inspect the user's RTDB data and confirm the expected task IDs still exist in the roadmap.

### App is deployed but old behavior is still visible

Make sure:

- the latest GitHub commit reached Vercel
- the latest deployment is `READY`
- you hard refresh the page after deployment

## Why This Project Is Useful

This app is useful for:

- self-learners following a serious ML path
- students preparing for ML engineer roles
- developers transitioning from software or data analysis into ML
- anyone who wants one place that combines roadmap, study flow, portfolio habits, and progress tracking

## License

MIT
