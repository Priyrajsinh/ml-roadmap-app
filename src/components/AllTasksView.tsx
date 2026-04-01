'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FolderKanban } from 'lucide-react';
import { phases } from '@/data/roadmap-content';
import { guideSections } from '@/data/roadmap-guides';
import { TaskChecklistCard } from '@/components/TaskChecklistCard';
import { useAuth } from '@/lib/AuthContext';
import { getOverallProgress } from '@/lib/progress';

export function AllTasksView() {
  const { completedTaskIds, progressLoading } = useAuth();
  const overall = getOverallProgress(completedTaskIds);

  if (progressLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-3xl bg-slate-800/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/8 bg-slate-900/70 p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Roadmap explorer</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">Everything lives here</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Each task includes its checklist, links, expected outputs, and GitHub packaging guidance so the roadmap feels like an operating system, not a bookmark dump.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-slate-950/60 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Progress</p>
            <p className="mt-1 text-2xl font-semibold text-white">{overall.percentage}%</p>
            <p className="text-sm text-slate-400">
              {overall.completed}/{overall.total} roadmap tasks complete
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {guideSections.map((section) => (
          <div key={section.id} className="rounded-[28px] border border-white/8 bg-slate-900/70 p-5">
            <div className="flex items-center gap-2 text-indigo-200">
              <FolderKanban className="h-4 w-4" />
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            </div>
            <p className="mt-2 text-sm text-slate-400">{section.description}</p>
            {section.emphasis && <p className="mt-3 text-sm text-indigo-200">{section.emphasis}</p>}
            {section.bullets && (
              <div className="mt-4 space-y-2">
                {section.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-2xl border border-white/8 bg-slate-950/70 p-3 text-sm text-slate-300">
                    {bullet}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      <div className="space-y-4">
        {phases.map((phase) => (
          <PhaseSection key={phase.id} phaseId={phase.id} />
        ))}
      </div>
    </div>
  );
}

function PhaseSection({ phaseId }: { phaseId: string }) {
  const phase = phases.find((entry) => entry.id === phaseId);
  const [expanded, setExpanded] = useState(phaseId === 'phase-1');
  const { completedTaskIds } = useAuth();

  if (!phase) return null;

  const totalTasks = phase.topics.reduce((sum, topic) => sum + topic.tasks.length, 0);
  const completed = phase.topics.reduce(
    (sum, topic) => sum + topic.tasks.filter((task) => completedTaskIds.includes(task.id)).length,
    0
  );
  const percentage = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/8 bg-slate-900/70">
      <button
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-start justify-between gap-4 p-6 text-left"
      >
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{phase.months}</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{phase.title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">{phase.description}</p>
          <p className="mt-3 text-sm text-indigo-200">Capstone outcome: {phase.capstoneProject}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/8 bg-slate-950/60 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Phase progress</p>
            <p className="mt-1 text-lg font-semibold text-white">{percentage}%</p>
            <p className="text-sm text-slate-400">
              {completed}/{totalTasks} tasks
            </p>
          </div>
          {expanded ? (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="space-y-6 border-t border-white/6 px-6 pb-6">
          {phase.topics.map((topic) => (
            <div key={topic.id} className="space-y-4 pt-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Week {topic.weekNumber}</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">{topic.title}</h3>
                  {topic.milestone && <p className="mt-2 text-sm text-slate-400">{topic.milestone}</p>}
                </div>
              </div>

              <div className="space-y-4">
                {topic.tasks.map((task) => (
                  <TaskChecklistCard
                    key={task.id}
                    task={task}
                    phaseColorScheme={phase.colorScheme}
                    topicTitle={topic.title}
                    weekNumber={topic.weekNumber}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
