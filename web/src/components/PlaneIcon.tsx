/** Folded paper plane, drawn as three facets so it reads as paper. */
export function PlaneIcon({ tone, size = 120 }: { tone: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 80" width={size} height={(size * 80) / 120} aria-hidden="true" className="plane-svg">
      {/* shadow wing */}
      <path d="M4 38 L116 6 L52 52 Z" fill="var(--paper-shade)" />
      {/* main wing */}
      <path d="M4 38 L116 6 L44 44 Z" fill="var(--paper)" stroke="var(--ink-soft)" strokeWidth="1.2" strokeLinejoin="round" />
      {/* keel */}
      <path d="M44 44 L116 6 L58 74 Z" fill="var(--paper-fold)" stroke="var(--ink-soft)" strokeWidth="1.2" strokeLinejoin="round" />
      {/* airmail stripe on the keel, tinted by category */}
      <path d="M60 52 L92 26 L95 29 L63 55 Z" fill={tone} />
      <path d="M68 58 L100 32 L101.5 34 L70 61 Z" fill={tone} opacity="0.6" />
    </svg>
  );
}
