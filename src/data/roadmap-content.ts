import { phases as legacyPhases } from '@/data/roadmap';
import { guideSections } from '@/data/roadmap-guides';
import { taskDetailOverrides } from '@/data/roadmap-overrides';
import type {
  Phase,
  SearchableRoadmapItem,
  Task,
  TaskDeliverable,
  TaskResource,
  TaskShowcaseAction,
  TaskStep,
  Topic,
} from '@/types/roadmap';

type LegacyPhase = (typeof legacyPhases)[number];
type LegacyTopic = LegacyPhase['topics'][number];
type LegacyTask = LegacyTopic['tasks'][number];
type LegacyResource = LegacyTask['resources'][number];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function titleCaseTag(tag: string): string {
  return tag
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function resourceKind(kind: LegacyResource['type']): TaskResource['kind'] {
  if (kind === 'repo') return 'github';
  return kind;
}

function inferRepoPrefix(phaseId: string): string {
  switch (phaseId) {
    case 'phase-1':
      return 'foundation';
    case 'phase-2':
      return 'classical-ml';
    case 'phase-3':
      return 'deep-learning';
    case 'phase-4':
      return 'nlp-transformers';
    case 'phase-5':
      return 'mlops';
    default:
      return 'projects';
  }
}

function buildBaseResources(task: LegacyTask): TaskResource[] {
  return task.resources.map((resource, index) => ({
    id: `${task.id}-resource-${index + 1}`,
    title: resource.title,
    url: resource.url,
    label: resource.title,
    kind: resourceKind(resource.type),
  }));
}

function buildDefaultGoal(task: LegacyTask): string {
  if (task.tags.length > 0) {
    return `Build confident working knowledge of ${task.tags
      .slice(0, 2)
      .map(titleCaseTag)
      .join(' and ')}.`;
  }

  return task.description;
}

function buildDefaultSteps(task: LegacyTask): TaskStep[] {
  const resources = buildBaseResources(task);
  const first = resources[0] ? [resources[0]] : [];
  const second = resources[1] ? [resources[1]] : first;

  return [
    {
      id: `${task.id}-step-1`,
      title: `Learn the core concepts behind ${task.title}`,
      description: task.description,
      estimatedMinutes: Math.max(20, Math.round(task.estimatedMinutes * 0.35)),
      type: 'learn',
      resources: first,
    },
    {
      id: `${task.id}-step-2`,
      title: `Practice the main workflow for ${task.title}`,
      description:
        'Translate the concept into code, notes, or a worked example so the task leaves behind something reusable.',
      estimatedMinutes: Math.max(20, Math.round(task.estimatedMinutes * 0.4)),
      type: 'practice',
      resources: second,
    },
    {
      id: `${task.id}-step-3`,
      title: `Create a showcase-ready artifact for ${task.title}`,
      description:
        'Package the output so it can live in your portfolio repo with a clear explanation of what you built.',
      estimatedMinutes: Math.max(15, Math.round(task.estimatedMinutes * 0.25)),
      type: 'showcase',
      resources: [],
    },
  ];
}

function buildDefaultDeliverables(task: LegacyTask, phaseId: string): TaskDeliverable[] {
  const prefix = inferRepoPrefix(phaseId);
  const outputType: TaskDeliverable['outputType'] = task.tags.includes('blog')
    ? 'readme'
    : task.tags.includes('pipeline') || task.tags.includes('deployment')
      ? 'script'
      : task.tags.includes('capstone')
        ? 'doc'
        : 'notebook';

  return [
    {
      id: `${task.id}-deliverable-1`,
      title: `${task.title} artifact`,
      description: `Store the output under ${prefix}/${slugify(task.title)}/ with enough context to revisit it later.`,
      outputType,
    },
  ];
}

function buildDefaultShowcase(task: LegacyTask, phaseId: string): TaskShowcaseAction[] {
  const prefix = inferRepoPrefix(phaseId);
  const folder = `${prefix}/${slugify(task.title)}/`;

  return [
    {
      id: `${task.id}-showcase-1`,
      title: `Publish ${task.title} to the portfolio repo`,
      repoPath: folder,
      commitMessage: `feat: add ${slugify(task.title).replace(/_/g, ' ')}`,
      readmeUpdate: `Add a short README bullet explaining what ${task.title} covers and why it matters.`,
      proof: 'Include a notebook, script, or note with one concrete output that proves the task was completed thoughtfully.',
    },
  ];
}

function enrichTask(task: LegacyTask, phaseId: string): Task {
  const override = taskDetailOverrides[task.id];
  const baseResources = buildBaseResources(task);

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    goal: override?.goal ?? buildDefaultGoal(task),
    whyItMatters: override?.whyItMatters ?? task.description,
    estimatedMinutes: task.estimatedMinutes,
    resources: baseResources,
    tags: task.tags,
    difficulty: task.difficulty,
    steps: override?.steps ?? buildDefaultSteps(task),
    deliverables: override?.deliverables ?? buildDefaultDeliverables(task, phaseId),
    githubShowcase: override?.githubShowcase ?? buildDefaultShowcase(task, phaseId),
    completionMode: 'all-steps',
  };
}

function enrichTopic(topic: LegacyTopic, phaseId: string): Topic {
  return {
    id: topic.id,
    title: topic.title,
    weekNumber: topic.weekNumber,
    milestone: topic.milestone,
    tasks: topic.tasks.map((task) => enrichTask(task, phaseId)),
  };
}

export const phases: Phase[] = legacyPhases.map((phase) => ({
  id: phase.id,
  title: phase.title,
  months: phase.months.replace(/â€“/g, '-'),
  description: phase.description,
  colorScheme: phase.colorScheme,
  topics: phase.topics.map((topic) => enrichTopic(topic, phase.id)),
  capstoneProject: phase.capstoneProject.replace(/â€“/g, '-'),
}));

export interface TaskWithContext {
  task: Task;
  phaseId: string;
  phaseTitle: string;
  phaseColorScheme: Phase['colorScheme'];
  topicId: string;
  topicTitle: string;
  weekNumber: number;
}

export const allTasksWithContext: TaskWithContext[] = phases.flatMap((phase) =>
  phase.topics.flatMap((topic) =>
    topic.tasks.map((task) => ({
      task,
      phaseId: phase.id,
      phaseTitle: phase.title,
      phaseColorScheme: phase.colorScheme,
      topicId: topic.id,
      topicTitle: topic.title,
      weekNumber: topic.weekNumber,
    }))
  )
);

export const taskIndex: Record<string, TaskWithContext> = Object.fromEntries(
  allTasksWithContext.map((entry) => [entry.task.id, entry])
);

export const stepIdsByTaskId: Record<string, string[]> = Object.fromEntries(
  allTasksWithContext.map((entry) => [entry.task.id, entry.task.steps.map((step) => step.id)])
);

export const roadmapSearchIndex: SearchableRoadmapItem[] = [
  ...allTasksWithContext.flatMap(({ task, phaseTitle, topicTitle }) => [
    {
      id: task.id,
      type: 'task' as const,
      title: task.title,
      description: task.description,
      phaseTitle,
      topicTitle,
      taskId: task.id,
    },
    ...task.steps.map((step) => ({
      id: step.id,
      type: 'step' as const,
      title: step.title,
      description: step.description ?? task.description,
      phaseTitle,
      topicTitle,
      taskId: task.id,
      stepId: step.id,
    })),
    ...task.deliverables.map((deliverable) => ({
      id: deliverable.id,
      type: 'deliverable' as const,
      title: deliverable.title,
      description: deliverable.description,
      phaseTitle,
      topicTitle,
      taskId: task.id,
    })),
    ...task.githubShowcase.map((showcase) => ({
      id: showcase.id,
      type: 'showcase' as const,
      title: showcase.title,
      description: `${showcase.repoPath} - ${showcase.readmeUpdate}`,
      phaseTitle,
      topicTitle,
      taskId: task.id,
    })),
  ]),
  ...guideSections.map((section) => ({
    id: section.id,
    type: 'guide' as const,
    title: section.title,
    description: section.description,
  })),
];

export function getTaskCompletion(completedItemIds: string[], taskId: string): boolean {
  const stepIds = stepIdsByTaskId[taskId] ?? [];
  return stepIds.length > 0 && stepIds.every((id) => completedItemIds.includes(id));
}

export function getCompletedTaskIds(completedItemIds: string[]): string[] {
  return allTasksWithContext
    .filter(({ task }) => getTaskCompletion(completedItemIds, task.id))
    .map(({ task }) => task.id);
}

export function getAllCoreItemIds(): string[] {
  return allTasksWithContext.flatMap(({ task }) => task.steps.map((step) => step.id));
}
