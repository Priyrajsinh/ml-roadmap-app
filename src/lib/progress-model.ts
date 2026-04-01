export function migrateLegacyCompletedItems(
  completedItems: Record<string, boolean> | undefined,
  completedTasks: Record<string, boolean> | undefined,
  stepIdsByTaskId: Record<string, string[]>
): Record<string, boolean> {
  const normalized = { ...(completedItems ?? {}) };

  if (completedItems && Object.keys(completedItems).length > 0) {
    return normalized;
  }

  for (const taskId of Object.keys(completedTasks ?? {})) {
    if (!completedTasks?.[taskId]) continue;

    for (const stepId of stepIdsByTaskId[taskId] ?? []) {
      normalized[stepId] = true;
    }
  }

  return normalized;
}
