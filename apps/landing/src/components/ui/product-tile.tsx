/**
 * ProductTile — the identity mark for a Better product surface.
 *
 * Design note (2026-07-31): the first attempt half-ported Helpway's animated
 * folder illustration (coloured body + flap + paper sheets). At 28–40px that art
 * collapses into a coloured blob — Helpway gets away with it because the folder
 * is a fully drawn bespoke illustration, not a reduction of one. Half an
 * illustration reads worse than none.
 *
 * So this is a product *mark*, not a miniature illustration: a tinted tile in
 * the product's colour carrying a purpose-drawn glyph in the same colour. It is
 * legible at 24px, it matches <PillarBadge> (same colour system), and it stays
 * inside the quiet register — colour is identity, the glyph is the meaning.
 */

import { cn } from "@better-i18n/ui/lib/utils";

export type ProductKey = "i18n" | "content" | "analytics";

/**
 * Solid, saturated fill with a white glyph — the reference implementation's
 * product marks are app-icon-like tiles, not pale tinted chips. A tinted chip
 * reads as a UI affordance; a filled tile reads as a product's identity.
 */
const PRODUCT_STYLE: Record<
  ProductKey,
  { from: string; to: string; ring: string }
> = {
  // Translation platform — violet, matching PILLAR_META.ai
  i18n: { from: "#8b5cf6", to: "#7c3aed", ring: "rgba(124,58,237,0.30)" },
  // Headless content — emerald, matching PILLAR_META.sync
  content: { from: "#10b981", to: "#059669", ring: "rgba(5,150,105,0.30)" },
  // Content analytics — blue, matching PILLAR_META.mcp
  analytics: { from: "#3b82f6", to: "#2563eb", ring: "rgba(37,99,235,0.30)" },
};

const SIZE = {
  /**
   * Inline with a line of text — the footer's product links.
   *
   * 16px because that is what `<GuideMark>` measures, and the footer sets both
   * in the same column: a product tile at `sm` beside a framework mark would
   * make one list read as two, and the labels would no longer share a left
   * edge. The glyph drops to 10px so the mark inside the smaller tile keeps the
   * same optical weight rather than filling it.
   */
  xs: { box: "size-4 rounded-[5px]", glyph: 10 },
  sm: { box: "size-7 rounded-[8px]", glyph: 16 },
  md: { box: "size-11 rounded-[12px]", glyph: 24 },
} as const;

/** Source glyph → translated glyph. The product's whole job in one mark. */
function I18nGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* latin "A" */}
      <path
        d="M3 15.5 6.2 7.5a.9.9 0 0 1 1.7 0l3.2 8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path d="M4.6 12.6h5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      {/* transform arrow */}
      <path
        d="M13.4 12h3.1m0 0-1.2-1.3m1.2 1.3-1.2 1.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      {/* target glyph block — a translated counterpart, drawn as CJK-ish strokes */}
      <rect x="18" y="7.4" width="3.4" height="9.2" rx="1.1" fill="currentColor" opacity="0.16" />
      <path
        d="M18.4 10.4h2.6M19.7 10.4v4.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Stacked entries — content modelled once, served in every locale. */
function ContentGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.2" y="4" width="17.6" height="6.4" rx="2" fill="currentColor" opacity="0.16" />
      <rect
        x="3.2"
        y="4"
        width="17.6"
        height="6.4"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M6.6 7.2h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect
        x="3.2"
        y="13.6"
        width="17.6"
        height="6.4"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M6.6 16.8h9.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/** Views per locale — the analytics product's whole job in one mark. */
function AnalyticsGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* three bars of increasing height = views by locale */}
      <rect x="4" y="13" width="3.6" height="7" rx="1.2" fill="currentColor" opacity="0.55" />
      <rect x="10.2" y="9" width="3.6" height="11" rx="1.2" fill="currentColor" opacity="0.8" />
      <rect x="16.4" y="5" width="3.6" height="15" rx="1.2" fill="currentColor" />
      {/* baseline */}
      <path d="M3 20.6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function ProductTile({
  product,
  size = "sm",
  className,
}: {
  product: ProductKey;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  const c = PRODUCT_STYLE[product];
  const s = SIZE[size];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center text-white",
        s.box,
        className,
      )}
      style={{
        background: `linear-gradient(160deg, ${c.from}, ${c.to})`,
        boxShadow: `0 1px 2px ${c.ring}, inset 0 1px 0 rgba(255,255,255,0.25)`,
      }}
    >
      {product === "i18n" ? (
        <I18nGlyph size={s.glyph} />
      ) : product === "content" ? (
        <ContentGlyph size={s.glyph} />
      ) : (
        <AnalyticsGlyph size={s.glyph} />
      )}
    </span>
  );
}
