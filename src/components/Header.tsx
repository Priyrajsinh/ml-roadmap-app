'use client';

import { Search, Menu, Flame, Trophy, Home, BarChart3, Calendar, Activity, LogIn, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { getOverallProgress } from '@/lib/progress';
import { useAuth } from '@/lib/AuthContext';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Header({ onMenuClick, onSearchClick, activeView, onViewChange }: HeaderProps) {
  const { user, progress, signIn, signOut } = useAuth();
  const [overallProgress, setOverallProgress] = useState(getOverallProgress());

  useEffect(() => {
    setOverallProgress(getOverallProgress());
  }, [progress]);

  const navItems = [
    { id: 'today', icon: Home, label: 'Today' },
    { id: 'roadmap', icon: BarChart3, label: 'Roadmap' },
    { id: 'timeline', icon: Calendar, label: 'Timeline' },
    { id: 'stats', icon: Activity, label: 'Stats' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-700"
          >
            <Menu className="w-5 h-5 text-slate-300" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              ML
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">
                ML Engineer Journey
              </h1>
              <p className="text-xs text-slate-400">
                12-Month Roadmap to MLE
              </p>
            </div>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                ${activeView === item.id
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {progress.streak > 0 && (
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-orange-500/20 rounded-full">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold text-orange-400">{progress.streak}</span>
            </div>
          )}
          
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-purple-500/20 rounded-full">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-purple-400">{progress.totalXP}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                style={{ width: `${overallProgress.percentage}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-300">
              {overallProgress.percentage}%
            </span>
          </div>
          
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg text-slate-400 hover:bg-slate-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Search</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-slate-700 text-xs rounded">
              ⌘K
            </kbd>
          </button>
          
          {user ? (
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <button
                onClick={signOut}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Sign In</span>
            </button>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}