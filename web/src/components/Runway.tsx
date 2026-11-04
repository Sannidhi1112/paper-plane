import type { StoryCard } from "../types";
import { CATEGORY_TONE } from "../types";
import type { UIStrings } from "../i18n";
import { PlaneIcon } from "./PlaneIcon";

interface Props {
  cards: StoryCard[];
  flightNo: (card: StoryCard) => string;
  opened: Set<string>;
  onOpen: (id: string) => void;
  t: UIStrings;
}

/** The grid of landed planes. Each one flies in, then waits to be tapped. */
export function Runway({ cards, flightNo, opened, onOpen, t }: Props) {
  if (!cards.length) return <p className="empty">{t.empty}</p>;
  return (
    <ul className="runway">
      {cards.map((card, i) => {
        const tone = CATEGORY_TONE[card.category];
        const isOpen = opened.has(card.id);
        // A little deterministic wobble so the planes don't look like a spreadsheet.
        const tilt = ((i * 37) % 13) - 6;
        return (
          <li key={card.id} style={{ ["--i" as string]: i, ["--tilt" as string]: `${tilt}deg` }}>
            <button
              id={`plane-${card.id}`}
              className={`plane-tile${isOpen ? " is-open" : ""}`}
              onClick={() => onOpen(card.id)}
              aria-label={`${card.headline}${isOpen ? ` (${t.read})` : ""}`}
            >
              <span className="flight-no">{flightNo(card)}</span>
              <span className="plane-wrap">
                <PlaneIcon tone={tone} />
              </span>
              <span className="tag">
                <span className="tag-cat" style={{ color: tone }}>
                  {t.categories[card.category]}
                </span>
                <span className="tag-head">
                  <span aria-hidden="true">{card.emoji}</span> {card.headline}
                </span>
              </span>
              {isOpen && <span className="read-stamp">{t.read}</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
