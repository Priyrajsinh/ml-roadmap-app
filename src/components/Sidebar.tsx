'use client';

import { Home, BarChart3, Calendar, Activity, Search, Menu, X, Zap, Clock, Target, Flame, Trophy } from 'lucide-react';
import { phases } from '@/data/roadmap';
import { getProgress, getOverallProgress } from '@/lib/progress';
import { useState, useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ isOpen, onClose, activeView, onViewChange }: SidebarProps) {
  const [progress, setProgress] = useState(getProgress());
  const [overallProgress, setOverallProgress] = useState(getOverallProgress());

  useEffect(() => {
    setProgress(getProgress());
    setOverallProgress(getOverallProgress());
  }, [activeView]);

  const totalTasks = overallProgress.total;
  const completedTasks = overallProgress.completed;
  const weeksLeft = Math.ceil((totalTasks - completedTasks) / 3);

  const menuItems = [
    { id: 'today', label: 'Today', icon: Home },
    { id: 'roadmap', label: 'Roadmap', icon: BarChart3 },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'stats', label: 'Stats', icon: Activity },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-slate-900 z-50 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        border-r border-white/10 flex flex-col
      `}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-indigo-400">
              ML Engineer
            </h1>
            <button onClick={onClose} className="lg:hidden p-2">
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">
                Progress
              </span>
              <span className="text-sm font-bold text-indigo-400">
                {overallProgress.percentage}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress.percentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>{completedTasks}/{totalTasks} completed</span>
              <span>{weeksLeft} weeks left</span>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            {progress.streak > 0 && (
              <div className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-orange-500/20 rounded-lg">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold text-orange-400">{progress.streak}</span>
              </div>
            )}
            <div className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-purple-500/20 rounded-lg">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-purple-400">{progress.totalXP}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                onClose();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${activeView === item.id 
                  ? 'bg-indigo-500/20 text-indigo-400 font-medium' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800 rounded-lg p-3 border border-white/5">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span className="font-medium text-slate-300">DSA</span>
              </div>
              <span className="text-slate-500">Daily</span>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-white/5">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-blue-500" />
                <span className="font-medium text-slate-300">German</span>
              </div>
              <span className="text-slate-500">30 min/day</span>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-white/5">
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-3 h-3 text-green-500" />
                <span className="font-medium text-slate-300">Cloud</span>
              </div>
              <span className="text-slate-500">1/quarter</span>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-white/5">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-purple-500" />
                <span className="font-medium text-slate-300">Target</span>
              </div>
              <span className="text-slate-500">12 months</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
