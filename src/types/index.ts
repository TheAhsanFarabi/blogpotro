export interface BlogVersion {
  v: string;
  message: string;
  timestamp: string;
  wordCount: number;
  content: string;
}

export type BlogStage = "seed" | "growing" | "published";

export interface BlogScores {
  human: number;
  clarity: number;
  accuracy: number;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  tags: string[];
  stage: BlogStage;
  scores: BlogScores | null;
  suggestions: string[];
  versions: BlogVersion[];
  createdAt: number;
  updatedAt: number;
}
