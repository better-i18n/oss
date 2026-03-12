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
import { UserComplaints } from "@/components/UserComplaints";
import { WhySwitchSection } from "@/components/WhySwitchSection";
import { getPageHead } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCode,
  IconRobot,
  IconZap,
  IconRocket,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/compare/transifex")({
  loader: ({ context }) => ({ messages: context.messages, locale: context.locale, locales: context.locales }),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
      pageKey: "compareTransifex",
      pathname: "/compare/transifex",
      pageType: "comparison",
      structuredDataOptions: { competitorName: "Transifex" },
    });
  },
  component: TransifexComparisonPage,
});

function TransifexComparisonPage() {
  const t = useT("marketing");
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
          <ComparisonTable competitorName="Transifex" features={features} featureLabel={t("compare.featureLabel")} />
        </div>
      </section>

      <UserComplaints
        competitor="Transifex"
        complaints={[
          { source: "G2", quote: "Outdated UI feels clunky", category: "Usability" },
          { source: "Capterra", quote: "Limited automation options", category: "Automation" },
          { source: "G2", quote: "Slow customer support", category: "Support" },
        ]}
      />

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

      <WhySwitchSection
        competitor="Transifex"
        reasons={[
          { painPoint: "Outdated UI makes daily translation work frustrating", solution: "Modern, responsive interface built with the latest web standards" },
          { painPoint: "Limited automation means repetitive manual work", solution: "AI-powered automation handles key discovery, translation, and deployment" },
          { painPoint: "Slow support response times delay critical fixes", solution: "Developer community and documentation-first approach for fast self-service" },
        ]}
      />

      <ComparisonRelatedTopics
        heading={t("compare.transifex.relatedTopics", { defaultValue: "Keep Reading" })}
        locale={locale}
        links={[
          { to: "/$locale/for-developers", title: t("compare.transifex.related.forDevs", { defaultValue: "For Developers" }), description: t("compare.transifex.related.forDevsDesc", { defaultValue: "How Better i18n fits your dev workflow" }) },
          { to: "/$locale/what-is", title: t("compare.transifex.related.whatIsI18n", { defaultValue: "What is i18n?" }), description: t("compare.transifex.related.whatIsI18nDesc", { defaultValue: "Internationalization fundamentals explained" }) },
          { to: "/$locale/i18n/vue", title: t("compare.transifex.related.vue", { defaultValue: "Vue i18n" }), description: t("compare.transifex.related.vueDesc", { defaultValue: "Composition API-based translations" }) },
        ]}
      />

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
        primaryHref="https://dash.better-i18n.com"
      />
    </MarketingLayout>
  );
}
