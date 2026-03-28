import { SpriteIcon } from "@/components/SpriteIcon";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export interface ComparisonFeature {
  name: string;
  betterI18n: boolean | string;
  competitor: boolean | string;
  highlight?: boolean;
}

interface ComparisonTableProps {
  competitorName: string;
  features: ComparisonFeature[];
  featureLabel?: string;
}

export function ComparisonTable({ competitorName, features, featureLabel }: ComparisonTableProps) {
  const t = useT("compare");
  const defaultFeatureLabel = t("featureColumn", { defaultValue: "Feature" });
  return (
    <div role="table" aria-label={`Feature comparison: Better i18n vs ${competitorName}`} className="overflow-hidden rounded-2xl border border-mist-200 bg-white">
      {/* Header */}
      <div role="row" className="grid grid-cols-3 bg-mist-50 border-b border-mist-200">
        <div role="columnheader" className="p-4 text-sm font-medium text-mist-600">{featureLabel ?? defaultFeatureLabel}</div>
        <div role="columnheader" className="p-4 text-sm font-medium text-mist-950 text-center border-l border-mist-200 bg-mist-100">
          Better i18n
        </div>
        <div role="columnheader" className="p-4 text-sm font-medium text-mist-600 text-center border-l border-mist-200">
          {competitorName}
        </div>
      </div>

      {/* Rows */}
      {features.map((feature, index) => (
        <div
          key={index}
          role="row"
          className={`grid grid-cols-3 border-b border-mist-100 last:border-b-0 ${
            feature.highlight ? "bg-emerald-50/50" : ""
          }`}
        >
          <div role="cell" className="p-4 text-sm text-mist-700">{feature.name}</div>
          <div role="cell" className="p-4 text-center border-l border-mist-100 bg-mist-50/50">
            <FeatureValue value={feature.betterI18n} highlight />
          </div>
          <div role="cell" className="p-4 text-center border-l border-mist-100">
            <FeatureValue value={feature.competitor} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureValue({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span role="img" aria-label="Yes">
        <SpriteIcon name="checkmark" className={`w-5 h-5 mx-auto ${highlight ? "text-emerald-600" : "text-mist-400"}`} aria-hidden="true" />
      </span>
    ) : (
      <span className="w-5 h-5 mx-auto text-mist-300 flex items-center justify-center text-lg font-light" aria-label="No">—</span>
    );
  }
  return <span className={`text-sm ${highlight ? "text-mist-950 font-medium" : "text-mist-600"}`}>{value}</span>;
}

// ─── Multi-competitor comparison ─────────────────────────────────────

export interface MultiComparisonFeature {
  readonly name: string;
  readonly values: ReadonlyMap<string, boolean | string>;
  readonly highlight?: boolean;
}

interface MultiComparisonTableProps {
  readonly competitors: readonly string[];
  readonly features: readonly MultiComparisonFeature[];
  readonly featureLabel?: string;
}

export function MultiComparisonTable({ competitors, features, featureLabel }: MultiComparisonTableProps) {
  const t = useT("compare");
  const defaultFeatureLabel = t("featureColumn", { defaultValue: "Feature" });
  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <div
        role="table"
        aria-label={`Feature comparison: ${competitors.join(" vs ")}`}
        className="overflow-hidden rounded-2xl border border-mist-200 bg-white min-w-[640px]"
      >
        {/* Header */}
        <div
          role="row"
          className="grid bg-mist-50 border-b border-mist-200"
          style={{ gridTemplateColumns: `minmax(180px, 2fr) repeat(${competitors.length}, minmax(100px, 1fr))` }}
        >
          <div role="columnheader" className="p-4 text-sm font-medium text-mist-600">
            {featureLabel ?? defaultFeatureLabel}
          </div>
          {competitors.map((name, i) => (
            <div
              key={name}
              role="columnheader"
              className={`p-4 text-sm font-medium text-center border-l border-mist-200 ${
                i === 0 ? "text-mist-950 bg-mist-100" : "text-mist-600"
              }`}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Rows */}
        {features.map((feature, index) => (
          <div
            key={index}
            role="row"
            className={`grid border-b border-mist-100 last:border-b-0 ${
              feature.highlight ? "bg-emerald-50/50" : ""
            }`}
            style={{ gridTemplateColumns: `minmax(180px, 2fr) repeat(${competitors.length}, minmax(100px, 1fr))` }}
          >
            <div role="cell" className="p-4 text-sm text-mist-700">{feature.name}</div>
            {competitors.map((name, i) => (
              <div
                key={name}
                role="cell"
                className={`p-4 text-center border-l border-mist-100 ${i === 0 ? "bg-mist-50/50" : ""}`}
              >
                <FeatureValue value={feature.values.get(name) ?? false} highlight={i === 0} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Three-way comparison hero ──────────────────────────────────────

interface ThreeWayHeroProps {
  readonly competitors: readonly string[];
  readonly title: string;
  readonly subtitle: string;
}

export function ThreeWayHero({ competitors, title, subtitle }: ThreeWayHeroProps) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
            {competitors.map((name, i) => (
              <span key={name}>
                {i > 0 && <span className="mx-1">vs</span>}
                <span className="font-medium">{name}</span>
              </span>
            ))}
          </div>

          <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
            {title}
          </h1>
          <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing comparison table ───────────────────────────────────────

export interface PricingRow {
  readonly label: string;
  readonly values: readonly string[];
  readonly highlight?: boolean;
}

interface PricingComparisonProps {
  readonly title: string;
  readonly subtitle: string;
  readonly columns: readonly string[];
  readonly rows: readonly PricingRow[];
}

export function PricingComparisonTable({ title, subtitle, columns, rows }: PricingComparisonProps) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-4">
          {title}
        </h2>
        <p className="text-mist-600 mb-10">{subtitle}</p>

        <div className="overflow-x-auto -mx-6 px-6">
          <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white min-w-[540px]">
            {/* Header */}
            <div
              className="grid bg-mist-50 border-b border-mist-200"
              style={{ gridTemplateColumns: `minmax(160px, 1.5fr) repeat(${columns.length}, minmax(100px, 1fr))` }}
            >
              <div className="p-4" />
              {columns.map((col, i) => (
                <div
                  key={col}
                  className={`p-4 text-sm font-medium text-center border-l border-mist-200 ${
                    i === 0 ? "text-mist-950 bg-mist-100" : "text-mist-600"
                  }`}
                >
                  {col}
                </div>
              ))}
            </div>

            {/* Rows */}
            {rows.map((row, index) => (
              <div
                key={index}
                className={`grid border-b border-mist-100 last:border-b-0 ${
                  row.highlight ? "bg-emerald-50/50" : ""
                }`}
                style={{ gridTemplateColumns: `minmax(160px, 1.5fr) repeat(${columns.length}, minmax(100px, 1fr))` }}
              >
                <div className="p-4 text-sm text-mist-700 font-medium">{row.label}</div>
                {row.values.map((val, i) => (
                  <div
                    key={i}
                    className={`p-4 text-sm text-center border-l border-mist-100 ${
                      i === 0 ? "bg-mist-50/50 text-mist-950 font-medium" : "text-mist-600"
                    }`}
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

// ─── DX Comparison section ──────────────────────────────────────────

export interface DxComparisonItem {
  readonly category: string;
  readonly items: readonly {
    readonly label: string;
    readonly values: ReadonlyMap<string, boolean | string>;
  }[];
}

interface DxComparisonProps {
  readonly title: string;
  readonly competitors: readonly string[];
  readonly categories: readonly DxComparisonItem[];
}

export function DxComparison({ title, competitors, categories }: DxComparisonProps) {
  return (
    <section className="py-16 sm:py-24 bg-mist-50">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-10">
          {title}
        </h2>
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-lg font-medium text-mist-950 mb-4">{cat.category}</h3>
              <div className="overflow-x-auto -mx-6 px-6">
                <div className="overflow-hidden rounded-xl border border-mist-200 bg-white min-w-[540px]">
                  {cat.items.map((item, i) => (
                    <div
                      key={i}
                      className="grid border-b border-mist-100 last:border-b-0"
                      style={{ gridTemplateColumns: `minmax(160px, 1.5fr) repeat(${competitors.length}, minmax(100px, 1fr))` }}
                    >
                      <div className="p-3 text-sm text-mist-700">{item.label}</div>
                      {competitors.map((name, ci) => (
                        <div
                          key={name}
                          className={`p-3 text-center border-l border-mist-100 ${ci === 0 ? "bg-mist-50/50" : ""}`}
                        >
                          <FeatureValue value={item.values.get(name) ?? false} highlight={ci === 0} />
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

// ─── Migration section ──────────────────────────────────────────────

interface MigrationSectionProps {
  readonly title: string;
  readonly subtitle: string;
  readonly steps: readonly { readonly title: string; readonly description: string }[];
}

export function MigrationSection({ title, subtitle, steps }: MigrationSectionProps) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-4">
          {title}
        </h2>
        <p className="text-mist-600 mb-10">{subtitle}</p>
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-mist-950 text-white flex items-center justify-center text-sm font-medium">
                {i + 1}
              </div>
              <div>
                <h3 className="text-base font-medium text-mist-950">{step.title}</h3>
                <p className="mt-1 text-sm text-mist-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
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
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
            <span>vs</span>
            <span className="font-medium">{competitorName}</span>
          </div>

          <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
            {title}
          </h1>
          <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}

interface DifferentiatorProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function Differentiator({ title, description, icon }: DifferentiatorProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-600">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-medium text-mist-950">{title}</h3>
        <p className="mt-1 text-sm text-mist-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryCTA: string;
  primaryHref: string;
}

export function CTASection({ title, subtitle, primaryCTA, primaryHref }: CTASectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-mist-950 rounded-3xl mx-6 lg:mx-10 mb-16">
      <div className="mx-auto max-w-2xl text-center px-6">
        <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
          {title}
        </h2>
        <p className="mt-4 text-lg text-mist-300">{subtitle}</p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href={primaryHref}
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
          >
            {primaryCTA}
          </a>
        </div>
      </div>
    </section>
  );
}

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

export function ComparisonRelatedTopics({ heading, links, locale }: ComparisonRelatedTopicsProps) {
  return (
    <section className="py-12 border-t border-mist-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-lg font-medium text-mist-950 mb-6">{heading}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to as never}
              params={{ locale } as never}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{link.title}</h3>
                <p className="text-xs text-mist-500 mt-1">{link.description}</p>
              </div>
              <SpriteIcon name="arrow-right" className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const allComparisons = [
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
  const vsLabelTemplate = t("vsLabel", { defaultValue: "Better i18n vs {name}" });

  return (
    <section className="py-16 border-t border-mist-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-mist-950 mb-8">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {others.map((competitor) => (
            <Link
              key={competitor.slug}
              to={`/$locale/compare/${competitor.slug}` as "/$locale/compare/crowdin" | "/$locale/compare/lokalise" | "/$locale/compare/phrase" | "/$locale/compare/transifex" | "/$locale/compare/smartling" | "/$locale/compare/xtm"}
              params={{ locale }}
              className="group flex items-center justify-between rounded-xl border border-mist-200 bg-white p-4 hover:border-mist-300 hover:shadow-md transition-all"
            >
              <span className="text-sm font-medium text-mist-950">
                {vsLabelTemplate.replace("{name}", competitor.name)}
              </span>
              <SpriteIcon name="arrow-right" className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
