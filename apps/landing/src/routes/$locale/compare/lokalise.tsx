import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import {
  ComparisonTable,
  ComparisonHero,
  Differentiator,
  CTASection,
  OtherComparisons,
  type ComparisonFeature,
} from "@/components/ComparisonTable";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconCode,
  IconRobot,
  IconGithub,
  IconRocket,
  IconArrowRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/compare/lokalise")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "compareLokalise",
      pathname: "/compare/lokalise",
      pageType: "comparison",
      structuredDataOptions: { competitorName: "Lokalise" },
    });
  },
  component: LokaliseComparisonPage,
});

function LokaliseComparisonPage() {
  const t = useTranslations("marketing");
  const { locale } = Route.useParams();

  const features: ComparisonFeature[] = [
    { name: t("compare.lokalise.features.gitIntegration"), betterI18n: true, competitor: true },
    { name: t("compare.lokalise.features.aiTranslation"), betterI18n: true, competitor: true },
    { name: t("compare.lokalise.features.mcpSupport"), betterI18n: true, competitor: false, highlight: true },
    { name: t("compare.lokalise.features.cdnDelivery"), betterI18n: true, competitor: true },
    { name: t("compare.lokalise.features.figmaPlugin"), betterI18n: false, competitor: true },
    { name: t("compare.lokalise.features.astKeyDiscovery"), betterI18n: true, competitor: false, highlight: true },
    { name: t("compare.lokalise.features.pricing"), betterI18n: t("compare.lokalise.features.pricingBetter"), competitor: t("compare.lokalise.features.pricingLokalise") },
    { name: t("compare.lokalise.features.freeForOpenSource"), betterI18n: true, competitor: false, highlight: true },
    { name: t("compare.lokalise.features.developerFirst"), betterI18n: true, competitor: false, highlight: true },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <ComparisonHero
        competitorName="Lokalise"
        title={t("compare.lokalise.hero.title")}
        subtitle={t("compare.lokalise.hero.subtitle")}
      />

      {/* Comparison Table */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <ComparisonTable competitorName="Lokalise" features={features} />
        </div>
      </section>

      {/* Why Better i18n */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-12">
            {t("compare.lokalise.whyBetter.title")}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Differentiator
              icon={<IconRocket className="w-5 h-5" />}
              title={t("compare.lokalise.whyBetter.pricing.title")}
              description={t("compare.lokalise.whyBetter.pricing.description")}
            />
            <Differentiator
              icon={<IconRobot className="w-5 h-5" />}
              title={t("compare.lokalise.whyBetter.mcpNative.title")}
              description={t("compare.lokalise.whyBetter.mcpNative.description")}
            />
            <Differentiator
              icon={<IconCode className="w-5 h-5" />}
              title={t("compare.lokalise.whyBetter.developerFirst.title")}
              description={t("compare.lokalise.whyBetter.developerFirst.description")}
            />
            <Differentiator
              icon={<IconGithub className="w-5 h-5" />}
              title={t("compare.lokalise.whyBetter.gitFirst.title")}
              description={t("compare.lokalise.whyBetter.gitFirst.description")}
            />
          </div>
        </div>
      </section>

      {/* Related Topics */}
      <section className="py-12 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-lg font-medium text-mist-950 mb-6">{t("whatIs.relatedTopics")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/$locale/i18n/best-tms"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.bestTms")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.bestTmsDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/what-is-localization"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.l10n")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.l10nDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/for-developers"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("i18n.relatedLinks.forDevelopers")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("i18n.relatedLinks.forDevelopersDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

      {/* Other Comparisons */}
      <OtherComparisons
        currentSlug="lokalise"
        locale={locale}
        title={t("compare.otherComparisons")}
      />

      {/* CTA */}
      <CTASection
        title={t("compare.lokalise.cta.title")}
        subtitle={t("compare.lokalise.cta.subtitle")}
        primaryCTA={t("compare.lokalise.cta.button")}
        primaryHref={`/${locale}`}
      />
    </MarketingLayout>
  );
}
