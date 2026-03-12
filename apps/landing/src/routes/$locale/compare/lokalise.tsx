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
  IconGithub,
  IconRocket,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/compare/lokalise")({
  loader: ({ context }) => ({ messages: context.messages, locale: context.locale, locales: context.locales }),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
      pageKey: "compareLokalise",
      pathname: "/compare/lokalise",
      pageType: "comparison",
      structuredDataOptions: { competitorName: "Lokalise" },
    });
  },
  component: LokaliseComparisonPage,
});

function LokaliseComparisonPage() {
  const t = useT("marketing");
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
          <ComparisonTable competitorName="Lokalise" features={features} featureLabel={t("compare.featureLabel")} />
        </div>
      </section>

      <UserComplaints
        competitor="Lokalise"
        complaints={[
          { source: "G2", quote: "Steep learning curve for non-technical users", category: "Usability" },
          { source: "Capterra", quote: "API rate limits cause issues", category: "API" },
          { source: "G2", quote: "Expensive for small teams", category: "Pricing" },
        ]}
      />

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

      <WhySwitchSection
        competitor="Lokalise"
        reasons={[
          { painPoint: "Steep learning curve alienates non-technical team members", solution: "Intuitive dashboard anyone can use — no training required" },
          { painPoint: "API rate limits block CI/CD pipelines during deployments", solution: "CDN-first delivery with no rate limits on translation fetches" },
          { painPoint: "Costs escalate quickly as team and key count grows", solution: "Predictable pricing that scales with your project, not your headcount" },
        ]}
      />

      <ComparisonRelatedTopics
        heading={t("compare.lokalise.relatedTopics", { defaultValue: "Explore Further" })}
        locale={locale}
        links={[
          { to: "/$locale/i18n/best-tms", title: t("compare.lokalise.related.bestTms", { defaultValue: "Best TMS Platforms" }), description: t("compare.lokalise.related.bestTmsDesc", { defaultValue: "Compare top translation management systems" }) },
          { to: "/$locale/integrations", title: t("compare.lokalise.related.integrations", { defaultValue: "Integrations" }), description: t("compare.lokalise.related.integrationsDesc", { defaultValue: "Git, CDN, and CI/CD integrations" }) },
          { to: "/$locale/i18n/nextjs", title: t("compare.lokalise.related.nextjs", { defaultValue: "Next.js i18n" }), description: t("compare.lokalise.related.nextjsDesc", { defaultValue: "Server-side i18n with App Router" }) },
        ]}
      />

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
        primaryHref="https://dash.better-i18n.com"
      />
    </MarketingLayout>
  );
}
