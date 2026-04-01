'use client';

import {
  createContext,
  useContext,
  useCallback,
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
  // Auth
  user: User | null;
  authLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  // Progress (reactive — updated by Firebase onValue listener)
  completedTasks: Record<string, boolean>;
  completedTaskIds: string[];
  isTaskCompleted: (taskId: string) => boolean;
  streak: number;
  totalXP: number;
  startDate: string | null;
  progressLoading: boolean;
  // Actions
  toggleTask: (taskId: string, difficulty: string) => Promise<void>;
  setStartDate: (date: string) => Promise<void>;
  // Toasts
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
    completedTasks,
    completedTaskIds,
    startDate,
    streak,
    totalXP,
    loading: progressLoading,
    toggleTask: baseToggle,
    setStartDate,
  } = useProgress(user);

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((text: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const toggleTask = useCallback(
    async (taskId: string, difficulty: string): Promise<void> => {
      const wasCompleted = completedTasks[taskId] === true;
      await baseToggle(taskId, difficulty);
      addToast(wasCompleted ? 'Task reset' : 'Task marked complete \u2713', 'success');
    },
    [baseToggle, completedTasks, addToast]
  );

  const isTaskCompleted = useCallback(
    (taskId: string) => completedTasks[taskId] === true,
    [completedTasks]
  );

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        signIn,
        signOut,
        completedTasks,
        completedTaskIds,
        isTaskCompleted,
        streak,
        totalXP,
        startDate,
        progressLoading,
        toggleTask,
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
