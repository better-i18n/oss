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
import { ComparisonDisclaimer } from "@/components/ComparisonDisclaimer";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { Divider, SectionHeader } from "@/components/ui/page";

const pageLoader = createPageLoader();

export const Route = createFileRoute("/$locale/compare/crowdin-vs-lokalise")({
  loader: pageLoader,
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

const COMPETITORS = ["Better I18N", "Crowdin", "Lokalise"] as const;

function buildValues(
  betterI18n: boolean | string,
  crowdin: boolean | string,
  lokalise: boolean | string,
): ReadonlyMap<string, boolean | string> {
  return new Map<string, boolean | string>([
    ["Better I18N", betterI18n],
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
    /* Neither of the next two is ours. buildValues is (betterI18n, crowdin,
       lokalise), so the first argument was claiming a capability we do not
       ship. See the note in PricingComparison.tsx. */
    { name: t("compare.crowdinVsLokalise.features.inContextEditor"), values: buildValues(false, true, true) },
    { name: t("compare.crowdinVsLokalise.features.translationMemory"), values: buildValues(false, true, true) },
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
      <section>
        <div className="section">
          <SectionHeader
            eyebrow={t("compare.crowdinVsLokalise.features.eyebrow")}
            title={t("compare.crowdinVsLokalise.features.title")}
            subtitle={t("compare.crowdinVsLokalise.features.subtitle")}
          />
          <div className="mt-8">
          <MultiComparisonTable
            competitors={[...COMPETITORS]}
            features={features}
            featureLabel={t("compare.featureLabel")}
          />
          </div>
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
        heading={t("compare.crowdinVsLokalise.relatedTopics")}
        locale={locale}
        links={[
          {
            to: "/$locale/compare/crowdin",
            title: t("compare.crowdinVsLokalise.related.crowdin"),
            description: t("compare.crowdinVsLokalise.related.crowdinDesc"),
          },
          {
            to: "/$locale/compare/lokalise",
            title: t("compare.crowdinVsLokalise.related.lokalise"),
            description: t("compare.crowdinVsLokalise.related.lokaliseDesc"),
          },
          {
            to: "/$locale/features",
            title: t("compare.crowdinVsLokalise.related.features"),
            description: t("compare.crowdinVsLokalise.related.featuresDesc"),
          },
        ]}
      />

      {/* Other Comparisons */}
      {/* Two link groups, two headings, so two sections — and the one
          permitted transition between sections is a Divider. Without it the
          frame drew a rule above "Keep Reading" and below "Other Comparisons"
          but nothing between them, so the pair read as a single section with a
          hole in the middle. */}
      <Divider />
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

      <ComparisonDisclaimer />
    </MarketingLayout>
  );
}
