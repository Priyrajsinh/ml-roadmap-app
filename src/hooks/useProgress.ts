'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ref,
  onValue,
  off,
  set,
  runTransaction,
  type DataSnapshot,
} from 'firebase/database';
import type { User } from 'firebase/auth';
import { getCompletedTaskIds, stepIdsByTaskId, taskIndex } from '@/data/roadmap-content';
import { migrateLegacyCompletedItems } from '@/lib/progress-model';
import { rtdb } from '@/lib/rtdb';

const XP_BY_DIFFICULTY: Record<string, number> = {
  beginner: 10,
  easy: 10,
  intermediate: 20,
  medium: 20,
  advanced: 30,
  hard: 30,
};

interface UserFirebaseData {
  completedItems?: Record<string, boolean>;
  completedTasks?: Record<string, boolean>;
  startDate?: string;
  streak?: number;
  lastCompletedDate?: string;
  totalXP?: number;
}

interface ProgressState {
  completedItems: Record<string, boolean>;
  startDate: string | null;
  streak: number;
  lastCompletedDate: string | null;
  totalXP: number;
}

function getDateKey(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toLocaleDateString('en-CA');
}

const defaultState: ProgressState = {
  completedItems: {},
  startDate: null,
  streak: 0,
  lastCompletedDate: null,
  totalXP: 0,
};

export function useProgress(user: User | null) {
  const [state, setState] = useState<ProgressState>(defaultState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setState(defaultState);
      setLoading(false);
      return;
    }

    const userRef = ref(rtdb, `users/${user.uid}`);

    function handleSnapshot(snapshot: DataSnapshot): void {
      const val = snapshot.val() as UserFirebaseData | null;
      setState({
        completedItems: migrateLegacyCompletedItems(
          val?.completedItems,
          val?.completedTasks,
          stepIdsByTaskId
        ),
        startDate: val?.startDate ?? null,
        streak: val?.streak ?? 0,
        lastCompletedDate: val?.lastCompletedDate ?? null,
        totalXP: val?.totalXP ?? 0,
      });
      setLoading(false);
    }

    onValue(userRef, handleSnapshot);

    return () => {
      off(userRef, 'value');
    };
  }, [user]);

  const toggleItem = useCallback(
    async (itemId: string, parentTaskId: string, difficulty: string): Promise<boolean> => {
      if (!user) return false;

      const xp = XP_BY_DIFFICULTY[difficulty] ?? 10;
      const userRef = ref(rtdb, `users/${user.uid}`);
      const stepIds = stepIdsByTaskId[parentTaskId] ?? [];
      const today = getDateKey();
      const yesterday = getDateKey(-1);

      try {
        const result = await runTransaction(userRef, (currentValue) => {
          const current = (currentValue as UserFirebaseData | null) ?? {};
          const completedItems = migrateLegacyCompletedItems(
            current.completedItems,
            current.completedTasks,
            stepIdsByTaskId
          );
          const currentXP = current.totalXP ?? 0;
          const wasTaskComplete =
            stepIds.length > 0 && stepIds.every((stepId) => completedItems[stepId] === true);
          const nextItemState = completedItems[itemId] !== true;

          if (nextItemState) {
            completedItems[itemId] = true;
          } else {
            delete completedItems[itemId];
          }

          const isTaskComplete =
            stepIds.length > 0 && stepIds.every((stepId) => completedItems[stepId] === true);

          let totalXP = currentXP;
          if (!wasTaskComplete && isTaskComplete) totalXP += xp;
          if (wasTaskComplete && !isTaskComplete) totalXP = Math.max(0, currentXP - xp);

          const lastCompletedDate = current.lastCompletedDate ?? null;
          const currentStreak = current.streak ?? 0;
          const streak =
            nextItemState && lastCompletedDate !== today
              ? lastCompletedDate === yesterday
                ? currentStreak + 1
                : 1
              : currentStreak;

          return {
            ...current,
            completedItems,
            totalXP,
            lastCompletedDate: nextItemState ? today : current.lastCompletedDate ?? null,
            streak,
          };
        });

        return result.committed;
      } catch (e) {
        console.error('Failed to toggle item:', e);
        return false;
      }
    },
    [user]
  );

  const resetTask = useCallback(
    async (taskId: string, difficulty: string): Promise<boolean> => {
      if (!user) return false;

      const xp = XP_BY_DIFFICULTY[difficulty] ?? 10;
      const userRef = ref(rtdb, `users/${user.uid}`);
      const stepIds = stepIdsByTaskId[taskId] ?? [];

      try {
        const result = await runTransaction(userRef, (currentValue) => {
          const current = (currentValue as UserFirebaseData | null) ?? {};
          const completedItems = migrateLegacyCompletedItems(
            current.completedItems,
            current.completedTasks,
            stepIdsByTaskId
          );
          const wasTaskComplete =
            stepIds.length > 0 && stepIds.every((stepId) => completedItems[stepId] === true);

          for (const stepId of stepIds) {
            delete completedItems[stepId];
          }

          return {
            ...current,
            completedItems,
            totalXP: wasTaskComplete ? Math.max(0, (current.totalXP ?? 0) - xp) : current.totalXP ?? 0,
          };
        });

        return result.committed;
      } catch (e) {
        console.error('Failed to reset task:', e);
        return false;
      }
    },
    [user]
  );

  const setStartDate = useCallback(
    async (date: string): Promise<void> => {
      if (!user) return;
      try {
        await set(ref(rtdb, `users/${user.uid}/startDate`), date);
      } catch (e) {
        console.error('Failed to set start date:', e);
      }
    },
    [user]
  );

  const completedItemIds = Object.keys(state.completedItems).filter(
    (id) => state.completedItems[id] === true
  );
  const completedTaskIds = getCompletedTaskIds(completedItemIds);

  return {
    completedItems: state.completedItems,
    completedItemIds,
    completedTaskIds,
    startDate: state.startDate,
    streak: state.streak,
    totalXP: state.totalXP,
    loading,
    toggleItem,
    resetTask,
    setStartDate,
    getTaskStepIds: (taskId: string) => stepIdsByTaskId[taskId] ?? [],
    getTask: (taskId: string) => taskIndex[taskId]?.task,
  };
}
