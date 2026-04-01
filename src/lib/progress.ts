import { phases } from '@/data/roadmap-content';

export interface ProgressSummary {
  completed: number;
  total: number;
  percentage: number;
}

export interface StepProgressSummary extends ProgressSummary {
  completedSteps: number;
  totalSteps: number;
  stepPercentage: number;
}

function calculateTaskProgress(taskIds: string[], total: number): ProgressSummary {
  return {
    completed: taskIds.length,
    total,
    percentage: total > 0 ? Math.round((taskIds.length / total) * 100) : 0,
  };
}

export function getOverallProgress(completedTaskIds: string[]): ProgressSummary {
  const total = phases.reduce(
    (taskTotal, phase) => taskTotal + phase.topics.reduce((sum, topic) => sum + topic.tasks.length, 0),
    0
  );

  return calculateTaskProgress(completedTaskIds, total);
}

export function getOverallStepProgress(completedItemIds: string[]): StepProgressSummary {
  const totalSteps = phases.reduce(
    (stepTotal, phase) =>
      stepTotal +
      phase.topics.reduce(
        (topicStepTotal, topic) =>
          topicStepTotal + topic.tasks.reduce((taskStepTotal, task) => taskStepTotal + task.steps.length, 0),
        0
      ),
    0
  );

  const completedTasks = phases.flatMap((phase) =>
    phase.topics.flatMap((topic) =>
      topic.tasks.filter((task) =>
        task.steps.every((step) => completedItemIds.includes(step.id))
      )
    )
  ).length;

  return {
    ...getOverallProgress(
      phases.flatMap((phase) =>
        phase.topics.flatMap((topic) =>
          topic.tasks
            .filter((task) => task.steps.every((step) => completedItemIds.includes(step.id)))
            .map((task) => task.id)
        )
      )
    ),
    completedSteps: completedItemIds.length,
    totalSteps,
    stepPercentage: totalSteps > 0 ? Math.round((completedItemIds.length / totalSteps) * 100) : 0,
    completed: completedTasks,
  };
}

export function getPhaseProgress(
  phaseId: string,
  completedTaskIds: string[]
): ProgressSummary {
  const phase = phases.find((entry) => entry.id === phaseId);
  if (!phase) return { completed: 0, total: 0, percentage: 0 };

  const taskIds = phase.topics.flatMap((topic) => topic.tasks.map((task) => task.id));
  const completed = taskIds.filter((id) => completedTaskIds.includes(id)).length;

  return {
    completed,
    total: taskIds.length,
    percentage: taskIds.length > 0 ? Math.round((completed / taskIds.length) * 100) : 0,
  };
}

export function getCurrentPhaseIndex(completedTaskIds: string[]): number {
  for (let index = phases.length - 1; index >= 0; index -= 1) {
    const phase = phases[index];
    const hasCompleted = phase.topics.some((topic) =>
      topic.tasks.some((task) => completedTaskIds.includes(task.id))
    );

    if (hasCompleted) return index;
  }

  return 0;
}
