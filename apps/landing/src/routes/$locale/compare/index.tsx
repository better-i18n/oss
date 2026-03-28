import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, formatStructuredData, createPageLoader } from "@/lib/page-seo";
import { getOrganizationSchema, getComparisonSchema } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/meta";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/compare/")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    const comparisonListSchema = getComparisonSchema({
      title: "Better i18n Alternatives Comparison",
      description: "Compare Better i18n with top translation management platforms.",
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
  { key: "crowdin", name: "Crowdin", slug: "crowdin", defaultDesc: "See how Better i18n compares to Crowdin for developer-first localization workflows.", defaultHighlight: "AI-native translations" },
  { key: "lokalise", name: "Lokalise", slug: "lokalise", defaultDesc: "Compare Better i18n with Lokalise for modern app localization and deployment.", defaultHighlight: "Built-in CDN delivery" },
  { key: "phrase", name: "Phrase", slug: "phrase", defaultDesc: "See how Better i18n compares to Phrase for enterprise translation management.", defaultHighlight: "Developer-first platform" },
  { key: "transifex", name: "Transifex", slug: "transifex", defaultDesc: "Compare Better i18n with Transifex for open-source and SaaS localization.", defaultHighlight: "Free tier available" },
];

function ComparePage() {
  const t = useT("marketing.compare.index");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={true}>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Compare Better i18n" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "See how Better i18n stacks up against other localization platforms." })}
            </p>
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
            {t("featureMatrix.title", { defaultValue: "Feature comparison" })}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-mist-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-mist-200 bg-mist-50">
                  <th className="text-left px-5 py-3 font-medium text-mist-700 w-48">Feature</th>
                  <th className="text-center px-4 py-3 font-semibold text-emerald-700 bg-emerald-50/60">Better i18n</th>
                  <th className="text-center px-4 py-3 font-medium text-mist-600">Crowdin</th>
                  <th className="text-center px-4 py-3 font-medium text-mist-600">Lokalise</th>
                  <th className="text-center px-4 py-3 font-medium text-mist-600">Phrase</th>
                  <th className="text-center px-4 py-3 font-medium text-mist-600">Transifex</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Free tier", better: "✓", crowdin: "✓", lokalise: "✗", phrase: "✗", transifex: "✗" },
                  { feature: "CDN delivery", better: "✓", crowdin: "✗", lokalise: "✗", phrase: "✗", transifex: "✗" },
                  { feature: "MCP support", better: "✓", crowdin: "✗", lokalise: "✗", phrase: "✗", transifex: "✗" },
                  { feature: "AI translation", better: "✓", crowdin: "✓", lokalise: "✓", phrase: "✓", transifex: "✓" },
                  { feature: "Git sync", better: "✓", crowdin: "✓", lokalise: "✓", phrase: "✓", transifex: "~" },
                  { feature: "CLI tool", better: "✓", crowdin: "✓", lokalise: "✓", phrase: "✓", transifex: "~" },
                  { feature: "OTA updates", better: "✓", crowdin: "✗", lokalise: "✗", phrase: "✗", transifex: "✗" },
                  { feature: "Type-safe SDKs", better: "✓", crowdin: "✗", lokalise: "✗", phrase: "✗", transifex: "✗" },
                  { feature: "Mobile SDKs", better: "✓", crowdin: "✓", lokalise: "✓", phrase: "✓", transifex: "~" },
                  { feature: "Starting price", better: "$0/mo", crowdin: "$40/mo", lokalise: "$140/mo", phrase: "$385/mo", transifex: "$150/mo" },
                ].map((row, i) => (
                  <tr key={row.feature} className={`border-b border-mist-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-mist-50/30"}`}>
                    <td className="px-5 py-3 font-medium text-mist-800">{row.feature}</td>
                    <td className={`text-center px-4 py-3 font-medium bg-emerald-50/40 ${row.better === "✓" ? "text-emerald-700" : row.better.startsWith("$") ? "text-mist-950" : "text-mist-400"}`}>{row.better}</td>
                    <td className={`text-center px-4 py-3 ${row.crowdin === "✓" ? "text-emerald-600" : row.crowdin === "✗" ? "text-mist-300" : row.crowdin.startsWith("$") ? "text-mist-700" : "text-mist-500"}`}>{row.crowdin}</td>
                    <td className={`text-center px-4 py-3 ${row.lokalise === "✓" ? "text-emerald-600" : row.lokalise === "✗" ? "text-mist-300" : row.lokalise.startsWith("$") ? "text-mist-700" : "text-mist-500"}`}>{row.lokalise}</td>
                    <td className={`text-center px-4 py-3 ${row.phrase === "✓" ? "text-emerald-600" : row.phrase === "✗" ? "text-mist-300" : row.phrase.startsWith("$") ? "text-mist-700" : "text-mist-500"}`}>{row.phrase}</td>
                    <td className={`text-center px-4 py-3 ${row.transifex === "✓" ? "text-emerald-600" : row.transifex === "✗" ? "text-mist-300" : row.transifex.startsWith("$") ? "text-mist-700" : "text-mist-500"}`}>{row.transifex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-mist-500">~ = partial support. Pricing as of 2026, subject to change.</p>
        </div>
      </section>

      {/* Competitors Grid */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {competitors.map((competitor) => (
              <Link
                key={competitor.slug}
                to={`/$locale/compare/${competitor.slug}`}
                params={{ locale }}
                className="group relative flex flex-col rounded-2xl border border-mist-200 bg-white p-6 hover:border-mist-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-mist-950">
                      Better i18n vs {competitor.name}
                    </h3>
                    <p className="mt-1 text-sm text-mist-600">
                      {t(`competitors.${competitor.key}.description`, { defaultValue: competitor.defaultDesc })}
                    </p>
                  </div>
                  <SpriteIcon name="arrow-right" className="w-5 h-5 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="mt-4 pt-4 border-t border-mist-100">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {t(`competitors.${competitor.key}.highlight`, { defaultValue: competitor.defaultHighlight })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
