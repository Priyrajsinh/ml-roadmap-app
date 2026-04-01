'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ref,
  onValue,
  off,
  set,
  remove,
  get,
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

const defaultState: ProgressState = {
  completedTasks: {},
  startDate: null,
  streak: 0,
  lastCompletedDate: null,
  totalXP: 0,
};

async function updateStreakForUser(uid: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const lastDateRef = ref(rtdb, `users/${uid}/lastCompletedDate`);
  const streakRef = ref(rtdb, `users/${uid}/streak`);

  const [lastDateSnap, streakSnap] = await Promise.all([
    get(lastDateRef),
    get(streakRef),
  ]);

  const lastDate = lastDateSnap.val() as string | null;
  const currentStreak = (streakSnap.val() as number) ?? 0;

  if (lastDate === today) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  await set(streakRef, lastDate === yesterday ? currentStreak + 1 : 1);
  await set(lastDateRef, today);
}

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
    async (taskId: string, difficulty: string): Promise<void> => {
      if (!user) return;

      const xp = XP_BY_DIFFICULTY[difficulty] ?? 10;
      const isCompleted = state.completedTasks[taskId] === true;
      const taskRef = ref(rtdb, `users/${user.uid}/completedTasks/${taskId}`);
      const xpRef = ref(rtdb, `users/${user.uid}/totalXP`);

      try {
        if (isCompleted) {
          await remove(taskRef);
          const xpSnap = await get(xpRef);
          const currentXP = (xpSnap.val() as number) ?? 0;
          await set(xpRef, Math.max(0, currentXP - xp));
        } else {
          await set(taskRef, true);
          const xpSnap = await get(xpRef);
          const currentXP = (xpSnap.val() as number) ?? 0;
          await set(xpRef, currentXP + xp);
          await updateStreakForUser(user.uid);
        }
      } catch (e) {
        console.error('Failed to toggle task:', e);
      }
    },
    [user, state.completedTasks]
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
