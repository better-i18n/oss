import { createFileRoute } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  ComparisonTable,
  ComparisonHero,
  Differentiator,
  CTASection,
  OtherComparisons,
  ComparisonRelatedTopics,
  type ComparisonFeature,
} from "@/components/ComparisonTable";
import { PillarBlogPosts } from "@/components/PillarBlogPosts";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { loadPillarBlogPosts } from "@/lib/pillar-blog-loader";
import { useT } from "@/lib/i18n";

const PILLAR_KEYWORDS = ["crowdin", "comparison", "alternative"] as const;

const baseLoader = createPageLoader();
import { UserComplaints } from "@/components/UserComplaints";
import { WhySwitchSection } from "@/components/WhySwitchSection";

export const Route = createFileRoute("/$locale/compare/crowdin")({
  loader: async (args: Parameters<typeof baseLoader>[0]) => {
    const [base, pillarPosts] = await Promise.all([
      baseLoader(args),
      loadPillarBlogPosts({
        data: { locale: args.context.locale, keywords: PILLAR_KEYWORDS },
      }),
    ]);
    return { ...base, pillarPosts };
  },
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "compareCrowdin",
      pathname: "/compare/crowdin",
      pageType: "comparison",
      structuredDataOptions: { competitorName: "Crowdin" },
    });
  },
  component: CrowdinComparisonPage,
});

function CrowdinComparisonPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();
  const { pillarPosts } = Route.useLoaderData();

  const features: ComparisonFeature[] = [
    { name: t("compare.crowdin.features.gitIntegration"), betterI18n: true, competitor: true },
    { name: t("compare.crowdin.features.aiTranslation"), betterI18n: true, competitor: true },
    { name: t("compare.crowdin.features.mcpSupport"), betterI18n: true, competitor: false, highlight: true },
    { name: t("compare.crowdin.features.cdnDelivery"), betterI18n: true, competitor: true },
    { name: t("compare.crowdin.features.inContextEditor"), betterI18n: true, competitor: true },
    { name: t("compare.crowdin.features.freeForOpenSource"), betterI18n: true, competitor: true },
    { name: t("compare.crowdin.features.astKeyDiscovery"), betterI18n: true, competitor: false, highlight: true },
    { name: t("compare.crowdin.features.pricing"), betterI18n: t("compare.crowdin.features.pricingBetter"), competitor: t("compare.crowdin.features.pricingCrowdin") },
    { name: t("compare.crowdin.features.setupTime"), betterI18n: t("compare.crowdin.features.setupTimeBetter"), competitor: t("compare.crowdin.features.setupTimeCrowdin") },
    { name: t("compare.crowdin.features.developerFirst"), betterI18n: true, competitor: false, highlight: true },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="compare" locale={locale} />
      <ComparisonHero
        competitorName="Crowdin"
        title={t("compare.crowdin.hero.title")}
        subtitle={t("compare.crowdin.hero.subtitle")}
      />

      {/* Comparison Table */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <ComparisonTable competitorName="Crowdin" features={features} featureLabel={t("compare.featureLabel")} />
        </div>
      </section>

      <UserComplaints
        competitor="Crowdin"
        complaints={[
          { source: "G2", quote: t("compare.crowdin.userComplaints.1.quote"), category: t("compare.crowdin.userComplaints.1.category") },
          { source: "G2", quote: t("compare.crowdin.userComplaints.2.quote"), category: t("compare.crowdin.userComplaints.2.category") },
          { source: "Capterra", quote: t("compare.crowdin.userComplaints.3.quote"), category: t("compare.crowdin.userComplaints.3.category") },
        ]}
      />

      {/* Why Better i18n */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-12">
            {t("compare.crowdin.whyBetter.title")}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Differentiator
              icon={<SpriteIcon name="code" className="w-5 h-5" />}
              title={t("compare.crowdin.whyBetter.developerFirst.title")}
              description={t("compare.crowdin.whyBetter.developerFirst.description")}
            />
            <Differentiator
              icon={<SpriteIcon name="robot" className="w-5 h-5" />}
              title={t("compare.crowdin.whyBetter.mcpNative.title")}
              description={t("compare.crowdin.whyBetter.mcpNative.description")}
            />
            <Differentiator
              icon={<SpriteIcon name="github" className="w-5 h-5" />}
              title={t("compare.crowdin.whyBetter.gitFirst.title")}
              description={t("compare.crowdin.whyBetter.gitFirst.description")}
            />
            <Differentiator
              icon={<SpriteIcon name="rocket" className="w-5 h-5" />}
              title={t("compare.crowdin.whyBetter.simpler.title")}
              description={t("compare.crowdin.whyBetter.simpler.description")}
            />
          </div>
        </div>
      </section>

      <WhySwitchSection
        competitor="Crowdin"
        reasons={[
          { painPoint: t("compare.crowdin.switchReasons.1.pain"), solution: t("compare.crowdin.switchReasons.1.solution") },
          { painPoint: t("compare.crowdin.switchReasons.2.pain"), solution: t("compare.crowdin.switchReasons.2.solution") },
          { painPoint: t("compare.crowdin.switchReasons.3.pain"), solution: t("compare.crowdin.switchReasons.3.solution") },
          { painPoint: t("compare.crowdin.switchReasons.4.pain"), solution: t("compare.crowdin.switchReasons.4.solution") },
        ]}
      />

      <PillarBlogPosts posts={pillarPosts} locale={locale} />

      <ComparisonRelatedTopics
        heading={t("compare.crowdin.relatedTopics", { defaultValue: "Learn More" })}
        locale={locale}
        links={[
          { to: "/$locale/what-is", title: t("compare.crowdin.related.whatIsI18n", { defaultValue: "What is i18n?" }), description: t("compare.crowdin.related.whatIsI18nDesc", { defaultValue: "Understanding internationalization fundamentals" }) },
          { to: "/$locale/i18n/react", title: t("compare.crowdin.related.react", { defaultValue: "React i18n" }), description: t("compare.crowdin.related.reactDesc", { defaultValue: "Integrate translations into your React app" }) },
          { to: "/$locale/features", title: t("compare.crowdin.related.features", { defaultValue: "All Features" }), description: t("compare.crowdin.related.featuresDesc", { defaultValue: "Explore the full Better i18n platform" }) },
        ]}
      />

      {/* Other Comparisons */}
      <OtherComparisons
        currentSlug="crowdin"
        locale={locale}
        title={t("compare.otherComparisons")}
      />

      {/* CTA */}
      <CTASection
        title={t("compare.crowdin.cta.title")}
        subtitle={t("compare.crowdin.cta.subtitle")}
        primaryCTA={t("compare.crowdin.cta.button")}
        primaryHref="https://dash.better-i18n.com"
      />
    </MarketingLayout>
  );
}
