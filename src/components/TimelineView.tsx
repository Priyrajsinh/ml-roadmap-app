'use client';

import { phases } from '@/data/roadmap';
import { getOverallProgress, getCurrentPhaseIndex } from '@/lib/progress';
import { useAuth } from '@/lib/AuthContext';

const COLOR_SCHEMES = {
  blue: { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500' },
  teal: { bg: 'bg-teal-500', text: 'text-teal-400', border: 'border-teal-500' },
  green: { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-400', border: 'border-pink-500' },
};

export function TimelineView() {
  const { progress } = useAuth();
  const overallProgress = getOverallProgress();
  const currentPhaseIndex = getCurrentPhaseIndex();

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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-2">Your Timeline</h1>
        <p className="text-slate-400">12-month journey to become an ML engineer</p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700" />
        
        <div className="space-y-6">
          {phases.map((phase, index) => {
            const completion = getPhaseCompletion(phase.id);
            const colorScheme = COLOR_SCHEMES[phase.colorScheme];
            const isActive = index === currentPhaseIndex;
            const isCompleted = completion === 100;
            const isLocked = index > 0 && getPhaseCompletion(phases[index - 1].id) < 80;
            
            return (
              <div key={phase.id} className={`relative flex items-start gap-4 ${isLocked ? 'opacity-50' : ''}`}>
                <div className={`
                  relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0
                  ${isCompleted ? colorScheme.bg : 'bg-slate-800'}
                  ${isActive ? 'ring-2 ring-offset-2 ring-offset-slate-900 ' + colorScheme.border : ''}
                `}>
                  {isCompleted ? (
                    <span className={`text-2xl font-bold ${colorScheme.text}`}>✓</span>
                  ) : (
                    <span className={`text-2xl font-bold ${colorScheme.text}`}>
                      {index + 1}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 bg-slate-800/50 rounded-xl border border-white/5 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                      <span className="text-sm text-slate-400">{phase.months}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">{completion}%</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-3">{phase.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colorScheme.bg} transition-all duration-500`}
                        style={{ width: `${completion}%` }}
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