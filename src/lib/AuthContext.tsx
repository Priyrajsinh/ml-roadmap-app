'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, signInWithGoogle, logOut, loadProgress, getProgress } from '@/lib/progress';
import type { ProgressState } from '@/lib/progress';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  progress: ProgressState;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressState>({
    completedTopics: [],
    completedTasks: [],
    streak: 0,
    lastActiveDate: null,
    totalXP: 0,
    phase6Track: null,
    expandedPhases: ['phase-1'],
    theme: 'dark',
    lastUpdated: new Date().toISOString(),
  });

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const loadedProgress = await loadProgress();
        setProgress(loadedProgress);
      } else {
        const localData = getProgress();
        setProgress(localData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    await signInWithGoogle();
  };

  const signOut = async () => {
    await logOut();
  };

  const refreshProgress = async () => {
    const p = await loadProgress();
    setProgress(p);
  };

  return (
    <AuthContext.Provider value={{ user, loading, progress, signIn, signOut, refreshProgress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}