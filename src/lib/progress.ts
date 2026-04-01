// Pure utility functions for progress calculations.
// No Firebase, no React state — all functions take completedTaskIds as a parameter.
import { phases } from '@/data/roadmap';

export function getOverallProgress(completedTaskIds: string[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  let total = 0;
  for (const phase of phases) {
    for (const topic of phase.topics) {
      total += topic.tasks.length;
    }
  }
  const completed = completedTaskIds.length;
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function getPhaseProgress(
  phaseId: string,
  completedTaskIds: string[]
): { completed: number; total: number; percentage: number } {
  const phase = phases.find((p) => p.id === phaseId);
  if (!phase) return { completed: 0, total: 0, percentage: 0 };

  let total = 0;
  let completed = 0;
  for (const topic of phase.topics) {
    for (const task of topic.tasks) {
      total += 1;
      if (completedTaskIds.includes(task.id)) completed += 1;
    }
  }
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function getCurrentPhaseIndex(completedTaskIds: string[]): number {
  for (let i = phases.length - 1; i >= 0; i--) {
    const phase = phases[i];
    const hasCompleted = phase.topics.some((topic) =>
      topic.tasks.some((task) => completedTaskIds.includes(task.id))
    );
    if (hasCompleted) return i;
  }
  return 0;
}
