'use client';

import { useMemo } from 'react';
import { allTasksWithContext, phases, type TaskWithContext } from '@/data/roadmap-content';

export interface ActiveWeekTasks {
  tasks: TaskWithContext[];
  weekNumber: number | null;
  roadmapComplete: boolean;
}

const WEEK_NUMBERS = [...new Set(allTasksWithContext.map((entry) => entry.weekNumber))].sort(
  (left, right) => left - right
);

export function useTasks() {
  return useMemo(() => ({ allTasksWithContext, phases }), []);
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

    const tasks = allTasksWithContext.filter((entry) => entry.weekNumber === weekNumber);
    const hasIncompleteTask = tasks.some(({ task }) => !completedTaskIds.includes(task.id));

    if (hasIncompleteTask) {
      return { tasks, weekNumber, roadmapComplete: false };
    }
  }

  return { tasks: [], weekNumber: null, roadmapComplete: true };
}
