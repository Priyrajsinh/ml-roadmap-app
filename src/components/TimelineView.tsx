'use client';

import { phases } from '@/data/roadmap';
import { getOverallProgress, getPhaseProgress, getCurrentPhaseIndex } from '@/lib/progress';
import { useAuth } from '@/lib/AuthContext';

const COLOR_SCHEMES: Record<
  string,
  { bg: string; text: string; border: string; bar: string }
> = {
  blue:   { bg: 'bg-blue-500',   text: 'text-blue-400',   border: 'border-blue-500',   bar: '#3B82F6' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500', bar: '#8B5CF6' },
  teal:   { bg: 'bg-teal-500',   text: 'text-teal-400',   border: 'border-teal-500',   bar: '#14B8A6' },
  green:  { bg: 'bg-green-500',  text: 'text-green-400',  border: 'border-green-500',  bar: '#22C55E' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500', bar: '#F97316' },
  pink:   { bg: 'bg-pink-500',   text: 'text-pink-400',   border: 'border-pink-500',   bar: '#EC4899' },
};

export function TimelineView() {
  const { completedTaskIds } = useAuth();
  const overall = getOverallProgress(completedTaskIds);
  const currentPhaseIndex = getCurrentPhaseIndex(completedTaskIds);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-1">Your Timeline</h1>
        <p className="text-slate-400">12-month journey to become an ML engineer</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${overall.percentage}%` }}
            />
          </div>
          <span className="text-sm font-bold text-white">{overall.percentage}%</span>
        </div>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700" />

        <div className="space-y-6">
          {phases.map((phase, index) => {
            const prog = getPhaseProgress(phase.id, completedTaskIds);
            const colorScheme = COLOR_SCHEMES[phase.colorScheme];
            const isActive = index === currentPhaseIndex;
            const isCompleted = prog.percentage === 100;

            return (
              <div key={phase.id} className="relative flex items-start gap-4">
                {/* Phase indicator dot */}
                <div
                  className={`
                    relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0
                    ${isCompleted ? colorScheme.bg : 'bg-slate-800'}
                    ${isActive ? `ring-2 ring-offset-2 ring-offset-slate-900 ${colorScheme.border}` : ''}
                  `}
                >
                  <span className={`text-2xl font-bold ${colorScheme.text}`}>
                    {isCompleted ? '✓' : index + 1}
                  </span>
                </div>

                {/* Phase card */}
                <div className="flex-1 bg-slate-800/50 rounded-xl border border-white/5 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                      <span className="text-sm text-slate-400">{phase.months}</span>
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {prog.percentage}%
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 mb-3">{phase.description}</p>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${prog.percentage}%`,
                          backgroundColor: colorScheme.bar,
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      {phase.topics.length} topics
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
