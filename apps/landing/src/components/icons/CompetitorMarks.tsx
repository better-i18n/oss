/**
 * CompetitorMark — the competitor's own logo on a neutral hairline tile.
 *
 * We now ship each product's real mark (public/logos/*), sourced from the
 * vendor's own site favicon / brand asset. This is nominative use: naming and
 * showing a product to identify the product being compared. We do NOT restyle,
 * recolour, or crop the marks, we do not imply endorsement, and every comparison
 * page carries `compare.disclaimer` stating that all names, logos, and trademarks
 * belong to their respective owners. If a vendor asks us to stop using their
 * mark, delete the file in public/logos/ and this component falls back to the
 * monogram automatically.
 *
 * Why real logos rather than the monograms we had first: on a page whose whole
 * job is to compare, a letter tile reads as us being coy about who we're talking
 * about. Showing the actual mark is more honest and easier to scan — and it
 * markets them well, which is the posture the whole comparison set is written in
 * (see `respectNote` in the Alternatives section).
 *
 * The tile is the constant, not the logo: identical size, identical hairline,
 * white ground. That is what keeps six logos of six different shapes and weights
 * from turning a row into visual noise (rule/white-page-hairline-separation).
 */

export type CompetitorKey =
  | "crowdin"
  | "lokalise"
  | "phrase"
  | "transifex"
  | "smartling"
  | "xtm"
  | "locize";

type Mark = {
  /** File in public/logos/ — the vendor's own square mark. */
  readonly asset?: string;
  /** Fallback monogram + brand hue, used when we have no asset for a vendor. */
  readonly letter: string;
  readonly hue: string;
  readonly label: string;
};

const MARKS: Record<CompetitorKey, Mark> = {
  crowdin: { asset: "crowdin.svg", letter: "C", hue: "#2ba24c", label: "Crowdin" },
  lokalise: { asset: "lokalise.png", letter: "L", hue: "#2870ed", label: "Lokalise" },
  phrase: { asset: "phrase.png", letter: "P", hue: "#0f7c8c", label: "Phrase" },
  transifex: { asset: "transifex.svg", letter: "T", hue: "#1f6fbf", label: "Transifex" },
  smartling: { asset: "smartling.png", letter: "S", hue: "#e8562a", label: "Smartling" },
  xtm: { asset: "xtm.png", letter: "X", hue: "#5b3fb5", label: "XTM" },
  /* locize.com/img/favicon.ico is a 146×147 PNG despite the .ico name — their
     own square mark, saved unmodified as locize.png. */
  locize: { asset: "locize.png", letter: "L", hue: "#2f8fd4", label: "Locize" },
};

/**
 * `tone` decides whether the vendor's own colours are shown.
 *
 * "brand" is the default and the honest one: an unmodified mark, which is what
 * nominative use rests on and what the note above promises.
 *
 * "ink" desaturates it, and exists for exactly one surface: the pricing matrix
 * header, where four logos sit in a row of narrow columns. There, four corporate
 * palettes inside our own comparison read as four brands competing for the eye
 * on our page (rule/neutral-ink-accent-is-identity-only). Desaturation is a
 * rendering treatment, not a redraw — the shape and proportions are untouched —
 * but it IS a departure from "we do not restyle", so it stays scoped to that one
 * table rather than becoming the default.
 */
export function CompetitorMark({
  competitor,
  size = 28,
  tone = "brand",
  className,
}: {
  competitor: CompetitorKey;
  size?: number;
  tone?: "brand" | "ink";
  className?: string;
}) {
  const mark = MARKS[competitor];

  // Logos are decorative here — the product name is always set in text right
  // next to the mark, so an alt string would just be read out twice.
  if (mark.asset) {
    return (
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-black/[0.07] bg-white ${className ?? ""}`}
        style={{ width: size, height: size }}
      >
        <img
          src={`/logos/${mark.asset}`}
          alt=""
          width={Math.round(size * 0.64)}
          height={Math.round(size * 0.64)}
          loading="lazy"
          decoding="async"
          className="object-contain"
          style={{
            width: Math.round(size * 0.64),
            height: Math.round(size * 0.64),
            filter: tone === "ink" ? "grayscale(1) contrast(0.85)" : undefined,
            opacity: tone === "ink" ? 0.75 : undefined,
          }}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-md border font-medium ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.45),
        color: tone === "ink" ? "var(--color-mist-600, #666)" : mark.hue,
        background:
          tone === "ink" ? "rgba(0,0,0,0.03)" : `color-mix(in srgb, ${mark.hue} 8%, white)`,
        borderColor:
          tone === "ink" ? "rgba(0,0,0,0.07)" : `color-mix(in srgb, ${mark.hue} 18%, white)`,
      }}
    >
      {mark.letter}
    </span>
  );
}

/** Public brand hue for a competitor — for the rare place that needs the colour without the mark. */
export function competitorHue(competitor: CompetitorKey): string {
  return MARKS[competitor].hue;
}

/** Display name, so call sites don't re-hardcode capitalisation ("XTM", not "Xtm"). */
export function competitorLabel(competitor: CompetitorKey): string {
  return MARKS[competitor].label;
}
