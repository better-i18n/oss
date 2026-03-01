import { IconCheckmark1, IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { Link } from "@tanstack/react-router";

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
  return (
    <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-3 bg-mist-50 border-b border-mist-200">
        <div className="p-4 text-sm font-medium text-mist-600">{featureLabel ?? "Feature"}</div>
        <div className="p-4 text-sm font-medium text-mist-950 text-center border-l border-mist-200 bg-mist-100">
          Better i18n
        </div>
        <div className="p-4 text-sm font-medium text-mist-600 text-center border-l border-mist-200">
          {competitorName}
        </div>
      </div>

      {/* Rows */}
      {features.map((feature, index) => (
        <div
          key={index}
          className={`grid grid-cols-3 border-b border-mist-100 last:border-b-0 ${
            feature.highlight ? "bg-emerald-50/50" : ""
          }`}
        >
          <div className="p-4 text-sm text-mist-700">{feature.name}</div>
          <div className="p-4 text-center border-l border-mist-100 bg-mist-50/50">
            <FeatureValue value={feature.betterI18n} highlight />
          </div>
          <div className="p-4 text-center border-l border-mist-100">
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
      <IconCheckmark1 className={`w-5 h-5 mx-auto ${highlight ? "text-emerald-600" : "text-mist-400"}`} />
    ) : (
      <span className="w-5 h-5 mx-auto text-mist-300 flex items-center justify-center text-lg font-light">—</span>
    );
  }
  return <span className={`text-sm ${highlight ? "text-mist-950 font-medium" : "text-mist-600"}`}>{value}</span>;
}

interface ComparisonHeroProps {
  competitorName: string;
  competitorLogo?: string;
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
  secondaryCTA?: string;
  secondaryHref?: string;
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
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{link.title}</h3>
                <p className="text-xs text-mist-500 mt-1">{link.description}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
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
];

interface OtherComparisonsProps {
  currentSlug: string;
  locale: string;
  title: string;
}

export function OtherComparisons({ currentSlug, locale, title }: OtherComparisonsProps) {
  const others = allComparisons.filter((c) => c.slug !== currentSlug);

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
              to={`/$locale/compare/${competitor.slug}` as "/$locale/compare/crowdin" | "/$locale/compare/lokalise" | "/$locale/compare/phrase" | "/$locale/compare/transifex"}
              params={{ locale }}
              className="group flex items-center justify-between rounded-xl border border-mist-200 bg-white p-4 hover:border-mist-300 hover:shadow-md transition-all"
            >
              <span className="text-sm font-medium text-mist-950">
                Better i18n vs {competitor.name}
              </span>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
