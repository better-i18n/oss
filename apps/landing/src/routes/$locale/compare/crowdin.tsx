import type { ReactNode } from "react";
import { StepNumber } from "@/components/ui/step-number";
import { createFileRoute } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { CompetitorMark } from "@/components/icons/CompetitorMarks";
import { ProductTile } from "@/components/ui/product-tile";
import { SupportMark, markState, useMarkLabels } from "@/components/ui/support-mark";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  OtherComparisons,
  ComparisonRelatedTopics,
} from "@/components/ComparisonTable";
import { PillarBlogPosts } from "@/components/PillarBlogPosts";
import {
  ClosingCta,
  Divider,
  FaqSection,
  FeatureGrid,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui/page";
import { ComparisonDisclaimer } from "@/components/ComparisonDisclaimer";
import { featureIcon } from "@/components/icons/feature-icons";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { loadPillarBlogPosts } from "@/lib/pillar-blog-loader";
import { useT } from "@/lib/i18n";

/**
 * Better I18N vs Crowdin — the reference implementation for the compare/* pages.
 *
 * Shape follows rule/pillar-page-shape: PageHero → Divider → Sections that each
 * open with a SectionHeader → FaqSection → ClosingCta → legal disclaimer.
 *
 * TWO THINGS WERE REMOVED ON PURPOSE, both about data honesty:
 *
 *  1. The `<UserComplaints>` block attributed quotes to "G2" and "Capterra"
 *     ("Migration between versions is painful", …). We have no sourced quotes:
 *     nobody collected them, and the strings were authored in-house. Presenting
 *     invented text as a named review site's verdict on a named competitor is
 *     both a data-integrity problem and a legal one. The keys still exist in the
 *     CDN — nothing was deleted — but this page no longer attributes them.
 *  2. The `defaultValue` fallbacks on the related-topics links. Fallbacks are
 *     forbidden in this project: the CDN source_text is the only source of truth.
 *
 * WHAT THE COMPETITOR CLAIMS BELOW ARE BASED ON (all from Crowdin's own public
 * pricing page, fetched 2026-07-31):
 *  - "Hosted words are the number of words that should be translated multiplied
 *     by the number of the project's target languages" — their FAQ, verbatim.
 *     500 words × 10 languages = 5,000 hosted words. That multiplication is the
 *     single most important thing a buyer needs to understand, so it leads the
 *     pricing section instead of a headline monthly figure.
 *  - "CDN for Translations" is a paid ADD-ON priced per 1M requests and per 10GB
 *     of transfer, free below those thresholds.
 *  - The open-source plan is granted on request ("Request Open Source License"),
 *     not self-serve.
 *  - Enterprise is annual billing only; listed prices exclude VAT/GST.
 *
 * Their per-plan monthly figures are rendered client-side and could not be read,
 * so no new price number is asserted here. The one that appears comes from the
 * already-published `features.pricingCrowdin` key. Every cell we could not verify
 * is an em dash, per the instruction to leave a gap rather than guess.
 */

const PILLAR_KEYWORDS = ["crowdin", "comparison", "alternative"] as const;

const baseLoader = createPageLoader();

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

/* ─── Comparison matrix ───────────────────────────────────────────────────
   Rows carry nuance, not ticks: a cell says what the behaviour IS. Where a
   competitor value could not be verified from a public source it renders an em
   dash — an empty cell is a finding, a guessed cell is a liability.

   `ours` / `theirs` are translation-key suffixes under compare.crowdin.matrix.
   `emphasis` marks the rows where the difference is structural rather than a
   feature checkbox. */
const MATRIX_ROWS: { key: string; emphasis?: boolean }[] = [
  { key: "pricingModel", emphasis: true },
  { key: "hostedWords", emphasis: true },
  { key: "cdnDelivery", emphasis: true },
  { key: "otaUpdates" },
  { key: "aiApproach" },
  { key: "gitWorkflow" },
  { key: "cliSdk" },
  { key: "mcp", emphasis: true },
  { key: "typeSafety" },
  { key: "setup" },
  { key: "openSource" },
  { key: "docs" },
  { key: "security" },
] as const;

/* Hero mark pair: our product tile against the competitor's monogram. PageHero's
   `pillarLabel` is a plain string, so the marks ride in `visual` rather than
   being spliced into a translated headline — no string surgery per locale. */
function VersusMarks() {
  return (
    <div className="flex w-fit items-center gap-3 rounded-xl border border-black/[0.07] bg-white px-4 py-3">
      <span className="flex items-center gap-2">
        <ProductTile product="i18n" size="sm" />
        <span className="text-[13px] font-medium text-mist-900">Better I18N</span>
      </span>
      <span className="text-[12px] text-mist-400">vs</span>
      <span className="flex items-center gap-2">
        <CompetitorMark competitor="crowdin" size={28} />
        <span className="text-[13px] text-mist-600">Crowdin</span>
      </span>
    </div>
  );
}

/* A yes/no in the matrix uses the shared <SupportMark> tile, so a capability
   claim reads the same here as in every other table on the site
   (rule/one-support-mark). A capability the other product does not have gets the
   tile's minus, not a red cross: the claim is "not available", not "bad
   product" — and on a page whose whole credibility rests on being fair about a
   competitor, that distinction is the point. Prose cells keep plain text; only
   discrete yes/no values get a tile, which `markState` decides. */
function MatrixCell({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "ours" | "theirs";
}) {
  const markLabels = useMarkLabels();
  /* The published value carries the state: an em dash means "not available".
     Anything with content is prose and stays prose. */
  const state = typeof children === "string" ? markState(children) : undefined;

  return (
    <td
      className={`border-t border-l border-black/[0.05] px-4 py-3 align-top text-[13px] leading-[1.5] ${
        tone === "ours" ? "text-mist-900" : "text-mist-600"
      }`}
    >
      {state ? <SupportMark state={state} label={markLabels[state]} /> : children}
    </td>
  );
}

/* ─── Legal ───────────────────────────────────────────────────────────────
   Required on every compare page. Structure mirrors what mature comparison
   pages carry — trademark ownership, informational purpose, source and date of
   the data, and a route to corrections — but the wording is ours. */
function CrowdinComparisonPage() {
  const t = useT("marketing");
  /* The "what you get" list makes the same capability claim the matrix does,
     so it uses the same tile and the same accessible names. */
  const markLabels = useMarkLabels();
  const { locale } = Route.useParams();
  const { pillarPosts } = Route.useLoaderData();

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="compare" locale={locale} />

      <PageHero
        pillar="mcp"
        pillarLabel={t("compare.crowdin.hero.badge")}
        titleId="compare-crowdin-title"
        title={t("compare.crowdin.hero.title")}
        subtitle={t("compare.crowdin.hero.subtitle")}
        primary={{
          label: t("compare.crowdin.cta.button"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("compare.crowdin.hero.ctaSecondary"),
          href: `/${locale}/pricing/`,
        }}
        visual={<VersusMarks />}
      />

      {/* ── Why teams switch ─────────────────────────────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.crowdin.whySwitch.eyebrow")}
          title={t("compare.crowdin.whyBetter.title")}
          subtitle={t("compare.crowdin.whySwitch.subtitle")}
        />
        <div className="mt-8">
          <FeatureGrid cols="lg:grid-cols-3" inset={20} padY={24}>
            {[
              { icon: "code", key: "developerFirst" },
              { icon: "robot", key: "mcpNative" },
              { icon: "github", key: "gitFirst" },
            ].map((item) => (
              <div
                key={item.key}
                className="feat-cell flex flex-col gap-3"
              >
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon
                    name={item.icon as "code" | "robot" | "github"}
                    className="size-3.5"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h3 className="text-[15px] font-medium tracking-[-0.02em] text-mist-900">
                    {t(`compare.crowdin.whyBetter.${item.key}.title`)}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-mist-600">
                    {t(`compare.crowdin.whyBetter.${item.key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </FeatureGrid>
        </div>
      </Section>

      {/* ── Detailed matrix ──────────────────────────────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.crowdin.matrix.eyebrow")}
          title={t("compare.crowdin.matrix.title")}
          subtitle={t("compare.crowdin.matrix.subtitle")}
        />

        {/* Hairline matrix: cells draw their own top + left rule, the table is
            shifted -1px, and the container clips the overhang — so no
            nth-child arithmetic decides where a rule goes. Scroll is contained
            inside the container, never on the page. */}
        <div className="mt-8 overflow-hidden rounded-xl border border-black/[0.07]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] -mt-px -ml-px border-collapse">
              <thead>
                <tr>
                  <th className="w-[26%] border-t border-l border-black/[0.05] bg-mist-50 px-4 py-3 text-left text-[11px] font-medium text-mist-400">
                    {t("compare.featureLabel")}
                  </th>
                  <th className="w-[37%] border-t border-l border-black/[0.05] bg-mist-50 px-4 py-3 text-left text-[11px] font-medium text-mist-900">
                    <span className="flex items-center gap-1.5">
                      <ProductTile product="i18n" size="sm" className="size-5 rounded-[6px]" />
                      Better I18N
                    </span>
                  </th>
                  <th className="w-[37%] border-t border-l border-black/[0.05] bg-mist-50 px-4 py-3 text-left text-[11px] font-medium text-mist-500">
                    {/* The mark makes the column identifiable at a glance in a
                        15-row matrix, and treats the competitor as a peer. */}
                    <span className="flex items-center gap-1.5">
                      <CompetitorMark competitor="crowdin" size={20} />
                      Crowdin
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATRIX_ROWS.map((row) => (
                  <tr key={row.key}>
                    <th
                      scope="row"
                      className={`border-t border-l border-black/[0.05] px-4 py-3 text-left align-top text-[13px] font-medium ${
                        row.emphasis ? "text-mist-900" : "text-mist-700"
                      }`}
                    >
                      <span className="flex items-start gap-2.5">
                        {featureIcon(row.key) ? (
                          <SpriteIcon
                            name={featureIcon(row.key)!}
                            className="mt-px size-3.5 shrink-0 text-mist-400"
                            aria-hidden="true"
                          />
                        ) : null}
                        <span>{t(`compare.crowdin.matrix.rows.${row.key}.label`)}</span>
                      </span>
                    </th>
                    <MatrixCell tone="ours">
                      {t(`compare.crowdin.matrix.rows.${row.key}.ours`)}
                    </MatrixCell>
                    <MatrixCell tone="theirs">
                      {t(`compare.crowdin.matrix.rows.${row.key}.theirs`)}
                    </MatrixCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-[1.6] text-mist-400">
          {t("compare.crowdin.matrix.note")}
        </p>
      </Section>

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.crowdin.pricing.eyebrow")}
          title={t("compare.crowdin.pricing.title")}
          subtitle={t("compare.crowdin.pricing.subtitle")}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          {/* How their model scales */}
          <div>
            <p className="text-[11px] font-medium text-mist-400">
              {t("compare.crowdin.pricing.modelLabel")}
            </p>
            <p className="mt-3 text-[13px] leading-[1.65] text-mist-600">
              {t("compare.crowdin.pricing.modelBody")}
            </p>

            {/* The multiplication, shown rather than described. Numbers are
                Crowdin's own worked example from their pricing FAQ. */}
            <div className="mt-4 overflow-hidden rounded-xl border border-black/[0.07] bg-mist-50 px-4 py-3">
              <p className="font-mono text-[12px] leading-[1.7] text-mist-700">
                500 {t("compare.crowdin.pricing.wordsUnit")}
                <span className="text-mist-400"> × </span>
                10 {t("compare.crowdin.pricing.localesUnit")}
                <span className="text-mist-400"> = </span>
                <span className="text-mist-900">
                  5,000 {t("compare.crowdin.pricing.hostedWordsUnit")}
                </span>
              </p>
              <p className="mt-1.5 text-[11px] text-mist-400">
                {t("compare.crowdin.pricing.exampleNote")}
              </p>
            </div>
          </div>

          {/* What we include that has to be added there */}
          <div>
            <p className="text-[11px] font-medium text-mist-400">
              {t("compare.crowdin.pricing.includedLabel")}
            </p>
            <div className="mt-3 overflow-hidden">
              <div className="-mt-px">
                {["cdn", "ota", "mcp", "freeTier"].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 border-t border-black/[0.05] py-3"
                  >
                    <span className="mt-px">
                      <SupportMark state="yes" label={markLabels.yes} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-mist-900">
                        {t(`compare.crowdin.pricing.included.${item}.title`)}
                      </p>
                      <p className="mt-1 text-[13px] leading-[1.55] text-mist-600">
                        {t(`compare.crowdin.pricing.included.${item}.body`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Migration ────────────────────────────────────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.crowdin.migration.eyebrow")}
          title={t("compare.crowdin.migration.title")}
          subtitle={t("compare.crowdin.migration.subtitle")}
        />
        <div className="mt-8">
          {["export", "import", "connect", "verify"].map((step, index) => (
            <div
              key={step}
              className={`flex gap-4 py-5 ${
                index === 0 ? "pt-0" : "border-t border-black/[0.05]"
              }`}
            >
              <StepNumber n={index + 1} />
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {t(`compare.crowdin.migration.steps.${step}.title`)}
                </h3>
                <p className="mt-1.5 text-[13px] leading-[1.55] text-mist-600">
                  {t(`compare.crowdin.migration.steps.${step}.body`)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[12px] leading-[1.6] text-mist-400">
          {t("compare.crowdin.migration.note")}
        </p>
      </Section>

      <Divider />
      <PillarBlogPosts posts={pillarPosts} locale={locale} />

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <Divider />
      <FaqSection
        eyebrow={t("compare.crowdin.faq.eyebrow")}
        title={t("compare.crowdin.faq.title")}
        subtitle={t("compare.crowdin.faq.subtitle")}
        items={["cheaper", "whySwitch", "migrate", "security", "which", "openSource"].map(
          (id) => ({
            id,
            question: t(`compare.crowdin.faq.items.${id}.question`),
            answer: t(`compare.crowdin.faq.items.${id}.answer`),
          }),
        )}
      />

      <Divider />
      <ComparisonRelatedTopics
        heading={t("compare.crowdin.relatedTopics")}
        locale={locale}
        links={[
          {
            to: "/$locale/what-is",
            title: t("compare.crowdin.related.whatIsI18n"),
            description: t("compare.crowdin.related.whatIsI18nDesc"),
          },
          {
            to: "/$locale/i18n/react",
            title: t("compare.crowdin.related.react"),
            description: t("compare.crowdin.related.reactDesc"),
          },
          {
            to: "/$locale/features",
            title: t("compare.crowdin.related.features"),
            description: t("compare.crowdin.related.featuresDesc"),
          },
        ]}
      />

      <OtherComparisons
        currentSlug="crowdin"
        locale={locale}
        title={t("compare.otherComparisons")}
      />

      <Divider />
      <ClosingCta
        eyebrow={t("compare.crowdin.closing.eyebrow")}
        title={t("compare.crowdin.cta.title")}
        subtitle={t("compare.crowdin.cta.subtitle")}
        primary={{
          label: t("compare.crowdin.cta.button"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("compare.crowdin.closing.ctaSecondary"),
          href: "https://cal.com/better-i18n/30min?overlayCalendar=true",
        }}
      />

      <ComparisonDisclaimer />
    </MarketingLayout>
  );
}
