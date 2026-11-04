import { z } from "zod";
import type { CategoryId } from "./config.js";

/** Raw article as we keep it from the news API. */
export interface RawArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  source: string;
  image: string | null;
  publishedAt: string;
  category: CategoryId;
}

/** What the AI must return for each article. Validated with zod. */
export const StoryCardSchema = z.object({
  emoji: z.string().min(1).max(8),
  headline: z.string().min(3).max(90),
  summary: z.string().min(10).max(320),
  whyCare: z.string().min(5).max(200),
  eli10: z.string().min(10).max(320),
  quiz: z.object({
    question: z.string(),
    options: z.array(z.string()).length(3),
    answerIndex: z.number().int().min(0).max(2),
  }),
});
export type StoryCardAI = z.infer<typeof StoryCardSchema>;

/** Final card stored and served to the frontend. */
export interface StoryCard extends StoryCardAI {
  id: string;
  category: CategoryId;
  source: string;
  url: string;
  image: string | null;
  publishedAt: string;
}

export interface Digest {
  date: string; // YYYY-MM-DD
  country: string;
  language: string;
  generatedAt: string;
  mock: boolean;
  cards: StoryCard[];
}
