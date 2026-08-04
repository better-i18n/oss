import { SpriteIcon } from "@/components/SpriteIcon";
import { CompetitorMark, type CompetitorKey } from "@/components/icons/CompetitorMarks";
import { ProductTile } from "@/components/ui/product-tile";
import { featureIcon } from "@/components/icons/feature-icons";
import { SupportMark, markState, useMarkLabels, type MarkState } from "@/components/ui/support-mark";
import { StepNumber } from "@/components/ui/step-number";
import { Link } from "@tanstack/react-router";
import { ClosingCta, Section } from "@/components/ui/page";
import { useT } from "@/lib/i18n";

/**
 * Comparison surfaces — tables, heroes and link grids shared by every
 * /compare/* page.
 *
 * Design language (see DESIGN-DECISIONS.md):
 *   - One clipped hairline container per table: `overflow-hidden rounded-xl
 *     border border-black/[0.07]`. Row and column rules are `black/[0.05]`.
 *   - Column headers are 11px `font-medium text-mist-400` — never uppercase
 *     with letter-spacing, which is the caps-label pattern we removed.
 *   - Emphasis is `bg-black/[0.02]`, never a tinted (emerald/blue) band.
 *   - Support marks are the 18px hairline tile used by `BentoRow`
 *     (`ui/page.tsx`): a 10px check for present, a 10px minus for absent. No
 *     green tick and no red cross — a red X editorialises against the
 *     competitor, and this set is written to name what we have, not to score
 *     points. Colour carries no information; ink weight does.
 *   - Link grids use the per-cell `border-t border-l` + `-mt-px -ml-px`
 *     hairline pattern (see FrameworkSupport.tsx) — no nth-child arithmetic,
 *     so no rule can double or go missing when the column count changes.
 *   - Row labels carry a 14px mist-400 icon from the shared
 *     `featureIcon(rowKey)` map, so the same capability looks the same in every
 *     matrix. Pass `iconKey` on a feature to opt in; without it the row is plain.
 *   - No inline `defaultValue` anywhere: `useT` humanises a missing key and
 *     never consults `defaultValue`, so a fallback here is dead code that hides
 *     the missing key instead of surfacing it (this file used to ship
 *     `t("vsLabel", { defaultValue: … })` and rendered "Vs Label" in production).
 */

/* ─── Shared cell primitives ─────────────────────────────────────────── */

const TABLE_SHELL = "overflow-hidden rounded-xl border border-black/[0.07] bg-white";
const HEAD_CELL = "px-4 py-3 text-[11px] font-medium text-mist-400";
const ROW_RULE = "border-t border-black/[0.05]";

/** Row label: shared icon (when the key maps to one) + the translated name. */
function FeatureLabel({ name, iconKey }: { name: string; iconKey?: string }) {
  const icon = iconKey ? featureIcon(iconKey) : undefined;
  return (
    <span className="flex items-start gap-2.5">
      {icon && (
        <SpriteIcon
          name={icon}
          className="mt-px size-3.5 shrink-0 text-mist-400"
          aria-hidden="true"
        />
      )}
      <span className="min-w-0">{name}</span>
    </span>
  );
}

function FeatureValue({
  value,
  highlight,
  labels,
}: {
  value: boolean | string;
  highlight?: boolean;
  labels: Record<MarkState, string>;
}) {
  const state = markState(value);
  if (state) {
    return <SupportMark state={state} label={labels[state]} />;
  }
  return (
    <span className={highlight ? "text-[13px] font-medium text-mist-900" : "text-[13px] text-mist-600"}>
      {value}
    </span>
  );
}

/**
 * Vendors we ship a mark for. A name outside this list renders as text rather
 * than crashing or inventing a logo for a product we hold no asset for.
 * `"Better I18N"` deliberately resolves to `undefined` here — ours is a
 * ProductTile, not a competitor mark.
 */
const MARKED_VENDORS = [
  "crowdin",
  "lokalise",
  "phrase",
  "transifex",
  "smartling",
  "xtm",
  "locize",
] as const;

function vendorKey(name: string): CompetitorKey | undefined {
  const slug = name.toLowerCase().replace(/\s+/g, "");
  return (MARKED_VENDORS as readonly string[]).includes(slug)
    ? (slug as CompetitorKey)
    : undefined;
}

/** Our own name, wherever it appears in a competitor list. */
function isOurs(name: string): boolean {
  return name.toLowerCase().replace(/[\s-]+/g, "") === "betteri18n";
}

/**
 * A product name with its mark: one size, one tile, everywhere
 * (rule/name-a-thing-with-its-mark). Both hero badges use it, so the marks in a
 * headline match the marks in the matrix below it.
 */
function NamedProduct({ name }: { name: string }) {
  const key = vendorKey(name);
  return (
    <span className="inline-flex items-center gap-1.5">
      {isOurs(name) ? (
        <ProductTile product="i18n" size="sm" className="size-[18px] rounded-[5px]" />
      ) : key ? (
        <CompetitorMark competitor={key} size={18} />
      ) : null}
      <span className="text-mist-900">{name}</span>
    </span>
  );
}

/** The small "vs Crowdin" label above a comparison headline. */
function VsBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-black/[0.07] bg-white px-2.5 py-1 text-[11px] font-medium text-mist-600">
      {children}
    </div>
  );
}

/* ─── Two-column feature table ───────────────────────────────────────── */

export interface ComparisonFeature {
  name: string;
  betterI18n: boolean | string;
  competitor: boolean | string;
  highlight?: boolean;
  /** Row key from the shared `featureIcon` map (e.g. "mcp", "cdnDelivery"). */
  iconKey?: string;
}

interface ComparisonTableProps {
  competitorName: string;
  features: ComparisonFeature[];
  featureLabel?: string;
}

/**
 * react-doctor's `prefer-tag-over-role` fires on the `role="table"` below and it
 * is knowingly not followed here — do not "fix" it without reading this.
 *
 * The rule is right in general: `<table>` gives screen readers semantics that
 * ARIA only imitates. But this grid is laid out with `grid grid-cols-3`, and
 * overriding `display` on `<tr>`/`<td>` is exactly what strips table semantics
 * out of the accessibility tree in Chrome and Safari. Swapping the tags in and
 * keeping the grid would leave us with markup that LOOKS correct and announces
 * nothing — strictly worse than what is here.
 *
 * So the choice is: real tags with `table-layout: fixed`, or ARIA roles with the
 * grid. This takes the second, and pays for it by applying the roles COMPLETELY
 * — table / row / columnheader / cell, no gaps — which is what makes the ARIA
 * path equivalent rather than decorative. Moving to real tags is a layout
 * rewrite across six compare pages, not a lint fix.
 */
export function ComparisonTable({ competitorName, features, featureLabel }: ComparisonTableProps) {
  const t = useT("compare");
  const labels = useMarkLabels();

  return (
    <div
      role="table"
      aria-label={`Feature comparison: Better I18N vs ${competitorName}`}
      className={TABLE_SHELL}
    >
      <div role="row" className="grid grid-cols-3">
        <div role="columnheader" className={HEAD_CELL}>
          {featureLabel ?? t("featureColumn")}
        </div>
        <div
          role="columnheader"
          className={`${HEAD_CELL} border-l border-black/[0.05] bg-black/[0.02] text-center text-mist-900`}
        >
          Better I18N
        </div>
        <div role="columnheader" className={`${HEAD_CELL} border-l border-black/[0.05] text-center`}>
          <span className="inline-flex items-center gap-1.5">
            <CompetitorMark
              competitor={competitorName.toLowerCase().replace(/\s+/g, "") as CompetitorKey}
              size={18}
            />
            {competitorName}
          </span>
        </div>
      </div>

      {features.map((feature) => (
        <div
          key={feature.name}
          role="row"
          className={`grid grid-cols-3 ${ROW_RULE} ${feature.highlight ? "bg-black/[0.02]" : ""}`}
        >
          <div role="cell" className="px-4 py-3 text-[13px] text-mist-700">
            <FeatureLabel name={feature.name} iconKey={feature.iconKey} />
          </div>
          <div
            role="cell"
            className="border-l border-black/[0.05] bg-black/[0.02] px-4 py-3 text-center"
          >
            <FeatureValue value={feature.betterI18n} highlight labels={labels} />
          </div>
          <div role="cell" className="border-l border-black/[0.05] px-4 py-3 text-center">
            <FeatureValue value={feature.competitor} labels={labels} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Multi-competitor table ──────────────────────────────────────────── */

export interface MultiComparisonFeature {
  readonly name: string;
  readonly values: ReadonlyMap<string, boolean | string>;
  readonly highlight?: boolean;
  /** Row key from the shared `featureIcon` map. */
  readonly iconKey?: string;
}

interface MultiComparisonTableProps {
  readonly competitors: readonly string[];
  readonly features: readonly MultiComparisonFeature[];
  readonly featureLabel?: string;
}

export function MultiComparisonTable({
  competitors,
  features,
  featureLabel,
}: MultiComparisonTableProps) {
  const t = useT("compare");
  const labels = useMarkLabels();
  const columns = `minmax(180px, 2fr) repeat(${competitors.length}, minmax(100px, 1fr))`;

  return (
    <div className="-mx-6 overflow-x-auto px-6">
      <div
        role="table"
        aria-label={`Feature comparison: ${competitors.join(" vs ")}`}
        className={`${TABLE_SHELL} min-w-[640px]`}
      >
        <div role="row" className="grid" style={{ gridTemplateColumns: columns }}>
          <div role="columnheader" className={HEAD_CELL}>
            {featureLabel ?? t("featureColumn")}
          </div>
          {competitors.map((name, i) => (
            <div
              key={name}
              role="columnheader"
              className={`${HEAD_CELL} border-l border-black/[0.05] text-center ${ i === 0 ? "bg-black/[0.02] text-mist-900" : "" }`}
            >
              {name}
            </div>
          ))}
        </div>

        {features.map((feature) => (
          <div
            key={feature.name}
            role="row"
            className={`grid ${ROW_RULE} ${feature.highlight ? "bg-black/[0.02]" : ""}`}
            style={{ gridTemplateColumns: columns }}
          >
            <div role="cell" className="px-4 py-3 text-[13px] text-mist-700">
              <FeatureLabel name={feature.name} iconKey={feature.iconKey} />
            </div>
            {competitors.map((name, i) => (
              <div
                key={name}
                role="cell"
                className={`border-l border-black/[0.05] px-4 py-3 text-center ${ i === 0 ? "bg-black/[0.02]" : "" }`}
              >
                <FeatureValue
                  value={feature.values.get(name) ?? false}
                  highlight={i === 0}
                  labels={labels}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Heroes ──────────────────────────────────────────────────────────── */

interface ThreeWayHeroProps {
  readonly competitors: readonly string[];
  readonly title: string;
  readonly subtitle: string;
}

export function ThreeWayHero({ competitors, title, subtitle }: ThreeWayHeroProps) {
  return (
    <section>
      <div className="section">
        <div className="max-w-3xl">
          <VsBadge>
            {competitors.map((name, i) => (
              <span key={name} className="inline-flex items-center">
                {i > 0 && <span className="mx-1.5 text-mist-400">vs</span>}
                <NamedProduct name={name} />
              </span>
            ))}
          </VsBadge>

          <h1 className="section-h2">{title}</h1>
          <p className="section-p mt-5">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}

interface ComparisonHeroProps {
  competitorName: string;
  title: string;
  subtitle: string;
}

export function ComparisonHero({ competitorName, title, subtitle }: ComparisonHeroProps) {
  return (
    <section>
      <div className="section">
        <div className="max-w-3xl">
          {/* Both marks, ours first. The badge used to read "vs · [their logo]
              Smartling", which names one party and marks one party — on a page
              whose whole subject is a comparison, that makes the competitor the
              subject and us the implied default. A comparison badge has two
              sides (rule/name-a-thing-with-its-mark). */}
          <VsBadge>
            <NamedProduct name="Better I18N" />
            <span className="text-mist-300">vs</span>
            <NamedProduct name={competitorName} />
          </VsBadge>

          <h1 className="section-h2">{title}</h1>
          <p className="section-p mt-5">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing table ───────────────────────────────────────────────────── */

export interface PricingRow {
  readonly label: string;
  readonly values: readonly string[];
  readonly highlight?: boolean;
  /** Row key from the shared `featureIcon` map. */
  readonly iconKey?: string;
}

interface PricingComparisonProps {
  readonly title: string;
  readonly subtitle: string;
  readonly columns: readonly string[];
  readonly rows: readonly PricingRow[];
}

export function PricingComparisonTable({
  title,
  subtitle,
  columns,
  rows,
}: PricingComparisonProps) {
  const gridColumns = `minmax(160px, 1.5fr) repeat(${columns.length}, minmax(100px, 1fr))`;

  return (
    <section>
      <div className="section">
        <h2 className="section-h2">{title}</h2>
        <p className="section-p mt-3">{subtitle}</p>

        <div className="-mx-6 mt-8 overflow-x-auto px-6">
          <div className={`${TABLE_SHELL} min-w-[540px]`}>
            <div className="grid" style={{ gridTemplateColumns: gridColumns }}>
              <div className={HEAD_CELL} />
              {columns.map((col, i) => (
                <div
                  key={col}
                  className={`${HEAD_CELL} border-l border-black/[0.05] text-center ${ i === 0 ? "bg-black/[0.02] text-mist-900" : "" }`}
                >
                  {col}
                </div>
              ))}
            </div>

            {rows.map((row) => (
              <div
                key={row.label}
                className={`grid ${ROW_RULE} ${row.highlight ? "bg-black/[0.02]" : ""}`}
                style={{ gridTemplateColumns: gridColumns }}
              >
                <div className="px-4 py-3 text-[13px] font-medium text-mist-700">
                  <FeatureLabel name={row.label} iconKey={row.iconKey} />
                </div>
                {row.values.map((val, i) => (
                  <div
                    key={`${row.label}-${columns[i] ?? i}`}
                    className={`border-l border-black/[0.05] px-4 py-3 text-center text-[13px] ${ i === 0 ? "bg-black/[0.02] font-medium text-mist-900" : "text-mist-600" }`}
                  >
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── DX comparison ───────────────────────────────────────────────────── */

export interface DxComparisonItem {
  readonly category: string;
  readonly items: readonly {
    readonly label: string;
    readonly values: ReadonlyMap<string, boolean | string>;
    /** Row key from the shared `featureIcon` map. */
    readonly iconKey?: string;
  }[];
}

interface DxComparisonProps {
  readonly title: string;
  readonly competitors: readonly string[];
  readonly categories: readonly DxComparisonItem[];
}

export function DxComparison({ title, competitors, categories }: DxComparisonProps) {
  const labels = useMarkLabels();
  const gridColumns = `minmax(160px, 1.5fr) repeat(${competitors.length}, minmax(100px, 1fr))`;

  return (
    <section>
      <div className="section">
        <h2 className="section-h2">{title}</h2>

        <div className="mt-8 flex flex-col gap-8">
          {categories.map((cat) => (
            <div key={cat.category}>
              <h3 className="mb-3 text-[11px] font-medium text-mist-400">{cat.category}</h3>
              <div className="-mx-6 overflow-x-auto px-6">
                <div className={`${TABLE_SHELL} min-w-[540px]`}>
                  {cat.items.map((item, i) => (
                    <div
                      key={item.label}
                      className={`grid ${i === 0 ? "" : ROW_RULE}`}
                      style={{ gridTemplateColumns: gridColumns }}
                    >
                      <div className="px-4 py-3 text-[13px] text-mist-700">
                        <FeatureLabel name={item.label} iconKey={item.iconKey} />
                      </div>
                      {competitors.map((name, ci) => (
                        <div
                          key={name}
                          className={`border-l border-black/[0.05] px-4 py-3 text-center ${ ci === 0 ? "bg-black/[0.02]" : "" }`}
                        >
                          <FeatureValue
                            value={item.values.get(name) ?? false}
                            highlight={ci === 0}
                            labels={labels}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Migration steps ─────────────────────────────────────────────────── */

interface MigrationSectionProps {
  readonly title: string;
  readonly subtitle: string;
  readonly steps: readonly { readonly title: string; readonly description: string }[];
}

export function MigrationSection({ title, subtitle, steps }: MigrationSectionProps) {
  return (
    <section>
      <div className="section">
        <h2 className="section-h2">{title}</h2>
        <p className="section-p mt-3">{subtitle}</p>

        {/* Hairline step list — the step number is a bordered marker, not a
            filled dark disc, so the column reads as an index not a badge row.
            This treatment is now <StepNumber> and is the one every ordered
            sequence on the site uses (rule/step-numbers-are-one-marker). */}
        <div className="-mt-px mt-8 overflow-hidden rounded-xl border border-black/[0.07] bg-white">
          {steps.map((step, i) => (
            <div key={step.title} className={`flex gap-4 px-4 py-4 ${i === 0 ? "" : ROW_RULE}`}>
              <StepNumber n={i + 1} />
              <div className="min-w-0">
                <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-mist-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Differentiator ──────────────────────────────────────────────────── */

interface DifferentiatorProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function Differentiator({ title, description, icon }: DifferentiatorProps) {
  return (
    <div className="flex gap-3">
      <span
        className="flex size-[22px] shrink-0 items-center justify-center rounded-md border border-black/[0.04] text-mist-600"
        style={{ background: "rgba(0,0,0,0.03)" }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">{title}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-mist-600">{description}</p>
      </div>
    </div>
  );
}

/* ─── Closing CTA ─────────────────────────────────────────────────────── */

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryCTA: string;
  primaryHref: string;
}

/**
 * The closing ask on a comparison page.
 *
 * Was a hand-rolled dark panel — `rounded-xl bg-mist-950 px-8 py-10` with its
 * own h2 size, its own button and a white-on-dark inversion nothing else on the
 * site uses. Five of the seven /compare/ pages had already moved to
 * <ClosingCta>; smartling and xtm still rendered this, so the two oldest
 * comparison pages closed differently from the five newer ones and from every
 * other page.
 *
 * It now delegates, and carries the customer wall: a comparison page is where a
 * reader is deciding between us and somebody else, which is the single place on
 * the site where "who already chose this" does the most work. `trustedBy` comes
 * from the shared `cta` namespace and is translated in all 22 locales.
 */
export function CTASection({ title, subtitle, primaryCTA, primaryHref }: CTASectionProps) {
  const t = useT("cta");

  return (
    <ClosingCta
      title={title}
      subtitle={subtitle}
      primary={{ label: primaryCTA, href: primaryHref }}
      customers={{ label: t("trustedBy") }}
    />
  );
}

/* ─── Related links ───────────────────────────────────────────────────── */

export interface RelatedTopicLink {
  to: string;
  title: string;
  description: string;
}

interface ComparisonRelatedTopicsProps {
  heading: string;
  links: RelatedTopicLink[];
  locale: string;
}

export function ComparisonRelatedTopics({
  heading,
  links,
  locale,
}: ComparisonRelatedTopicsProps) {
  /*
   * Three things were making this block read as clumsy on the framework
   * guides, where it sits between "Related Articles" above and "Explore Other
   * Framework Guides" below:
   *
   *   1. The heading was `text-[11px] text-mist-400` — a grey micro-label,
   *      while the identical block on /i18n/doctor uses a real
   *      `text-lg text-mist-950` h2. Between two properly-sized headings this
   *      one looked like a leftover caption.
   *   2. Each link carried `px-4 py-4` of its own. Listed items are not cards
   *      (rule/listed-items-are-not-cards), and the horizontal padding pushed
   *      every title 16px right of the heading above it, so nothing in the
   *      section shared a left edge.
   *   3. Four links in a three-column grid leaves one orphan on a second row,
   *      and `py-4` on top of `gap-y-6` made that row's gap enormous. Four
   *      columns fits the four links these pages actually pass, and matches
   *      the related-topics grid on every other page.
   */
  return (
    <Section labelledBy="related-topics">
      <h2 id="related-topics" className="text-lg font-medium text-mist-950">
        {heading}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to as never}
            params={{ locale } as never}
            className="group flex flex-col gap-1"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-[15px] font-medium tracking-[-0.015em] text-mist-900 transition-colors group-hover:text-mist-600">
                {link.title}
              </span>
              <SpriteIcon
                name="arrow-right"
                className="size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600"
                aria-hidden="true"
              />
            </span>
            <span className="text-[13px] leading-relaxed text-mist-600">{link.description}</span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

const allComparisons: readonly { name: string; slug: CompetitorKey }[] = [
  { name: "Crowdin", slug: "crowdin" },
  { name: "Lokalise", slug: "lokalise" },
  { name: "Phrase", slug: "phrase" },
  { name: "Transifex", slug: "transifex" },
  { name: "Smartling", slug: "smartling" },
  { name: "XTM", slug: "xtm" },
];

interface OtherComparisonsProps {
  currentSlug: string;
  locale: string;
  title: string;
}

export function OtherComparisons({ currentSlug, locale, title }: OtherComparisonsProps) {
  const t = useT("compare");
  const others = allComparisons.filter((c) => c.slug !== currentSlug);

  return (
    <section>
      <div className="section">
        <h2 className="text-[11px] font-medium text-mist-400">{title}</h2>

        <div className="mt-8 grid gap-x-10 gap-y-6 grid-cols-1 sm:grid-cols-3">
            {others.map((competitor) => (
              <Link
                key={competitor.slug}
                /* Router is configured `trailingSlash: "always"` (src/router.tsx),
                   so the generated `to` union carries the trailing slash. */
                to={
                  `/$locale/compare/${competitor.slug}/` as
                    | "/$locale/compare/crowdin/"
                    | "/$locale/compare/lokalise/"
                    | "/$locale/compare/phrase/"
                    | "/$locale/compare/transifex/"
                    | "/$locale/compare/smartling/"
                    | "/$locale/compare/xtm/"
                }
                params={{ locale }}
                /* The visible row is the vendor's own mark plus its name — with
                   the logo present, repeating "Better I18N vs …" in 13px is
                   noise. The full sentence stays as the accessible name so the
                   link still says where it goes out of context. */
                aria-label={t("vsLabel", { name: competitor.name })}
                className="group flex items-center gap-2.5"
              >
                <CompetitorMark competitor={competitor.slug} size={20} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-mist-700 transition-colors group-hover:text-mist-950">
                  {competitor.name}
                </span>
                <SpriteIcon
                  name="chevron-right"
                  className="size-3.5 shrink-0 text-mist-300 transition-colors group-hover:text-mist-600"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
      </div>
    </section>
  );
}
