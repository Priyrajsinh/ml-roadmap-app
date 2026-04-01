# ML Engineer Roadmap — 12 Months to Production ML

A free, self-hosted, daily-use learning tracker for the 12-month ML engineering roadmap.

**Live demo:** https://ml-roadmap-app-six.vercel.app

## What's inside

- 48 weeks of structured curriculum with specific tasks, not vague goals
- Real named resources: papers, courses, repos (mostly free)
- **Today's Tasks** view — shows tasks scheduled for today based on your start date
- **All Tasks** view — accordion browser: Phase → Week → Task, with progress bars at every level
- Firebase Realtime Database sync — progress persists across devices via Google Sign-In
- Streak tracking and XP system (easy=10, medium=20, hard=30 XP)
- Redo button on completed tasks to reset and attempt again
- Toast notifications on task actions
- Beautiful dark UI built to look at every day

## Tech stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · Firebase (Auth + Realtime Database)

## Running locally

```bash
git clone https://github.com/Priyrajsinh/ml-roadmap-app
cd ml-roadmap-app
npm install
```

Create `.env.local` with your Firebase project credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Then:

```bash
npm run dev
```

Open http://localhost:3000

## Firebase setup

1. Create a Firebase project at console.firebase.google.com
2. Enable **Google Sign-In** under Authentication → Sign-in method
3. Enable **Realtime Database** — start in test mode (lock down rules before going public)
4. Copy your web app credentials to `.env.local`

Recommended Realtime Database rules:

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

## Deploy your own (free)

**Vercel (recommended)**

1. Fork this repo
2. Go to vercel.com → New Project → Import your fork
3. Add your Firebase environment variables under Settings → Environment Variables
4. Click Deploy

## Curriculum overview

| Phase | Months | Topics |
|-------|--------|--------|
| 1 — Foundations | 1–2 | Python, NumPy, Linear Algebra, Stats, Calculus |
| 2 — Classical ML | 3–4 | Sklearn, Supervised, Unsupervised Learning |
| 3 — Deep Learning | 5–6 | Neural Nets, PyTorch, CNNs |
| 4 — NLP & Transformers | 7–8 | BERT, fine-tuning, Hugging Face |
| 5 — MLOps | 9–10 | MLflow, Docker, FastAPI, CI/CD |
| 6 — Specialization | 11–12 | CV / NLP / Tabular track of your choice |

## Data model

```
users/
  {uid}/
    completedTasks/
      {taskId}: true        ← present & true = done, absent = not done
    startDate: "YYYY-MM-DD" ← used to compute Today's Tasks
    streak: 5
    lastCompletedDate: "YYYY-MM-DD"
    totalXP: 150
```

## License

MIT — fork, customize, share freely.
