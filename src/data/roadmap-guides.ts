import type { GuideSection } from '@/types/roadmap';

export const guideSections: GuideSection[] = [
  {
    id: 'guide-repo-setup',
    title: 'Repository Blueprint',
    description:
      'Create one public ML portfolio repo on day 1 and keep all foundations, projects, notes, and writeups inside it.',
    emphasis: 'Your GitHub is part of the roadmap, not something you clean up at the end.',
    bullets: [
      'Use a clear repo name like ml-engineering-portfolio.',
      'Create top-level folders for foundation, deep-learning, genai-llm, mlops, projects, system-design, and blog.',
      'Keep README.md as your portfolio landing page with featured projects and links.',
      'Never commit datasets, model weights, .env files, or secrets.',
    ],
    checklist: [
      { id: 'guide-repo-setup-1', text: 'Create the public portfolio repository.' },
      { id: 'guide-repo-setup-2', text: 'Add README, LICENSE, and a safe .gitignore.' },
      { id: 'guide-repo-setup-3', text: 'Create folders for foundations, projects, and documentation.' },
      { id: 'guide-repo-setup-4', text: 'Make your first commit with structure and intent, not empty promises.' },
    ],
  },
  {
    id: 'guide-daily-non-negotiables',
    title: 'Daily Non-Negotiables',
    description:
      'These habits compound over the whole year and make the roadmap feel like a system instead of random study sessions.',
    emphasis: 'Consistency matters more than squeezing every checkbox into one day.',
    checklist: [
      { id: 'guide-daily-non-negotiables-1', text: 'Do one focused DSA block before your main study block.' },
      { id: 'guide-daily-non-negotiables-2', text: 'Spend at least 30 minutes on German or communication practice.' },
      { id: 'guide-daily-non-negotiables-3', text: 'Push at least one meaningful Git commit when you build or learn something substantial.' },
    ],
  },
  {
    id: 'guide-sunday-review',
    title: 'Sunday Review Ritual',
    description:
      'Sunday is where you consolidate learning, clean the repo, and make your public proof of work sharper.',
    emphasis: 'The review keeps your portfolio and your roadmap moving together.',
    checklist: [
      { id: 'guide-sunday-review-1', text: 'Push all unfinished local work and clean up commit history if needed.' },
      { id: 'guide-sunday-review-2', text: 'Update the root README with the newest artifact or learning win.' },
      { id: 'guide-sunday-review-3', text: 'Write one short paragraph toward a blog post, technical note, or SOP.' },
      { id: 'guide-sunday-review-4', text: 'Review next week’s section so Monday starts with clarity.' },
      { id: 'guide-sunday-review-5', text: 'Check Germany application and portfolio readiness checkpoints.' },
    ],
  },
  {
    id: 'guide-readme',
    title: 'Portfolio README Checklist',
    description:
      'Your root README should explain who you are, what you build, and where the strongest proof of work lives.',
    bullets: [
      'Lead with one-line positioning: ML engineer target + current focus.',
      'Feature 2-3 projects with stack, result, and repo path.',
      'Link notebooks, reports, and deployed demos where available.',
      'Keep the README current as the public map of the journey.',
    ],
  },
];
