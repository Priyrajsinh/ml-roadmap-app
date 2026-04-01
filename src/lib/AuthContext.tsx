'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import { useAuth as useFirebaseAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';

interface ToastItem {
  id: string;
  text: string;
  type: 'success' | 'error';
}

interface AppContextType {
  user: User | null;
  authLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  completedItems: Record<string, boolean>;
  completedItemIds: string[];
  completedTaskIds: string[];
  isItemCompleted: (itemId: string) => boolean;
  isTaskCompleted: (taskId: string) => boolean;
  streak: number;
  totalXP: number;
  startDate: string | null;
  progressLoading: boolean;
  toggleItem: (itemId: string, parentTaskId: string, difficulty: string) => Promise<boolean>;
  resetTask: (taskId: string, difficulty: string) => Promise<boolean>;
  setStartDate: (date: string) => Promise<void>;
  toasts: ToastItem[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    loading: authLoading,
    signIn,
    signOut,
  } = useFirebaseAuth();

  const {
    completedItems,
    completedItemIds,
    completedTaskIds,
    startDate,
    streak,
    totalXP,
    loading: progressLoading,
    toggleItem: baseToggleItem,
    resetTask: baseResetTask,
    setStartDate,
  } = useProgress(user);

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((text: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const toggleItem = useCallback(
    async (itemId: string, parentTaskId: string, difficulty: string): Promise<boolean> => {
      const wasCompleted = completedItems[itemId] === true;
      const success = await baseToggleItem(itemId, parentTaskId, difficulty);

      if (success) {
        addToast(wasCompleted ? 'Checklist step reset' : 'Checklist step completed', 'success');
      } else {
        addToast('Could not update checklist progress. Check Firebase config and rules.', 'error');
      }

      return success;
    },
    [addToast, baseToggleItem, completedItems]
  );

  const resetTask = useCallback(
    async (taskId: string, difficulty: string): Promise<boolean> => {
      const success = await baseResetTask(taskId, difficulty);

      if (success) {
        addToast('Task reset', 'success');
      } else {
        addToast('Could not reset task progress. Check Firebase config and rules.', 'error');
      }

      return success;
    },
    [addToast, baseResetTask]
  );

  const isItemCompleted = useCallback(
    (itemId: string) => completedItems[itemId] === true,
    [completedItems]
  );

  const isTaskCompleted = useCallback(
    (taskId: string) => completedTaskIds.includes(taskId),
    [completedTaskIds]
  );

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        signIn,
        signOut,
        completedItems,
        completedItemIds,
        completedTaskIds,
        isItemCompleted,
        isTaskCompleted,
        streak,
        totalXP,
        startDate,
        progressLoading,
        toggleItem,
        resetTask,
        setStartDate,
        toasts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
