'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, ExternalLink, BookOpen, Users } from 'lucide-react';
import { phases, type Phase, type Topic, type Task } from '@/data/roadmap';
import { toggleTask as toggleTaskFn } from '@/lib/progress';
import { useAuth } from '@/lib/AuthContext';

const COLOR_SCHEMES = {
  blue: { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500', light: 'bg-blue-500/10' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500', light: 'bg-purple-500/10' },
  teal: { bg: 'bg-teal-500', text: 'text-teal-400', border: 'border-teal-500', light: 'bg-teal-500/10' },
  green: { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500', light: 'bg-green-500/10' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500', light: 'bg-orange-500/10' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-400', border: 'border-pink-500', light: 'bg-pink-500/10' },
};

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner': return 'bg-green-500/20 text-green-400';
    case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
    case 'advanced': return 'bg-red-500/20 text-red-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function PhaseCard({ phase }: { phase: Phase }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { progress, refreshProgress } = useAuth();
  const colorScheme = COLOR_SCHEMES[phase.colorScheme];
  
  const totalTasks = phase.topics.reduce((sum, topic) => sum + topic.tasks.length, 0);
  const completedTasks = phase.topics.reduce((sum, topic) => 
    sum + topic.tasks.filter(task => progress.completedTasks.includes(task.id)).length, 0
  );
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const isPhaseLocked = () => {
    if (phase.id !== 'phase-6') return false;
    const phase5 = phases.find(p => p.id === 'phase-5');
    if (!phase5) return false;
    
    let total = 0;
    let completed = 0;
    phase5.topics.forEach(topic => {
      topic.tasks.forEach(task => {
        total += 1;
        if (progress.completedTasks.includes(task.id)) completed += 1;
      });
    });
    
    return total > 0 && (completed / total) < 0.8;
  };

  const handleTogglePhase = () => {
    if (isPhaseLocked()) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden mb-4 transition-all duration-300">
      <button
        onClick={handleTogglePhase}
        className="w-full p-5 flex items-center justify-between hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div 
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorScheme.light}`}
          >
            <span className={`text-2xl font-bold ${colorScheme.text}`}>
              {phase.id.replace('phase-', '')}
            </span>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-400">
                {phase.months}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {phase.title}
            </h3>
            <p className="text-sm text-slate-400">
              {phase.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-300">
              {completedTasks}/{totalTasks} tasks
            </p>
            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${colorScheme.bg}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-white/5">
          <div className="p-4 bg-slate-900/50">
            <p className="text-sm text-slate-400">{phase.description}</p>
            {phase.capstoneProject && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300">Capstone: {phase.capstoneProject}</span>
              </div>
            )}
          </div>
          
          <div className="divide-y divide-white/5">
            {phase.topics.map((topic) => (
              <TopicItem key={topic.id} topic={topic} colorScheme={colorScheme} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TopicItem({ topic, colorScheme }: { topic: Topic; colorScheme: typeof COLOR_SCHEMES.blue }) {
  const [showDetails, setShowDetails] = useState(false);
  const { progress, refreshProgress } = useAuth();
  
  const totalTasks = topic.tasks.length;
  const completedTasks = topic.tasks.filter(task => progress.completedTasks.includes(task.id)).length;
  const isCompleted = totalTasks > 0 && completedTasks === totalTasks;
  
  const totalMinutes = topic.tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);

  const handleToggleTask = async (taskId: string) => {
    await toggleTaskFn(taskId);
    await refreshProgress();
  };

  return (
    <div className="p-4 hover:bg-slate-800/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs text-slate-500">Week {topic.weekNumber}</span>
            <h4 className={`font-semibold ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
              {topic.title}
            </h4>
            {topic.milestone && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded">
                <Users className="w-3 h-3" />
                {topic.milestone}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              ~{formatTime(totalMinutes)}
            </span>
            <span>
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            {showDetails ? 'Hide tasks' : 'Show tasks'}
            {showDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="mt-4 space-y-2">
              {topic.tasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  isCompleted={progress.completedTasks.includes(task.id)}
                  onToggle={() => handleToggleTask(task.id)}
                  colorScheme={colorScheme}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task, isCompleted, onToggle, colorScheme }: { 
  task: Task; 
  isCompleted: boolean; 
  onToggle: () => void;
  colorScheme: typeof COLOR_SCHEMES.blue;
}) {
  const getTimeColor = (minutes: number) => {
    if (minutes < 60) return 'text-green-400';
    if (minutes <= 90) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 ${isCompleted ? 'opacity-60' : ''}`}>
      <button
        onClick={onToggle}
        className="mt-0.5 flex-shrink-0"
      >
        {isCompleted ? (
          <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="w-5 h-5 rounded border-2 border-slate-600 hover:border-green-500 transition-colors" />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
            {task.title}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${getDifficultyColor(task.difficulty)}`}>
            {task.difficulty}
          </span>
          <span className={`text-xs ${getTimeColor(task.estimatedMinutes)}`}>
            {formatTime(task.estimatedMinutes)}
          </span>
        </div>
        
        <p className="text-xs text-slate-500 mt-1">{task.description}</p>
        
        {task.resources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {task.resources.slice(0, 3).map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colorScheme.bg}`} />
                {resource.title.substring(0, 20)}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}