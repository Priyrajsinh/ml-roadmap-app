'use client';

import { useEffect, useState } from 'react';
import {
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Flame,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import type { Phase, Task } from '@/data/roadmap';
import { getTodayTasksForDate } from '@/hooks/useTasks';
import { useAuth } from '@/lib/AuthContext';
import { getOverallProgress } from '@/lib/progress';

const PHASE_BADGE: Record<Phase['colorScheme'], string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  teal: 'bg-teal-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
};

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

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
      className={`flex items-start gap-3 rounded-lg p-3 transition-all ${
        completed ? 'bg-slate-900/30 opacity-60' : 'bg-slate-900/50 hover:bg-slate-900/70'
      }`}
    >
      <button
        onClick={handleToggle}
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-all ${
          completed
            ? 'border-green-500 bg-green-500'
            : 'border-slate-600 hover:border-green-500'
        }`}
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {completed && <Check className="h-3 w-3 text-white" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-sm font-medium ${
              completed ? 'text-slate-500 line-through' : 'text-slate-100'
            }`}
          >
            {task.title}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            {formatTime(task.estimatedMinutes)}
          </span>
        </div>

        {task.resources.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-2">
            {task.resources.slice(0, 2).map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400 transition-colors hover:bg-slate-700"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${badgeColor}`} />
                {resource.title.substring(0, 22)}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        )}
      </div>

      {completed && (
        <button
          onClick={handleToggle}
          title="Redo task"
          className="flex-shrink-0 rounded p-1 text-slate-500 transition-colors hover:bg-slate-700 hover:text-orange-400"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

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
  const activeWeek = startDate
    ? getTodayTasksForDate(startDate, completedTaskIds)
    : { tasks: [], weekNumber: null, roadmapComplete: false };
  const todayTasks = activeWeek.tasks;
  const isFutureStart = startDate !== null && new Date(startDate) > new Date();
  const roadmapComplete =
    startDate !== null && !isFutureStart && activeWeek.roadmapComplete;
  const noTasks =
    todayTasks.length === 0 &&
    startDate !== null &&
    !isFutureStart &&
    !roadmapComplete;
  const completedCount = todayTasks.filter((item) =>
    completedTaskIds.includes(item.task.id)
  ).length;

  if (progressLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-24 rounded-xl bg-slate-800/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{getGreeting()}!</h1>
            <p className="mt-0.5 text-slate-400">Ready to level up today?</p>
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1.5">
                <Flame className="h-5 w-5 text-orange-400" />
                <span className="font-bold text-orange-400">{streak}</span>
                <span className="text-sm text-orange-300">day streak</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1.5">
              <Trophy className="h-5 w-5 text-purple-400" />
              <span className="font-bold text-purple-400">{totalXP} XP</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span>Overall roadmap progress</span>
            <span>{overall.percentage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
              style={{ width: `${overall.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {!startDate && (
        <div className="rounded-xl border border-white/5 bg-slate-800/50 p-8 text-center">
          <Calendar className="mx-auto mb-3 h-12 w-12 text-indigo-400" />
          <h2 className="mb-2 text-xl font-bold text-white">Set Your Start Date</h2>
          <p className="mb-5 text-slate-400">
            Tell us when you started your ML journey and we&apos;ll show the tasks
            scheduled for today.
          </p>
          <button
            onClick={() => setStartDate(new Date().toISOString().split('T')[0])}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-indigo-500"
          >
            Start Today
          </button>
        </div>
      )}

      {isFutureStart && startDate && (
        <div className="rounded-xl border border-white/5 bg-slate-800/30 p-6 text-center">
          <div className="mb-2 text-4xl">Start</div>
          <h2 className="mb-1 text-xl font-bold text-slate-300">
            Journey starts on {startDate}
          </h2>
          <p className="text-slate-500">
            Come back on your start date to see your first tasks!
          </p>
        </div>
      )}

      {noTasks && (
        <div className="rounded-xl border border-white/5 bg-slate-800/30 p-6 text-center">
          <div className="mb-2 text-4xl">Rest</div>
          <h2 className="mb-1 text-xl font-bold text-slate-300">
            Rest day or you are ahead of schedule!
          </h2>
          <p className="text-slate-500">
            No tasks are available right now. Keep up the great pace!
          </p>
        </div>
      )}

      {roadmapComplete && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
          <div className="mb-2 text-4xl">Done</div>
          <h2 className="mb-1 text-xl font-bold text-green-400">
            You completed the roadmap!
          </h2>
          <p className="text-slate-400">
            Outstanding work. Every week is finished and your progress is fully synced.
          </p>
        </div>
      )}

      {startDate && !isFutureStart && !noTasks && !roadmapComplete && (
        <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-800/50">
          <div className="flex items-center justify-between border-b border-white/5 p-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Today&apos;s Tasks</h2>
              <p className="text-sm text-slate-400">
                Week {activeWeek.weekNumber} • {completedCount}/{todayTasks.length} completed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-500"
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

          <div className="space-y-2 p-3">
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
