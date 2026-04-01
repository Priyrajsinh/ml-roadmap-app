export type RoadmapColorScheme =
  | 'blue'
  | 'purple'
  | 'teal'
  | 'green'
  | 'orange'
  | 'pink';

export type TaskDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type TaskStepType =
  | 'learn'
  | 'practice'
  | 'build'
  | 'review'
  | 'showcase';

export type ResourceKind =
  | 'course'
  | 'book'
  | 'video'
  | 'paper'
  | 'docs'
  | 'github'
  | 'blog'
  | 'tool'
  | 'template';

export interface TaskResource {
  id: string;
  title: string;
  url: string;
  label: string;
  kind: ResourceKind;
  appliesToStepId?: string;
}

export interface TaskStep {
  id: string;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  type: TaskStepType;
  resources: TaskResource[];
}

export interface TaskDeliverable {
  id: string;
  title: string;
  description: string;
  outputType: 'notebook' | 'script' | 'readme' | 'repo-folder' | 'doc' | 'artifact';
}

export interface TaskShowcaseAction {
  id: string;
  title: string;
  repoPath: string;
  commitMessage: string;
  readmeUpdate: string;
  proof: string;
  publishTarget?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  goal: string;
  whyItMatters?: string;
  estimatedMinutes: number;
  resources: TaskResource[];
  tags: string[];
  difficulty: TaskDifficulty;
  steps: TaskStep[];
  deliverables: TaskDeliverable[];
  githubShowcase: TaskShowcaseAction[];
  completionMode: 'all-steps';
}

export interface Topic {
  id: string;
  title: string;
  weekNumber: number;
  tasks: Task[];
  milestone?: string;
}

export interface Phase {
  id: string;
  title: string;
  months: string;
  description: string;
  colorScheme: RoadmapColorScheme;
  topics: Topic[];
  capstoneProject: string;
}

export interface GuideChecklistItem {
  id: string;
  text: string;
}

export interface GuideSection {
  id: string;
  title: string;
  description: string;
  emphasis?: string;
  checklist?: GuideChecklistItem[];
  bullets?: string[];
}

export interface SearchableRoadmapItem {
  id: string;
  type: 'task' | 'step' | 'guide' | 'deliverable' | 'showcase';
  title: string;
  description: string;
  url?: string;
  phaseTitle?: string;
  topicTitle?: string;
  taskId?: string;
  stepId?: string;
}
