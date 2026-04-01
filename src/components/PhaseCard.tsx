'use client';

import { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { type Phase, type Topic, type Task } from '@/data/roadmap';
import { useAuth } from '@/lib/AuthContext';
import { getPhaseProgress } from '@/lib/progress';

const COLOR_SCHEMES: Record<
  Phase['colorScheme'],
  { bg: string; text: string; border: string; bar: string; light: string }
> = {
  blue:   { bg: 'bg-blue-500',   text: 'text-blue-400',   border: 'border-blue-500',   bar: '#3B82F6', light: 'bg-blue-500/10' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500', bar: '#8B5CF6', light: 'bg-purple-500/10' },
  teal:   { bg: 'bg-teal-500',   text: 'text-teal-400',   border: 'border-teal-500',   bar: '#14B8A6', light: 'bg-teal-500/10' },
  green:  { bg: 'bg-green-500',  text: 'text-green-400',  border: 'border-green-500',  bar: '#22C55E', light: 'bg-green-500/10' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500', bar: '#F97316', light: 'bg-orange-500/10' },
  pink:   { bg: 'bg-pink-500',   text: 'text-pink-400',   border: 'border-pink-500',   bar: '#EC4899', light: 'bg-pink-500/10' },
};

function getDifficultyClass(difficulty: string): string {
  if (difficulty === 'beginner')    return 'bg-green-500/20 text-green-400';
  if (difficulty === 'intermediate') return 'bg-yellow-500/20 text-yellow-400';
  if (difficulty === 'advanced')    return 'bg-red-500/20 text-red-400';
  return 'bg-slate-500/20 text-slate-400';
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// ─── Task item ────────────────────────────────────────────────────────────────

interface TaskItemProps {
  task: Task;
  colorScheme: (typeof COLOR_SCHEMES)[Phase['colorScheme']];
}

function TaskItem({ task, colorScheme }: TaskItemProps) {
  const { isTaskCompleted, toggleTask } = useAuth();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const syncedCompleted = isTaskCompleted(task.id);

  useEffect(() => {
    if (optimistic !== null && optimistic === syncedCompleted) {
      setOptimistic(null);
    }
  }, [optimistic, syncedCompleted]);

  const completed = optimistic !== null ? optimistic : syncedCompleted;

  const handleToggle = async () => {
    const next = !completed;
    setOptimistic(next);
    const success = await toggleTask(task.id, task.difficulty);

    if (!success) {
      setOptimistic(null);
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 ${
        completed ? 'opacity-60' : ''
      }`}
    >
      {/* Checkbox — clicking this is the primary toggle */}
      <button
        onClick={handleToggle}
        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
        style={
          completed
            ? { background: '#22C55E', borderColor: '#22C55E' }
            : { borderColor: '#475569' }
        }
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {completed && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm ${
              completed ? 'line-through text-slate-500' : 'text-slate-200'
            }`}
          >
            {task.title}
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${getDifficultyClass(task.difficulty)}`}
          >
            {task.difficulty}
          </span>
          <span className="text-xs text-slate-500">
            {formatTime(task.estimatedMinutes)}
          </span>
        </div>

        <p className="text-xs text-slate-500 mt-1">{task.description}</p>

        {task.resources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {task.resources.slice(0, 3).map((r, idx) => (
              <a
                key={idx}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colorScheme.bg}`} />
                {r.title.substring(0, 20)}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Redo button */}
      {completed && (
        <button
          onClick={handleToggle}
          title="Reset task"
          className="flex-shrink-0 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-orange-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// ─── Topic item ───────────────────────────────────────────────────────────────

interface TopicItemProps {
  topic: Topic;
  colorScheme: (typeof COLOR_SCHEMES)[Phase['colorScheme']];
}

function TopicItem({ topic, colorScheme }: TopicItemProps) {
  const [showTasks, setShowTasks] = useState(false);
  const { completedTaskIds } = useAuth();

  const total = topic.tasks.length;
  const completed = topic.tasks.filter((t) => completedTaskIds.includes(t.id)).length;
  const totalMinutes = topic.tasks.reduce((s, t) => s + t.estimatedMinutes, 0);

  return (
    <div className="p-4 hover:bg-slate-800/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs text-slate-500">Week {topic.weekNumber}</span>
            <h4 className="font-semibold text-white">{topic.title}</h4>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />~{formatTime(totalMinutes)}
            </span>
            <span>
              {completed}/{total} tasks
            </span>
          </div>

          <button
            onClick={() => setShowTasks((s) => !s)}
            className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            {showTasks ? 'Hide tasks' : 'Show tasks'}
            {showTasks ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {showTasks && (
            <div className="mt-3 space-y-2">
              {topic.tasks.map((task) => (
                <TaskItem key={task.id} task={task} colorScheme={colorScheme} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Phase card ───────────────────────────────────────────────────────────────

export function PhaseCard({ phase }: { phase: Phase }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { completedTaskIds } = useAuth();

  const colorScheme = COLOR_SCHEMES[phase.colorScheme];
  const prog = getPhaseProgress(phase.id, completedTaskIds);

  return (
    <div className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden mb-4 transition-all duration-300">
      <button
        onClick={() => setIsExpanded((expanded) => !expanded)}
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
            <p className="text-sm font-medium text-slate-400">{phase.months}</p>
            <h3 className="text-xl font-bold text-white">{phase.title}</h3>
            <p className="text-sm text-slate-400">{phase.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-300">
              {prog.completed}/{prog.total} tasks
            </p>
            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${prog.percentage}%`,
                  backgroundColor: colorScheme.bar,
                }}
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
          {phase.capstoneProject && (
            <div className="px-5 py-3 bg-slate-900/50 flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300">
                Capstone: {phase.capstoneProject}
              </span>
            </div>
          )}
          <div className="divide-y divide-white/5">
            {phase.topics.map((topic) => (
              <TopicItem
                key={topic.id}
                topic={topic}
                colorScheme={colorScheme}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
