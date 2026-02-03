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
  IconZap,
  IconRocket,
  IconArrowRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/compare/transifex")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "compareTransifex",
      pathname: "/compare/transifex",
      pageType: "comparison",
      structuredDataOptions: { competitorName: "Transifex" },
    });
  },
  component: TransifexComparisonPage,
});

function TransifexComparisonPage() {
  const t = useTranslations("marketing");
  const { locale } = Route.useParams();

  const features: ComparisonFeature[] = [
    { name: t("compare.transifex.features.gitIntegration"), betterI18n: true, competitor: true },
    { name: t("compare.transifex.features.aiTranslation"), betterI18n: true, competitor: true },
    { name: t("compare.transifex.features.mcpSupport"), betterI18n: true, competitor: false, highlight: true },
    { name: t("compare.transifex.features.cdnDelivery"), betterI18n: true, competitor: true },
    { name: t("compare.transifex.features.liveTranslation"), betterI18n: false, competitor: true },
    { name: t("compare.transifex.features.astKeyDiscovery"), betterI18n: true, competitor: false, highlight: true },
    { name: t("compare.transifex.features.pricing"), betterI18n: t("compare.transifex.features.pricingBetter"), competitor: t("compare.transifex.features.pricingTransifex") },
    { name: t("compare.transifex.features.freeForOpenSource"), betterI18n: true, competitor: true },
    { name: t("compare.transifex.features.modernStack"), betterI18n: true, competitor: false, highlight: true },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <ComparisonHero
        competitorName="Transifex"
        title={t("compare.transifex.hero.title")}
        subtitle={t("compare.transifex.hero.subtitle")}
      />

      {/* Comparison Table */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <ComparisonTable competitorName="Transifex" features={features} />
        </div>
      </section>

      {/* Why Better i18n */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-12">
            {t("compare.transifex.whyBetter.title")}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Differentiator
              icon={<IconZap className="w-5 h-5" />}
              title={t("compare.transifex.whyBetter.modern.title")}
              description={t("compare.transifex.whyBetter.modern.description")}
            />
            <Differentiator
              icon={<IconRobot className="w-5 h-5" />}
              title={t("compare.transifex.whyBetter.mcpNative.title")}
              description={t("compare.transifex.whyBetter.mcpNative.description")}
            />
            <Differentiator
              icon={<IconRocket className="w-5 h-5" />}
              title={t("compare.transifex.whyBetter.pricing.title")}
              description={t("compare.transifex.whyBetter.pricing.description")}
            />
            <Differentiator
              icon={<IconCode className="w-5 h-5" />}
              title={t("compare.transifex.whyBetter.developerFirst.title")}
              description={t("compare.transifex.whyBetter.developerFirst.description")}
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
        currentSlug="transifex"
        locale={locale}
        title={t("compare.otherComparisons")}
      />

      {/* CTA */}
      <CTASection
        title={t("compare.transifex.cta.title")}
        subtitle={t("compare.transifex.cta.subtitle")}
        primaryCTA={t("compare.transifex.cta.button")}
        primaryHref={`/${locale}`}
      />
    </MarketingLayout>
  );
}
