'use client';

import { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  FolderGit2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { Phase, Task } from '@/types/roadmap';
import { useAuth } from '@/lib/AuthContext';

const DIFFICULTY_CLASS: Record<Task['difficulty'], string> = {
  beginner: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  intermediate: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  advanced: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
};

const STEP_TYPE_CLASS: Record<string, string> = {
  learn: 'text-sky-300',
  practice: 'text-emerald-300',
  build: 'text-fuchsia-300',
  review: 'text-amber-300',
  showcase: 'text-indigo-300',
};

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

interface TaskChecklistCardProps {
  task: Task;
  phaseColorScheme: Phase['colorScheme'];
  topicTitle?: string;
  weekNumber?: number;
  defaultExpanded?: boolean;
  emphasize?: boolean;
}

export function TaskChecklistCard({
  task,
  phaseColorScheme,
  topicTitle,
  weekNumber,
  defaultExpanded = false,
  emphasize = false,
}: TaskChecklistCardProps) {
  const { isItemCompleted, isTaskCompleted, toggleItem, resetTask } = useAuth();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const completed = isTaskCompleted(task.id);

  const completedSteps = useMemo(
    () => task.steps.filter((step) => isItemCompleted(step.id)).length,
    [isItemCompleted, task.steps]
  );

  const progressPercentage =
    task.steps.length > 0 ? Math.round((completedSteps / task.steps.length) * 100) : 0;

  const borderTone = {
    blue: 'border-blue-500/20',
    purple: 'border-purple-500/20',
    teal: 'border-teal-500/20',
    green: 'border-green-500/20',
    orange: 'border-orange-500/20',
    pink: 'border-pink-500/20',
  }[phaseColorScheme];

  return (
    <article
      className={`overflow-hidden rounded-3xl border bg-slate-900/70 backdrop-blur ${
        emphasize ? `${borderTone} shadow-[0_24px_80px_rgba(15,23,42,0.45)]` : 'border-white/8'
      }`}
    >
      <button
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full flex-col gap-4 p-5 text-left md:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              {topicTitle && <span>{topicTitle}</span>}
              {typeof weekNumber === 'number' && <span>Week {weekNumber}</span>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-semibold text-white">{task.title}</h3>
              <span className={`rounded-full border px-2.5 py-1 text-xs ${DIFFICULTY_CLASS[task.difficulty]}`}>
                {task.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(task.estimatedMinutes)}
              </span>
            </div>
            <p className="max-w-3xl text-sm text-slate-300">{task.goal}</p>
          </div>

          <div className="flex items-center gap-3">
            {completed && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  void resetTask(task.id, task.difficulty);
                }}
                className="rounded-full border border-white/10 bg-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:border-orange-400/40 hover:text-orange-300"
              >
                <span className="inline-flex items-center gap-1">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </span>
              </button>
            )}
            <span className="text-sm font-medium text-slate-300">
              {completedSteps}/{task.steps.length}
            </span>
            {expanded ? (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Task completion</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-teal-400 transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </button>

      {expanded && (
        <div className="grid gap-6 border-t border-white/6 px-5 py-5 md:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] md:px-6">
          <div className="space-y-5">
            {task.whyItMatters && (
              <div className="rounded-2xl border border-white/8 bg-slate-950/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-300">
                  <Sparkles className="h-4 w-4" />
                  Why this matters
                </div>
                <p className="text-sm text-slate-300">{task.whyItMatters}</p>
              </div>
            )}

            <div className="space-y-3">
              {task.steps.map((step) => {
                const stepCompleted = isItemCompleted(step.id);

                return (
                  <div
                    key={step.id}
                    className={`rounded-2xl border p-4 transition ${
                      stepCompleted
                        ? 'border-emerald-500/20 bg-emerald-500/8'
                        : 'border-white/8 bg-slate-950/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => void toggleItem(step.id, task.id, task.difficulty)}
                        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition ${
                          stepCompleted
                            ? 'border-emerald-400 bg-emerald-400'
                            : 'border-slate-600 hover:border-emerald-400'
                        }`}
                        aria-label={stepCompleted ? 'Mark step incomplete' : 'Mark step complete'}
                      >
                        {stepCompleted && <span className="text-xs font-bold text-slate-950">✓</span>}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            className={`text-sm font-medium ${
                              stepCompleted ? 'text-emerald-100 line-through' : 'text-slate-100'
                            }`}
                          >
                            {step.title}
                          </h4>
                          <span className={`text-[11px] uppercase tracking-[0.18em] ${STEP_TYPE_CLASS[step.type]}`}>
                            {step.type}
                          </span>
                          {step.estimatedMinutes && (
                            <span className="text-xs text-slate-500">{formatTime(step.estimatedMinutes)}</span>
                          )}
                        </div>
                        {step.description && (
                          <p className="mt-1.5 text-sm text-slate-400">{step.description}</p>
                        )}

                        {step.resources.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {step.resources.map((resource) => (
                              <a
                                key={resource.id}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 transition hover:border-indigo-400/40 hover:text-white"
                              >
                                <span>{resource.label}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-slate-950/70 p-4">
              <h4 className="text-sm font-semibold text-white">Expected Outputs</h4>
              <div className="mt-3 space-y-3">
                {task.deliverables.map((deliverable) => (
                  <div key={deliverable.id} className="rounded-2xl border border-white/6 bg-slate-900/80 p-3">
                    <p className="text-sm font-medium text-slate-100">{deliverable.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{deliverable.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-500/18 bg-indigo-500/8 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-indigo-200">
                <FolderGit2 className="h-4 w-4" />
                GitHub Showcase
              </div>
              <div className="space-y-3">
                {task.githubShowcase.map((showcase) => (
                  <div key={showcase.id} className="rounded-2xl border border-indigo-400/12 bg-slate-950/70 p-3">
                    <p className="text-sm font-medium text-slate-100">{showcase.title}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">Repo path</p>
                    <p className="mt-1 font-mono text-xs text-slate-300">{showcase.repoPath}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">Commit</p>
                    <p className="mt-1 text-sm text-slate-300">{showcase.commitMessage}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">README update</p>
                    <p className="mt-1 text-sm text-slate-300">{showcase.readmeUpdate}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">Proof</p>
                    <p className="mt-1 text-sm text-slate-300">{showcase.proof}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </article>
  );
}
