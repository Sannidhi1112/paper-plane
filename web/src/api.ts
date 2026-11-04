import type { Digest, Options } from "./types";
import { sampleDigest } from "./sampleDigest";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

// Used when the server can't be reached (e.g. the shareable preview).
export const FALLBACK_OPTIONS: Options = {
  defaultCountry: "us",
  defaultLanguage: "en",
  countries: [
    { code: "us", name: "United States", flag: "🇺🇸" },
    { code: "in", name: "India", flag: "🇮🇳" },
    { code: "gb", name: "United Kingdom", flag: "🇬🇧" },
    { code: "ca", name: "Canada", flag: "🇨🇦" },
    { code: "au", name: "Australia", flag: "🇦🇺" },
  ],
  languages: [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिन्दी" },
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "es", name: "Spanish", native: "Español" },
    { code: "fr", name: "French", native: "Français" },
  ],
};

async function getJson<T>(path: string, timeoutMs: number): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

export async function loadOptions(): Promise<{ options: Options; online: boolean }> {
  try {
    return { options: await getJson<Options>("/api/options", 4000), online: true };
  } catch {
    return { options: FALLBACK_OPTIONS, online: false };
  }
}

/**
 * Today's digest for a country + language.
 * Long timeout: the first request of the day for a new combo makes the server build it (~30-60s).
 */
export async function loadDigest(
  country: string,
  lang: string,
  online: boolean,
): Promise<{ digest: Digest; isSample: boolean } | { error: true }> {
  if (!online) return { digest: sampleDigest(country, lang), isSample: true };
  try {
    const q = new URLSearchParams({ country, lang });
    const digest = await getJson<Digest>(`/api/digest/today?${q}`, 90_000);
    if (!digest.cards?.length) throw new Error("empty");
    return { digest, isSample: false };
  } catch {
    return { error: true };
  }
}

// ---- small per-browser memory (best-effort) ----
function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — fine */
  }
}

export const readEdition = () => read<{ country?: string; lang?: string }>("paper-plane:edition", {});
export const writeEdition = (country: string, lang: string) => write("paper-plane:edition", { country, lang });

// Opened planes are tracked per day + country (same stories across languages).
const openedKey = (date: string, country: string) => `paper-plane:opened:${country}:${date}`;
export const readOpened = (date: string, country: string) => read<string[]>(openedKey(date, country), []);
export const writeOpened = (date: string, country: string, ids: string[]) => write(openedKey(date, country), ids);
