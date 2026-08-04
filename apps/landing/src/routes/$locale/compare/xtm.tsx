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
import { ComparisonDisclaimer } from "@/components/ComparisonDisclaimer";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { UserComplaints } from "@/components/UserComplaints";
import { WhySwitchSection } from "@/components/WhySwitchSection";
import { Divider, SectionHeader } from "@/components/ui/page";

export const Route = createFileRoute("/$locale/compare/xtm")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
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
      <BackToHub hub="compare" locale={locale} />
      <ComparisonHero
        competitorName="XTM"
        title={t("compare.xtm.hero.title")}
        subtitle={t("compare.xtm.hero.subtitle")}
      />

      <section>
        <div className="section">
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
          { quote: t("compare.xtm.userComplaints.1.quote"), category: t("compare.xtm.userComplaints.1.category") },
          { quote: t("compare.xtm.userComplaints.2.quote"), category: t("compare.xtm.userComplaints.2.category") },
          { quote: t("compare.xtm.userComplaints.3.quote"), category: t("compare.xtm.userComplaints.3.category") },
        ]}
      />

      <Divider />
      <section>
        <div className="section">
          <SectionHeader
            eyebrow={t("compare.xtm.whyBetter.eyebrow")}
            title={t("compare.xtm.whyBetter.title")}
            subtitle={t("compare.xtm.whyBetter.subtitle")}
          />
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Differentiator
              icon={<SpriteIcon name="code" className="w-5 h-5" />}
              title={t("compare.xtm.whyBetter.developerFirst.title")}
              description={t(
                "compare.xtm.whyBetter.developerFirst.description",
              )}
            />
            <Differentiator
              icon={<SpriteIcon name="robot" className="w-5 h-5" />}
              title={t("compare.xtm.whyBetter.mcpNative.title")}
              description={t("compare.xtm.whyBetter.mcpNative.description")}
            />
            <Differentiator
              icon={<SpriteIcon name="github" className="w-5 h-5" />}
              title={t("compare.xtm.whyBetter.gitFirst.title")}
              description={t("compare.xtm.whyBetter.gitFirst.description")}
            />
            <Differentiator
              icon={<SpriteIcon name="rocket" className="w-5 h-5" />}
              title={t("compare.xtm.whyBetter.modern.title")}
              description={t("compare.xtm.whyBetter.modern.description")}
            />
          </div>
        </div>
      </section>

      <WhySwitchSection
        competitor="XTM"
        reasons={[
          { painPoint: t("compare.xtm.switchReasons.1.pain"), solution: t("compare.xtm.switchReasons.1.solution") },
          { painPoint: t("compare.xtm.switchReasons.2.pain"), solution: t("compare.xtm.switchReasons.2.solution") },
          { painPoint: t("compare.xtm.switchReasons.3.pain"), solution: t("compare.xtm.switchReasons.3.solution") },
          { painPoint: t("compare.xtm.switchReasons.4.pain"), solution: t("compare.xtm.switchReasons.4.solution") },
        ]}
      />

      <ComparisonRelatedTopics
        heading={t("compare.xtm.relatedTopics")}
        locale={locale}
        links={[
          {
            to: "/$locale/what-is",
            title: t("compare.xtm.related.whatIsI18n"),
            description: t("compare.xtm.related.whatIsI18nDesc"),
          },
          {
            to: "/$locale/i18n/react",
            title: t("compare.xtm.related.react"),
            description: t("compare.xtm.related.reactDesc"),
          },
          {
            to: "/$locale/features",
            title: t("compare.xtm.related.features"),
            description: t("compare.xtm.related.featuresDesc"),
          },
        ]}
      />

      {/* Two link groups, two headings, so two sections — and the one
          permitted transition between sections is a Divider. Without it the
          frame drew a rule above "Keep Reading" and below "Other Comparisons"
          but nothing between them, so the pair read as a single section with a
          hole in the middle. */}
      <Divider />
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

      <ComparisonDisclaimer />
    </MarketingLayout>
  );
}
