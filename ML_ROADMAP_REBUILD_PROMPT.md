# ML Roadmap App — Complete Rebuild Prompt

> Paste this entire file into Claude Code, Cursor, Copilot, or any AI coding agent.
> It is self-contained. The agent does not need extra context.

---

## Mission

Rebuild the existing `ml-roadmap-app` (Next.js 14, TypeScript, Tailwind CSS) into a
**daily-use ML learning tool** that someone genuinely wants to open every morning.
The current app has a good skeleton but suffers from:
- Generic, vague resources ("read the docs", "watch a video")
- No "what do I do TODAY?" view
- No streak or motivation loop
- No time estimates per task
- A visual design that doesn't inspire daily visits

Fix all of this. Do not change the tech stack.

---

## 1. Data Layer — Replace `src/data/roadmap.ts` entirely

Create a 12-month curriculum with **specific, real, named resources** for every topic.
Use the exact structure below. Do not invent URLs — use only these verified ones.

```typescript
// src/data/roadmap.ts
export interface Resource {
  title: string;
  type: 'course' | 'book' | 'paper' | 'repo' | 'video' | 'tool';
  url: string;
  free: boolean;
  estimatedHours: number; // honest estimate to complete
}

export interface Task {
  id: string;
  title: string;
  description: string; // 1-2 sentences, specific
  estimatedMinutes: number; // realistic daily time box
  resources: Resource[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Topic {
  id: string;
  title: string;
  weekNumber: number; // which week of the phase
  tasks: Task[];
  milestone?: string; // optional deliverable: "Build X"
}

export interface Phase {
  id: string;
  title: string;
  months: string; // e.g. "Months 1–2"
  description: string;
  colorScheme: 'blue' | 'purple' | 'teal' | 'green' | 'orange' | 'pink';
  topics: Topic[];
  capstoneProject: string; // what to build at the end
}
```

### Curriculum content to implement

Implement all 6 phases with these **exact** tasks and resources:

---

#### Phase 1 — Foundations (Months 1–2) `colorScheme: 'blue'`

**Topic: Python for Data Science (Week 1–2)**
Tasks:
- "Complete Python Crash Course chapters 1–8" | 60 min/day | Resources: [Python Crash Course book (https://nostarch.com/pythoncrashcourse2e), Real Python tutorials (https://realpython.com)]
- "NumPy in 1 hour — array operations, broadcasting" | 60 min | Resources: [NumPy official quickstart (https://numpy.org/doc/stable/user/quickstart.html), CS231n NumPy tutorial (https://cs231n.github.io/python-numpy-tutorial/)]
- "Pandas fundamentals — DataFrames, groupby, merge" | 90 min | Resources: [10 minutes to pandas (https://pandas.pydata.org/docs/user_guide/10min.html), Kaggle Pandas course (https://www.kaggle.com/learn/pandas)]

**Topic: Linear Algebra for ML (Week 3–4)**
Tasks:
- "Gilbert Strang MIT 18.06 — Lectures 1–6 (vectors, matrices, elimination)" | 90 min | Resources: [MIT OCW 18.06SC (https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/), 3Blue1Brown Essence of Linear Algebra (https://www.3blue1brown.com/topics/linear-algebra)]
- "Implement matrix multiplication from scratch in NumPy" | 60 min | Resources: [Matrix calculus for ML (https://arxiv.org/abs/1802.01528)]
- "Eigenvalues and SVD — intuition + implementation" | 60 min | Resources: [Visual explanation of SVD (https://www.youtube.com/watch?v=vSczTbgc8Rc)]

**Topic: Statistics & Probability (Week 5–6)**
Tasks:
- "Probability distributions — normal, binomial, Poisson — with scipy.stats" | 60 min | Resources: [Think Stats (https://greenteapress.com/thinkstats2/html/index.html), StatQuest statistics playlist (https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9)]
- "Hypothesis testing, p-values, confidence intervals" | 60 min | Resources: [StatQuest hypothesis testing (https://www.youtube.com/watch?v=0oc49DyA3hU)]
- "Bayes theorem from first principles" | 45 min | Resources: [3Blue1Brown Bayes (https://www.youtube.com/watch?v=HZGCoVF3YvM)]

**Topic: Calculus for ML (Week 7–8)**
Tasks:
- "Derivatives, chain rule, partial derivatives" | 60 min | Resources: [3Blue1Brown Calculus series (https://www.3blue1brown.com/topics/calculus), Khan Academy multivariable calculus (https://www.khanacademy.org/math/multivariable-calculus)]
- "Implement gradient descent from scratch" | 90 min | Resources: [Andrew Ng's gradient descent explanation (https://www.coursera.org/learn/machine-learning)]

Capstone: "Exploratory data analysis on the Titanic dataset — clean, visualize, summarize in a Jupyter notebook"

---

#### Phase 2 — Classical ML (Months 3–4) `colorScheme: 'purple'`

**Topic: Scikit-learn & ML Workflow (Week 9–10)**
Tasks:
- "Andrew Ng ML Specialization — Course 1 weeks 1–3 (linear + logistic regression)" | 120 min | Resources: [Coursera ML Specialization (https://www.coursera.org/specializations/machine-learning-introduction), Sklearn user guide (https://scikit-learn.org/stable/user_guide.html)]
- "Feature engineering — encoding, scaling, imputation" | 60 min | Resources: [Sklearn preprocessing (https://scikit-learn.org/stable/modules/preprocessing.html), Feature Engineering for ML book by Alice Zheng (https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/)]
- "Train/val/test splits, cross-validation, overfitting" | 60 min | Resources: [Sklearn cross-validation docs (https://scikit-learn.org/stable/modules/cross_validation.html)]

**Topic: Supervised Learning (Week 11–12)**
Tasks:
- "Decision trees and random forests — intuition + sklearn" | 90 min | Resources: [Sklearn ensemble methods (https://scikit-learn.org/stable/modules/ensemble.html), StatQuest Random Forests (https://www.youtube.com/watch?v=J4Wdy0Wc_xQ)]
- "SVMs and kernel trick" | 60 min | Resources: [StatQuest SVM (https://www.youtube.com/watch?v=efR1C6CvhmE)]
- "Gradient boosting — XGBoost and LightGBM" | 90 min | Resources: [XGBoost docs (https://xgboost.readthedocs.io/en/stable/tutorials/model.html), LightGBM docs (https://lightgbm.readthedocs.io/en/stable/)]

**Topic: Unsupervised Learning (Week 13–14)**
Tasks:
- "K-Means clustering — theory + sklearn implementation" | 60 min | Resources: [Sklearn clustering comparison (https://scikit-learn.org/stable/modules/clustering.html)]
- "PCA — dimensionality reduction with a real dataset" | 60 min | Resources: [Sklearn PCA tutorial (https://scikit-learn.org/stable/modules/decomposition.html)]

Capstone: "Kaggle Titanic competition submission — target >78% accuracy"

---

#### Phase 3 — Deep Learning (Months 5–6) `colorScheme: 'teal'`

**Topic: Neural Networks from Scratch (Week 15–16)**
Tasks:
- "fast.ai Practical Deep Learning — Lesson 1–3 (train your first neural net)" | 120 min | Resources: [fast.ai course (https://course.fast.ai), fast.ai book (https://github.com/fastai/fastbook)]
- "Implement a 2-layer neural net with backprop in NumPy (no frameworks)" | 120 min | Resources: [Andrej Karpathy micrograd (https://github.com/karpathy/micrograd), Neural Networks: Zero to Hero (https://karpathy.ai/zero-to-hero.html)]
- "Activation functions — ReLU, sigmoid, tanh, softmax — why they matter" | 45 min | Resources: [CS231n notes on activation functions (https://cs231n.github.io/neural-networks-1/)]

**Topic: PyTorch (Week 17–18)**
Tasks:
- "PyTorch in 60 minutes blitz — tensors, autograd, nn.Module" | 90 min | Resources: [PyTorch 60 min blitz (https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html)]
- "Build an image classifier with PyTorch on CIFAR-10" | 120 min | Resources: [PyTorch CIFAR tutorial (https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html)]
- "Training loop, loss, optimizer — write it from scratch" | 90 min | Resources: [PyTorch tutorials (https://pytorch.org/tutorials/)]

**Topic: CNNs (Week 19–20)**
Tasks:
- "Convolutional neural networks — filters, pooling, receptive field" | 90 min | Resources: [CS231n CNN lecture (https://cs231n.github.io/convolutional-networks/), 3Blue1Brown But what is a neural network? (https://www.youtube.com/watch?v=aircAruvnKk)]
- "Transfer learning with ResNet on a custom dataset" | 120 min | Resources: [PyTorch transfer learning tutorial (https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html)]

Capstone: "Train a CNN classifier on a dataset of your choice — deploy it as a Hugging Face Space"

---

#### Phase 4 — NLP & Transformers (Months 7–8) `colorScheme: 'green'`

**Topic: NLP Fundamentals (Week 21–22)**
Tasks:
- "Text preprocessing — tokenization, stemming, TF-IDF" | 60 min | Resources: [NLTK book (https://www.nltk.org/book/), spaCy 101 (https://spacy.io/usage/spacy-101)]
- "Word embeddings — Word2Vec, GloVe intuition" | 60 min | Resources: [CS224n notes on word vectors (https://web.stanford.edu/class/cs224n/), Illustrated Word2Vec (https://jalammar.github.io/illustrated-word2vec/)]

**Topic: Transformers & LLMs (Week 23–26)**
Tasks:
- "Attention mechanism — read the original Attention Is All You Need paper" | 90 min | Resources: [Attention Is All You Need (https://arxiv.org/abs/1706.03762), The Illustrated Transformer (https://jalammar.github.io/illustrated-transformer/)]
- "Hugging Face transformers library — pipelines, tokenizers, fine-tuning" | 120 min | Resources: [HuggingFace course (https://huggingface.co/learn/nlp-course/chapter1/1), HF docs (https://huggingface.co/docs/transformers/index)]
- "Fine-tune BERT for text classification" | 120 min | Resources: [HF fine-tuning guide (https://huggingface.co/docs/transformers/training)]
- "Prompt engineering for LLMs" | 60 min | Resources: [Prompt engineering guide (https://www.promptingguide.ai)]

Capstone: "Fine-tune a sentiment classifier on a domain-specific dataset and publish it to Hugging Face Hub"

---

#### Phase 5 — MLOps & Production (Months 9–10) `colorScheme: 'orange'`

**Topic: Experiment Tracking & Reproducibility (Week 27–28)**
Tasks:
- "MLflow tracking — log experiments, compare runs" | 90 min | Resources: [MLflow quickstart (https://mlflow.org/docs/latest/getting-started/intro-quickstart/index.html)]
- "DVC for data versioning" | 60 min | Resources: [DVC tutorial (https://dvc.org/doc/start)]
- "W&B (Weights & Biases) — sweeps and dashboards" | 90 min | Resources: [W&B quickstart (https://docs.wandb.ai/quickstart)]

**Topic: Model Deployment (Week 29–30)**
Tasks:
- "FastAPI REST API to serve a model" | 120 min | Resources: [FastAPI ML serving tutorial (https://fastapi.tiangolo.com/tutorial/), Full Stack FastAPI template (https://github.com/fastapi/full-stack-fastapi-template)]
- "Docker container for your ML model" | 90 min | Resources: [Docker for ML (https://docs.docker.com/get-started/overview/), Practical MLOps book (https://github.com/paiml/practical-mlops-book)]
- "Deploy to Hugging Face Spaces or Railway" | 60 min | Resources: [HF Spaces docs (https://huggingface.co/docs/hub/spaces)]

**Topic: Monitoring & CI/CD (Week 31–32)**
Tasks:
- "GitHub Actions CI pipeline for model tests" | 90 min | Resources: [GitHub Actions for ML (https://docs.github.com/en/actions)]
- "Data/model drift detection basics" | 60 min | Resources: [Evidently AI (https://www.evidentlyai.com/)]

Capstone: "Deploy your Phase 3 CNN or Phase 4 NLP model as a public API with a Gradio demo"

---

#### Phase 6 — Specialization & Capstone (Months 11–12) `colorScheme: 'pink'`

**Topic: Choose Your Specialization (Week 33–36)**
Offer three tracks. User picks one at the start of Phase 6.

Track A — Computer Vision:
- "Object detection — YOLO architecture and training" | 120 min | Resources: [Ultralytics YOLOv8 docs (https://docs.ultralytics.com), DETR paper (https://arxiv.org/abs/2005.12872)]
- "Image segmentation — Segment Anything Model" | 90 min | Resources: [SAM paper (https://arxiv.org/abs/2304.02643), SAM demo (https://segment-anything.com)]

Track B — NLP/LLMs:
- "RAG (Retrieval-Augmented Generation) system from scratch" | 120 min | Resources: [LangChain RAG tutorial (https://python.langchain.com/docs/tutorials/rag/), LlamaIndex (https://docs.llamaindex.ai/en/stable/)]
- "LLM fine-tuning with LoRA/QLoRA" | 120 min | Resources: [HF PEFT library (https://huggingface.co/docs/peft/index), QLora paper (https://arxiv.org/abs/2305.14314)]

Track C — Tabular/Structured Data:
- "AutoML — AutoGluon and H2O.ai" | 90 min | Resources: [AutoGluon docs (https://auto.gluon.ai/stable/index.html)]
- "Kaggle competition strategy — feature stores, stacking" | 120 min | Resources: [Kaggle Grandmaster notebooks, Feature Store docs (https://www.featurestore.org)]

**Topic: Final Capstone (Week 37–48)**
Tasks:
- "Define your capstone project scope in a one-page spec" | 60 min
- "Build data pipeline and baseline model" | ongoing | Resources: [cookiecutter-data-science (https://cookiecutter-data-science.drivendata.org)]
- "Iterate: improve, evaluate, document" | ongoing
- "Write a technical blog post about your project" | Resources: [Towards Data Science (https://towardsdatascience.com), Hashnode (https://hashnode.com)]
- "Push to GitHub with full README" | Resources: [How to write a good ML README (https://github.com/academic/awesome-readme)]

---

## 2. Progress & State — Update `src/lib/progress.ts`

Add these fields to `ProgressState`:

```typescript
interface ProgressState {
  completedTopics: string[];       // existing
  completedTasks: string[];        // NEW — track individual tasks
  streak: number;                  // NEW — consecutive days with ≥1 task done
  lastActiveDate: string | null;   // NEW — ISO date string "2026-04-01"
  totalXP: number;                 // NEW — gamification points
  phase6Track: 'cv' | 'nlp' | 'tabular' | null; // NEW
}
```

XP values:
- Complete a task: +10 XP
- Complete a topic: +50 XP (bonus)
- Complete a phase: +200 XP (bonus)
- Maintain a streak day: +5 XP

Streak logic: on app load, check if `lastActiveDate` was yesterday. If yes, streak continues. If today, no change. If 2+ days ago, streak resets to 0.

---

## 3. New View — "Today" Dashboard

Create `src/components/TodayView.tsx`. This is the default home screen.

Layout:
```
┌─────────────────────────────────────────────────────┐
│  Good morning! 🔥 Day 14 streak  ░░░░░░░ 34% done  │
├─────────────────────────────────────────────────────┤
│  TODAY'S FOCUS                  ~2h 30m estimated   │
│  ┌─────────────────────────────────────────────────┐│
│  │ ○ Implement backprop in NumPy        [90 min]   ││
│  │   ↳ karpathy/micrograd  →  CS231n notes         ││
│  ├─────────────────────────────────────────────────┤│
│  │ ○ Watch: 3B1B Backpropagation        [20 min]   ││
│  │   ↳ youtube.com/watch?v=Ilg3gGewQ5U            ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  UPCOMING (next 3 tasks)                            │
│  · Activation functions deep dive        [45 min]  │
│  · PyTorch autograd tutorial             [60 min]  │
│  · Build CIFAR-10 classifier             [120 min] │
│                                                     │
│  YOUR PROGRESS                                      │
│  Phase 3 ██████░░░░ 60%   Overall ████░░░░░░ 38%   │
└─────────────────────────────────────────────────────┘
```

"Today" selection logic:
- Find the first incomplete task in the current phase
- Add the next 1–2 tasks after it
- Cap at ~3 hours total
- If the user has already done tasks today, show "You're done for today! Come back tomorrow." with the streak count

Each task row must show:
- Checkbox (click to mark complete, awards XP, updates streak)
- Task title
- Time estimate badge (color-coded: green <60min, amber 60–90min, red >90min)
- 1–2 resource links as small pills (clicking opens in new tab)

---

## 4. Visual Design System

The app must use **dark mode as default** (the `dark` class on `<html>`).

Color palette:
```css
/* Phase colors */
--blue:   #3B82F6;
--purple: #8B5CF6;
--teal:   #14B8A6;
--green:  #22C55E;
--orange: #F97316;
--pink:   #EC4899;

/* Base */
--bg-primary:   #0F172A;  /* slate-900 */
--bg-secondary: #1E293B;  /* slate-800 */
--bg-card:      #1E293B;
--border:       rgba(255,255,255,0.08);
--text-primary: #F1F5F9;
--text-muted:   #94A3B8;
```

Typography: Use the Inter font (`next/font/google`).

Component rules:
- Phase cards: left border `4px solid <phase-color>`, dark card background
- Progress bars: animated fill, phase color
- Streak counter: amber flame emoji with day count
- XP display: small badge in top-right of header
- Resource pills: type badge (`COURSE`, `PAPER`, `VIDEO`, etc.) in phase color + link text

---

## 5. Navigation — 4 Views

Add a clean bottom nav (mobile) and left sidebar (desktop) with:

1. **Today** (default) — daily task view described above
2. **Roadmap** — the phase/topic/task tree (existing view, improved)
3. **Timeline** — horizontal 12-month calendar showing phase positions + current position marker
4. **Stats** — streak history calendar (GitHub-style heatmap), XP chart, phase completion ring charts

---

## 6. Roadmap View — Improvements to existing

Keep the phase accordion structure but improve it:

- Phase header: show phase color, month range, completion %, and capstone project name
- Topic row: show week number, task count, estimated hours total
- Task row (expanded): show full description, ALL resources as cards with type/free badges, difficulty tag, time estimate
- Resource cards must have: icon for type, title, `free` or `paid` badge, estimated hours, direct link button
- Add a "Mark all in topic done" button
- Show a lock icon on Phase 6 until Phase 5 is ≥80% complete

---

## 7. README.md — Replace entirely

Write a new `README.md` with:

```markdown
# ML Engineer Roadmap — 12 Months to Production ML

A free, self-hosted, daily-use learning tracker for the 12-month ML engineering roadmap.

## What's inside
- 48 weeks of structured curriculum with specific tasks, not vague goals
- Real named resources: papers, courses, repos (mostly free)
- Daily "Today" view — open the app and know exactly what to do
- Streak tracking and XP system to build a daily habit
- Beautiful dark UI built to look at every day

## Tech stack
Next.js 14 · React 18 · TypeScript · Tailwind CSS

## Running locally
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/ml-roadmap-app
cd ml-roadmap-app
npm install
npm run dev
\`\`\`
Open http://localhost:3000

## Deploy your own (free)
**Vercel (recommended)**
1. Fork this repo
2. Go to vercel.com → New Project → Import your fork
3. Click Deploy

**Netlify**
\`\`\`bash
npm run build && npm run export
\`\`\`
Upload the `out/` folder to Netlify Drop.

## Curriculum overview
| Phase | Months | Topics |
|-------|--------|--------|
| 1 — Foundations | 1–2 | Python, NumPy, Linear Algebra, Stats, Calculus |
| 2 — Classical ML | 3–4 | Sklearn, Supervised, Unsupervised Learning |
| 3 — Deep Learning | 5–6 | Neural Nets, PyTorch, CNNs |
| 4 — NLP & Transformers | 7–8 | BERT, fine-tuning, Hugging Face |
| 5 — MLOps | 9–10 | MLflow, Docker, FastAPI, CI/CD |
| 6 — Specialization | 11–12 | CV / NLP / Tabular track of your choice |

## License
MIT — fork, customize, share freely.
```

---

## 8. Quality checklist before finishing

- [ ] All 6 phases render correctly in Roadmap view
- [ ] Checking a task updates localStorage, re-renders streak/XP in header
- [ ] Today view shows the right next tasks (not already-completed ones)
- [ ] Every resource link opens in a new tab
- [ ] App works on mobile (375px wide) — test it
- [ ] Dark mode is default; light mode toggle works
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] `npm run lint` passes clean
- [ ] README has correct deploy instructions

---

## Constraints

- Do NOT change the tech stack (Next.js 14, React 18, TypeScript, Tailwind)
- Do NOT add a database or backend — localStorage only
- Do NOT use any paid APIs
- Keep all dependencies minimal — only add a package if truly necessary
- The app must be deployable on Vercel free tier with zero config
- Mobile-first: the app will primarily be used on a phone in the morning

---

## Execution order

1. Update `src/data/roadmap.ts` with full curriculum first
2. Update `src/lib/progress.ts` with new ProgressState fields
3. Create `src/components/TodayView.tsx`
4. Update `src/components/Header.tsx` — add streak + XP display
5. Update `src/app/layout.tsx` — dark mode default, Inter font
6. Update `src/app/page.tsx` — wire up 4 views + nav
7. Improve existing `src/components/PhaseCard.tsx` and `TopicCard.tsx`
8. Create `src/components/StatsView.tsx`
9. Create `src/components/TimelineView.tsx`
10. Replace `README.md`
11. Run build + lint, fix all errors
