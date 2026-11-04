import { useEffect, useRef, useState } from "react";
import type { StoryCard } from "../types";
import { CATEGORY_TONE } from "../types";
import type { UIStrings } from "../i18n";

interface Props {
  card: StoryCard;
  flightNo: string;
  position: string; // "3 / 6"
  quizAnswer: number | undefined;
  onAnswer: (choice: number) => void;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  t: UIStrings;
  lang: string;
}

/** An unfolded plane: the story written on airmail paper. */
export function Letter({ card, flightNo, position, quizAnswer, onAnswer, onClose, onPrev, onNext, t, lang }: Props) {
  const [kidMode, setKidMode] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    setKidMode(false);
  }, [card.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  const answered = quizAnswer !== undefined;
  const correct = answered && quizAnswer === card.quiz.answerIndex;

  return (
    <div className="overlay" onClick={onClose}>
      <article
        key={card.id}
        className="letter"
        lang={lang}
        role="dialog"
        aria-modal="true"
        aria-labelledby="letter-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="letter-inner">
          <header className="letter-top">
            <span className="flight-no">{flightNo}</span>
            <span className="letter-cat" style={{ background: CATEGORY_TONE[card.category] }}>
              {t.categories[card.category]}
            </span>
            <button ref={closeRef} id="letter-close" className="icon-btn" onClick={onClose} aria-label={t.foldBack}>
              ✕
            </button>
          </header>

          <h2 id="letter-title">
            <span className="letter-emoji" aria-hidden="true">
              {card.emoji}
            </span>
            {card.headline}
          </h2>

          <div className="mode-switch" role="group" aria-label={t.readingLevel}>
            <button id="mode-normal" aria-pressed={!kidMode} onClick={() => setKidMode(false)}>
              {t.grownUp}
            </button>
            <button id="mode-kid" aria-pressed={kidMode} onClick={() => setKidMode(true)}>
              {t.kid}
            </button>
          </div>

          <p className="letter-body">{kidMode ? card.eli10 : card.summary}</p>

          <aside className="why">
            <span className="why-label">{t.whyMatters}</span>
            <p>{card.whyCare}</p>
          </aside>

          <section className="quiz" aria-labelledby={`quiz-${card.id}`}>
            <h3 id={`quiz-${card.id}`}>
              {t.quickCheck} {card.quiz.question}
            </h3>
            <div className="quiz-options">
              {card.quiz.options.map((opt, i) => {
                const state = !answered ? "" : i === card.quiz.answerIndex ? "right" : i === quizAnswer ? "wrong" : "dim";
                return (
                  <button
                    key={i}
                    id={`quiz-${card.id}-${i}`}
                    className={`quiz-opt ${state}`}
                    disabled={answered}
                    onClick={() => onAnswer(i)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <p className="quiz-result" role="status">
                {correct ? t.nailed : t.close(card.quiz.options[card.quiz.answerIndex])}
              </p>
            )}
          </section>

          <footer className="letter-foot">
            <a href={card.url} target="_blank" rel="noopener noreferrer">
              {t.fullStory(card.source)}
            </a>
            <nav className="letter-nav">
              <button id="letter-prev" className="icon-btn" onClick={onPrev} disabled={!onPrev} aria-label={t.prev}>
                ←
              </button>
              <span className="pos">{position}</span>
              <button id="letter-next" className="icon-btn" onClick={onNext} disabled={!onNext} aria-label={t.next}>
                →
              </button>
            </nav>
          </footer>
        </div>
      </article>
    </div>
  );
}
