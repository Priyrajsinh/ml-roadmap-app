'use client';

import { useState, useEffect } from 'react';
import { phases } from '@/data/roadmap';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { PhaseCard } from '@/components/PhaseCard';
import { SearchModal } from '@/components/SearchModal';
import { TodayView } from '@/components/TodayView';
import { StatsView } from '@/components/StatsView';
import { TimelineView } from '@/components/TimelineView';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeView, setActiveView] = useState('today');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'today':
        return <TodayView />;
      case 'timeline':
        return <TimelineView />;
      case 'stats':
        return <StatsView />;
      case 'roadmap':
      default:
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-2">
                12-Month ML Engineer Roadmap
              </h2>
              <p className="text-slate-400">
                Your journey to becoming a production ML engineer. Click on phases to expand, 
                mark tasks as complete, and track your progress.
              </p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-green-500"></span>
                  <span className="text-slate-300">Beginner</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-yellow-500"></span>
                  <span className="text-slate-300">Intermediate</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-red-500"></span>
                  <span className="text-slate-300">Advanced</span>
                </span>
              </div>
            </div>

            {phases.map(phase => (
              <PhaseCard key={phase.id} phase={phase} />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeView={activeView}
          onViewChange={setActiveView}
        />

        <main className="flex-1 lg:ml-72 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
