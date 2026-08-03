/**
 * Page grammar — the only sanctioned way to build a marketing page.
 *
 * Every page is composed as:
 *
 *   <PageHero>            frame + pillar badge + hero headline + 2 CTAs
 *   <Divider />
 *   <Section>             SectionHeader + one bespoke visual
 *   <Divider />
 *   ... 4-6 sections total ...
 *   <PageTestimonial />
 *   <ClosingCta />
 *
 * Rules (see DESIGN-DECISIONS.md):
 *   - A section ALWAYS opens with <SectionHeader> (eyebrow → h2 → lede).
 *   - Sections are ONLY ever separated by <Divider />.
 *   - No page may hand-roll `max-w-7xl px-6 py-20`; use <Section>/<Frame>.
 *   - Headings are font-weight 500. Never bold/semibold — hierarchy comes
 *     from size and ink weight, not from stroke weight.
 *   - All copy arrives as props. These primitives never hold strings, so
 *     callers stay responsible for `t("…")` (no hardcoded user-facing text).
 */

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CustomerProof } from "@/components/CustomerProof";

/* ─── Pillars ──────────────────────────────────────────────────────
   The product surfaces a detail page can belong to. Colour is allowed
   HERE and essentially nowhere else — it is identity, not decoration. */

export type Pillar = "ai" | "sync" | "mcp" | "content";

export const PILLAR_META: Record<
  Pillar,
  { color: string; borderColor: string; bg: string }
> = {
  ai: { color: "#7e22ce", borderColor: "rgba(126,34,206,0.14)", bg: "rgba(126,34,206,0.08)" },
  sync: { color: "#16a34a", borderColor: "rgba(34,197,94,0.16)", bg: "rgba(34,197,94,0.1)" },
  mcp: { color: "#2563eb", borderColor: "rgba(37,99,235,0.16)", bg: "rgba(37,99,235,0.08)" },
  content: { color: "#c2410c", borderColor: "rgba(194,65,12,0.14)", bg: "rgba(194,65,12,0.08)" },
};

/* ─── Structure ────────────────────────────────────────────────── */

/** Continuous vertical frame rules behind the entire page. Mount once, in the layout. */
export function FrameLines() {
  return (
    <div className="frame-lines" aria-hidden="true">
      <div className="frame-lines-inner" />
    </div>
  );
}

/** The one horizontal container: 1160px + vertical hairlines, no vertical rhythm. */
export function Frame({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className ? `frame ${className}` : "frame"} style={style}>
      {children}
    </div>
  );
}

/** Frame + the one vertical rhythm. Every content block on every page is one of these. */
export function Section({
  children,
  id,
  className,
  style,
  labelledBy,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={className ? `section ${className}` : "section"}
      style={style}
    >
      {children}
    </section>
  );
}

/** The only permitted transition between two sections. The corner ticks are the signature. */
export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <div className="divider-inner" />
    </div>
  );
}

/* ─── Openings ─────────────────────────────────────────────────── */

export function PillarBadge({ pillar, label }: { pillar: Pillar; label: string }) {
  const meta = PILLAR_META[pillar];
  return (
    <div
      className="flex w-fit items-center gap-1.5 rounded-sm"
      style={{ padding: "4px 10px", border: `1px solid ${meta.borderColor}`, background: meta.bg }}
    >
      <span
        aria-hidden="true"
        style={{ width: 6, height: 6, borderRadius: 2, background: meta.color }}
      />
      <span className="text-xs font-medium" style={{ color: meta.color }}>
        {label}
      </span>
    </div>
  );
}

/**
 * Detail-page hero. Flat, left-aligned, on white — no gradient, no wallpaper.
 * `visual` renders directly under the CTAs, still inside the frame.
 */
export function PageHero({
  pillar,
  pillarLabel,
  title,
  subtitle,
  primary,
  secondary,
  visual,
  titleId = "page-hero-title",
}: {
  pillar?: Pillar;
  pillarLabel?: string;
  title: ReactNode;
  subtitle: ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  visual?: ReactNode;
  titleId?: string;
}) {
  return (
    // Bottom padding matters as much as top: without it the hero visual sits
    // flush against the following <Divider /> and the ticked rule reads as the
    // visual's own bottom border instead of a section boundary.
    <Frame style={{ paddingTop: 56, paddingBottom: 64 }}>
      {pillar && pillarLabel && (
        <div style={{ marginBottom: 20 }}>
          <PillarBadge pillar={pillar} label={pillarLabel} />
        </div>
      )}
      <h1
        id={titleId}
        className="max-w-[20ch] font-medium leading-[1.08] tracking-[-0.03em] text-mist-950"
        style={{ fontSize: "var(--text-hero)", textWrap: "balance" }}
      >
        {title}
      </h1>
      <p
        className="max-w-[48ch] leading-relaxed text-mist-600"
        style={{ fontSize: "var(--text-sub)", marginTop: 16 }}
      >
        {subtitle}
      </p>
      {(primary || secondary) && (
        <div className="flex flex-wrap items-center gap-2" style={{ marginTop: 28 }}>
          {primary && (
            <a className="btn btn-dark btn-lg" href={primary.href}>
              {primary.label}
            </a>
          )}
          {secondary && (
            <a className="btn btn-outline btn-lg" href={secondary.href}>
              {secondary.label}
            </a>
          )}
        </div>
      )}
      {/* The visual is a separate beat from the copy — 56px, not the 32px that
          separates lines of text, so the eye registers a change of register. */}
      {visual && <div style={{ marginTop: 56 }}>{visual}</div>}
    </Frame>
  );
}

/** The fixed opening of every section: eyebrow → h2 → lede. */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  titleMaxWidth = "22ch",
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  titleMaxWidth?: string;
  id?: string;
}) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="section-h2" style={{ maxWidth: titleMaxWidth }}>
        {title}
      </h2>
      {subtitle && (
        <p className="section-p" style={{ marginTop: 12 }}>
          {subtitle}
        </p>
      )}
    </>
  );
}

/* ─── Repeatable section archetypes ───────────────────────────────
   These four cover the ~47 non-pillar pages. Pillar pages get bespoke
   visuals instead — but still open with <SectionHeader>. */

/** N columns split by vertical hairlines. The workhorse feature layout. */
export function FeatureRow({ children }: { children: ReactNode }) {
  return <div className="feat-row">{children}</div>;
}

export function FeatureColumn({
  icon,
  label,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  label?: string;
  title: ReactNode;
  description: ReactNode;
  action?: { label: string; href: string; icon?: ReactNode };
}) {
  return (
    <div className="feat-item">
      {(icon || label) && (
        <div className="flex items-center gap-2">
          {icon && (
            <span
              className="flex shrink-0 items-center justify-center border border-black/[0.04]"
              style={{
                width: 22,
                height: 22,
                borderRadius: "var(--radius-sm)",
                background: "rgba(0,0,0,0.03)",
                color: "var(--color-muted-ink)",
              }}
            >
              {icon}
            </span>
          )}
          {label && (
            <span className="text-[11px] font-medium text-mist-600">{label}</span>
          )}
        </div>
      )}
      <div>
        <h3
          className="font-medium leading-[1.3] tracking-[-0.02em] text-mist-900"
          style={{ fontSize: "var(--text-lead)" }}
        >
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-mist-600">{description}</p>
      </div>
      {action && (
        <a className="learn-more w-fit" href={action.href}>
          {action.label}
          {action.icon}
        </a>
      )}
    </div>
  );
}

/**
 * `FeatureRow` for more items than fit on one line.
 *
 * Use this instead of a hand-rolled `grid` whenever a section lists six or
 * eight capabilities. The reason is alignment, not convenience: a hand-rolled
 * grid gives every cell the same horizontal padding, so the first cell of each
 * row sits ~28px inside the section's left edge while the `<h2>` above it sits
 * at 0. Two left edges in one section is what makes the grid read as a card
 * dropped onto the page rather than part of it, and it is the specific defect
 * this primitive exists to prevent (`rule/one-container`).
 *
 * `.feat-grid` decides the flush edge per ROW, and moves the nth-child cycle
 * with the column count at each breakpoint — see styles.css.
 */
export function FeatureGrid({ children }: { children: ReactNode }) {
  return <div className="feat-grid">{children}</div>;
}

export function FeatureCell({
  title,
  description,
}: {
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <div className="feat-cell">
      <h3 className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-mist-900">
        {title}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">{description}</p>
    </div>
  );
}

/** Tinted hairline rows — for enumerations that would otherwise become a wall of bullets. */
export function BentoList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}

export function BentoRow({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bento-row">
      {/* Default affordance: a hairline tile holding a small check. A bare ✓ next
          to 13px text reads as a bullet and disappears; the tile gives the row a
          left edge to align on and marks it as "included" rather than decorative.
          Callers can still pass their own icon. */}
      <span className="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-black/[0.06] bg-white text-mist-500">
        {icon ?? (
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <span className="min-w-0 text-[13px] leading-snug text-mist-700">{children}</span>
    </div>
  );
}

/**
 * The one FAQ archetype: a hairline question list inside a single clipped
 * container, one row open at a time.
 *
 * There must be exactly one of these in the codebase. The pricing page used to
 * ship its own `<details>` implementation inside a `max-w-3xl px-6` container —
 * different type scale, different disclosure affordance, and no frame rules — so
 * the same product answered questions in two visual languages.
 */
export function FaqList({
  items,
  className,
}: {
  items: ReadonlyArray<{ id: string; question: ReactNode; answer: ReactNode }>;
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    // No outer box: the frame already contains this block, so a border here
    // would be a nested container. Questions are separated by a single hairline
    // between them — `first:border-t-0` drops the leading rule that would
    // otherwise read as the top edge of a card that isn't there.
    <dl className={className}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`border-t border-black/[0.05] first:border-t-0 ${isOpen ? "bg-black/[0.02]" : ""}`}
          >
            <dt>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg px-4 py-4 text-left transition-colors hover:bg-black/[0.02]"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {item.question}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0 text-mist-300 transition-transform duration-150"
                  style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </dt>
            {isOpen && (
              <dd className="px-4 pb-4 text-[13px] leading-relaxed text-mist-600 max-w-[68ch]">
                {item.answer}
              </dd>
            )}
          </div>
        );
      })}
    </dl>
  );
}

/**
 * The FAQ section shape shared by every page that answers questions: opening on
 * the left (38%), the list on the right.
 */
export function FaqSection({
  eyebrow,
  title,
  subtitle,
  items,
  id = "faq",
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  items: ReadonlyArray<{ id: string; question: ReactNode; answer: ReactNode }>;
  id?: string;
}) {
  return (
    <Section id={id}>
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <div className="lg:w-[38%] lg:flex-shrink-0 lg:pt-2">
          <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        </div>
        <div className="flex-1">
          <FaqList items={items} />
        </div>
      </div>
    </Section>
  );
}

/** Full-bleed quote band with a dotted ground. One per page, never two. */
export function PageTestimonial({
  quote,
  name,
  role,
  avatar,
  patternId = "dots-testimonial",
}: {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  patternId?: string;
}) {
  return (
    <Section className="!p-0">
      <div className="relative overflow-hidden">
        <svg className="pointer-events-none absolute inset-0 h-full w-full text-black/5" aria-hidden="true">
          <defs>
            <pattern id={patternId} x="-1" y="-1" width="12" height="12" patternUnits="userSpaceOnUse">
              <rect x="1" y="1" width="2" height="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect fill={`url(#${patternId})`} width="100%" height="100%" />
        </svg>

        <figure
          className="relative flex items-start gap-12 max-sm:flex-col max-sm:gap-6"
          style={{ padding: "56px 32px" }}
        >
          <blockquote
            className="flex-1 leading-[1.45] tracking-[-0.02em] text-mist-900"
            style={{ fontSize: "var(--text-quote)" }}
          >
            &ldquo;{quote}&rdquo;
          </blockquote>
          <figcaption className="flex min-w-[120px] shrink-0 flex-col items-end text-right max-sm:flex-row max-sm:items-center max-sm:gap-3 max-sm:text-left">
            {avatar && (
              <img
                src={avatar}
                alt=""
                width={48}
                height={48}
                loading="lazy"
                className="block rounded-sm border border-black/[0.04]"
              />
            )}
            <p className="mt-2.5 text-[13px] font-medium text-mist-900 max-sm:mt-0">{name}</p>
            <p className="text-xs text-mist-400">{role}</p>
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}

/** The closing ask. Every page ends with exactly one of these. */
export function ClosingCta({
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
  customers,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /**
   * Optional proof row under the buttons: who already runs on this. The
   * conversion point is where a reader is deciding, so it is the one place a
   * logo row earns its space (user decision 2026-08-01). Pass the label text —
   * the copy stays translated at the call site.
   */
  customers?: { label: string };
}) {
  return (
    <Section>
      {/* Two columns when there is proof to show: the ask on the left, who
          already runs on this on the right. The logos used to sit in a row under
          the buttons while the band's whole right half stayed empty — which
          framed the proof as a footnote to the CTA when, at the point someone is
          deciding, it is part of the argument. Without customers the band stays
          a single column, so nothing reflows on the pages that pass none. */}
      <div
        className={
          customers
            ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)]"
            : undefined
        }
      >
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="section-h2" style={{ maxWidth: "24ch" }}>
            {title}
          </h2>
          {subtitle && (
            <p className="section-p" style={{ marginTop: 12 }}>
              {subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2" style={{ marginTop: 24 }}>
            <a className="btn btn-dark btn-lg" href={primary.href}>
              {primary.label}
            </a>
            {secondary && (
              <a className="btn btn-outline btn-lg" href={secondary.href}>
                {secondary.label}
              </a>
            )}
          </div>
        </div>

        {customers && <CustomerProof label={customers.label} />}
      </div>
    </Section>
  );
}

