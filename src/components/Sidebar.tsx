'use client';

import { Home, List, Calendar, Activity, X, Flame, Trophy } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getOverallProgress } from '@/lib/progress';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

const MENU_ITEMS = [
  { id: 'today',     icon: Home,     label: "Today's Tasks" },
  { id: 'all-tasks', icon: List,     label: 'All Tasks' },
  { id: 'timeline',  icon: Calendar, label: 'Timeline' },
  { id: 'stats',     icon: Activity, label: 'Stats' },
];

export function Sidebar({ isOpen, onClose, activeView, onViewChange }: SidebarProps) {
  const { completedTaskIds, streak, totalXP } = useAuth();
  const overall = getOverallProgress(completedTaskIds);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-slate-900 z-50
          border-r border-white/10 flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-indigo-400">ML Engineer Journey</span>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 hover:bg-slate-700 rounded transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Progress card */}
          <div className="bg-slate-800 rounded-xl p-4 border border-white/5">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-400">Overall Progress</span>
              <span className="font-bold text-indigo-400">{overall.percentage}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${overall.percentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {overall.completed}/{overall.total} tasks
            </p>
          </div>

          {/* XP + streak */}
          <div className="flex gap-2 mt-3">
            {streak > 0 && (
              <div className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-500/20 rounded-lg">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold text-orange-400">{streak}</span>
              </div>
            )}
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-purple-500/20 rounded-lg">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-purple-400">{totalXP} XP</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
                activeView === item.id
                  ? 'bg-indigo-500/20 text-indigo-400 font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
