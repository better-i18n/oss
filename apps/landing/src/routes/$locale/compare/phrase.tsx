import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import {
  ComparisonTable,
  ComparisonHero,
  Differentiator,
  CTASection,
  OtherComparisons,
  ComparisonRelatedTopics,
  type ComparisonFeature,
} from "@/components/ComparisonTable";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCode,
  IconRobot,
  IconZap,
  IconRocket,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/compare/phrase")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "comparePhrase",
      pathname: "/compare/phrase",
      pageType: "comparison",
      structuredDataOptions: { competitorName: "Phrase" },
    });
  },
  component: PhraseComparisonPage,
});

function PhraseComparisonPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features: ComparisonFeature[] = [
    { name: t("compare.phrase.features.gitIntegration"), betterI18n: true, competitor: true },
    { name: t("compare.phrase.features.aiTranslation"), betterI18n: true, competitor: true },
    { name: t("compare.phrase.features.mcpSupport"), betterI18n: true, competitor: false, highlight: true },
    { name: t("compare.phrase.features.cdnDelivery"), betterI18n: true, competitor: true },
    { name: t("compare.phrase.features.enterpriseFeatures"), betterI18n: false, competitor: true },
    { name: t("compare.phrase.features.astKeyDiscovery"), betterI18n: true, competitor: false, highlight: true },
    { name: t("compare.phrase.features.pricing"), betterI18n: t("compare.phrase.features.pricingBetter"), competitor: t("compare.phrase.features.pricingPhrase") },
    { name: t("compare.phrase.features.freeForOpenSource"), betterI18n: true, competitor: false, highlight: true },
    { name: t("compare.phrase.features.setupComplexity"), betterI18n: t("compare.phrase.features.setupSimple"), competitor: t("compare.phrase.features.setupComplex") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <ComparisonHero
        competitorName="Phrase"
        title={t("compare.phrase.hero.title")}
        subtitle={t("compare.phrase.hero.subtitle")}
      />

      {/* Comparison Table */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <ComparisonTable competitorName="Phrase" features={features} featureLabel={t("compare.featureLabel")} />
        </div>
      </section>

      {/* Why Better i18n */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-12">
            {t("compare.phrase.whyBetter.title")}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Differentiator
              icon={<IconRocket className="w-5 h-5" />}
              title={t("compare.phrase.whyBetter.pricing.title")}
              description={t("compare.phrase.whyBetter.pricing.description")}
            />
            <Differentiator
              icon={<IconZap className="w-5 h-5" />}
              title={t("compare.phrase.whyBetter.simplicity.title")}
              description={t("compare.phrase.whyBetter.simplicity.description")}
            />
            <Differentiator
              icon={<IconRobot className="w-5 h-5" />}
              title={t("compare.phrase.whyBetter.mcpNative.title")}
              description={t("compare.phrase.whyBetter.mcpNative.description")}
            />
            <Differentiator
              icon={<IconCode className="w-5 h-5" />}
              title={t("compare.phrase.whyBetter.developerFirst.title")}
              description={t("compare.phrase.whyBetter.developerFirst.description")}
            />
          </div>
        </div>
      </section>

      <ComparisonRelatedTopics
        heading={t("compare.phrase.relatedTopics", { defaultValue: "Related Resources" })}
        locale={locale}
        links={[
          { to: "/$locale/what-is-localization", title: t("compare.phrase.related.l10n", { defaultValue: "What is Localization?" }), description: t("compare.phrase.related.l10nDesc", { defaultValue: "Understanding l10n for enterprise teams" }) },
          { to: "/$locale/features", title: t("compare.phrase.related.features", { defaultValue: "Platform Features" }), description: t("compare.phrase.related.featuresDesc", { defaultValue: "See the full Better i18n feature set" }) },
          { to: "/$locale/for-developers", title: t("compare.phrase.related.forDevs", { defaultValue: "For Developers" }), description: t("compare.phrase.related.forDevsDesc", { defaultValue: "Developer-first localization workflows" }) },
        ]}
      />

      {/* Other Comparisons */}
      <OtherComparisons
        currentSlug="phrase"
        locale={locale}
        title={t("compare.otherComparisons")}
      />

      {/* CTA */}
      <CTASection
        title={t("compare.phrase.cta.title")}
        subtitle={t("compare.phrase.cta.subtitle")}
        primaryCTA={t("compare.phrase.cta.button")}
        primaryHref="https://dash.better-i18n.com"
      />
    </MarketingLayout>
  );
}
