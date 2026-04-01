import { describe, expect, it } from 'vitest';
import { taskIndex, roadmapSearchIndex, stepIdsByTaskId } from '@/data/roadmap-content';
import { getTodayTasksForDate } from '@/hooks/useTasks';
import { getOverallProgress, getOverallStepProgress } from '@/lib/progress';

describe('roadmap calculations', () => {
  it('returns the current week tasks when the roadmap has started', () => {
    const today = new Date().toISOString().split('T')[0];
    const activeWeek = getTodayTasksForDate(today, []);

    expect(activeWeek.weekNumber).toBe(1);
    expect(activeWeek.tasks.length).toBeGreaterThan(0);
  });

  it('moves to the next incomplete week when the current one is fully done', () => {
    const today = new Date().toISOString().split('T')[0];
    const weekOneTaskIds = ['task-1-1-1', 'task-1-1-2', 'task-1-1-3'];
    const activeWeek = getTodayTasksForDate(today, weekOneTaskIds);

    expect(activeWeek.weekNumber).toBe(3);
  });

  it('calculates overall progress by completed tasks', () => {
    const summary = getOverallProgress(['task-1-1-1', 'task-1-1-2']);

    expect(summary.completed).toBe(2);
    expect(summary.total).toBeGreaterThan(2);
    expect(summary.percentage).toBeGreaterThan(0);
  });

  it('calculates step progress independently from task progress', () => {
    const summary = getOverallStepProgress(stepIdsByTaskId['task-1-1-1']);

    expect(summary.completedSteps).toBe(stepIdsByTaskId['task-1-1-1'].length);
    expect(summary.stepPercentage).toBeGreaterThan(0);
    expect(summary.completed).toBe(1);
  });

  it('indexes steps and showcase content in search', () => {
    const hasChecklistResult = roadmapSearchIndex.some((entry) =>
      entry.title.toLowerCase().includes('fundamentals folder')
    );
    const hasShowcaseResult = roadmapSearchIndex.some((entry) =>
      entry.description.toLowerCase().includes('readme')
    );

    expect(hasChecklistResult).toBe(true);
    expect(hasShowcaseResult).toBe(true);
  });

  it('builds detailed task content for today cards', () => {
    expect(taskIndex['task-1-1-1'].task.steps.length).toBe(3);
    expect(taskIndex['task-1-1-1'].task.deliverables.length).toBeGreaterThan(0);
  });
});
