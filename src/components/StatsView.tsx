'use client';

import { useEffect } from 'react';
import { Flame, Trophy, Target, CheckCircle2 } from 'lucide-react';
import { phases } from '@/data/roadmap';
import { getOverallProgress } from '@/lib/progress';
import { useAuth } from '@/lib/AuthContext';

const COLOR_SCHEMES = {
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400' },
  teal: { bg: 'bg-teal-500/20', border: 'border-teal-500', text: 'text-teal-400' },
  green: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400' },
  orange: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400' },
  pink: { bg: 'bg-pink-500/20', border: 'border-pink-500', text: 'text-pink-400' },
};

export function StatsView() {
  const { progress } = useAuth();
  const overallProgress = getOverallProgress();

  const getPhaseCompletion = (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return 0;
    
    let total = 0;
    let completed = 0;
    
    phase.topics.forEach(topic => {
      topic.tasks.forEach(task => {
        total += 1;
        if (progress.completedTasks.includes(task.id)) {
          completed += 1;
        }
      });
    });
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const completedTopicsCount = new Set(
    progress.completedTasks.map(t => {
      for (const phase of phases) {
        for (const topic of phase.topics) {
          if (topic.tasks.some(task => task.id === t)) {
            return topic.id;
          }
        }
      }
      return null;
    }).filter(Boolean)
  ).size;

  const totalTopicsCount = phases.reduce((sum, phase) => sum + phase.topics.length, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-2">Your Stats</h1>
        <p className="text-slate-400">Track your progress and achievements</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-slate-400">Streak</span>
          </div>
          <div className="text-3xl font-bold text-white">{progress.streak}</div>
          <div className="text-xs text-slate-500">days</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">Total XP</span>
          </div>
          <div className="text-3xl font-bold text-white">{progress.totalXP}</div>
          <div className="text-xs text-slate-500">points</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-sm text-slate-400">Tasks Done</span>
          </div>
          <div className="text-3xl font-bold text-white">{overallProgress.completed}</div>
          <div className="text-xs text-slate-500">of {overallProgress.total}</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-400">Progress</span>
          </div>
          <div className="text-3xl font-bold text-white">{overallProgress.percentage}%</div>
          <div className="text-xs text-slate-500">complete</div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Phase Progress</h2>
        </div>
        
        <div className="p-4 space-y-4">
          {phases.map((phase, index) => {
            const completion = getPhaseCompletion(phase.id);
            const colorScheme = COLOR_SCHEMES[phase.colorScheme];
            const isLocked = index > 0 && getPhaseCompletion(phases[index - 1].id) < 80;
            
            return (
              <div key={phase.id} className={`${isLocked ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colorScheme.text.replace('text-', 'bg-')}`} />
                    <span className="font-medium text-white">{phase.title}</span>
                    <span className="text-sm text-slate-500">({phase.months})</span>
                  </div>
                  <span className="text-sm text-slate-400">{completion}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${colorScheme.bg.replace('/20', '')} transition-all duration-500`}
                    style={{ 
                      width: `${completion}%`,
                      backgroundColor: colorScheme.text === 'text-blue-400' ? '#3B82F6' :
                        colorScheme.text === 'text-purple-400' ? '#8B5CF6' :
                        colorScheme.text === 'text-teal-400' ? '#14B8A6' :
                        colorScheme.text === 'text-green-400' ? '#22C55E' :
                        colorScheme.text === 'text-orange-400' ? '#F97316' : '#EC4899'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Topics Completed</h2>
        </div>
        
        <div className="p-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{completedTopicsCount}</div>
            <div className="text-sm text-slate-400">of {totalTopicsCount} topics</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">XP Breakdown</h2>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Tasks completed</span>
            <span className="text-white font-medium">{progress.completedTasks.length} × 10 = {progress.completedTasks.length * 10} XP</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Topics completed</span>
            <span className="text-white font-medium">{completedTopicsCount} × 50 = {completedTopicsCount * 50} XP</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Streak bonus</span>
            <span className="text-white font-medium">{progress.streak * 5} XP</span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between items-center">
            <span className="text-white font-semibold">Total</span>
            <span className="text-purple-400 font-bold text-xl">{progress.totalXP} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}