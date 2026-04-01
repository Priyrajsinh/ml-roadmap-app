'use client';

import { Search, Menu, Flame, Trophy, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getOverallProgress } from '@/lib/progress';

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

const NAV_ITEMS = [
  { id: 'today',     label: "Today's Tasks" },
  { id: 'all-tasks', label: 'All Tasks' },
  { id: 'timeline',  label: 'Timeline' },
  { id: 'stats',     label: 'Stats' },
];

export function Header({
  onMenuClick,
  onSearchClick,
  activeView,
  onViewChange,
}: HeaderProps) {
  const { user, authLoading, signIn, signOut, streak, totalXP, completedTaskIds } =
    useAuth();
  const overall = getOverallProgress(completedTaskIds);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-lg border-b border-white/10">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Logo + mobile menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-300" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              ML
            </div>
            <span className="hidden sm:block text-base font-bold text-white">
              ML Journey
            </span>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeView === item.id
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: stats + search + auth */}
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded-full">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold text-orange-400">{streak}</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded-full">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-purple-400">{totalXP} XP</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 bg-slate-800 rounded-lg">
            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${overall.percentage}%` }}
              />
            </div>
            <span className="text-xs text-slate-300">{overall.percentage}%</span>
          </div>

          <button
            onClick={onSearchClick}
            className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-800 rounded-lg text-slate-400 hover:bg-slate-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Search</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-slate-700 text-xs rounded">
              \u2318K
            </kbd>
          </button>

          {!authLoading &&
            (user ? (
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt={user.displayName ?? 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <button
                  onClick={signOut}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 text-sm transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            ))}
        </div>
      </div>
    </header>
  );
}
