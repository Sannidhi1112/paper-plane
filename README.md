# ✈️ Paper Plane

Daily news, delivered as little paper planes. Tap a plane to unfold the story.

```
paper-plane/
├── server/   Node + TypeScript: fetch headlines → Claude rewrites them as "Pip" → save daily digest → API
└── web/      React + TypeScript + Vite: the sky, the planes, the unfolding letters
```

## Run both (no API keys needed)

```bash
# terminal 1
cd server
npm install
cp .env.example .env   # MOCK=true by default
npm run dev            # http://localhost:4000

# terminal 2
cd web
npm install
npm run dev            # http://localhost:5173  (proxies /api to the server)
```

If the server isn't running, the web app shows a built-in "Sample flight" with made-up stories.

## Real news

In `server/.env`: `MOCK=false`, add `GNEWS_API_KEY` (gnews.io) and `ANTHROPIC_API_KEY` (console.anthropic.com), choose which `COUNTRIES` and `LANGUAGES` users can pick, then `npm run generate`.

## Countries and languages

- Users pick a country and a language in the app; the choice is remembered in their browser.
- Headlines are fetched once per country per day. Claude writes the cards in the chosen language, and the buttons and labels switch too (English, Hindi, Telugu, Spanish, French; other languages fall back to English labels).
- Each country + language pair is ~18 AI calls a day. The morning cron builds every country in the default language; other languages are built the first time someone picks them that day (first visitor waits ~30-60s).

## Web app features

- Planes fly in on load with a little wobble; each has a flight number (`PP-1103-04`) and a category stripe
- Tap → plane unfolds into an airmail letter: headline, summary, **Grown-up / Explain like I'm 10** toggle, "why it matters", quiz, link to the original
- ← / → keys (or buttons) to move between planes, Esc to fold it back
- Section chips to filter, progress tally (planes unfolded, quiz score), "Read" stamp on opened planes (remembered per day)
- Light and dark (night sky) themes; respects reduced-motion

## Deploying later

- `web`: `npm run build` → static `dist/` (Vercel/Netlify). Set `VITE_API_URL` to your server's URL.
- `server`: any Node host (Render, Railway, Fly). Protect or remove `POST /api/digest/refresh`.
