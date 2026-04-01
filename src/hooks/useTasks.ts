'use client';

import { useMemo } from 'react';
import { phases, type Task, type Phase } from '@/data/roadmap';

export interface TaskWithContext {
  task: Task;
  phaseId: string;
  phaseTitle: string;
  phaseColorScheme: Phase['colorScheme'];
  topicId: string;
  topicTitle: string;
  weekNumber: number;
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

// Computed once at module load — roadmap data is static
const ALL_TASKS_WITH_CONTEXT = buildAllTasks();

export function useTasks() {
  return useMemo(() => ({ allTasksWithContext: ALL_TASKS_WITH_CONTEXT, phases }), []);
}

export function getTodayTasksForDate(startDate: string): TaskWithContext[] {
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const daysSinceStart = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceStart < 0) return []; // Start date is in the future

  const currentWeek = Math.floor(daysSinceStart / 7) + 1;
  return ALL_TASKS_WITH_CONTEXT.filter((t) => t.weekNumber === currentWeek);
}
