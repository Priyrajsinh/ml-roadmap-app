'use client';

import { phases } from '@/data/roadmap-content';
import { useAuth } from '@/lib/AuthContext';
import { getCurrentPhaseIndex, getPhaseProgress, getOverallProgress } from '@/lib/progress';

export function TimelineView() {
  const { completedTaskIds } = useAuth();
  const overall = getOverallProgress(completedTaskIds);
  const currentPhaseIndex = getCurrentPhaseIndex(completedTaskIds);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/8 bg-slate-900/70 p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Journey map</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Twelve-month ML roadmap</h1>
        <p className="mt-2 text-sm text-slate-400">
          Track phase milestones, capstone outcomes, and where the current momentum sits right now.
        </p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-teal-400"
            style={{ width: `${overall.percentage}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-slate-300">
          {overall.completed}/{overall.total} tasks complete • {overall.percentage}% overall
        </p>
      </section>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10 md:left-8" />

        <div className="space-y-6">
          {phases.map((phase, index) => {
            const progress = getPhaseProgress(phase.id, completedTaskIds);
            const active = index === currentPhaseIndex;

            return (
              <article key={phase.id} className="relative flex gap-4 md:gap-6">
                <div
                  className={`relative z-10 mt-2 h-12 w-12 rounded-2xl border text-center text-lg font-semibold leading-[3rem] ${
                    progress.percentage === 100
                      ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300'
                      : active
                        ? 'border-indigo-400/30 bg-indigo-500/15 text-indigo-200'
                        : 'border-white/10 bg-slate-900 text-slate-400'
                  }`}
                >
                  {progress.percentage === 100 ? '✓' : index + 1}
                </div>

                <div className="flex-1 rounded-[28px] border border-white/8 bg-slate-900/70 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{phase.months}</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">{phase.title}</h2>
                      <p className="mt-2 text-sm text-slate-400">{phase.description}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-slate-950/60 px-4 py-3 text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Phase progress</p>
                      <p className="mt-1 text-xl font-semibold text-white">{progress.percentage}%</p>
                      <p className="text-sm text-slate-400">
                        {progress.completed}/{progress.total} tasks
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    {phase.topics.slice(0, 2).map((topic) => (
                      <div key={topic.id} className="rounded-2xl border border-white/8 bg-slate-950/60 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Week {topic.weekNumber}</p>
                        <p className="mt-2 text-sm font-medium text-slate-100">{topic.title}</p>
                        {topic.milestone && <p className="mt-2 text-sm text-slate-400">{topic.milestone}</p>}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-indigo-500/18 bg-indigo-500/8 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-indigo-200/80">Capstone outcome</p>
                    <p className="mt-2 text-sm text-slate-200">{phase.capstoneProject}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
