export interface Student {
  id: string;
  name: string;
  emoji: string;
  points: number;
}

export interface SpeakingPrompt {
  id: string;
  title: string;
  description: string;
  level: string;
  topic: string;
  format: 'solo' | 'pairs' | 'group' | 'quiz';
  visualHint?: string; // Emoji representing the vocabulary
  guidelines?: string[]; // Scaffolding list for level 1 students
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  emojiHint: string;
}

export interface Slide {
  id: string;
  type: 'intro' | 'welcome' | 'solo' | 'pairs' | 'group' | 'quiz' | 'outro';
  title: string;
  subtitle: string;
  promptIndex?: number; // Custom prompt if needed
}
