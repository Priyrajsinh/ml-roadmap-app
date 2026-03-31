'use client';

import { phases, type Phase, type Topic, type Task } from '@/data/roadmap';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { auth, googleProvider, db } from './firebase';

const STORAGE_KEY = 'ml-roadmap-progress';

export interface ProgressState {
  completedTopics: string[];
  completedTasks: string[];
  streak: number;
  lastActiveDate: string | null;
  totalXP: number;
  phase6Track: 'cv' | 'nlp' | 'tabular' | null;
  expandedPhases: string[];
  theme: 'light' | 'dark';
  lastUpdated: string;
}

const defaultProgress: ProgressState = {
  completedTopics: [],
  completedTasks: [],
  streak: 0,
  lastActiveDate: null,
  totalXP: 0,
  phase6Track: null,
  expandedPhases: ['phase-1'],
  theme: 'dark',
  lastUpdated: new Date().toISOString(),
};

const XP_VALUES = {
  COMPLETE_TASK: 10,
  COMPLETE_TOPIC: 50,
  COMPLETE_PHASE: 200,
  STREAK_BONUS: 5,
};

let currentUser: User | null = null;
let localProgress = getLocalProgress();

function getLocalProgress(): ProgressState {
  if (typeof window === 'undefined') return defaultProgress;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress = JSON.parse(stored);
      return migrateProgress(progress);
    }
  } catch (e) {
    console.error('Failed to load progress:', e);
  }
  return defaultProgress;
}

function migrateProgress(progress: Partial<ProgressState>): ProgressState {
  return {
    completedTopics: progress.completedTopics || [],
    completedTasks: progress.completedTasks || [],
    streak: progress.streak || 0,
    lastActiveDate: progress.lastActiveDate || null,
    totalXP: progress.totalXP || 0,
    phase6Track: progress.phase6Track || null,
    expandedPhases: progress.expandedPhases || ['phase-1'],
    theme: progress.theme || 'dark',
    lastUpdated: progress.lastUpdated || new Date().toISOString(),
  };
}

function saveLocalProgress(progress: ProgressState): void {
  if (typeof window === 'undefined') return;
  
  try {
    progress.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

async function saveRemoteProgress(progress: ProgressState): Promise<void> {
  if (!currentUser) return;
  
  try {
    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, {
      ...progress,
      lastUpdated: serverTimestamp(),
      email: currentUser.email,
    }, { merge: true });
  } catch (e) {
    console.error('Failed to save remote progress:', e);
  }
}

export async function loadProgress(): Promise<ProgressState> {
  const progress = getLocalProgress();
  
  if (currentUser) {
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const remoteData = docSnap.data() as ProgressState;
        localProgress = { ...progress, ...remoteData };
        saveLocalProgress(localProgress);
      }
    } catch (e) {
      console.error('Failed to load remote progress:', e);
    }
  }
  
  return localProgress;
}

export function getProgress(): ProgressState {
  return localProgress;
}

export async function saveProgress(progress: ProgressState): Promise<void> {
  localProgress = progress;
  saveLocalProgress(progress);
  
  if (currentUser) {
    await saveRemoteProgress(progress);
  }
}

export async function toggleTask(taskId: string): Promise<{ progress: ProgressState; xpGained: number }> {
  const progress = { ...localProgress };
  const index = progress.completedTasks.indexOf(taskId);
  let xpGained = 0;
  
  if (index === -1) {
    progress.completedTasks.push(taskId);
    xpGained = XP_VALUES.COMPLETE_TASK;
    progress.totalXP += xpGained;
  } else {
    progress.completedTasks.splice(index, 1);
    progress.totalXP -= XP_VALUES.COMPLETE_TASK;
  }
  
  await saveProgress(progress);
  return { progress, xpGained };
}

export async function toggleTopic(topicId: string): Promise<{ progress: ProgressState; xpGained: number }> {
  const progress = { ...localProgress };
  const index = progress.completedTopics.indexOf(topicId);
  let xpGained = 0;
  
  if (index === -1) {
    progress.completedTopics.push(topicId);
    xpGained = XP_VALUES.COMPLETE_TOPIC;
    progress.totalXP += xpGained;
  } else {
    progress.completedTopics.splice(index, 1);
    progress.totalXP -= XP_VALUES.COMPLETE_TOPIC;
  }
  
  await saveProgress(progress);
  return { progress, xpGained };
}

export async function togglePhase(phaseId: string): Promise<ProgressState> {
  const progress = { ...localProgress };
  const index = progress.expandedPhases.indexOf(phaseId);
  
  if (index === -1) {
    progress.expandedPhases.push(phaseId);
  } else {
    progress.expandedPhases.splice(index, 1);
  }
  
  await saveProgress(progress);
  return progress;
}

export async function setPhaseComplete(phaseId: string): Promise<{ progress: ProgressState; xpGained: number }> {
  const progress = { ...localProgress };
  const xpGained = XP_VALUES.COMPLETE_PHASE;
  progress.totalXP += xpGained;
  await saveProgress(progress);
  return { progress, xpGained };
}

export async function setTheme(theme: 'light' | 'dark'): Promise<ProgressState> {
  const progress = { ...localProgress };
  progress.theme = theme;
  await saveProgress(progress);
  return progress;
}

export async function setPhase6Track(track: 'cv' | 'nlp' | 'tabular'): Promise<ProgressState> {
  const progress = { ...localProgress };
  progress.phase6Track = track;
  await saveProgress(progress);
  return progress;
}

export async function updateStreak(): Promise<ProgressState> {
  const progress = { ...localProgress };
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (progress.lastActiveDate === today) {
    return progress;
  }
  
  if (progress.lastActiveDate === yesterday) {
    progress.streak += 1;
    progress.totalXP += XP_VALUES.STREAK_BONUS;
  } else if (progress.lastActiveDate !== today) {
    progress.streak = progress.lastActiveDate ? 1 : progress.streak + 1;
  }
  
  progress.lastActiveDate = today;
  await saveProgress(progress);
  return progress;
}

export function getCompletionRate(totalTasks: number, completedTasks: string[]): number {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks.length / totalTasks) * 100);
}

export function getTaskCompletionRate(phaseId: string): number {
  const progress = localProgress;
  const phase = phases.find((p: Phase) => p.id === phaseId);
  if (!phase) return 0;
  
  let totalTasks = 0;

  phase.topics.forEach((topic: Topic) => {
    topic.tasks.forEach((task: Task) => {
      totalTasks += 1;
    });
  });
  
  const completedInPhase = progress.completedTasks.filter((t: string) => 
    phase.topics.some((topic: Topic) => topic.tasks.some((task: Task) => task.id === t))
  );
  
  return getCompletionRate(totalTasks, completedInPhase);
}

export function getOverallProgress(): { completed: number; total: number; percentage: number } {
  const progress = localProgress;
  
  let total = 0;
  let completed = 0;
  
  phases.forEach((phase: Phase) => {
    phase.topics.forEach((topic: Topic) => {
      topic.tasks.forEach((task: Task) => {
        total += 1;
        if (progress.completedTasks.includes(task.id)) {
          completed += 1;
        }
      });
    });
  });
  
  return {
    completed,
    total,
    percentage: getCompletionRate(total, progress.completedTasks),
  };
}

export function getCurrentPhaseIndex(): number {
  const progress = localProgress;
  
  for (let i = phases.length - 1; i >= 0; i--) {
    const phase = phases[i];
    const hasCompletedTasks = phase.topics.some((topic: Topic) =>
      topic.tasks.some((task: Task) => progress.completedTasks.includes(task.id))
    );
    if (hasCompletedTasks) {
      return i;
    }
  }
  return 0;
}

export function getTodayTasks(): { current: Task[]; upcoming: Task[] } {
  const progress = localProgress;
  const currentPhaseIndex = getCurrentPhaseIndex();
  const currentPhase = phases[currentPhaseIndex];
  
  const currentTasks: Task[] = [];
  const upcomingTasks: Task[] = [];
  
  if (currentPhase) {
    for (const topic of currentPhase.topics) {
      for (const task of topic.tasks) {
        if (!progress.completedTasks.includes(task.id)) {
          if (currentTasks.length < 3) {
            currentTasks.push(task);
          } else if (upcomingTasks.length < 3) {
            upcomingTasks.push(task);
          }
        }
      }
    }
  }
  
  return { current: currentTasks, upcoming: upcomingTasks };
}

export async function resetProgress(): Promise<ProgressState> {
  const progress = { ...defaultProgress };
  await saveProgress(progress);
  return progress;
}

export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    currentUser = result.user;
    await loadProgress();
    return result.user;
  } catch (e) {
    console.error('Sign in failed:', e);
    return null;
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
  currentUser = null;
  localProgress = getLocalProgress();
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
      await loadProgress();
    }
    callback(user);
  });
}

export function getCurrentUser(): User | null {
  return currentUser;
}