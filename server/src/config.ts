import "dotenv/config";

export const config = {
  mock: (process.env.MOCK ?? "true").toLowerCase() === "true",
  gnewsKey: process.env.GNEWS_API_KEY ?? "",
  anthropicKey: process.env.ANTHROPIC_API_KEY ?? "",
  model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5",
  defaultCountry: (process.env.DEFAULT_COUNTRY ?? process.env.COUNTRY ?? "us").toLowerCase(),
  // Countries users can pick. Each one costs ~18 AI calls per day once someone opens it.
  countries: (process.env.COUNTRIES ?? "us,in,gb,ca,au")
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean),
  defaultLanguage: (process.env.DEFAULT_LANGUAGE ?? "en").toLowerCase(),
  // Languages the cards can be written in. Each country+language pair is its own daily digest.
  languages: (process.env.LANGUAGES ?? "en,hi,te,es,fr")
    .split(",")
    .map((l) => l.trim().toLowerCase())
    .filter(Boolean),
  perCategory: Number(process.env.PER_CATEGORY ?? 3),
  port: Number(process.env.PORT ?? 4000),
  cronSchedule: process.env.CRON_SCHEDULE ?? "0 6 * * *",
};

// GNews categories mapped to our friendly section names + colors for the UI.
export const CATEGORIES = [
  { id: "nation", label: "Home Front", emoji: "🏠", color: "#FFB4A2" },
  { id: "world", label: "Around the World", emoji: "🌍", color: "#A2D2FF" },
  { id: "business", label: "Money Matters", emoji: "💰", color: "#FFE5A2" },
  { id: "technology", label: "Tech Talk", emoji: "🤖", color: "#CDB4DB" },
  { id: "science", label: "Science Snacks", emoji: "🔬", color: "#B5E48C" },
  { id: "sports", label: "Game Time", emoji: "🏏", color: "#FFC8DD" },
] as const;

// Display info for countries GNews supports. Add more here and to COUNTRIES in .env.
export const COUNTRY_INFO: Record<string, { name: string; flag: string }> = {
  us: { name: "United States", flag: "🇺🇸" },
  in: { name: "India", flag: "🇮🇳" },
  gb: { name: "United Kingdom", flag: "🇬🇧" },
  ca: { name: "Canada", flag: "🇨🇦" },
  au: { name: "Australia", flag: "🇦🇺" },
  sg: { name: "Singapore", flag: "🇸🇬" },
  ie: { name: "Ireland", flag: "🇮🇪" },
  nz: { name: "New Zealand", flag: "🇳🇿" },
};

export const isAllowedCountry = (c: string) => config.countries.includes(c);

// `name` goes into the AI prompt; `native` is shown in the picker.
export const LANGUAGE_INFO: Record<string, { name: string; native: string }> = {
  en: { name: "English", native: "English" },
  hi: { name: "Hindi", native: "हिन्दी" },
  te: { name: "Telugu", native: "తెలుగు" },
  ta: { name: "Tamil", native: "தமிழ்" },
  es: { name: "Spanish", native: "Español" },
  fr: { name: "French", native: "Français" },
  de: { name: "German", native: "Deutsch" },
};

export const isAllowedLanguage = (l: string) => config.languages.includes(l) && l in LANGUAGE_INFO;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
