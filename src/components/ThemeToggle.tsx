'use client';

import { Moon, Sun } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { setTheme as setThemeFn } from '@/lib/progress';

export function ThemeToggle() {
  const { progress, refreshProgress } = useAuth();
  
  const handleToggle = async () => {
    await setThemeFn(progress.theme === 'light' ? 'dark' : 'light');
    await refreshProgress();
  };
  
  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {progress.theme === 'light' ? (
        <Moon className="w-5 h-5 text-slate-700" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  );
}