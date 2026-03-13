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
  IconGithub,
  IconRocket,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { UserComplaints } from "@/components/UserComplaints";
import { WhySwitchSection } from "@/components/WhySwitchSection";

export const Route = createFileRoute("/$locale/compare/xtm")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
      pageKey: "compareXTM",
      pathname: "/compare/xtm",
      pageType: "comparison",
      structuredDataOptions: { competitorName: "XTM" },
    });
  },
  component: XTMComparisonPage,
});

function XTMComparisonPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features: ComparisonFeature[] = [
    {
      name: t("compare.xtm.features.aiTranslation"),
      betterI18n: true,
      competitor: true,
    },
    {
      name: t("compare.xtm.features.gitIntegration"),
      betterI18n: true,
      competitor: false,
      highlight: true,
    },
    {
      name: t("compare.xtm.features.mcpSupport"),
      betterI18n: true,
      competitor: false,
      highlight: true,
    },
    {
      name: t("compare.xtm.features.cdnDelivery"),
      betterI18n: true,
      competitor: false,
      highlight: true,
    },
    {
      name: t("compare.xtm.features.inContextEditor"),
      betterI18n: true,
      competitor: true,
    },
    {
      name: t("compare.xtm.features.translationMemory"),
      betterI18n: true,
      competitor: true,
    },
    {
      name: t("compare.xtm.features.catTool"),
      betterI18n: false,
      competitor: true,
    },
    {
      name: t("compare.xtm.features.pricing"),
      betterI18n: t("compare.xtm.features.pricingBetter"),
      competitor: t("compare.xtm.features.pricingXTM"),
    },
    {
      name: t("compare.xtm.features.setupTime"),
      betterI18n: t("compare.xtm.features.setupTimeBetter"),
      competitor: t("compare.xtm.features.setupTimeXTM"),
    },
    {
      name: t("compare.xtm.features.developerFirst"),
      betterI18n: true,
      competitor: false,
      highlight: true,
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <ComparisonHero
        competitorName="XTM"
        title={t("compare.xtm.hero.title")}
        subtitle={t("compare.xtm.hero.subtitle")}
      />

      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <ComparisonTable
            competitorName="XTM"
            features={features}
            featureLabel={t("compare.featureLabel")}
          />
        </div>
      </section>

      <UserComplaints
        competitor="XTM"
        complaints={[
          { source: "G2", quote: "Batch processing is slow", category: "Performance" },
          { source: "Capterra", quote: "Translation memory sharing limited", category: "TM" },
          { source: "G2", quote: "Mobile experience poor", category: "Mobile" },
        ]}
      />

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-12">
            {t("compare.xtm.whyBetter.title")}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Differentiator
              icon={<IconCode className="w-5 h-5" />}
              title={t("compare.xtm.whyBetter.developerFirst.title")}
              description={t(
                "compare.xtm.whyBetter.developerFirst.description",
              )}
            />
            <Differentiator
              icon={<IconRobot className="w-5 h-5" />}
              title={t("compare.xtm.whyBetter.mcpNative.title")}
              description={t("compare.xtm.whyBetter.mcpNative.description")}
            />
            <Differentiator
              icon={<IconGithub className="w-5 h-5" />}
              title={t("compare.xtm.whyBetter.gitFirst.title")}
              description={t("compare.xtm.whyBetter.gitFirst.description")}
            />
            <Differentiator
              icon={<IconRocket className="w-5 h-5" />}
              title={t("compare.xtm.whyBetter.modern.title")}
              description={t("compare.xtm.whyBetter.modern.description")}
            />
          </div>
        </div>
      </section>

      <WhySwitchSection
        competitor="XTM"
        reasons={[
          { painPoint: "Batch processing bottlenecks slow down large translation jobs", solution: "CDN-first delivery with instant key updates — no batch processing needed" },
          { painPoint: "Limited translation memory sharing across projects", solution: "Namespace-based organization with cross-project key reuse built in" },
          { painPoint: "Poor mobile experience limits on-the-go translation review", solution: "Responsive dashboard works seamlessly on any device" },
          { painPoint: "CAT tool dependency adds complexity for developer workflows", solution: "Developer-first approach — manage translations from your IDE or CI/CD pipeline" },
        ]}
      />

      <ComparisonRelatedTopics
        heading={t("compare.xtm.relatedTopics", {
          defaultValue: "Learn More",
        })}
        locale={locale}
        links={[
          {
            to: "/$locale/what-is",
            title: t("compare.xtm.related.whatIsI18n", {
              defaultValue: "What is i18n?",
            }),
            description: t("compare.xtm.related.whatIsI18nDesc", {
              defaultValue: "Understanding internationalization fundamentals",
            }),
          },
          {
            to: "/$locale/i18n/react",
            title: t("compare.xtm.related.react", {
              defaultValue: "React i18n",
            }),
            description: t("compare.xtm.related.reactDesc", {
              defaultValue: "Integrate translations into your React app",
            }),
          },
          {
            to: "/$locale/features",
            title: t("compare.xtm.related.features", {
              defaultValue: "All Features",
            }),
            description: t("compare.xtm.related.featuresDesc", {
              defaultValue: "Explore the full Better i18n platform",
            }),
          },
        ]}
      />

      <OtherComparisons
        currentSlug="xtm"
        locale={locale}
        title={t("compare.otherComparisons")}
      />

      <CTASection
        title={t("compare.xtm.cta.title")}
        subtitle={t("compare.xtm.cta.subtitle")}
        primaryCTA={t("compare.xtm.cta.button")}
        primaryHref="https://dash.better-i18n.com"
      />
    </MarketingLayout>
  );
}
