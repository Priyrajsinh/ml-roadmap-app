'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { TodayView } from '@/components/TodayView';
import { AllTasksView } from '@/components/AllTasksView';
import { TimelineView } from '@/components/TimelineView';
import { StatsView } from '@/components/StatsView';
import { SearchModal } from '@/components/SearchModal';
import { useAuth } from '@/lib/AuthContext';

type View = 'today' | 'all-tasks' | 'timeline' | 'stats';

function ToastContainer() {
  const { toasts } = useAuth();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2.5 rounded-lg shadow-xl text-white text-sm font-medium ${
            t.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('today');

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
      case 'today':     return <TodayView />;
      case 'all-tasks': return <AllTasksView />;
      case 'timeline':  return <TimelineView />;
      case 'stats':     return <StatsView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
        activeView={activeView}
        onViewChange={(v) => setActiveView(v as View)}
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeView={activeView}
          onViewChange={(v) => setActiveView(v as View)}
        />

        <main className="flex-1 lg:ml-72 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">{renderContent()}</div>
        </main>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <ToastContainer />
    </div>
  );
}
