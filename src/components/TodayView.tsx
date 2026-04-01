'use client';

import { Calendar, Flame, Target, Trophy } from 'lucide-react';
import { guideSections } from '@/data/roadmap-guides';
import { getTodayTasksForDate } from '@/hooks/useTasks';
import { useAuth } from '@/lib/AuthContext';
import { getOverallProgress, getOverallStepProgress } from '@/lib/progress';
import { TaskChecklistCard } from '@/components/TaskChecklistCard';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function TodayView() {
  const {
    startDate,
    streak,
    totalXP,
    completedTaskIds,
    completedItemIds,
    setStartDate,
    progressLoading,
  } = useAuth();

  const overall = getOverallProgress(completedTaskIds);
  const stepProgress = getOverallStepProgress(completedItemIds);
  const activeWeek = startDate
    ? getTodayTasksForDate(startDate, completedTaskIds)
    : { tasks: [], weekNumber: null, roadmapComplete: false };

  const todayTasks = activeWeek.tasks;
  const focusTask =
    todayTasks.find(({ task }) => !completedTaskIds.includes(task.id)) ?? todayTasks[0] ?? null;
  const supportingTasks = todayTasks.filter(({ task }) => task.id !== focusTask?.task.id);
  const completedCount = todayTasks.filter(({ task }) => completedTaskIds.includes(task.id)).length;
  const isFutureStart = startDate !== null && new Date(startDate) > new Date();

  if (progressLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-3xl bg-slate-800/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.25),transparent_42%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-indigo-200/80">Study cockpit</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              {getGreeting()}, keep building proof not just progress.
            </h1>
            <p className="mt-3 text-base text-slate-300">
              Today&apos;s workspace shows the exact steps, exact links, expected outputs, and GitHub actions for the
              current roadmap week.
            </p>
          </div>

          <div className="grid min-w-[220px] gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
              <Flame className="h-4 w-4" />
              <span>{streak} day streak</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
              <Trophy className="h-4 w-4" />
              <span>{totalXP} XP</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Roadmap tasks</span>
              <span>{overall.percentage}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400" style={{ width: `${overall.percentage}%` }} />
            </div>
            <p className="mt-2 text-sm text-slate-300">
              {overall.completed}/{overall.total} tasks completed
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Checklist steps</span>
              <span>{stepProgress.stepPercentage}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${stepProgress.stepPercentage}%` }} />
            </div>
            <p className="mt-2 text-sm text-slate-300">
              {stepProgress.completedSteps}/{stepProgress.totalSteps} steps complete
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Current week</span>
              <span>{activeWeek.weekNumber ?? '-'}</span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm text-slate-300">
              <Target className="h-4 w-4 text-indigo-300" />
              <span>
                {todayTasks.length > 0 ? `${completedCount}/${todayTasks.length} tasks complete this week` : 'No active week yet'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {!startDate && (
        <section className="rounded-[28px] border border-white/8 bg-slate-900/70 p-8 text-center">
          <Calendar className="mx-auto mb-3 h-10 w-10 text-indigo-300" />
          <h2 className="text-2xl font-semibold text-white">Set your start date</h2>
          <p className="mt-2 text-slate-400">
            Once the journey start date is saved, the app will map you to the correct roadmap week and load the exact checklist.
          </p>
          <button
            onClick={() => void setStartDate(new Date().toISOString().split('T')[0])}
            className="mt-5 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400"
          >
            Start today
          </button>
        </section>
      )}

      {isFutureStart && startDate && (
        <section className="rounded-[28px] border border-white/8 bg-slate-900/70 p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">Journey starts on {startDate}</h2>
          <p className="mt-2 text-slate-400">Come back on that date and this workspace will unlock the first guided week.</p>
        </section>
      )}

      {startDate && !isFutureStart && focusTask && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Focus task</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">One clear place to work from</h2>
            </div>
            <p className="text-sm text-slate-400">
              Week {activeWeek.weekNumber} • {completedCount}/{todayTasks.length} tasks complete
            </p>
          </div>

          <TaskChecklistCard
            task={focusTask.task}
            phaseColorScheme={focusTask.phaseColorScheme}
            topicTitle={focusTask.topicTitle}
            weekNumber={focusTask.weekNumber}
            defaultExpanded
            emphasize
          />

          {supportingTasks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Also in this week</h3>
              {supportingTasks.map(({ task, phaseColorScheme, topicTitle, weekNumber }) => (
                <TaskChecklistCard
                  key={task.id}
                  task={task}
                  phaseColorScheme={phaseColorScheme}
                  topicTitle={topicTitle}
                  weekNumber={weekNumber}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        {guideSections.slice(0, 2).map((section) => (
          <div key={section.id} className="rounded-[28px] border border-white/8 bg-slate-900/70 p-5">
            <h3 className="text-lg font-semibold text-white">{section.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{section.description}</p>
            {section.emphasis && <p className="mt-3 text-sm text-indigo-200">{section.emphasis}</p>}
            {section.checklist && (
              <div className="mt-4 space-y-2">
                {section.checklist.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/8 bg-slate-950/70 p-3 text-sm text-slate-300">
                    {item.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
