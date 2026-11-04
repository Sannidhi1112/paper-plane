import type { RawArticle } from "./types.js";

// Made-up sample articles for MOCK mode only — lets the pipeline and UI run with no keys.
const now = new Date().toISOString();
const base = { content: "", image: null, publishedAt: now, url: "https://example.com/" };

export const sampleArticles: RawArticle[] = [
  { ...base, url: base.url + "1", category: "nation", source: "Sample Wire",
    title: "City council approves new bike lanes downtown",
    description: "The council voted to add protected bike lanes on three main streets, with work starting next spring." },
  { ...base, url: base.url + "2", category: "world", source: "Sample Global",
    title: "Two countries sign agreement on shared river water",
    description: "Leaders signed a deal setting out how much water each side can draw during dry months." },
  { ...base, url: base.url + "3", category: "business", source: "Sample Markets",
    title: "Coffee prices rise for third straight month",
    description: "Bad harvests pushed wholesale coffee prices up, and some cafés say menu prices may follow." },
  { ...base, url: base.url + "4", category: "technology", source: "Sample Tech",
    title: "Phone makers agree on a common charging standard",
    description: "Several manufacturers said new phones will share one charger type starting next year." },
  { ...base, url: base.url + "5", category: "science", source: "Sample Science",
    title: "Researchers spot a new comet heading past Earth",
    description: "Astronomers say the comet will be visible with binoculars for about two weeks next month." },
  { ...base, url: base.url + "6", category: "sports", source: "Sample Sports",
    title: "Underdog team wins championship in final-minute goal",
    description: "A last-minute goal gave the underdogs their first title in 40 years." },
];
