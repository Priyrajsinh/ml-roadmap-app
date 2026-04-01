'use client';

import type { ReactNode } from 'react';
import { CheckCircle2, Flame, GitBranch, Target, Trophy } from 'lucide-react';
import { phases } from '@/data/roadmap-content';
import { guideSections } from '@/data/roadmap-guides';
import { useAuth } from '@/lib/AuthContext';
import { getOverallProgress, getOverallStepProgress, getPhaseProgress } from '@/lib/progress';

export function StatsView() {
  const { completedTaskIds, completedItemIds, streak, totalXP } = useAuth();
  const overall = getOverallProgress(completedTaskIds);
  const stepProgress = getOverallStepProgress(completedItemIds);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/8 bg-slate-900/70 p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Progress analytics</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Roadmap stats</h1>
        <p className="mt-2 text-sm text-slate-400">
          See task completion, checklist depth, phase progress, and portfolio-support routines in one place.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={<Flame className="h-5 w-5 text-orange-300" />} label="Streak" value={`${streak}`} sublabel="days" />
        <MetricCard icon={<Trophy className="h-5 w-5 text-purple-300" />} label="XP" value={`${totalXP}`} sublabel="total" />
        <MetricCard icon={<CheckCircle2 className="h-5 w-5 text-emerald-300" />} label="Tasks" value={`${overall.completed}/${overall.total}`} sublabel={`${overall.percentage}% complete`} />
        <MetricCard icon={<Target className="h-5 w-5 text-sky-300" />} label="Checklist steps" value={`${stepProgress.completedSteps}/${stepProgress.totalSteps}`} sublabel={`${stepProgress.stepPercentage}% complete`} />
      </div>

      <section className="rounded-[32px] border border-white/8 bg-slate-900/70 p-5">
        <h2 className="text-xl font-semibold text-white">Phase progress</h2>
        <div className="mt-5 space-y-4">
          {phases.map((phase) => {
            const progress = getPhaseProgress(phase.id, completedTaskIds);

            return (
              <div key={phase.id}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-white">{phase.title}</p>
                    <p className="text-slate-500">{phase.months}</p>
                  </div>
                  <p className="text-slate-300">{progress.completed}/{progress.total}</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[32px] border border-white/8 bg-slate-900/70 p-5">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-indigo-300" />
            <h2 className="text-xl font-semibold text-white">Portfolio support</h2>
          </div>
          <div className="mt-4 space-y-3">
            {guideSections.map((section) => (
              <div key={section.id} className="rounded-2xl border border-white/8 bg-slate-950/70 p-4">
                <p className="text-sm font-medium text-slate-100">{section.title}</p>
                <p className="mt-2 text-sm text-slate-400">{section.description}</p>
                {section.checklist && (
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                    {section.checklist.length} checklist items
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/8 bg-slate-900/70 p-5">
          <h2 className="text-xl font-semibold text-white">Current status</h2>
          <div className="mt-4 space-y-3">
            <StatusRow label="Roadmap task completion" value={`${overall.percentage}%`} />
            <StatusRow label="Checklist depth completion" value={`${stepProgress.stepPercentage}%`} />
            <StatusRow label="Total completed tasks" value={`${overall.completed}`} />
            <StatusRow label="Total completed checklist items" value={`${stepProgress.completedSteps}`} />
            <StatusRow label="Tracked guide sections" value={`${guideSections.length}`} />
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sublabel: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/8 bg-slate-900/70 p-5">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{sublabel}</p>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/70 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
