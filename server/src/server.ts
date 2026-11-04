import express from "express";
import cors from "cors";
import cron from "node-cron";
import {
  config,
  CATEGORIES,
  COUNTRY_INFO,
  LANGUAGE_INFO,
  isAllowedCountry,
  isAllowedLanguage,
} from "./config.js";
import { generateDigest } from "./generate.js";
import { loadDigest, loadLatest, todayISO } from "./store.js";

const app = express();
app.use(cors());

// One in-flight generation per country+language, so many users picking the same combo trigger one run.
const inFlight = new Map<string, Promise<unknown>>();
function generateOnce(country: string, lang: string) {
  const key = `${country}:${lang}`;
  let p = inFlight.get(key);
  if (!p) {
    p = generateDigest(country, lang).finally(() => inFlight.delete(key));
    inFlight.set(key, p);
  }
  return p;
}

/** Read ?country= and ?lang=, fall back to defaults, reject anything not enabled. */
function pickEdition(req: express.Request, res: express.Response) {
  const country = String(req.query.country ?? config.defaultCountry).toLowerCase();
  const lang = String(req.query.lang ?? config.defaultLanguage).toLowerCase();
  if (!isAllowedCountry(country)) {
    res.status(400).json({ error: `Country "${country}" isn't available. Try one of: ${config.countries.join(", ")}` });
    return null;
  }
  if (!isAllowedLanguage(lang)) {
    res.status(400).json({ error: `Language "${lang}" isn't available. Try one of: ${config.languages.join(", ")}` });
    return null;
  }
  return { country, lang };
}

app.get("/api/health", (_req, res) => res.json({ ok: true, mock: config.mock }));

app.get("/api/categories", (_req, res) => res.json(CATEGORIES));

// Everything the pickers need in one call.
app.get("/api/options", (_req, res) =>
  res.json({
    defaultCountry: config.defaultCountry,
    defaultLanguage: config.defaultLanguage,
    countries: config.countries.map((code) => ({
      code,
      ...(COUNTRY_INFO[code] ?? { name: code.toUpperCase(), flag: "🏳️" }),
    })),
    languages: config.languages.filter((l) => l in LANGUAGE_INFO).map((code) => ({ code, ...LANGUAGE_INFO[code] })),
  }),
);

// Today's digest: /api/digest/today?country=in&lang=te&category=technology
app.get("/api/digest/today", async (req, res) => {
  const ed = pickEdition(req, res);
  if (!ed) return;

  let digest = await loadDigest(todayISO(), ed.country, ed.lang);
  if (!digest) {
    // First visitor for this edition today: build it now (takes ~30-60s with real APIs).
    try {
      await generateOnce(ed.country, ed.lang);
      digest = await loadDigest(todayISO(), ed.country, ed.lang);
    } catch (e) {
      console.error(`Generation failed for ${ed.country}/${ed.lang}:`, (e as Error).message);
    }
    digest ??= await loadLatest(ed.country, ed.lang); // yesterday's is better than nothing
  }
  if (!digest) return res.status(503).json({ error: "Planes are still being folded. Try again in a minute." });

  const category = req.query.category as string | undefined;
  res.json(category ? { ...digest, cards: digest.cards.filter((c) => c.category === category) } : digest);
});

// Specific past day: /api/digest/2026-11-03?country=in&lang=hi
app.get("/api/digest/:date", async (req, res) => {
  const ed = pickEdition(req, res);
  if (!ed) return;
  const digest = await loadDigest(req.params.date, ed.country, ed.lang);
  digest ? res.json(digest) : res.status(404).json({ error: "No planes flew that day." });
});

// Manual refresh (handy in dev). Protect or remove before deploying publicly.
app.post("/api/digest/refresh", async (req, res) => {
  const ed = pickEdition(req, res);
  if (!ed) return;
  try {
    await generateOnce(ed.country, ed.lang);
    res.json(await loadDigest(todayISO(), ed.country, ed.lang));
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// Every morning, pre-build each country in the default language.
// Other languages are built the first time someone picks them that day (keeps AI costs down).
cron.schedule(config.cronSchedule, async () => {
  for (const c of config.countries) {
    await generateOnce(c, config.defaultLanguage).catch((e) => console.error(`Cron failed for ${c}:`, e));
  }
});

app.listen(config.port, () => {
  console.log(`✈️  Paper Plane API on http://localhost:${config.port}`);
  console.log(`   countries: ${config.countries.join(", ")} · languages: ${config.languages.join(", ")} · cron: ${config.cronSchedule}`);
  generateOnce(config.defaultCountry, config.defaultLanguage).catch((e) =>
    console.error("Startup generation failed:", e.message),
  );
});
