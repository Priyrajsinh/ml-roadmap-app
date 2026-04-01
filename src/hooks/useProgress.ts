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
import { rtdb } from '@/lib/rtdb';
import type { User } from 'firebase/auth';

const XP_BY_DIFFICULTY: Record<string, number> = {
  beginner: 10,
  easy: 10,
  intermediate: 20,
  medium: 20,
  advanced: 30,
  hard: 30,
};

interface UserFirebaseData {
  completedTasks?: Record<string, boolean>;
  startDate?: string;
  streak?: number;
  lastCompletedDate?: string;
  totalXP?: number;
}

interface ProgressState {
  completedTasks: Record<string, boolean>;
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
  completedTasks: {},
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
        completedTasks: val?.completedTasks ?? {},
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]); // intentionally using uid — avoids re-subscribing on token refreshes

  const toggleTask = useCallback(
    async (taskId: string, difficulty: string): Promise<boolean> => {
      if (!user) return false;

      const xp = XP_BY_DIFFICULTY[difficulty] ?? 10;
      const userRef = ref(rtdb, `users/${user.uid}`);
      const today = getDateKey();
      const yesterday = getDateKey(-1);

      try {
        const result = await runTransaction(userRef, (currentValue) => {
          const current = (currentValue as UserFirebaseData | null) ?? {};
          const completedTasks = { ...(current.completedTasks ?? {}) };
          const isCompleted = completedTasks[taskId] === true;
          const currentXP = current.totalXP ?? 0;

          if (isCompleted) {
            delete completedTasks[taskId];

            return {
              ...current,
              completedTasks,
              totalXP: Math.max(0, currentXP - xp),
            };
          }

          const lastCompletedDate = current.lastCompletedDate ?? null;
          const currentStreak = current.streak ?? 0;
          completedTasks[taskId] = true;

          return {
            ...current,
            completedTasks,
            totalXP: currentXP + xp,
            lastCompletedDate: today,
            streak:
              lastCompletedDate === today
                ? currentStreak
                : lastCompletedDate === yesterday
                  ? currentStreak + 1
                  : 1,
          };
        });

        return result.committed;
      } catch (e) {
        console.error('Failed to toggle task:', e);
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

  const completedTaskIds = Object.keys(state.completedTasks).filter(
    (k) => state.completedTasks[k] === true
  );

  return {
    completedTasks: state.completedTasks,
    completedTaskIds,
    startDate: state.startDate,
    streak: state.streak,
    totalXP: state.totalXP,
    loading,
    toggleTask,
    setStartDate,
  };
}
