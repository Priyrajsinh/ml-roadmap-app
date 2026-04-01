'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Search as SearchIcon, X } from 'lucide-react';
import { roadmapSearchIndex, taskIndex } from '@/data/roadmap-content';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const normalized = query.toLowerCase();
    return roadmapSearchIndex
      .filter((entry) => {
        const haystack = `${entry.title} ${entry.description} ${entry.phaseTitle ?? ''} ${entry.topicTitle ?? ''}`.toLowerCase();
        return haystack.includes(normalized);
      })
      .slice(0, 12);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
          <SearchIcon className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tasks, checklist steps, deliverables, or GitHub actions"
            className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
            autoFocus
          />
          <button onClick={onClose} className="rounded-full p-2 transition hover:bg-slate-800">
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {!query && (
            <div className="p-8 text-center text-sm text-slate-400">
              Search across the roadmap, step-level checklist items, deliverables, and GitHub showcase guidance.
            </div>
          )}

          {query && results.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-400">
              No roadmap content matched &quot;{query}&quot;.
            </div>
          )}

          {results.map((result) => {
            const parentTask = result.taskId ? taskIndex[result.taskId]?.task : null;

            return (
              <div key={result.id} className="border-b border-white/6 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-full border border-white/10 px-2 py-1 uppercase tracking-[0.16em] text-slate-400">
                    {result.type}
                  </span>
                  {result.phaseTitle && <span>{result.phaseTitle}</span>}
                  {result.topicTitle && <span>{result.topicTitle}</span>}
                </div>

                <h4 className="mt-2 text-base font-medium text-white">{result.title}</h4>
                <p className="mt-1 text-sm text-slate-400">{result.description}</p>

                {parentTask && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {parentTask.resources.slice(0, 3).map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 transition hover:border-indigo-400/40"
                      >
                        <span>{resource.label}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-white/8 px-5 py-3 text-xs text-slate-500">
          <span>{results.length} result{results.length === 1 ? '' : 's'}</span>
          <span>Search covers tasks, steps, deliverables, showcase guidance, and guide sections.</span>
        </div>
      </div>
    </div>
  );
}
