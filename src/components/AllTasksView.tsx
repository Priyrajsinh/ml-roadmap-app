'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  RotateCcw,
  ExternalLink,
  Clock,
  Lock,
} from 'lucide-react';
import { phases, type Phase, type Topic, type Task } from '@/data/roadmap';
import { useAuth } from '@/lib/AuthContext';
import { getOverallProgress, getPhaseProgress } from '@/lib/progress';

const PHASE_COLORS: Record<
  string,
  { bg: string; text: string; border: string; bar: string; light: string }
> = {
  blue:   { bg: 'bg-blue-500',   text: 'text-blue-400',   border: 'border-blue-500/30',   bar: '#3B82F6', light: 'bg-blue-500/10' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/30', bar: '#8B5CF6', light: 'bg-purple-500/10' },
  teal:   { bg: 'bg-teal-500',   text: 'text-teal-400',   border: 'border-teal-500/30',   bar: '#14B8A6', light: 'bg-teal-500/10' },
  green:  { bg: 'bg-green-500',  text: 'text-green-400',  border: 'border-green-500/30',  bar: '#22C55E', light: 'bg-green-500/10' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/30', bar: '#F97316', light: 'bg-orange-500/10' },
  pink:   { bg: 'bg-pink-500',   text: 'text-pink-400',   border: 'border-pink-500/30',   bar: '#EC4899', light: 'bg-pink-500/10' },
};

function getDifficultyClass(difficulty: string): string {
  if (difficulty === 'beginner') return 'bg-green-500/20 text-green-400';
  if (difficulty === 'intermediate') return 'bg-yellow-500/20 text-yellow-400';
  if (difficulty === 'advanced') return 'bg-red-500/20 text-red-400';
  return 'bg-slate-500/20 text-slate-400';
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// ─── Task row ────────────────────────────────────────────────────────────────

interface TaskRowProps {
  task: Task;
  phaseColors: (typeof PHASE_COLORS)[string];
}

function TaskRow({ task, phaseColors }: TaskRowProps) {
  const { isTaskCompleted, toggleTask } = useAuth();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);

  const completed = optimistic !== null ? optimistic : isTaskCompleted(task.id);

  const handleToggle = async () => {
    const next = !completed;
    setOptimistic(next);
    await toggleTask(task.id, task.difficulty);
    setOptimistic(null);
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 transition-opacity ${
        completed ? 'opacity-60' : ''
      }`}
    >
      {/* Checkbox */}
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm font-medium ${
              completed ? 'line-through text-slate-500' : 'text-slate-200'
            }`}
          >
            {task.title}
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${getDifficultyClass(
              task.difficulty
            )}`}
          >
            {task.difficulty}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            {formatTime(task.estimatedMinutes)}
          </span>
        </div>

        {task.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}

        {task.resources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {task.resources.slice(0, 2).map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${phaseColors.bg}`} />
                {r.title.substring(0, 22)}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Redo button (only on completed tasks) */}
      {completed && (
        <button
          onClick={handleToggle}
          title="Reset task"
          className="flex-shrink-0 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-orange-400 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ─── Topic / week section ─────────────────────────────────────────────────────

interface TopicSectionProps {
  topic: Topic;
  phaseColors: (typeof PHASE_COLORS)[string];
}

function TopicSection({ topic, phaseColors }: TopicSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const { completedTaskIds } = useAuth();

  const total = topic.tasks.length;
  const completed = topic.tasks.filter((t) => completedTaskIds.includes(t.id)).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full px-5 py-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-1 h-8 rounded-full ${phaseColors.bg}`}
          />
          <div className="text-left">
            <p className="text-xs text-slate-500">Week {topic.weekNumber}</p>
            <h4 className="text-sm font-semibold text-white">{topic.title}</h4>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            {completed}/{total}
          </span>
          <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: phaseColors.bar }}
            />
          </div>
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-4 space-y-2">
          {topic.tasks.map((task) => (
            <TaskRow key={task.id} task={task} phaseColors={phaseColors} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Phase accordion ──────────────────────────────────────────────────────────

interface PhaseSectionProps {
  phase: Phase;
  isLocked: boolean;
}

function PhaseSection({ phase, isLocked }: PhaseSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const { completedTaskIds } = useAuth();
  const colors = PHASE_COLORS[phase.colorScheme];
  const prog = getPhaseProgress(phase.id, completedTaskIds);

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all ${colors.border} ${
        isLocked ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={() => !isLocked && setExpanded((e) => !e)}
        disabled={isLocked}
        className="w-full p-4 flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.light}`}
          >
            {isLocked ? (
              <Lock className={`w-5 h-5 ${colors.text}`} />
            ) : (
              <span className={`font-bold text-lg ${colors.text}`}>
                {phase.id.replace('phase-', '')}
              </span>
            )}
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-500">{phase.months}</p>
            <h3 className="font-bold text-white">{phase.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-slate-400">
              {prog.completed}/{prog.total} tasks
            </p>
            <div className="w-20 h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${prog.percentage}%`,
                  backgroundColor: colors.bar,
                }}
              />
            </div>
          </div>
          <span className="text-sm font-bold text-slate-300">{prog.percentage}%</span>
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="divide-y divide-white/5 bg-slate-900/30">
          {phase.topics.map((topic) => (
            <TopicSection key={topic.id} topic={topic} phaseColors={colors} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── All Tasks View ───────────────────────────────────────────────────────────

export function AllTasksView() {
  const { completedTaskIds, progressLoading } = useAuth();
  const overall = getOverallProgress(completedTaskIds);

  if (progressLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall progress bar */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Overall Roadmap Progress
          </h2>
          <span className="text-2xl font-bold text-white">{overall.percentage}%</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${overall.percentage}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {overall.completed} of {overall.total} tasks completed
        </p>
      </div>

      {/* Phase accordions */}
      {phases.map((phase, idx) => {
        const prevPhasePct =
          idx > 0
            ? getPhaseProgress(phases[idx - 1].id, completedTaskIds).percentage
            : 100;
        const isLocked = idx > 0 && prevPhasePct < 80;
        return (
          <PhaseSection key={phase.id} phase={phase} isLocked={isLocked} />
        );
      })}
    </div>
  );
}
