import { config, CATEGORIES, type CategoryId } from "./config.js";
import type { RawArticle } from "./types.js";
import { sampleArticles } from "./sample.js";

interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: { name: string };
}

async function fetchCategory(category: CategoryId, country: string): Promise<RawArticle[]> {
  const params = new URLSearchParams({
    category,
    lang: "en",
    country,
    max: String(config.perCategory),
    apikey: config.gnewsKey,
  });
  const res = await fetch(`https://gnews.io/api/v4/top-headlines?${params}`);
  if (!res.ok) {
    throw new Error(`GNews ${category} failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { articles: GNewsArticle[] };
  return data.articles.map((a) => ({
    title: a.title,
    description: a.description ?? "",
    content: a.content ?? "",
    url: a.url,
    source: a.source?.name ?? "Unknown",
    image: a.image,
    publishedAt: a.publishedAt,
    category,
  }));
}

/** Fetch top headlines for every category, de-duplicated by URL. */
export async function fetchHeadlines(country: string): Promise<RawArticle[]> {
  if (config.mock) return sampleArticles;
  if (!config.gnewsKey) throw new Error("GNEWS_API_KEY missing (or set MOCK=true)");

  const all: RawArticle[] = [];
  // Sequential with a small pause — free tiers often rate-limit bursts.
  for (const c of CATEGORIES) {
    try {
      all.push(...(await fetchCategory(c.id, country)));
    } catch (err) {
      console.warn(`⚠️  Skipping ${c.id}:`, (err as Error).message);
    }
    await new Promise((r) => setTimeout(r, 1200));
  }
  const seen = new Set<string>();
  return all.filter((a) => (seen.has(a.url) ? false : (seen.add(a.url), true)));
}
