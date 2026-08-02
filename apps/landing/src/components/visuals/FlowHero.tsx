import type { ReactNode } from "react";
import { PILLAR_META, type Pillar } from "@/components/ui/page";

/**
 * FlowHero — the "many sources converge on one platform" hero diagram.
 *
 * Eight cards sit around the edge of a 1100×500 canvas; a quadratic path runs
 * from each to a product tile at the centre, and a pulse travels along the paths
 * in sequence. Adapted from Helpway's Inbox hero, with our own subject: source
 * strings, AI suggestions, glossary constraints and Git PRs flowing into the
 * platform, then out to every locale.
 *
 * Why it is a component and not page markup: `react`, `nextjs` and
 * `best-library` all want this shape with different cards. The geometry, the
 * animation timing and the reduced-motion handling are the hard parts and they
 * are identical every time; only the card contents differ.
 *
 * Three constraints it holds to:
 *
 * 1. **No JavaScript.** The motion is SMIL (`<animate>`) inside the SVG, so it
 *    costs nothing at runtime and works in a statically generated page with no
 *    hydration and no `framer-motion`.
 * 2. **One accent.** The pulse takes a single pillar hue. A multi-colour version
 *    would make the colour look like it encodes something, and it does not
 *    (`rule/neutral-ink-accent-is-identity-only`).
 * 3. **No third-party images.** Helpway's version pulls avatars from Unsplash;
 *    our CSP blocks external hosts, so callers pass local assets or none.
 *
 * Cards are laid into eight fixed slots. Pass fewer than eight and the unused
 * slots — and their paths — are simply not drawn.
 */

/**
 * Card slots, clockwise from top-left. `d` ends at the centre tile (550,400).
 *
 * `h` is a RESERVATION, not a clip: `foreignObject` here is `overflow: visible`,
 * so a card taller than its slot silently grows into its neighbour instead of
 * being cut. That is exactly what happened on `/content/` — the top-centre slot
 * was 190×84 while its card (eyebrow + a chained-call mono line + a prose line)
 * measured 158, so it ran 74px down into the slot below and overlapped it by
 * 189×54px. Two rules follow from that:
 *
 * 1. A slot's `h` must be the WORST case its card can reach, and vertical
 *    neighbours need ~25px of clearance on top of it — the copy is translated,
 *    and German and Turkish run 20-35% longer than the English it was laid out
 *    against.
 * 2. The card primitives below clamp their body text, so a translation can only
 *    ever cost a card its last line, never the layout.
 *
 * Widths are 250/255 for cards with a body and 215 for single-line cards; four
 * different widths made the ring read as accidental rather than composed.
 */
const SLOTS = [
  { x: 30, y: 20, w: 255, h: 132, d: "M200 100 Q 300 300, 550 400" },
  { x: 455, y: 0, w: 250, h: 132, d: "M560 50 Q 552 260, 550 400" },
  { x: 800, y: 5, w: 255, h: 132, d: "M900 80 Q 800 300, 550 400" },
  { x: 15, y: 200, w: 250, h: 124, d: "M160 280 Q 300 360, 550 400" },
  { x: 820, y: 200, w: 250, h: 124, d: "M940 280 Q 750 360, 550 400" },
  { x: 120, y: 352, w: 215, h: 92, d: "M260 392 Q 400 400, 550 400" },
  { x: 760, y: 348, w: 215, h: 92, d: "M840 388 Q 700 396, 550 400" },
  { x: 462, y: 162, w: 215, h: 92, d: "M566 254 Q 556 320, 550 400" },
] as const;

/** Total loop length. Each card's pulse is offset by `i / SLOTS.length`. */
const CYCLE = "7.2s";

export interface FlowHeroProps {
  /** Up to 8 nodes, laid into the slots above in order. */
  cards: readonly ReactNode[];
  /** Centre tile: the mark plus the two lines under it. */
  center: {
    mark: ReactNode;
    label: string;
    sublabel: string;
  };
  /** Pillar whose hue the travelling pulse borrows. */
  pillar?: Pillar;
  /** Accessible description; the diagram is decorative without it. */
  title: string;
}

export function FlowHero({ cards, center, pillar = "sync", title }: FlowHeroProps) {
  const accent = PILLAR_META[pillar].color;
  const used = SLOTS.slice(0, Math.min(cards.length, SLOTS.length));

  return (
    <div className="relative">
      {/* Scoped, because the motion lives in SMIL rather than CSS: a media
          query cannot pause <animate>, but it can hide the element carrying it,
          which leaves the static grey path — the diagram's resting state. */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .flow-hero-pulse { display: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 1100 500"
        fill="none"
        role="img"
        aria-label={title}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {used.map((slot, i) => (
          <g key={slot.d}>
            <path
              d={slot.d}
              stroke="rgba(0,0,0,0.09)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* `pathLength="1"` normalises every path to a 0–1 scale, so one set
                of dash values produces the same pulse length on a long edge path
                and a short centre one. */}
            <path
              className="flow-hero-pulse"
              d={slot.d}
              fill="none"
              pathLength="1"
              stroke={accent}
              strokeLinecap="butt"
              strokeWidth="2.5"
            >
              <animate
                attributeName="stroke-dashoffset"
                calcMode="spline"
                dur={CYCLE}
                keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
                keyTimes={`0;${(i * 0.125).toFixed(3)};${(i * 0.125 + 0.167).toFixed(3)};1`}
                repeatCount="indefinite"
                values="0.25;0.25;-1;-1"
              />
              <animate
                attributeName="stroke-dasharray"
                dur={CYCLE}
                repeatCount="indefinite"
                values="0.25 1;0.25 1"
              />
              {/* Opacity gates the pulse so it appears at the card and fades at
                  the tile, instead of snapping back to the start. */}
              <animate
                attributeName="opacity"
                calcMode="spline"
                dur={CYCLE}
                keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
                keyTimes={`0;${(i * 0.125).toFixed(3)};${(i * 0.125 + 0.009).toFixed(3)};${(i * 0.125 + 0.147).toFixed(3)};${(i * 0.125 + 0.167).toFixed(3)};1`}
                repeatCount="indefinite"
                values="0;0;1;1;0;0"
              />
            </path>
          </g>
        ))}

        {used.map((slot, i) => (
          <foreignObject
            key={`card-${slot.d}`}
            x={slot.x}
            y={slot.y}
            width={slot.w}
            height={slot.h}
            style={{ overflow: "visible" }}
          >
            {cards[i]}
          </foreignObject>
        ))}

        {/* Centre tile */}
        <foreignObject x="400" y="368" width="300" height="120" style={{ overflow: "visible" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {center.mark}
            </div>
            <p
              style={{
                marginTop: 12,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "-0.015em",
                color: "#171717",
              }}
            >
              {center.label}
            </p>
            <p style={{ marginTop: 2, fontSize: 12, color: "#787878" }}>{center.sublabel}</p>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

/* ─── Card primitives ────────────────────────────────────────────────
   Inline styles, not Tailwind: content inside <foreignObject> is easy to get
   wrong when a utility class depends on a parent that the SVG boundary breaks,
   and these cards are drawn at a fixed pixel scale set by the viewBox rather
   than by the page's type ramp. */

const CARD: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: 12,
  padding: "12px 14px",
  boxSizing: "border-box",
  // The cards sit on white and are crossed by the grey connector paths. A
  // hairline alone let the paths read as if they ran *through* the cards; one
  // soft shadow lifts them off the canvas so the lines clearly pass behind.
  // Same elevation logic as the hero panel — one shadow doing all the work, no
  // second border, no tint (rule/white-page-hairline-separation).
  boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 28px -14px rgba(0,0,0,0.14)",
};

/**
 * Body text is clamped rather than left to grow.
 *
 * These cards are positioned in a fixed 1100×500 coordinate space, so a card
 * that gets taller does not push anything — it overlaps it. Clamping caps the
 * worst case at a known height in every language: the cost of a long
 * translation is a truncated last line inside one card, not a broken diagram.
 */
const clamp = (lines: number): React.CSSProperties => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: lines,
  overflow: "hidden",
});

/** A card with an eyebrow line, a mono body and an optional trailing node. */
export function FlowCard({
  eyebrow,
  icon,
  children,
  corner,
}: {
  /**
   * Omitted when the card is one of a repeating set — three sibling cards that
   * differ only by locale do not need the same label printed three times; the
   * first one names the operation and the rest are read as more of it.
   */
  eyebrow?: string;
  icon?: ReactNode;
  children: ReactNode;
  corner?: ReactNode;
}) {
  return (
    <div style={{ ...CARD, position: "relative" }}>
      {corner && (
        <span style={{ position: "absolute", top: 12, right: 14, display: "flex" }}>
          {corner}
        </span>
      )}
      {eyebrow && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 7,
          // The eyebrow is a label for the value under it, so it is kept to one
          // line: a two-line eyebrow reads as the card's content and buries the
          // value it is supposed to introduce.
          paddingRight: corner ? 22 : 0,
        }}
      >
        {icon && <span style={{ display: "flex", color: "#a3a3a3" }}>{icon}</span>}
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.055em",
            textTransform: "uppercase",
            color: "#a3a3a3",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {eyebrow}
        </span>
      </div>
      )}
      {children}
    </div>
  );
}

/** Monospace line — a translation key, a file path, a branch name. */
export function FlowMono({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: 12,
        lineHeight: 1.45,
        letterSpacing: "-0.01em",
        color: "#171717",
        // `break-all` split identifiers mid-word (`.lan / guage("tr")`). Breaking
        // on the punctuation an API expression already has keeps the call
        // readable across the wrap.
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        ...clamp(2),
      }}
    >
      {children}
    </p>
  );
}

/** Ordinary prose line inside a card. */
export function FlowText({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return (
    <p
      style={{
        fontSize: 12,
        lineHeight: 1.5,
        color: muted ? "#787878" : "#404040",
        ...clamp(3),
      }}
    >
      {children}
    </p>
  );
}
