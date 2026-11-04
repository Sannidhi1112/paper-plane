# ✈️ Paper Plane — server

Daily news, delivered as little paper planes by Pip. This service:

1. **Fetches** top headlines per category from GNews
2. **Rewrites** each one with Claude into a cute story card (emoji, headline, summary, "why care", explain-like-I'm-10, quiz)
3. **Saves** one digest per day (JSON files now, swap for Supabase later)
4. **Serves** it to the React frontend over a small API, regenerating every morning via cron

## Run it (no keys needed)

```bash
npm install
cp .env.example .env      # MOCK=true by default
npm run generate          # builds today's digest from sample data
npm run dev               # API on http://localhost:4000
```

Open http://localhost:4000/api/digest/today

## Go live with real news

1. Get a free key at https://gnews.io and an API key at https://console.anthropic.com
2. In `.env`: set `MOCK=false`, add `GNEWS_API_KEY` and `ANTHROPIC_API_KEY`, choose `COUNTRIES` (e.g. `us,in`) and `DEFAULT_COUNTRY`
3. `npm run generate` (defaults) or `npm run generate -- in te` (India, Telugu)

Each country: 6 categories × 3 headlines = ~18 Claude calls per day, done once and cached. Headlines are fetched once per country per day and reused for every language. The morning cron builds each country in the default language; other languages are built the first time someone picks them that day.

## API

| Method | Path | What |
|---|---|---|
| GET | `/api/options` | Countries and languages users can pick, plus defaults |
| GET | `/api/digest/today?country=in&lang=te` | Today's digest for a country (built on first request). `&category=technology` to filter |
| GET | `/api/digest/:date?country=in&lang=te` | A past day, e.g. `2026-11-03` |
| GET | `/api/categories` | Section names, emojis, colors for the UI |
| POST | `/api/digest/refresh?country=in&lang=te` | Regenerate now (dev only — protect before deploying) |

## Card shape

```json
{
  "id": "a1b2c3d4e5f6",
  "category": "technology",
  "emoji": "🔌",
  "headline": "...",
  "summary": "...",
  "whyCare": "...",
  "eli10": "...",
  "quiz": { "question": "...", "options": ["a", "b", "c"], "answerIndex": 0 },
  "source": "Outlet name",
  "url": "https://original-article",
  "image": "https://...",
  "publishedAt": "..."
}
```

## Notes

- The prompt tells Claude to use only facts from the article and to stay neutral; every card links to the original source.
- Check the GNews free-tier terms (request limits, production use) before deploying.
- Files: `config.ts` (settings, categories) · `news.ts` (fetch) · `summarize.ts` (AI prompt) · `store.ts` (storage) · `generate.ts` (pipeline) · `server.ts` (API + cron)
