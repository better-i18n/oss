import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, formatStructuredData, createPageLoader } from "@/lib/page-seo";
import { getOrganizationSchema, getComparisonSchema } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/meta";
import { useT } from "@/lib/i18n";
import { ClosingCta, Divider, PageHero, Section, SectionHeader } from "@/components/ui/page";
import { CompetitorMark, type CompetitorKey } from "@/components/icons/CompetitorMarks";
import { SupportMark, markState } from "@/components/SupportMark";
import { featureIcon } from "@/components/icons/feature-icons";

/** Compare routes as literals. A template path (`/$locale/compare/${slug}`) is
    untypeable — the router's `to` union only holds concrete paths — so a typo in
    a slug used to compile fine and ship a dead link. */
const COMPARE_ROUTES = {
  crowdin: "/$locale/compare/crowdin/",
  lokalise: "/$locale/compare/lokalise/",
  phrase: "/$locale/compare/phrase/",
  transifex: "/$locale/compare/transifex/",
  smartling: "/$locale/compare/smartling/",
  xtm: "/$locale/compare/xtm/",
} as const;


export const Route = createFileRoute("/$locale/compare/")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    const comparisonListSchema = getComparisonSchema({
      title: "Better I18N Alternatives Comparison",
      description: "Compare Better I18N with top translation management platforms.",
      items: [
        { name: "Crowdin", description: "Cloud-based TMS for agile teams", url: `${SITE_URL}/en/compare/crowdin` },
        { name: "Lokalise", description: "Translation and localization platform", url: `${SITE_URL}/en/compare/lokalise` },
        { name: "Phrase", description: "Enterprise localization platform", url: `${SITE_URL}/en/compare/phrase` },
        { name: "Transifex", description: "Localization platform for digital content", url: `${SITE_URL}/en/compare/transifex` },
      ],
    });

    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "compare",
      pathname: "/compare",
      customStructuredData: formatStructuredData([getOrganizationSchema({ locale: loaderData?.locale }), comparisonListSchema]),
    });
  },
  component: ComparePage,
});

const competitors = [
  { key: "crowdin", name: "Crowdin", slug: "crowdin", defaultDesc: "See how Better I18N compares to Crowdin for developer-first localization workflows.", defaultHighlight: "AI-native translations" },
  { key: "lokalise", name: "Lokalise", slug: "lokalise", defaultDesc: "Compare Better I18N with Lokalise for modern app localization and deployment.", defaultHighlight: "Built-in CDN delivery" },
  { key: "phrase", name: "Phrase", slug: "phrase", defaultDesc: "See how Better I18N compares to Phrase for enterprise translation management.", defaultHighlight: "Developer-first platform" },
  { key: "transifex", name: "Transifex", slug: "transifex", defaultDesc: "Compare Better I18N with Transifex for open-source and SaaS localization.", defaultHighlight: "Free tier available" },
];

const COMPETITOR_COLUMNS = ["Crowdin", "Lokalise", "Phrase", "Transifex"] as const;

/** Column order of every `MATRIX_ROWS.values` array, used as the cell key. */
const MATRIX_COLUMNS = ["Better I18N", ...COMPETITOR_COLUMNS] as const;

/** values[0] is Better I18N; the rest follow COMPETITOR_COLUMNS order. */
const MATRIX_ROWS = [
  { key: "freeTier", values: ["\u2713", "\u2713", "\u2717", "\u2717", "\u2717"] },
  { key: "cdn", values: ["\u2713", "\u2717", "\u2717", "\u2717", "\u2717"] },
  { key: "mcp", values: ["\u2713", "\u2717", "\u2717", "\u2717", "\u2717"] },
  { key: "ai", values: ["\u2713", "\u2713", "\u2713", "\u2713", "\u2713"] },
  { key: "git", values: ["\u2713", "\u2713", "\u2713", "\u2713", "~"] },
  { key: "cli", values: ["\u2713", "\u2713", "\u2713", "\u2713", "~"] },
  { key: "ota", values: ["\u2713", "\u2717", "\u2717", "\u2717", "\u2717"] },
  { key: "typesafe", values: ["\u2713", "\u2717", "\u2717", "\u2717", "\u2717"] },
  { key: "mobile", values: ["\u2713", "\u2713", "\u2713", "\u2713", "~"] },
  { key: "price", values: ["$0/mo", "$40/mo", "$140/mo", "$1,245/mo", "$150/mo"] },
] as const;

function ComparePage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();
  /* Screen-reader names for the three mark states. The glyphs in MATRIX_ROWS are
     data, not text, so the tile needs a translated label of its own. */
  const markLabels = {
    yes: t("compare.marks.yes"),
    no: t("compare.marks.no"),
    partial: t("compare.marks.partial"),
  };

  return (
    <MarketingLayout showCTA={false}>
      <PageHero
        pillar="mcp"
        pillarLabel={t("compare.index.hero.badge")}
        titleId="compare-hero-title"
        title={t("compare.index.hero.title")}
        subtitle={t("compare.index.hero.subtitle")}
        primary={{
          label: t("compare.index.hero.ctaPrimary"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("compare.index.hero.ctaSecondary"),
          href: `/${locale}/pricing/`,
        }}
      />

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("compare.index.featureMatrix.eyebrow")}
          title={t("compare.index.featureMatrix.title")}
          subtitle={t("compare.index.featureMatrix.subtitle")}
        />

        {/* Hairline matrix. The previous version tinted the Better I18N column
            emerald on every cell and zebra-striped the rows — two decorative
            signals layered on the data. Here the only emphasis is ink weight:
            our column is mist-900, competitors mist-500, a missing capability
            mist-300. */}
        <div className="mt-8 overflow-x-auto rounded-xl border border-black/[0.07]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.06]">
                <th className="w-48 px-5 py-3 text-left text-[11px] font-medium text-mist-400">
                  {t("compare.index.featureMatrix.columnFeature")}
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-medium text-mist-900">
                  Better I18N
                </th>
                {COMPETITOR_COLUMNS.map((name) => (
                  <th
                    key={name}
                    className="px-4 py-3 text-[11px] font-medium text-mist-400"
                  >
                    {/* The mark makes each column identifiable at a glance in a
                        10-row matrix, and it treats the competitor as a peer
                        rather than a bare string. */}
                    <span className="flex items-center justify-center gap-1.5">
                      <CompetitorMark
                        competitor={name.toLowerCase() as CompetitorKey}
                        size={18}
                      />
                      {name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX_ROWS.map((row) => {
                const icon = featureIcon(row.key);
                return (
                  <tr key={row.key} className="border-b border-black/[0.05] last:border-0">
                    <td className="px-5 py-3 text-[13px] text-mist-700">
                      <span className="flex items-start gap-2.5">
                        {icon && (
                          <SpriteIcon
                            name={icon}
                            className="mt-px size-3.5 shrink-0 text-mist-400"
                            aria-hidden="true"
                          />
                        )}
                        <span className="min-w-0">
                          {t(`compare.index.featureMatrix.rows.${row.key}`)}
                        </span>
                      </span>
                    </td>
                    {/* Iterate the COLUMNS, not the values array: the column
                        name is a stable key, an array index is not. */}
                    {MATRIX_COLUMNS.map((column, idx) => {
                      const value = row.values[idx];
                      if (value === undefined) return null;
                      const state = markState(value);
                      return (
                        <td
                          key={column}
                          className={`px-4 py-3 text-center text-[13px] tabular-nums ${
                            idx === 0 ? "font-medium text-mist-900" : "text-mist-500"
                          }`}
                        >
                          {/* Booleans get the shared hairline tile so the matrix
                              reads like every other check on the site; a value
                              with content (a price) stays plain text. */}
                          {state ? (
                            <span className="inline-flex justify-center">
                              <SupportMark state={state} label={markLabels[state]} />
                            </span>
                          ) : (
                            value
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-mist-400">
          {t("compare.index.featureMatrix.note")}
        </p>
      </Section>

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("compare.index.competitors.eyebrow")}
          title={t("compare.index.competitors.title")}
          subtitle={t("compare.index.competitors.subtitle")}
        />
        <div className="mt-8 overflow-hidden rounded-xl border border-black/[0.07]">
          <div className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2">
            {competitors.map((competitor) => (
              <Link
                key={competitor.slug}
                to={COMPARE_ROUTES[competitor.slug as keyof typeof COMPARE_ROUTES]}
                params={{ locale }}
                className="group flex flex-col gap-3 border-t border-l border-black/[0.05] px-5 py-4 transition-colors hover:bg-black/[0.02]"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="flex items-center gap-2.5 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                    <CompetitorMark competitor={competitor.key as CompetitorKey} size={24} />
                    Better I18N vs {competitor.name}
                  </h3>
                  <SpriteIcon
                    name="arrow-right"
                    className="size-4 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600"
                  />
                </div>
                <p className="text-[13px] leading-relaxed text-mist-600">
                  {t(`compare.index.competitors.${competitor.key}.description`)}
                </p>
                <span className="mt-auto text-[11px] font-medium text-mist-400">
                  {t(`compare.index.competitors.${competitor.key}.highlight`)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      <ClosingCta
        eyebrow={t("compare.index.closing.eyebrow")}
        title={t("compare.index.closing.title")}
        subtitle={t("compare.index.closing.subtitle")}
        primary={{
          label: t("compare.index.closing.ctaPrimary"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("compare.index.closing.ctaSecondary"),
          href: "https://cal.com/better-i18n/30min?overlayCalendar=true",
        }}
      />
    </MarketingLayout>
  );
}
