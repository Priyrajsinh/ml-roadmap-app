# ML Roadmap App

An interactive 12-month ML Engineer roadmap built with Next.js, Firebase, and Tailwind CSS.

This project is designed to feel like a real study companion, not just a static checklist. It combines a structured machine learning curriculum with progress tracking, Google sign-in, synced persistence, XP/streak mechanics, and multiple roadmap views so you can keep momentum over a long learning journey.

Live app: [ml-roadmap-app-six.vercel.app](https://ml-roadmap-app-six.vercel.app)

## What This App Contains

- A 12-month ML Engineer roadmap split into 6 major phases
- Structured weekly topics with concrete tasks instead of vague goals
- Real learning resources: docs, courses, books, papers, repos, and tools
- A `Today's Tasks` view based on your roadmap start date
- Automatic move-forward behavior: if you finish the current week's tasks early, the app advances to the next unfinished week
- An `All Tasks` view for browsing the full roadmap phase by phase and week by week
- A `Timeline` view for seeing overall progression across the roadmap
- A `Stats` view for tracking XP, streaks, progress, and completed topics
- Google authentication with Firebase Auth
- Cross-device sync with Firebase Realtime Database
- Task toggle, undo, and progress recalculation in real time
- Phase access without artificial locking

## Core Experience

The app is built around two ideas:

1. A long-term roadmap should still feel actionable each day.
2. Progress should be saved in the cloud and update instantly.

Once a user signs in and sets a start date, the app calculates where they are in the roadmap and shows the active week's tasks in `Today's Tasks`.

Behavior of `Today's Tasks`:

- If the current week still has unfinished tasks, those tasks are shown
- If the current week is already fully completed, the app moves forward to the next unfinished week
- If an earlier week becomes unfinished again because a task is unchecked, that week can appear again
- If all roadmap weeks are complete, the app shows a completion state

## Roadmap Overview

| Phase | Months | Focus |
| --- | --- | --- |
| 1 | 1-2 | Python, NumPy, linear algebra, statistics, calculus |
| 2 | 3-4 | Classical machine learning, sklearn workflow, supervised and unsupervised learning |
| 3 | 5-6 | Deep learning fundamentals, PyTorch, CNNs |
| 4 | 7-8 | NLP, transformers, Hugging Face, LLM basics |
| 5 | 9-10 | MLOps, experiment tracking, deployment, CI/CD, monitoring |
| 6 | 11-12 | Specialization track and final capstone |

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Firebase Auth
- Firebase Realtime Database
- Lucide React
- Vercel

## Features

### Progress Tracking

- Check and uncheck tasks
- Progress bars update automatically
- XP is awarded by difficulty
- Streak is tracked in Firebase
- State stays synced across sessions and devices

### Views

- `Today's Tasks`: active weekly workload
- `All Tasks`: full roadmap explorer
- `Timeline`: phase-level progress
- `Stats`: roadmap completion and XP summary

### Auth and Sync

- Google sign-in
- Per-user cloud persistence
- Realtime updates from Firebase RTDB
- User data isolated by Firebase rules

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

Production build:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
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

### 6. Why RTDB is required

This app stores progress in Firebase Realtime Database, not Firestore.

That includes:

- completed tasks
- start date
- streak
- last completed date
- total XP

## Vercel Deployment

Deploying on Vercel is straightforward:

1. Push the repo to GitHub
2. Import the project into Vercel
3. Add all Firebase environment variables in Vercel Project Settings
4. Make sure `NEXT_PUBLIC_FIREBASE_DATABASE_URL` is present
5. Deploy

If Firebase rules are too strict or RTDB is not created, sign-in may work while task progress still fails to save. In that case, check:

- Realtime Database exists
- database rules are published
- Vercel env vars are correct

## Data Shape

The app stores user progress like this:

```text
users/
  {uid}/
    completedTasks/
      {taskId}: true
    startDate: "YYYY-MM-DD"
    streak: 5
    lastCompletedDate: "YYYY-MM-DD"
    totalXP: 150
```

## Project Structure

```text
src/
  app/
    layout.tsx
    page.tsx
  components/
    AllTasksView.tsx
    Header.tsx
    PhaseCard.tsx
    SearchModal.tsx
    Sidebar.tsx
    StatsView.tsx
    TimelineView.tsx
    TodayView.tsx
  data/
    roadmap.ts
  hooks/
    useAuth.ts
    useProgress.ts
    useTasks.ts
  lib/
    AuthContext.tsx
    firebase.ts
    progress.ts
    rtdb.ts
```

## Current Product Behavior

- Users must be signed in to save progress
- Unchecking a completed task removes its completion state and updates progress
- Completing all tasks for a week pushes `Today's Tasks` to the next unfinished week
- Earlier weeks can reappear if tasks are unchecked again
- The roadmap is fully browsable without phase locks

## Troubleshooting

### Sign-in works but tasks do not save

Check these first:

- Realtime Database was created
- RTDB rules were published
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL` exists in Vercel
- the user is signed in

### Progress does not update

Make sure the task was saved under the signed-in user and RTDB rules allow:

- read on `users/$uid`
- write on `users/$uid`

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
- anyone who wants a roadmap with structure, not just a list of links

## License

MIT
