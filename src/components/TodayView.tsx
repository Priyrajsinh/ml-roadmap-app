'use client';

import { useState, useEffect } from 'react';
import { Check, Clock, ExternalLink, Flame, Trophy, ChevronRight } from 'lucide-react';
import { phases, type Task, type Phase } from '@/data/roadmap';
import { 
  toggleTask as toggleTaskFn, 
  updateStreak, 
  getOverallProgress,
  getCurrentPhaseIndex 
} from '@/lib/progress';
import { useAuth } from '@/lib/AuthContext';

const COLOR_SCHEMES = {
  blue: { bg: 'bg-blue-500/10', border: 'border-l-blue-500', text: 'text-blue-400', badge: 'bg-blue-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-l-purple-500', text: 'text-purple-400', badge: 'bg-purple-500' },
  teal: { bg: 'bg-teal-500/10', border: 'border-l-teal-500', text: 'text-teal-400', badge: 'bg-teal-500' },
  green: { bg: 'bg-green-500/10', border: 'border-l-green-500', text: 'text-green-400', badge: 'bg-green-500' },
  orange: { bg: 'bg-orange-500/10', border: 'border-l-orange-500', text: 'text-orange-400', badge: 'bg-orange-500' },
  pink: { bg: 'bg-pink-500/10', border: 'border-l-pink-500', text: 'text-pink-400', badge: 'bg-pink-500' },
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getTimeEstimateColor(minutes: number): string {
  if (minutes < 60) return 'text-green-400';
  if (minutes <= 90) return 'text-yellow-400';
  return 'text-red-400';
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function getTaskTypeIcon(type: string): string {
  switch (type) {
    case 'course': return 'COURSE';
    case 'book': return 'BOOK';
    case 'paper': return 'PAPER';
    case 'repo': return 'REPO';
    case 'video': return 'VIDEO';
    case 'tool': return 'TOOL';
    case 'docs': return 'DOCS';
    case 'blog': return 'BLOG';
    default: return type.toUpperCase();
  }
}

interface TaskRowProps {
  task: Task;
  isCompleted: boolean;
  onToggle: () => void;
  colorScheme: typeof COLOR_SCHEMES.blue;
}

function TaskRow({ task, isCompleted, onToggle, colorScheme }: TaskRowProps) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors ${isCompleted ? 'opacity-60' : ''}`}>
      <button
        onClick={onToggle}
        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          isCompleted 
            ? 'bg-green-500 border-green-500' 
            : 'border-slate-600 hover:border-green-500'
        }`}
      >
        {isCompleted && <Check className="w-3 h-3 text-white" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-medium ${isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
            {task.title}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded ${getTimeEstimateColor(task.estimatedMinutes)} bg-black/30`}>
            <Clock className="w-3 h-3 inline mr-1" />
            {formatTime(task.estimatedMinutes)}
          </span>
        </div>
        
        {task.resources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {task.resources.slice(0, 2).map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colorScheme.badge}`} />
                {resource.title.substring(0, 25)}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function TodayView() {
  const { progress, refreshProgress } = useAuth();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    updateStreak().then(() => refreshProgress());
  }, []);
  
  const overallProgress = getOverallProgress();
  const currentPhaseIndex = getCurrentPhaseIndex();
  const currentPhase = phases[currentPhaseIndex];
  const colorScheme = currentPhase ? COLOR_SCHEMES[currentPhase.colorScheme] : COLOR_SCHEMES.blue;
  
  const todayTasks: Task[] = [];
  const upcomingTasks: Task[] = [];
  
  if (currentPhase) {
    for (const topic of currentPhase.topics) {
      for (const task of topic.tasks) {
        if (!progress.completedTasks.includes(task.id)) {
          if (todayTasks.length < 3) {
            todayTasks.push(task);
          } else if (upcomingTasks.length < 3) {
            upcomingTasks.push(task);
          }
        }
      }
    }
  }
  
  const completedToday = progress.completedTasks.filter(t => {
    return todayTasks.some(task => task.id === t);
  }).length;
  
  const totalTodayEstimate = todayTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const hasCompletedAllToday = todayTasks.length > 0 && completedToday === todayTasks.length;
  
  const handleToggleTask = async (taskId: string) => {
    setLoading(true);
    await toggleTaskFn(taskId);
    await refreshProgress();
    setLoading(false);
  };
  
  const getPhaseCompletionPercent = (phase: Phase): number => {
    let total = 0;
    let completed = 0;
    phase.topics.forEach(topic => {
      topic.tasks.forEach(task => {
        total += 1;
        if (progress.completedTasks.includes(task.id)) completed += 1;
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {getGreeting()}!
            </h1>
            <p className="text-slate-400">Ready to learn something new today?</p>
          </div>
          
          <div className="flex items-center gap-4">
            {progress.streak > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 rounded-full">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="font-bold text-orange-400">{progress.streak}</span>
                <span className="text-orange-300 text-sm">day streak</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full">
              <Trophy className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-purple-400">{progress.totalXP}</span>
              <span className="text-purple-300 text-sm">XP</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
          <span>Phase {currentPhaseIndex + 1}: {currentPhase?.title}</span>
          <div className="flex-1 max-w-xs h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${getPhaseCompletionPercent(currentPhase!)}%` }}
            />
          </div>
          <span>{getPhaseCompletionPercent(currentPhase!)}% done</span>
        </div>
      </div>
      
      {hasCompletedAllToday ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
          <Trophy className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-green-400 mb-2">You&apos;re done for today!</h2>
          <p className="text-slate-400">Great work! Come back tomorrow to keep your streak going.</p>
        </div>
      ) : (
        <>
          <div className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">TODAY&apos;S FOCUS</h2>
                <p className="text-sm text-slate-400">~{formatTime(totalTodayEstimate)} estimated</p>
              </div>
              <div className="text-sm text-slate-400">
                {completedToday}/{todayTasks.length} tasks
              </div>
            </div>
            
            <div className="p-2">
              {todayTasks.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No tasks available</p>
              ) : (
                todayTasks.map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    isCompleted={progress.completedTasks.includes(task.id)}
                    onToggle={() => handleToggleTask(task.id)}
                    colorScheme={colorScheme}
                  />
                ))
              )}
            </div>
          </div>
          
          {upcomingTasks.length > 0 && (
            <div className="bg-slate-800/30 rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <h2 className="text-lg font-semibold text-white">UPCOMING</h2>
              </div>
              
              <div className="p-2">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 opacity-60">
                    <div className="w-5 h-5 rounded border-2 border-slate-600" />
                    <div className="flex-1">
                      <span className="text-slate-300">{task.title}</span>
                      <span className={`text-xs ml-2 ${getTimeEstimateColor(task.estimatedMinutes)}`}>
                        {formatTime(task.estimatedMinutes)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <h3 className="font-semibold text-white mb-3">YOUR PROGRESS</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Phase {currentPhaseIndex + 1}</span>
                <span className="text-slate-300">{getPhaseCompletionPercent(currentPhase!)}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${colorScheme.bg.replace('/10', '')} transition-all duration-500`}
                  style={{ width: `${getPhaseCompletionPercent(currentPhase!)}%`, backgroundColor: colorScheme.text.replace('text-', '') }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Overall</span>
                <span className="text-slate-300">{overallProgress.percentage}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${overallProgress.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <h3 className="font-semibold text-white mb-3">STATS</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{overallProgress.completed}</div>
              <div className="text-sm text-slate-400">Tasks Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{overallProgress.total - overallProgress.completed}</div>
              <div className="text-sm text-slate-400">Tasks Left</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}