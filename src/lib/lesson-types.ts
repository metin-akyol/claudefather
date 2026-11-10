import type { TopicSlug } from "@/content/topics";

export const LEVELS = ["foundation", "intermediate", "advanced"] as const;
export type Level = (typeof LEVELS)[number];

export const levelLabel: Record<Level, string> = {
  foundation: "Foundation",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export interface Heading {
  id: string;
  text: string;
}

export interface LessonMeta {
  slug: string;
  title: string;
  summary: string;
  /** ISO date (YYYY-MM-DD) */
  published: string;
  /** ISO date (YYYY-MM-DD), set when a lesson is meaningfully revised */
  updated?: string;
  /** One line describing what changed in the latest update. */
  updateNote?: string;
  topics: TopicSlug[];
  level: Level;
  tools: string[];
  featured: boolean;
  draft: boolean;
  author: string;
  readingMinutes: number;
  /** Number of <Prompt> blocks: reusable prompts in the lesson. */
  promptCount: number;
  headings: Heading[];
  isNew: boolean;
}
