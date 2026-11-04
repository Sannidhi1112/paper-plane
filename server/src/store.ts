import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { Digest, RawArticle } from "./types.js";

// Simple JSON-file storage to start. Swap for Supabase/Postgres later
// by re-implementing these functions — nothing else needs to change.
const DATA_DIR = path.resolve("data");

const digestFile = (date: string, country: string, lang: string) =>
  path.join(DATA_DIR, `digest-${country}-${lang}-${date}.json`);
const rawFile = (date: string, country: string) => path.join(DATA_DIR, `raw-${country}-${date}.json`);

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch {
    return null;
  }
}
async function writeJson(file: string, data: unknown) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(file, JSON.stringify(data, null, 2));
}

export const saveDigest = (d: Digest) => writeJson(digestFile(d.date, d.country, d.language), d);
export const loadDigest = (date: string, country: string, lang: string) =>
  readJson<Digest>(digestFile(date, country, lang));

/** Most recent digest for a country+language (fallback when today's isn't ready yet). */
export async function loadLatest(country: string, lang: string): Promise<Digest | null> {
  try {
    const prefix = `digest-${country}-${lang}-`;
    const last = (await readdir(DATA_DIR)).filter((f) => f.startsWith(prefix)).sort().at(-1);
    return last ? readJson<Digest>(path.join(DATA_DIR, last)) : null;
  } catch {
    return null;
  }
}

// Raw headlines are cached per country per day, so picking a second language
// re-uses them instead of calling the news API again.
export const saveRaw = (date: string, country: string, articles: RawArticle[]) =>
  writeJson(rawFile(date, country), articles);
export const loadRaw = (date: string, country: string) => readJson<RawArticle[]>(rawFile(date, country));

export const todayISO = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local time
