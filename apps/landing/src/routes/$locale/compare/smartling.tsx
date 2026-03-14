import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/$locale/compare/smartling")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
      pageKey: "compareSmartling",
      pathname: "/compare/smartling",
      pageType: "comparison",
      structuredDataOptions: { competitorName: "Smartling" },
    });
  },
  component: SmartlingComparisonPage,
});

function SmartlingComparisonPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features: ComparisonFeature[] = [
    {
      name: t("compare.smartling.features.aiTranslation"),
      betterI18n: true,
      competitor: true,
    },
    {
      name: t("compare.smartling.features.gitIntegration"),
      betterI18n: true,
      competitor: true,
    },
    {
      name: t("compare.smartling.features.mcpSupport"),
      betterI18n: true,
      competitor: false,
      highlight: true,
    },
    {
      name: t("compare.smartling.features.cdnDelivery"),
      betterI18n: true,
      competitor: true,
    },
    {
      name: t("compare.smartling.features.inContextEditor"),
      betterI18n: true,
      competitor: true,
    },
    {
      name: t("compare.smartling.features.astKeyDiscovery"),
      betterI18n: true,
      competitor: false,
      highlight: true,
    },
    {
      name: t("compare.smartling.features.proxyTranslation"),
      betterI18n: false,
      competitor: true,
    },
    {
      name: t("compare.smartling.features.pricing"),
      betterI18n: t("compare.smartling.features.pricingBetter"),
      competitor: t("compare.smartling.features.pricingSmartling"),
    },
    {
      name: t("compare.smartling.features.setupTime"),
      betterI18n: t("compare.smartling.features.setupTimeBetter"),
      competitor: t("compare.smartling.features.setupTimeSmartling"),
    },
    {
      name: t("compare.smartling.features.developerFirst"),
      betterI18n: true,
      competitor: false,
      highlight: true,
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="compare" locale={locale} />
      <ComparisonHero
        competitorName="Smartling"
        title={t("compare.smartling.hero.title")}
        subtitle={t("compare.smartling.hero.subtitle")}
      />

      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <ComparisonTable
            competitorName="Smartling"
            features={features}
            featureLabel={t("compare.featureLabel")}
          />
        </div>
      </section>

      <UserComplaints
        competitor="Smartling"
        complaints={[
          { source: "G2", quote: t("compare.smartling.userComplaints.1.quote"), category: t("compare.smartling.userComplaints.1.category") },
          { source: "Capterra", quote: t("compare.smartling.userComplaints.2.quote"), category: t("compare.smartling.userComplaints.2.category") },
          { source: "G2", quote: t("compare.smartling.userComplaints.3.quote"), category: t("compare.smartling.userComplaints.3.category") },
        ]}
      />

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-12">
            {t("compare.smartling.whyBetter.title")}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Differentiator
              icon={<IconCode className="w-5 h-5" />}
              title={t("compare.smartling.whyBetter.developerFirst.title")}
              description={t(
                "compare.smartling.whyBetter.developerFirst.description",
              )}
            />
            <Differentiator
              icon={<IconRobot className="w-5 h-5" />}
              title={t("compare.smartling.whyBetter.mcpNative.title")}
              description={t(
                "compare.smartling.whyBetter.mcpNative.description",
              )}
            />
            <Differentiator
              icon={<IconGithub className="w-5 h-5" />}
              title={t("compare.smartling.whyBetter.transparent.title")}
              description={t(
                "compare.smartling.whyBetter.transparent.description",
              )}
            />
            <Differentiator
              icon={<IconRocket className="w-5 h-5" />}
              title={t("compare.smartling.whyBetter.simpler.title")}
              description={t(
                "compare.smartling.whyBetter.simpler.description",
              )}
            />
          </div>
        </div>
      </section>

      <WhySwitchSection
        competitor="Smartling"
        reasons={[
          { painPoint: t("compare.smartling.switchReasons.1.pain"), solution: t("compare.smartling.switchReasons.1.solution") },
          { painPoint: t("compare.smartling.switchReasons.2.pain"), solution: t("compare.smartling.switchReasons.2.solution") },
          { painPoint: t("compare.smartling.switchReasons.3.pain"), solution: t("compare.smartling.switchReasons.3.solution") },
        ]}
      />

      <ComparisonRelatedTopics
        heading={t("compare.smartling.relatedTopics", {
          defaultValue: "Learn More",
        })}
        locale={locale}
        links={[
          {
            to: "/$locale/what-is",
            title: t("compare.smartling.related.whatIsI18n", {
              defaultValue: "What is i18n?",
            }),
            description: t("compare.smartling.related.whatIsI18nDesc", {
              defaultValue: "Understanding internationalization fundamentals",
            }),
          },
          {
            to: "/$locale/i18n/react",
            title: t("compare.smartling.related.react", {
              defaultValue: "React i18n",
            }),
            description: t("compare.smartling.related.reactDesc", {
              defaultValue: "Integrate translations into your React app",
            }),
          },
          {
            to: "/$locale/features",
            title: t("compare.smartling.related.features", {
              defaultValue: "All Features",
            }),
            description: t("compare.smartling.related.featuresDesc", {
              defaultValue: "Explore the full Better i18n platform",
            }),
          },
        ]}
      />

      <OtherComparisons
        currentSlug="smartling"
        locale={locale}
        title={t("compare.otherComparisons")}
      />

      <CTASection
        title={t("compare.smartling.cta.title")}
        subtitle={t("compare.smartling.cta.subtitle")}
        primaryCTA={t("compare.smartling.cta.button")}
        primaryHref="https://dash.better-i18n.com"
      />
    </MarketingLayout>
  );
}
