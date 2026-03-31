export interface Resource {
  title: string;
  url: string;
  type: 'course' | 'book' | 'video' | 'paper' | 'docs' | 'github' | 'blog';
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  resources: Resource[];
  subtopics: string[];
}

export interface Phase {
  id: number;
  title: string;
  subtitle: string;
  weeks: string;
  description: string;
  icon: string;
  color: string;
  topics: Topic[];
}

export interface GermanTimelineEvent {
  month: string;
  year: number;
  event: string;
  deadline?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  technologies: string[];
  features: string[];
  architecture: string;
  timeline: string;
}

export interface ParallelTrack {
  id: string;
  title: string;
  schedule: { month: string; content: string }[];
}

export interface University {
  name: string;
  program: string;
  deadline: string;
  tuition: string;
  requirements: string[];
}
