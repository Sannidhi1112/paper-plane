import { useEffect, useMemo, useState } from "react";
import type { CategoryId, Digest, Options } from "./types";
import { CATEGORY_TONE } from "./types";
import { ui } from "./i18n";
import { loadDigest, loadOptions, readEdition, readOpened, writeEdition, writeOpened } from "./api";
import { Runway } from "./components/Runway";
import { Letter } from "./components/Letter";
import { PlaneIcon } from "./components/PlaneIcon";

type Filter = CategoryId | "all";
type Status = "loading" | "ready" | "error";

export default function App() {
  const [options, setOptions] = useState<Options | null>(null);
  const [online, setOnline] = useState(false);
  const [country, setCountry] = useState("us");
  const [lang, setLang] = useState("en");

  const [status, setStatus] = useState<Status>("loading");
  const [digest, setDigest] = useState<Digest | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [opened, setOpened] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const t = ui(lang);

  // 1. Load the pickers' choices, then restore this browser's last edition.
  useEffect(() => {
    loadOptions().then(({ options, online }) => {
      const saved = readEdition();
      const has = <T extends { code: string }>(list: T[], c?: string) => !!c && list.some((x) => x.code === c);
      setOptions(options);
      setOnline(online);
      setCountry(has(options.countries, saved.country) ? saved.country! : options.defaultCountry);
      setLang(has(options.languages, saved.lang) ? saved.lang! : options.defaultLanguage);
    });
  }, []);

  // 2. Fetch the digest whenever the edition changes.
  useEffect(() => {
    if (!options) return;
    let cancelled = false;
    setStatus("loading");
    setOpenId(null);
    setFilter("all");
    writeEdition(country, lang);
    loadDigest(country, lang, online).then((r) => {
      if (cancelled) return;
      if ("error" in r) return setStatus("error");
      setDigest(r.digest);
      setIsSample(r.isSample);
      setOpened(new Set(readOpened(r.digest.date, country)));
      setStatus("ready");
    });
    return () => {
      cancelled = true;
    };
  }, [options, online, country, lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const cards = useMemo(
    () => (digest ? digest.cards.filter((c) => filter === "all" || c.category === filter) : []),
    [digest, filter],
  );
  const categories = useMemo(
    () => (digest ? ([...new Set(digest.cards.map((c) => c.category))] as CategoryId[]) : []),
    [digest],
  );

  const countryInfo = options?.countries.find((c) => c.code === country);
  const langInfo = options?.languages.find((l) => l.code === lang);
  const today = digest && status === "ready" ? new Date(digest.date + "T12:00:00") : new Date();
  const weekday = today.toLocaleDateString(t.locale, { weekday: "long" });

  const mmdd = `${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
  const flightNo = (id: string) =>
    `PP-${mmdd}-${String((digest?.cards.findIndex((c) => c.id === id) ?? 0) + 1).padStart(2, "0")}`;

  const open = (id: string) => {
    setOpenId(id);
    if (digest && !opened.has(id)) {
      const next = new Set(opened).add(id);
      setOpened(next);
      writeOpened(digest.date, country, [...next]);
    }
  };
  const idx = openId ? cards.findIndex((c) => c.id === openId) : -1;
  const current = idx >= 0 ? cards[idx] : null;
  const close = () => {
    const id = openId;
    setOpenId(null);
    if (id) requestAnimationFrame(() => document.getElementById(`plane-${id}`)?.focus());
  };

  const answeredCount = digest ? digest.cards.filter((c) => answers[c.id] !== undefined).length : 0;
  const rightCount = digest ? digest.cards.filter((c) => answers[c.id] === c.quiz.answerIndex).length : 0;

  return (
    <>
      <div className="clouds" aria-hidden="true" />
      <main className="page">
        <header className="masthead">
          <div className="brand">
            <h1>Paper Plane</h1>
            <p className="greeting">{t.greeting(weekday)}</p>
          </div>
          <div className="postmark" aria-hidden="true">
            <span className="pm-day">{today.toLocaleDateString(t.locale, { weekday: "short" })}</span>
            <span className="pm-date">{today.getDate()}</span>
            <span className="pm-month">
              {today.toLocaleDateString(t.locale, { month: "short" })} · {country.toUpperCase()}
            </span>
          </div>
        </header>

        {options && (
          <section className="edition" aria-label={`${t.country} / ${t.language}`}>
            <label className="picker" htmlFor="pick-country">
              <span className="picker-label">{t.country}</span>
              <span className="picker-box">
                <span className="picker-flag" aria-hidden="true">
                  {countryInfo?.flag}
                </span>
                <select id="pick-country" value={country} onChange={(e) => setCountry(e.target.value)}>
                  {options.countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </span>
            </label>
            <label className="picker" htmlFor="pick-lang">
              <span className="picker-label">{t.language}</span>
              <span className="picker-box">
                <span className="picker-flag" aria-hidden="true">
                  Aa
                </span>
                <select id="pick-lang" value={lang} onChange={(e) => setLang(e.target.value)}>
                  {options.languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.native}
                      {l.native !== l.name ? ` · ${l.name}` : ""}
                    </option>
                  ))}
                </select>
              </span>
            </label>
          </section>
        )}

        {status === "loading" && (
          <div className="loading" aria-busy="true" role="status">
            <PlaneIcon tone="var(--airmail-red)" size={90} />
            <p>{options ? t.folding(countryInfo?.name ?? country, langInfo?.native ?? lang) : t.loading}</p>
          </div>
        )}

        {status === "error" && (
          <div className="loading" role="alert">
            <p>{t.loadError}</p>
          </div>
        )}

        {status === "ready" && digest && (
          <>
            {isSample && <p className="sample-note">{t.sampleNote}</p>}

            <section className="status">
              <div className="tally">
                <span className="tally-num">{opened.size}</span>/{digest.cards.length} {t.unfolded}
              </div>
              <div className="tally">
                {t.quiz} <span className="tally-num">{rightCount}</span>/{answeredCount} {t.right}
              </div>
            </section>

            <nav className="skies">
              {(["all", ...categories] as Filter[]).map((f) => (
                <button
                  key={f}
                  id={`filter-${f}`}
                  className="sky-chip"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  style={f === "all" ? undefined : { ["--tone" as string]: CATEGORY_TONE[f] }}
                >
                  {f === "all" ? t.allSkies : t.categories[f]}
                </button>
              ))}
            </nav>

            <Runway cards={cards} flightNo={(c) => flightNo(c.id)} opened={opened} onOpen={open} t={t} />

            <p className="colophon">{t.colophon}</p>
          </>
        )}
      </main>

      {current && (
        <Letter
          card={current}
          flightNo={flightNo(current.id)}
          position={`${idx + 1} / ${cards.length}`}
          quizAnswer={answers[current.id]}
          onAnswer={(i) => setAnswers((a) => ({ ...a, [current.id]: i }))}
          onClose={close}
          onPrev={idx > 0 ? () => open(cards[idx - 1].id) : undefined}
          onNext={idx < cards.length - 1 ? () => open(cards[idx + 1].id) : undefined}
          t={t}
          lang={digest?.language ?? lang}
        />
      )}
    </>
  );
}
