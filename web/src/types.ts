// Mirrors the server's Digest / StoryCard types.
export type CategoryId = "nation" | "world" | "business" | "technology" | "science" | "sports";

export interface StoryCard {
  id: string;
  category: CategoryId;
  emoji: string;
  headline: string;
  summary: string;
  whyCare: string;
  eli10: string;
  quiz: { question: string; options: string[]; answerIndex: number };
  source: string;
  url: string;
  image: string | null;
  publishedAt: string;
}

export interface Digest {
  date: string;
  country: string;
  language: string;
  generatedAt: string;
  mock: boolean;
  cards: StoryCard[];
}

export interface Options {
  defaultCountry: string;
  defaultLanguage: string;
  countries: { code: string; name: string; flag: string }[];
  languages: { code: string; name: string; native: string }[];
}

export const CATEGORY_TONE: Record<CategoryId, string> = {
  nation: "var(--c-nation)",
  world: "var(--c-world)",
  business: "var(--c-business)",
  technology: "var(--c-tech)",
  science: "var(--c-science)",
  sports: "var(--c-sports)",
};
