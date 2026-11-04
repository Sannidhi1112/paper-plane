import Anthropic from "@anthropic-ai/sdk";
import { config, LANGUAGE_INFO } from "./config.js";
import { StoryCardSchema, type RawArticle, type StoryCardAI } from "./types.js";

const MASCOT_PROMPT = `You are "Pip", a little folded paper plane who flies each day's news to people who find newspapers boring. Each story you write gets folded into a plane and opened by the reader.

Voice: warm, curious, short sentences, a light joke or flying pun only when the story is light. For serious stories (deaths, disasters, war, crime) drop the jokes and be kind and plain.

Rules:
- Use ONLY facts present in the article text given to you. Never add names, numbers, dates or claims that are not in it.
- If the article text is thin, keep the summary short rather than guessing.
- Stay neutral on politics: describe what happened and who said what, no opinions.
- Write everything in your own words; do not copy sentences from the article.

Return ONLY a JSON object, no markdown fences, with exactly these keys:
{
  "emoji": one emoji that fits the story,
  "headline": a catchy but accurate headline, max 80 characters,
  "summary": 2 short sentences in Pip's voice, max 300 characters,
  "whyCare": 1 sentence on why a regular person should care, max 180 characters,
  "eli10": the same story explained to a 10-year-old, max 300 characters,
  "quiz": { "question": a question answerable from the summary, "options": [3 short options], "answerIndex": 0, 1 or 2 }
}`;

let client: Anthropic | null = null;
function getClient() {
  if (!config.anthropicKey) throw new Error("ANTHROPIC_API_KEY missing (or set MOCK=true)");
  client ??= new Anthropic({ apiKey: config.anthropicKey });
  return client;
}

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in model reply");
  return JSON.parse(text.slice(start, end + 1));
}

async function summarizeWithAI(article: RawArticle, language: string): Promise<StoryCardAI> {
  const languageName = LANGUAGE_INFO[language]?.name ?? "English";
  const languageRule =
    language === "en"
      ? ""
      : `\n\nLanguage: write every text value (headline, summary, whyCare, eli10, quiz question and options) in natural, everyday ${languageName}, the way a friendly local would say it, in its native script. Keep the JSON keys in English. Keep names of people, places and organizations recognizable.`;
  const articleText = [
    `Title: ${article.title}`,
    `Source: ${article.source}`,
    `Description: ${article.description}`,
    `Content: ${article.content}`,
  ].join("\n");

  // One retry if the JSON comes back malformed.
  for (let attempt = 1; attempt <= 2; attempt++) {
    const msg = await getClient().messages.create({
      model: config.model,
      max_tokens: 700,
      system: MASCOT_PROMPT + languageRule,
      messages: [{ role: "user", content: articleText }],
    });
    const text = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("");
    const parsed = StoryCardSchema.safeParse(extractJson(text));
    if (parsed.success) return parsed.data;
    console.warn(`⚠️  Bad JSON for "${article.title}" (attempt ${attempt})`, parsed.error.issues[0]);
  }
  throw new Error(`Could not summarize: ${article.title}`);
}

/** Offline stand-in so the whole pipeline runs without API keys. */
function summarizeMock(article: RawArticle, language: string): StoryCardAI {
  const short = article.description.slice(0, 200);
  const tag = language === "en" ? "" : `[${language}] `; // marks mock cards for non-English picks
  return {
    emoji: "📰",
    headline: (tag + article.title).slice(0, 80),
    summary: `Fresh off the runway! ${short}`,
    whyCare: "This could show up in your feed, your wallet, or your group chat soon.",
    eli10: `Imagine this: ${short.toLowerCase()}`,
    quiz: {
      question: `Which outlet reported this story?`,
      options: [article.source, "The Daily Kite", "Cloud Gazette"],
      answerIndex: 0,
    },
  };
}

export async function summarize(article: RawArticle, language = "en"): Promise<StoryCardAI> {
  return config.mock ? summarizeMock(article, language) : summarizeWithAI(article, language);
}
