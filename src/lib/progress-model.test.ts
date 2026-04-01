import { describe, expect, it } from 'vitest';
import { getCompletedTaskIds, getTaskCompletion, stepIdsByTaskId, taskIndex } from '@/data/roadmap-content';
import { migrateLegacyCompletedItems } from '@/lib/progress-model';

describe('progress item model', () => {
  it('returns false when no task steps are complete', () => {
    expect(getTaskCompletion([], 'task-1-1-1')).toBe(false);
  });

  it('returns false when only some task steps are complete', () => {
    const partial = [stepIdsByTaskId['task-1-1-1'][0]];
    expect(getTaskCompletion(partial, 'task-1-1-1')).toBe(false);
  });

  it('returns true when all task steps are complete', () => {
    const completed = stepIdsByTaskId['task-1-1-1'];
    expect(getTaskCompletion(completed, 'task-1-1-1')).toBe(true);
  });

  it('derives completed task ids from completed checklist items', () => {
    const completed = stepIdsByTaskId['task-1-1-2'];
    expect(getCompletedTaskIds(completed)).toContain('task-1-1-2');
  });

  it('migrates legacy task completion into nested step completion', () => {
    const migrated = migrateLegacyCompletedItems(undefined, { 'task-1-1-1': true }, stepIdsByTaskId);
    expect(Object.keys(migrated)).toEqual(stepIdsByTaskId['task-1-1-1']);
  });

  it('preserves newer item-level progress over legacy task booleans', () => {
    const preserved = migrateLegacyCompletedItems(
      { [stepIdsByTaskId['task-1-1-1'][0]]: true },
      { 'task-1-1-2': true },
      stepIdsByTaskId
    );

    expect(preserved).toEqual({ [stepIdsByTaskId['task-1-1-1'][0]]: true });
  });

  it('keeps task steps stable for showcase-rich tasks', () => {
    expect(taskIndex['task-6-4-5'].task.githubShowcase.length).toBeGreaterThan(0);
    expect(taskIndex['task-6-4-5'].task.steps.length).toBeGreaterThan(0);
  });
});
