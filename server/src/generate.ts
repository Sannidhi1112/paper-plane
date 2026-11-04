import { createHash } from "node:crypto";
import { config } from "./config.js";
import { fetchHeadlines } from "./news.js";
import { summarize } from "./summarize.js";
import { loadRaw, saveDigest, saveRaw, todayISO } from "./store.js";
import type { Digest, StoryCard } from "./types.js";

/** The full pipeline: fetch (or reuse today's) headlines → summarize in the language → save. */
export async function generateDigest(
  country: string = config.defaultCountry,
  language: string = config.defaultLanguage,
): Promise<Digest> {
  const started = Date.now();
  const date = todayISO();
  console.log(`✈️  Generating digest (country=${country}, lang=${language}, mock=${config.mock})`);

  let articles = await loadRaw(date, country);
  if (articles) {
    console.log(`   reusing ${articles.length} cached headlines`);
  } else {
    articles = await fetchHeadlines(country);
    await saveRaw(date, country, articles);
    console.log(`   fetched ${articles.length} articles`);
  }

  const cards: StoryCard[] = [];
  for (const a of articles) {
    try {
      const ai = await summarize(a, language);
      cards.push({
        ...ai,
        id: createHash("sha1").update(a.url).digest("hex").slice(0, 12),
        category: a.category,
        source: a.source,
        url: a.url,
        image: a.image,
        publishedAt: a.publishedAt,
      });
    } catch (err) {
      console.warn("   ⚠️ ", (err as Error).message);
    }
  }

  const digest: Digest = {
    date,
    country,
    language,
    generatedAt: new Date().toISOString(),
    mock: config.mock,
    cards,
  };
  await saveDigest(digest);
  console.log(`✅ Saved ${cards.length} cards in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  return digest;
}

// `npm run generate`            → default country + language
// `npm run generate -- in te`   → India, Telugu
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDigest(process.argv[2]?.toLowerCase(), process.argv[3]?.toLowerCase()).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
