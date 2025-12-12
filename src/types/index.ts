export interface VocabularyWord {
  exampleSentence: boolean;
  id: string;
  finnish: string;
  english: string;
  partOfSpeech?: string;
  categories: string[];
  cefr?: string;
  pronunciation?: string;
  audio?: string | null;
  examples?: string[];
  difficultyScore?: number;
  frequency?: number;
  example?: string;
  aiGenerated?: boolean;
  generatedAt?: string;
  aiService?: string | null;
  categoryId?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  fallbackUsed?: boolean;
  interval?: number; // Current interval in days (optional for existing data)
  repetitions?: number; // Streak of correct answers (optional for existing data)
  easinessFactor?: number; // The multiplier (starts at 2.5) (optional for existing data)
  nextReviewDate?: string; // ISO date string (e.g., "2025-12-25") (optional for existing data)
}

export interface Category {
  id: string;
  name: string;
  count: number;
  emoji?: string;
  description?: string;
}

export interface UserFolder {
  id: string;
  name: string;
  wordIds: string[];
}

export type View =
  | "categories"
  | "vocabulary"
  | "folders"
  | "loading"
  | "practice"
  | "review"
  | "learning";