import type { TaskDeliverable, TaskResource, TaskShowcaseAction, TaskStep } from '@/types/roadmap';

export interface TaskDetailOverride {
  goal?: string;
  whyItMatters?: string;
  steps?: TaskStep[];
  deliverables?: TaskDeliverable[];
  githubShowcase?: TaskShowcaseAction[];
}

function resource(
  id: string,
  title: string,
  url: string,
  kind: TaskResource['kind'],
  label?: string
): TaskResource {
  return { id, title, url, kind, label: label ?? title };
}

export const taskDetailOverrides: Record<string, TaskDetailOverride> = {
  'task-1-1-1': {
    goal: 'Finish Python basics with a visible practice artifact instead of passive reading.',
    whyItMatters: 'This task is the floor for every later notebook, experiment, and ML service.',
    steps: [
      {
        id: 'task-1-1-1-step-1',
        title: 'Cover chapters 1-4: syntax, variables, strings, lists',
        description: 'Code along and rewrite the examples yourself.',
        estimatedMinutes: 40,
        type: 'learn',
        resources: [
          resource('task-1-1-1-step-1-r1', 'Python Crash Course', 'https://nostarch.com/pythoncrashcourse2e', 'book'),
        ],
      },
      {
        id: 'task-1-1-1-step-2',
        title: 'Cover chapters 5-8: conditionals, loops, functions, dictionaries, files',
        description: 'Turn each concept into one tiny executable script.',
        estimatedMinutes: 45,
        type: 'practice',
        resources: [
          resource('task-1-1-1-step-2-r1', 'Real Python Basics', 'https://realpython.com/python-basics/', 'course'),
        ],
      },
      {
        id: 'task-1-1-1-step-3',
        title: 'Create a fundamentals folder with runnable examples',
        description: 'Save your scripts so this becomes a reusable reference.',
        estimatedMinutes: 35,
        type: 'showcase',
        resources: [],
      },
    ],
    deliverables: [
      {
        id: 'task-1-1-1-deliverable-1',
        title: 'Python basics practice folder',
        description: 'A repo folder with short scripts for strings, lists, loops, functions, and file handling.',
        outputType: 'repo-folder',
      },
    ],
    githubShowcase: [
      {
        id: 'task-1-1-1-showcase-1',
        title: 'Publish the Python basics artifact',
        repoPath: 'foundation/python/python_basics/',
        commitMessage: 'build: add python fundamentals exercises and notes',
        readmeUpdate: 'Add a Foundations entry linking to your Python basics folder.',
        proof: 'Show 4-5 runnable scripts and a short notes file with mistakes and takeaways.',
      },
    ],
  },
  'task-1-1-2': {
    goal: 'Get comfortable with NumPy arrays, shapes, and broadcasting through direct practice.',
    steps: [
      {
        id: 'task-1-1-2-step-1',
        title: 'Learn shapes, indexing, slicing, reshaping, and dtypes',
        description: 'Recreate the official quickstart examples in a notebook.',
        estimatedMinutes: 30,
        type: 'learn',
        resources: [
          resource('task-1-1-2-step-1-r1', 'NumPy Official Quickstart', 'https://numpy.org/doc/stable/user/quickstart.html', 'docs'),
        ],
      },
      {
        id: 'task-1-1-2-step-2',
        title: 'Practice broadcasting and vectorized math',
        description: 'Convert at least one loop-based operation into vectorized NumPy code.',
        estimatedMinutes: 35,
        type: 'practice',
        resources: [
          resource('task-1-1-2-step-2-r1', 'CS231n NumPy Tutorial', 'https://cs231n.github.io/python-numpy-tutorial/', 'course'),
        ],
      },
      {
        id: 'task-1-1-2-step-3',
        title: 'Save a NumPy cheat sheet notebook',
        description: 'Capture the array operations and shape patterns you will reuse later.',
        estimatedMinutes: 25,
        type: 'showcase',
        resources: [],
      },
    ],
  },
  'task-1-1-3': {
    goal: 'Reach the point where you can load, clean, group, merge, and summarize tabular data confidently.',
    steps: [
      {
        id: 'task-1-1-3-step-1',
        title: 'Learn DataFrame creation, filtering, sorting, and basic inspection',
        estimatedMinutes: 30,
        type: 'learn',
        resources: [
          resource('task-1-1-3-step-1-r1', '10 Minutes to Pandas', 'https://pandas.pydata.org/docs/user_guide/10min.html', 'docs'),
        ],
      },
      {
        id: 'task-1-1-3-step-2',
        title: 'Practice groupby, merge, and missing-value cleanup',
        estimatedMinutes: 40,
        type: 'practice',
        resources: [
          resource('task-1-1-3-step-2-r1', 'Kaggle Pandas Course', 'https://www.kaggle.com/learn/pandas', 'course'),
        ],
      },
      {
        id: 'task-1-1-3-step-3',
        title: 'Create a mini EDA notebook on Titanic or another starter CSV',
        estimatedMinutes: 40,
        type: 'build',
        resources: [],
      },
    ],
  },
  'task-3-1-2': {
    goal: 'Build real backprop intuition by implementing the full network path yourself.',
    whyItMatters: 'This is the bridge between theory and deep-learning debugging skill.',
    steps: [
      {
        id: 'task-3-1-2-step-1',
        title: 'Write the forward pass: linear -> ReLU -> linear -> softmax -> loss',
        estimatedMinutes: 40,
        type: 'build',
        resources: [
          resource('task-3-1-2-step-1-r1', 'micrograd', 'https://github.com/karpathy/micrograd', 'github'),
        ],
      },
      {
        id: 'task-3-1-2-step-2',
        title: 'Implement backward pass and gradient checking',
        estimatedMinutes: 45,
        type: 'practice',
        resources: [
          resource('task-3-1-2-step-2-r1', 'Neural Networks: Zero to Hero', 'https://karpathy.ai/zero-to-hero.html', 'video'),
        ],
      },
      {
        id: 'task-3-1-2-step-3',
        title: 'Train on a simple dataset and document what breaks or improves',
        estimatedMinutes: 35,
        type: 'showcase',
        resources: [],
      },
    ],
  },
  'task-5-3-1': {
    goal: 'Make your ML work reproducible and reviewable through CI from the start.',
    steps: [
      {
        id: 'task-5-3-1-step-1',
        title: 'Create a workflow that installs dependencies and runs tests',
        estimatedMinutes: 35,
        type: 'build',
        resources: [
          resource('task-5-3-1-step-1-r1', 'GitHub Actions Docs', 'https://docs.github.com/en/actions', 'docs'),
        ],
      },
      {
        id: 'task-5-3-1-step-2',
        title: 'Add a small evaluation or sanity gate for the model pipeline',
        estimatedMinutes: 30,
        type: 'practice',
        resources: [],
      },
      {
        id: 'task-5-3-1-step-3',
        title: 'Document what the workflow protects you from',
        estimatedMinutes: 25,
        type: 'showcase',
        resources: [],
      },
    ],
  },
  'task-6-4-1': {
    goal: 'Turn the capstone from an idea into a scoped engineering plan.',
    steps: [
      {
        id: 'task-6-4-1-step-1',
        title: 'Define the problem, user, dataset, and success metric',
        estimatedMinutes: 20,
        type: 'review',
        resources: [
          resource('task-6-4-1-step-1-r1', 'Cookiecutter Data Science', 'https://cookiecutter-data-science.drivendata.org', 'template'),
        ],
      },
      {
        id: 'task-6-4-1-step-2',
        title: 'List the data pipeline, baseline, experiments, and deployment path',
        estimatedMinutes: 20,
        type: 'build',
        resources: [],
      },
      {
        id: 'task-6-4-1-step-3',
        title: 'Publish the one-page spec in the repo before you code',
        estimatedMinutes: 20,
        type: 'showcase',
        resources: [],
      },
    ],
  },
  'task-6-4-5': {
    goal: 'Ship the project in a way that recruiters and reviewers can understand quickly.',
    steps: [
      {
        id: 'task-6-4-5-step-1',
        title: 'Write README sections for problem, dataset, approach, metrics, and setup',
        estimatedMinutes: 25,
        type: 'build',
        resources: [
          resource('task-6-4-5-step-1-r1', 'Awesome README', 'https://github.com/academic/awesome-readme', 'github'),
        ],
      },
      {
        id: 'task-6-4-5-step-2',
        title: 'Link demo, report, notebook, and architecture notes',
        estimatedMinutes: 20,
        type: 'showcase',
        resources: [],
      },
      {
        id: 'task-6-4-5-step-3',
        title: 'Make the final push with a clean release-style commit',
        estimatedMinutes: 15,
        type: 'showcase',
        resources: [],
      },
    ],
  },
};
