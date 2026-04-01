'use client';

import { Flame, Trophy, Target, CheckCircle2 } from 'lucide-react';
import { phases } from '@/data/roadmap';
import { getOverallProgress, getPhaseProgress } from '@/lib/progress';
import { useAuth } from '@/lib/AuthContext';

const COLOR_HEX: Record<string, string> = {
  blue:   '#3B82F6',
  purple: '#8B5CF6',
  teal:   '#14B8A6',
  green:  '#22C55E',
  orange: '#F97316',
  pink:   '#EC4899',
};

export function StatsView() {
  const { completedTaskIds, streak, totalXP } = useAuth();
  const overall = getOverallProgress(completedTaskIds);

  // Count topics where at least one task is completed
  const completedTopicsCount = new Set(
    completedTaskIds.flatMap((taskId) => {
      for (const phase of phases) {
        for (const topic of phase.topics) {
          if (topic.tasks.some((t) => t.id === taskId)) return [topic.id];
        }
      }
      return [];
    })
  ).size;

  const totalTopicsCount = phases.reduce(
    (sum, phase) => sum + phase.topics.length,
    0
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-1">Your Stats</h1>
        <p className="text-slate-400">Track your progress and achievements</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-slate-400">Streak</span>
          </div>
          <div className="text-3xl font-bold text-white">{streak}</div>
          <div className="text-xs text-slate-500">days</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">Total XP</span>
          </div>
          <div className="text-3xl font-bold text-white">{totalXP}</div>
          <div className="text-xs text-slate-500">points</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-sm text-slate-400">Tasks Done</span>
          </div>
          <div className="text-3xl font-bold text-white">{overall.completed}</div>
          <div className="text-xs text-slate-500">of {overall.total}</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-400">Progress</span>
          </div>
          <div className="text-3xl font-bold text-white">{overall.percentage}%</div>
          <div className="text-xs text-slate-500">complete</div>
        </div>
      </div>

      {/* Phase progress */}
      <div className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Phase Progress</h2>
        </div>
        <div className="p-4 space-y-4">
          {phases.map((phase, index) => {
            const prog = getPhaseProgress(phase.id, completedTaskIds);
            const isLocked =
              index > 0 &&
              getPhaseProgress(phases[index - 1].id, completedTaskIds).percentage < 80;
            const barColor = COLOR_HEX[phase.colorScheme] ?? '#6366F1';

            return (
              <div key={phase.id} className={isLocked ? 'opacity-50' : ''}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: barColor }}
                    />
                    <span className="font-medium text-white">{phase.title}</span>
                    <span className="text-sm text-slate-500">({phase.months})</span>
                  </div>
                  <span className="text-sm text-slate-400">{prog.percentage}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${prog.percentage}%`, backgroundColor: barColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topics completed */}
      <div className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Topics Completed</h2>
        </div>
        <div className="p-4 text-center">
          <div className="text-4xl font-bold text-white">{completedTopicsCount}</div>
          <div className="text-sm text-slate-400">of {totalTopicsCount} topics</div>
        </div>
      </div>

      {/* XP breakdown */}
      <div className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">XP Breakdown</h2>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Tasks completed (10–30 XP each)</span>
            <span className="text-white font-medium">{totalXP} XP total</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Tasks done</span>
            <span className="text-white font-medium">{overall.completed}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Current streak</span>
            <span className="text-white font-medium">{streak} days</span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between items-center">
            <span className="text-white font-semibold">Total XP</span>
            <span className="text-purple-400 font-bold text-xl">{totalXP} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
