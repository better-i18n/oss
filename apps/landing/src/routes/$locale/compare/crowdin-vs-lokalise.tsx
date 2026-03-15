import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  MultiComparisonTable,
  ThreeWayHero,
  PricingComparisonTable,
  DxComparison,
  MigrationSection,
  CTASection,
  OtherComparisons,
  ComparisonRelatedTopics,
  type MultiComparisonFeature,
  type PricingRow,
  type DxComparisonItem,
} from "@/components/ComparisonTable";
import { getPageHead } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/compare/crowdin-vs-lokalise")({
  loader: ({ context }) => ({
    messages: context.messages,
    locale: context.locale,
  }),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "compareCrowdinVsLokalise",
      pathname: "/compare/crowdin-vs-lokalise",
      pageType: "comparison",
      structuredDataOptions: {
        competitorName: "Crowdin vs Lokalise",
      },
    });
  },
  component: CrowdinVsLokalisePage,
});

const COMPETITORS = ["Better i18n", "Crowdin", "Lokalise"] as const;

function buildValues(
  betterI18n: boolean | string,
  crowdin: boolean | string,
  lokalise: boolean | string,
): ReadonlyMap<string, boolean | string> {
  return new Map<string, boolean | string>([
    ["Better i18n", betterI18n],
    ["Crowdin", crowdin],
    ["Lokalise", lokalise],
  ]);
}

function CrowdinVsLokalisePage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  // ── Feature matrix (14 rows) ──────────────────────────────────────
  const features: readonly MultiComparisonFeature[] = [
    { name: t("compare.crowdinVsLokalise.features.aiTranslation"), values: buildValues(true, true, true) },
    { name: t("compare.crowdinVsLokalise.features.gitIntegration"), values: buildValues(true, true, true) },
    { name: t("compare.crowdinVsLokalise.features.cdnDelivery"), values: buildValues(true, true, true) },
    { name: t("compare.crowdinVsLokalise.features.inContextEditor"), values: buildValues(true, true, true) },
    { name: t("compare.crowdinVsLokalise.features.translationMemory"), values: buildValues(true, true, true) },
    { name: t("compare.crowdinVsLokalise.features.pluralRules"), values: buildValues(true, true, true) },
    { name: t("compare.crowdinVsLokalise.features.webhooks"), values: buildValues(true, true, true) },
    { name: t("compare.crowdinVsLokalise.features.branchingWorkflows"), values: buildValues(true, true, false) },
    { name: t("compare.crowdinVsLokalise.features.screenshotContext"), values: buildValues(true, true, true) },
    { name: t("compare.crowdinVsLokalise.features.mcpServer"), values: buildValues(true, false, false), highlight: true },
    { name: t("compare.crowdinVsLokalise.features.i18nDoctor"), values: buildValues(true, false, false), highlight: true },
    { name: t("compare.crowdinVsLokalise.features.autoFixCli"), values: buildValues(true, false, false), highlight: true },
    { name: t("compare.crowdinVsLokalise.features.headlessCms"), values: buildValues(true, false, false), highlight: true },
    { name: t("compare.crowdinVsLokalise.features.progressiveAi"), values: buildValues(true, false, false), highlight: true },
  ];

  // ── Pricing table (10-person team scenario) ───────────────────────
  const pricingRows: readonly PricingRow[] = [
    { label: t("compare.crowdinVsLokalise.pricing.monthlyPrice"), values: [t("compare.crowdinVsLokalise.pricing.monthlyPrice.better"), t("compare.crowdinVsLokalise.pricing.monthlyPrice.crowdin"), t("compare.crowdinVsLokalise.pricing.monthlyPrice.lokalise")], highlight: true },
    { label: t("compare.crowdinVsLokalise.pricing.annualPrice"), values: [t("compare.crowdinVsLokalise.pricing.annualPrice.better"), t("compare.crowdinVsLokalise.pricing.annualPrice.crowdin"), t("compare.crowdinVsLokalise.pricing.annualPrice.lokalise")], highlight: true },
    { label: t("compare.crowdinVsLokalise.pricing.freeTier"), values: [t("compare.crowdinVsLokalise.pricing.freeTier.better"), t("compare.crowdinVsLokalise.pricing.freeTier.crowdin"), t("compare.crowdinVsLokalise.pricing.freeTier.lokalise")] },
    { label: t("compare.crowdinVsLokalise.pricing.seats"), values: [t("compare.crowdinVsLokalise.pricing.seats.better"), t("compare.crowdinVsLokalise.pricing.seats.crowdin"), t("compare.crowdinVsLokalise.pricing.seats.lokalise")] },
    { label: t("compare.crowdinVsLokalise.pricing.perSeatCost"), values: [t("compare.crowdinVsLokalise.pricing.perSeatCost.better"), t("compare.crowdinVsLokalise.pricing.perSeatCost.crowdin"), t("compare.crowdinVsLokalise.pricing.perSeatCost.lokalise")] },
    { label: t("compare.crowdinVsLokalise.pricing.aiTranslations"), values: [t("compare.crowdinVsLokalise.pricing.aiTranslations.better"), t("compare.crowdinVsLokalise.pricing.aiTranslations.crowdin"), t("compare.crowdinVsLokalise.pricing.aiTranslations.lokalise")] },
    { label: t("compare.crowdinVsLokalise.pricing.overageCost"), values: [t("compare.crowdinVsLokalise.pricing.overageCost.better"), t("compare.crowdinVsLokalise.pricing.overageCost.crowdin"), t("compare.crowdinVsLokalise.pricing.overageCost.lokalise")] },
    { label: t("compare.crowdinVsLokalise.pricing.annualSavings"), values: [t("compare.crowdinVsLokalise.pricing.annualSavings.better"), t("compare.crowdinVsLokalise.pricing.annualSavings.crowdin"), t("compare.crowdinVsLokalise.pricing.annualSavings.lokalise")] },
  ];

  // ── DX comparison (CLI, API, SDK) ─────────────────────────────────
  const dxCategories: readonly DxComparisonItem[] = [
    {
      category: t("compare.crowdinVsLokalise.dx.cli"),
      items: [
        { label: t("compare.crowdinVsLokalise.dx.cliPush"), values: buildValues(true, true, true) },
        { label: t("compare.crowdinVsLokalise.dx.cliScan"), values: buildValues(true, false, false) },
        { label: t("compare.crowdinVsLokalise.dx.cliAutoFix"), values: buildValues(true, false, false) },
      ],
    },
    {
      category: t("compare.crowdinVsLokalise.dx.api"),
      items: [
        { label: t("compare.crowdinVsLokalise.dx.restApi"), values: buildValues(true, true, true) },
        { label: t("compare.crowdinVsLokalise.dx.graphqlApi"), values: buildValues(false, false, false) },
        { label: t("compare.crowdinVsLokalise.dx.webhookApi"), values: buildValues(true, true, true) },
      ],
    },
    {
      category: t("compare.crowdinVsLokalise.dx.sdk"),
      items: [
        { label: t("compare.crowdinVsLokalise.dx.reactSdk"), values: buildValues(true, true, true) },
        { label: t("compare.crowdinVsLokalise.dx.nextjsSdk"), values: buildValues(true, false, true) },
        { label: t("compare.crowdinVsLokalise.dx.flutterSdk"), values: buildValues(true, true, false) },
        { label: t("compare.crowdinVsLokalise.dx.expoSdk"), values: buildValues(true, false, false) },
      ],
    },
  ];

  // ── Migration steps ───────────────────────────────────────────────
  const migrationSteps = [
    { title: t("compare.crowdinVsLokalise.migration.step1.title"), description: t("compare.crowdinVsLokalise.migration.step1.description") },
    { title: t("compare.crowdinVsLokalise.migration.step2.title"), description: t("compare.crowdinVsLokalise.migration.step2.description") },
    { title: t("compare.crowdinVsLokalise.migration.step3.title"), description: t("compare.crowdinVsLokalise.migration.step3.description") },
    { title: t("compare.crowdinVsLokalise.migration.step4.title"), description: t("compare.crowdinVsLokalise.migration.step4.description") },
  ] as const;

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="compare" locale={locale} />
      {/* Hero */}
      <ThreeWayHero
        competitors={[...COMPETITORS]}
        title={t("compare.crowdinVsLokalise.hero.title")}
        subtitle={t("compare.crowdinVsLokalise.hero.subtitle")}
      />

      {/* Pricing Table */}
      <PricingComparisonTable
        title={t("compare.crowdinVsLokalise.pricing.title")}
        subtitle={t("compare.crowdinVsLokalise.pricing.subtitle")}
        columns={[...COMPETITORS]}
        rows={[...pricingRows]}
      />

      {/* Feature Matrix */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-10">
            {t("compare.crowdinVsLokalise.features.title")}
          </h2>
          <MultiComparisonTable
            competitors={[...COMPETITORS]}
            features={features}
            featureLabel={t("compare.featureLabel")}
          />
        </div>
      </section>

      {/* DX Comparison */}
      <DxComparison
        title={t("compare.crowdinVsLokalise.dx.title")}
        competitors={[...COMPETITORS]}
        categories={dxCategories}
      />

      {/* Migration */}
      <MigrationSection
        title={t("compare.crowdinVsLokalise.migration.title")}
        subtitle={t("compare.crowdinVsLokalise.migration.subtitle")}
        steps={migrationSteps}
      />

      {/* Related Topics */}
      <ComparisonRelatedTopics
        heading={t("compare.crowdinVsLokalise.relatedTopics", { defaultValue: "Learn More" })}
        locale={locale}
        links={[
          {
            to: "/$locale/compare/crowdin",
            title: t("compare.crowdinVsLokalise.related.crowdin", { defaultValue: "Better i18n vs Crowdin" }),
            description: t("compare.crowdinVsLokalise.related.crowdinDesc", { defaultValue: "Detailed two-way comparison with Crowdin" }),
          },
          {
            to: "/$locale/compare/lokalise",
            title: t("compare.crowdinVsLokalise.related.lokalise", { defaultValue: "Better i18n vs Lokalise" }),
            description: t("compare.crowdinVsLokalise.related.lokaliseDesc", { defaultValue: "Detailed two-way comparison with Lokalise" }),
          },
          {
            to: "/$locale/features",
            title: t("compare.crowdinVsLokalise.related.features", { defaultValue: "All Features" }),
            description: t("compare.crowdinVsLokalise.related.featuresDesc", { defaultValue: "Explore the full Better i18n platform" }),
          },
        ]}
      />

      {/* Other Comparisons */}
      <OtherComparisons
        currentSlug="crowdin-vs-lokalise"
        locale={locale}
        title={t("compare.otherComparisons")}
      />

      {/* CTA */}
      <CTASection
        title={t("compare.crowdinVsLokalise.cta.title")}
        subtitle={t("compare.crowdinVsLokalise.cta.subtitle")}
        primaryCTA={t("compare.crowdinVsLokalise.cta.button")}
        primaryHref="https://dash.better-i18n.com"
      />
    </MarketingLayout>
  );
}
