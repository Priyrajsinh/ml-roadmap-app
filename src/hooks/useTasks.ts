'use client';

import { useMemo } from 'react';
import { phases, type Phase, type Task } from '@/data/roadmap';

export interface TaskWithContext {
  task: Task;
  phaseId: string;
  phaseTitle: string;
  phaseColorScheme: Phase['colorScheme'];
  topicId: string;
  topicTitle: string;
  weekNumber: number;
}

export interface ActiveWeekTasks {
  tasks: TaskWithContext[];
  weekNumber: number | null;
  roadmapComplete: boolean;
}

function buildAllTasks(): TaskWithContext[] {
  const result: TaskWithContext[] = [];

  for (const phase of phases) {
    for (const topic of phase.topics) {
      for (const task of topic.tasks) {
        result.push({
          task,
          phaseId: phase.id,
          phaseTitle: phase.title,
          phaseColorScheme: phase.colorScheme,
          topicId: topic.id,
          topicTitle: topic.title,
          weekNumber: topic.weekNumber,
        });
      }
    }
  }

  return result;
}

const ALL_TASKS_WITH_CONTEXT = buildAllTasks();
const WEEK_NUMBERS = [...new Set(ALL_TASKS_WITH_CONTEXT.map((task) => task.weekNumber))]
  .sort((a, b) => a - b);

export function useTasks() {
  return useMemo(() => ({ allTasksWithContext: ALL_TASKS_WITH_CONTEXT, phases }), []);
}

export function getTodayTasksForDate(
  startDate: string,
  completedTaskIds: string[]
): ActiveWeekTasks {
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const daysSinceStart = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceStart < 0) {
    return { tasks: [], weekNumber: null, roadmapComplete: false };
  }

  const currentWeek = Math.floor(daysSinceStart / 7) + 1;

  for (const weekNumber of WEEK_NUMBERS) {
    if (weekNumber < currentWeek) continue;

    const tasks = ALL_TASKS_WITH_CONTEXT.filter((task) => task.weekNumber === weekNumber);
    const hasIncompleteTask = tasks.some(
      ({ task }) => !completedTaskIds.includes(task.id)
    );

    if (hasIncompleteTask) {
      return { tasks, weekNumber, roadmapComplete: false };
    }
  }

  return { tasks: [], weekNumber: null, roadmapComplete: true };
}
