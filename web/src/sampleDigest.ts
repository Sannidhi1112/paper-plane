import type { Digest } from "./types";

// Made-up sample stories so the UI works before the server is connected.
// Shown with a "Sample flight" banner — never presented as real news.
export function sampleDigest(country = "us", language = "en"): Digest {
  const today = new Date();
  const now = today.toISOString();
  const base = { image: null, publishedAt: now };
  return {
    date: today.toLocaleDateString("en-CA"),
    country,
    language,
    generatedAt: now,
    mock: true,
    cards: [
      {
        ...base, id: "s1", category: "nation", emoji: "🚲", source: "Sample Wire", url: "https://example.com/bike-lanes",
        headline: "Downtown is getting protected bike lanes",
        summary: "The city council voted yes on new bike lanes for three main streets. Construction starts next spring, so pedal-pushers get a safer ride by summer.",
        whyCare: "Fewer cars downtown can mean easier parking, quieter streets, and a cheaper commute.",
        eli10: "The grown-ups in charge of the city decided to build special lanes just for bikes, with a little wall so cars can't drive in them.",
        quiz: { question: "When does construction start?", options: ["Next spring", "This weekend", "In ten years"], answerIndex: 0 },
      },
      {
        ...base, id: "s2", category: "world", emoji: "🌊", source: "Sample Global", url: "https://example.com/river-deal",
        headline: "Two neighbors finally agree on sharing a river",
        summary: "Leaders of two countries signed a deal on how much river water each side can use in dry months. It ends years of back-and-forth.",
        whyCare: "Water deals like this keep farms running and food prices steady when droughts hit.",
        eli10: "Two countries share one river. They made a promise about who gets how much water when it doesn't rain, so nobody runs out.",
        quiz: { question: "What does the deal cover?", options: ["Fishing rights", "Water in dry months", "Bridge tolls"], answerIndex: 1 },
      },
      {
        ...base, id: "s3", category: "business", emoji: "☕", source: "Sample Markets", url: "https://example.com/coffee",
        headline: "Coffee prices climb for a third month",
        summary: "Bad harvests pushed wholesale coffee prices up again. Some cafés say your latte might cost a little more soon.",
        whyCare: "If you buy coffee daily, a small price bump adds up over a month.",
        eli10: "Not many coffee beans grew this year, so they cost more. That might make coffee at cafés cost more too.",
        quiz: { question: "Why are prices rising?", options: ["Bad harvests", "A new tax", "Too many cafés"], answerIndex: 0 },
      },
      {
        ...base, id: "s4", category: "technology", emoji: "🔌", source: "Sample Tech", url: "https://example.com/chargers",
        headline: "One charger to rule them all (phones, at least)",
        summary: "Several phone makers agreed new phones will use the same charger type starting next year. Your drawer of tangled cables can start retiring.",
        whyCare: "One cable for every phone means less waste and less hunting for the right charger.",
        eli10: "Lots of phone companies decided all their new phones will use the same kind of charger, so you can borrow your friend's.",
        quiz: { question: "When does the change start?", options: ["Today", "Next year", "Never"], answerIndex: 1 },
      },
      {
        ...base, id: "s5", category: "science", emoji: "☄️", source: "Sample Science", url: "https://example.com/comet",
        headline: "A new comet is cruising past Earth",
        summary: "Astronomers spotted a comet that will be visible with binoculars for about two weeks next month. Clear skies, please!",
        whyCare: "It's a free sky show, and you only need binoculars and a dark spot.",
        eli10: "A giant space snowball with a glowing tail is flying near us. Next month you can see it with binoculars!",
        quiz: { question: "What do you need to see it?", options: ["A telescope only", "Binoculars", "A spaceship"], answerIndex: 1 },
      },
      {
        ...base, id: "s6", category: "sports", emoji: "🏆", source: "Sample Sports", url: "https://example.com/final",
        headline: "Underdogs win it all with a last-minute goal",
        summary: "A goal in the final minute gave the underdog team its first championship in 40 years. The crowd did not stay seated.",
        whyCare: "Forty years is a long wait, and it's a nice reminder that long shots sometimes land.",
        eli10: "A team that hardly ever wins scored right before the game ended and became the champions!",
        quiz: { question: "How long since their last title?", options: ["4 years", "14 years", "40 years"], answerIndex: 2 },
      },
    ],
  };
}
