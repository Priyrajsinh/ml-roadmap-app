'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon, X, ExternalLink, FileText, Book, Video, Code, Tag } from 'lucide-react';
import { phases, type Task, type Topic } from '@/data/roadmap';
import { getProgress } from '@/lib/progress';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ type: string; item: Task | Topic; phaseTitle: string }[]>([]);
  const progress = getProgress();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults: { type: string; item: Task | Topic; phaseTitle: string }[] = [];
    const lowerQuery = query.toLowerCase();

    phases.forEach(phase => {
      phase.topics.forEach(topic => {
        const topicDesc = (topic as any).description || '';
        if (topic.title.toLowerCase().includes(lowerQuery) || 
            topicDesc.toLowerCase().includes(lowerQuery)) {
          searchResults.push({ type: 'topic', item: topic, phaseTitle: phase.title });
        }
        
        topic.tasks.forEach(task => {
          if (task.title.toLowerCase().includes(lowerQuery) ||
              task.description.toLowerCase().includes(lowerQuery)) {
            searchResults.push({ type: 'task', item: task, phaseTitle: phase.title });
          }
        });
      });
    });

    setResults(searchResults.slice(0, 10));
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <Book className="w-4 h-4" />;
      case 'book': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'repo': return <Code className="w-4 h-4" />;
      case 'paper': return <FileText className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-slate-800 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <SearchIcon className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, topics, resources..."
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 && query && (
            <div className="p-8 text-center text-slate-400">
              No results found for &quot;{query}&quot;
            </div>
          )}
          
          {results.length === 0 && !query && (
            <div className="p-8 text-center text-slate-400">
              Start typing to search the roadmap...
            </div>
          )}

          {results.map((result, index) => (
            <div
              key={index}
              className="p-4 hover:bg-slate-700/50 border-b border-white/5"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  result.type === 'task' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {result.type === 'task' ? 'Task' : 'Topic'}
                </span>
                <span className="text-xs text-slate-500">{result.phaseTitle}</span>
              </div>
              
              <h4 className="font-medium text-white">
                {(result.item as Task).title || (result.item as Topic).title}
              </h4>
              
              {'description' in result.item && result.item.description && (
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                  {result.item.description}
                </p>
              )}

              {'resources' in result.item && result.item.resources && result.item.resources.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.item.resources.slice(0, 3).map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                    >
                      {getTypeIcon(resource.type)}
                      {resource.title.substring(0, 20)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-white/10 bg-slate-900 flex items-center justify-between text-xs text-slate-500">
          <span>{results.length} results</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">Cmd</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">K</kbd>
              <span>to open</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
