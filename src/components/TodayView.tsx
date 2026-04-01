'use client';

import { useEffect, useState } from 'react';
import { Flame, Trophy, Check, RotateCcw, ExternalLink, Clock, Calendar } from 'lucide-react';
import type { Task, Phase } from '@/data/roadmap';
import { useAuth } from '@/lib/AuthContext';
import { getTodayTasksForDate, type TaskWithContext } from '@/hooks/useTasks';
import { getOverallProgress } from '@/lib/progress';

const PHASE_BADGE: Record<Phase['colorScheme'], string> = {
  blue:   'bg-blue-500',
  purple: 'bg-purple-500',
  teal:   'bg-teal-500',
  green:  'bg-green-500',
  orange: 'bg-orange-500',
  pink:   'bg-pink-500',
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// ─── Single task row ──────────────────────────────────────────────────────────

interface TodayTaskRowProps {
  task: Task;
  badgeColor: string;
}

function TodayTaskRow({ task, badgeColor }: TodayTaskRowProps) {
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
      className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
        completed ? 'opacity-60 bg-slate-900/30' : 'bg-slate-900/50 hover:bg-slate-900/70'
      }`}
    >
      <button
        onClick={handleToggle}
        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          completed
            ? 'bg-green-500 border-green-500'
            : 'border-slate-600 hover:border-green-500'
        }`}
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {completed && <Check className="w-3 h-3 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm font-medium ${
              completed ? 'line-through text-slate-500' : 'text-slate-100'
            }`}
          >
            {task.title}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            {formatTime(task.estimatedMinutes)}
          </span>
        </div>

        {task.resources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1.5">
            {task.resources.slice(0, 2).map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${badgeColor}`} />
                {r.title.substring(0, 22)}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}
      </div>

      {completed && (
        <button
          onClick={handleToggle}
          title="Redo task"
          className="flex-shrink-0 p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-orange-400 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function TodayView() {
  const {
    startDate,
    streak,
    totalXP,
    completedTaskIds,
    setStartDate,
    progressLoading,
  } = useAuth();

  const overall = getOverallProgress(completedTaskIds);

  // Compute today's tasks
  const todayTasks: TaskWithContext[] = startDate
    ? getTodayTasksForDate(startDate)
    : [];

  const isFutureStart =
    startDate !== null && new Date(startDate) > new Date();
  const noTasks = todayTasks.length === 0 && startDate !== null && !isFutureStart;
  const completedCount = todayTasks.filter((t) =>
    completedTaskIds.includes(t.task.id)
  ).length;
  const allDone = todayTasks.length > 0 && completedCount === todayTasks.length;

  // Loading skeleton
  if (progressLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Greeting + streak header */}
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{getGreeting()}!</h1>
            <p className="text-slate-400 mt-0.5">Ready to level up today?</p>
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 rounded-full">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="font-bold text-orange-400">{streak}</span>
                <span className="text-orange-300 text-sm">day streak</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 rounded-full">
              <Trophy className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-purple-400">{totalXP} XP</span>
            </div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Overall roadmap progress</span>
            <span>{overall.percentage}%</span>
          </div>
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
              style={{ width: `${overall.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* No start date → prompt to set it */}
      {!startDate && (
        <div className="bg-slate-800/50 rounded-xl p-8 border border-white/5 text-center">
          <Calendar className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Set Your Start Date</h2>
          <p className="text-slate-400 mb-5">
            Tell us when you started your ML journey and we&apos;ll show the tasks
            scheduled for today.
          </p>
          <button
            onClick={() =>
              setStartDate(new Date().toISOString().split('T')[0])
            }
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
          >
            Start Today
          </button>
        </div>
      )}

      {/* Future start date */}
      {isFutureStart && startDate && (
        <div className="bg-slate-800/30 border border-white/5 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">📅</div>
          <h2 className="text-xl font-bold text-slate-300 mb-1">
            Journey starts on {startDate}
          </h2>
          <p className="text-slate-500">
            Come back on your start date to see your first tasks!
          </p>
        </div>
      )}

      {/* Rest day / ahead of schedule */}
      {noTasks && (
        <div className="bg-slate-800/30 border border-white/5 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">😌</div>
          <h2 className="text-xl font-bold text-slate-300 mb-1">
            Rest day or you are ahead of schedule!
          </h2>
          <p className="text-slate-500">
            No tasks scheduled for this week. Keep up the great pace!
          </p>
        </div>
      )}

      {/* Celebration banner */}
      {allDone && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-xl font-bold text-green-400 mb-1">
            You crushed today&apos;s tasks!
          </h2>
          <p className="text-slate-400">
            Outstanding work. Come back tomorrow to keep the streak going!
          </p>
        </div>
      )}

      {/* Today's tasks list */}
      {startDate && !isFutureStart && !noTasks && (
        <div className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Today&apos;s Tasks
              </h2>
              <p className="text-sm text-slate-400">
                {completedCount}/{todayTasks.length} completed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      todayTasks.length > 0
                        ? Math.round((completedCount / todayTasks.length) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-xs text-slate-400">
                {todayTasks.length > 0
                  ? Math.round((completedCount / todayTasks.length) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>

          <div className="p-3 space-y-2">
            {todayTasks.map(({ task, phaseColorScheme }) => (
              <TodayTaskRow
                key={task.id}
                task={task}
                badgeColor={PHASE_BADGE[phaseColorScheme] ?? 'bg-indigo-500'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
