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
import {
  ClosingCta,
  Divider,
  FaqSection,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui/page";
import { ComparisonDisclaimer } from "@/components/ComparisonDisclaimer";
import { featureIcon } from "@/components/icons/feature-icons";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

/**
 * Better I18N vs Transifex. Shape follows compare/crowdin.tsx.
 *
 * VERIFIED FROM TRANSIFEX'S OWN PRICING PAGE (fetched 2026-07-31):
 *   - Plans are banded by word volume. Starter shows "from $160 / $260 / $380 /
 *     $510 per month" monthly, or "$135 / $215 / $320 / $425 per month billed
 *     annually" (annual = 2 months free). Self-serve signup exists.
 *   - Their hosted-word definition, verbatim: "the number of source words
 *     translated into a specific language in your organization. Duplicate source
 *     strings with identical translations in the same language are only counted
 *     once. The hosted word count remains unaffected by untranslated languages."
 *     NOTE: unlike Crowdin, this is NOT words × every target language, so this
 *     page does not claim it is. Getting that wrong in our favour would be
 *     exactly the kind of thing that discredits a comparison page.
 *   - AI is a paid add-on: "Add AI words to your plan… From $84/month". Annual
 *     Growth/Enterprise+ include 60,000 or 300,000 AI words/year. Past the limit
 *     AI features pause; no penalty.
 *   - Collaborators count everyone on the project, including external
 *     translators and reviewers.
 *
 * ⚠️ VENDOR CONSOLIDATION: transifex.com now brands itself "XTM Transifex" (the
 * site logo files are literally `XTM Transifex.png`). Transifex and XTM are one
 * vendor family, so our separate /compare/transifex and /compare/xtm pages need
 * a product decision — see the summary. This page therefore does not imply they
 * are independent competitors.
 *
 * The invented "G2 / Capterra" quote block and the `defaultValue` fallbacks were
 * removed for the same reasons as on the Crowdin page.
 */

export const Route = createFileRoute("/$locale/compare/transifex")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "compareTransifex",
      pathname: "/compare/transifex",
      pageType: "comparison",
      structuredDataOptions: { competitorName: "Transifex" },
    });
  },
  component: TransifexComparisonPage,
});

const MATRIX_ROWS: { key: string; emphasis?: boolean }[] = [
  { key: "pricingModel", emphasis: true },
  { key: "entryPrice" },
  { key: "hostedWords", emphasis: true },
  { key: "collaborators", emphasis: true },
  { key: "aiApproach", emphasis: true },
  { key: "cdnDelivery" },
  { key: "otaUpdates" },
  { key: "gitWorkflow" },
  { key: "cliSdk" },
  { key: "mcp", emphasis: true },
  { key: "typeSafety" },
  { key: "setup" },
  { key: "docs" },
  { key: "security" },
];

/** Their published Starter bands, monthly vs annual, read off their own page. */
const TRANSIFEX_BANDS = [
  { band: "1", monthly: "$160/mo", annual: "$135/mo" },
  { band: "2", monthly: "$260/mo", annual: "$215/mo" },
  { band: "3", monthly: "$380/mo", annual: "$320/mo" },
  { band: "4", monthly: "$510/mo", annual: "$425/mo" },
];

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
        <CompetitorMark competitor="transifex" size={28} />
        <span className="text-[13px] text-mist-600">Transifex</span>
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

function TransifexComparisonPage() {
  const t = useT("marketing");
  /* The "what you get" list makes the same capability claim the matrix does,
     so it uses the same tile and the same accessible names. */
  const markLabels = useMarkLabels();
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="compare" locale={locale} />

      <PageHero
        pillar="mcp"
        pillarLabel={t("compare.transifex.hero.badge")}
        titleId="compare-transifex-title"
        title={t("compare.transifex.hero.title")}
        subtitle={t("compare.transifex.hero.subtitle")}
        primary={{ label: t("compare.transifex.cta.button"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("compare.transifex.hero.ctaSecondary"), href: `/${locale}/pricing/` }}
        visual={<VersusMarks />}
      />

      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.transifex.whySwitch.eyebrow")}
          title={t("compare.transifex.whyBetter.title")}
          subtitle={t("compare.transifex.whySwitch.subtitle")}
        />
        <div className="mt-8 overflow-hidden">
          <div className="-mt-px -ml-px grid grid-cols-1 lg:grid-cols-3">
            {[
              { icon: "code", key: "developerFirst" },
              { icon: "robot", key: "mcpNative" },
              { icon: "zap", key: "aiIncluded" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex flex-col gap-3 border-t border-l border-black/[0.05] px-5 py-6"
              >
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon
                    name={item.icon as "code" | "robot" | "zap"}
                    className="size-3.5"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h3 className="text-[15px] font-medium tracking-[-0.02em] text-mist-900">
                    {t(`compare.transifex.whyBetter.${item.key}.title`)}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-mist-600">
                    {t(`compare.transifex.whyBetter.${item.key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.transifex.matrix.eyebrow")}
          title={t("compare.transifex.matrix.title")}
          subtitle={t("compare.transifex.matrix.subtitle")}
        />
        <div className="mt-8 overflow-hidden rounded-xl border border-black/[0.07]">
          <div className="overflow-x-auto">
            <table className="-mt-px -ml-px w-full min-w-[720px] border-collapse">
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
                      <CompetitorMark competitor="transifex" size={20} />
                      Transifex
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
                        <span>{t(`compare.transifex.matrix.rows.${row.key}.label`)}</span>
                      </span>
                    </th>
                    <MatrixCell tone="ours">
                      {t(`compare.transifex.matrix.rows.${row.key}.ours`)}
                    </MatrixCell>
                    <MatrixCell tone="theirs">
                      {t(`compare.transifex.matrix.rows.${row.key}.theirs`)}
                    </MatrixCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-[1.6] text-mist-400">
          {t("compare.transifex.matrix.note")}
        </p>
      </Section>

      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.transifex.pricing.eyebrow")}
          title={t("compare.transifex.pricing.title")}
          subtitle={t("compare.transifex.pricing.subtitle")}
        />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="text-[11px] font-medium text-mist-400">
              {t("compare.transifex.pricing.modelLabel")}
            </p>
            <p className="mt-3 text-[13px] leading-[1.65] text-mist-600">
              {t("compare.transifex.pricing.modelBody")}
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-black/[0.07]">
              <div className="flex items-center gap-3 border-b border-black/[0.05] bg-mist-50 px-4 py-2">
                <span className="w-24 shrink-0 text-[11px] font-medium text-mist-400">
                  {t("compare.transifex.pricing.bandLabel")}
                </span>
                <span className="text-[11px] font-medium text-mist-400">
                  {t("compare.transifex.pricing.monthlyLabel")}
                </span>
                <span className="ml-auto text-[11px] font-medium text-mist-400">
                  {t("compare.transifex.pricing.annualLabel")}
                </span>
              </div>
              <div className="-mt-px">
                {TRANSIFEX_BANDS.map((band) => (
                  <div
                    key={band.band}
                    className="flex items-center gap-3 border-t border-black/[0.05] px-4 py-2.5"
                  >
                    <span className="w-24 shrink-0 font-mono text-[12px] tabular-nums text-mist-500">
                      {band.band}
                    </span>
                    <span className="font-mono text-[13px] tabular-nums text-mist-700">
                      {band.monthly}
                    </span>
                    <span className="ml-auto font-mono text-[13px] tabular-nums text-mist-900">
                      {band.annual}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-2 text-[11px] text-mist-400">
              {t("compare.transifex.pricing.ladderNote")}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium text-mist-400">
              {t("compare.transifex.pricing.includedLabel")}
            </p>
            <div className="mt-3 overflow-hidden">
              <div className="-mt-px">
                {["ai", "cdn", "mcp", "freeTier"].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 border-t border-black/[0.05] py-3"
                  >
                    <span className="mt-px">
                      <SupportMark state="yes" label={markLabels.yes} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-mist-900">
                        {t(`compare.transifex.pricing.included.${item}.title`)}
                      </p>
                      <p className="mt-1 text-[13px] leading-[1.55] text-mist-600">
                        {t(`compare.transifex.pricing.included.${item}.body`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.transifex.migration.eyebrow")}
          title={t("compare.transifex.migration.title")}
          subtitle={t("compare.transifex.migration.subtitle")}
        />
        <div className="mt-8">
          {["export", "import", "connect", "verify"].map((step, index) => (
            <div
              key={step}
              className={`flex gap-4 py-5 ${index === 0 ? "pt-0" : "border-t border-black/[0.05]"}`}
            >
              <StepNumber n={index + 1} />
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {t(`compare.transifex.migration.steps.${step}.title`)}
                </h3>
                <p className="mt-1.5 text-[13px] leading-[1.55] text-mist-600">
                  {t(`compare.transifex.migration.steps.${step}.body`)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[12px] leading-[1.6] text-mist-400">
          {t("compare.transifex.migration.note")}
        </p>
      </Section>

      <Divider />
      <FaqSection
        eyebrow={t("compare.transifex.faq.eyebrow")}
        title={t("compare.transifex.faq.title")}
        subtitle={t("compare.transifex.faq.subtitle")}
        items={["cheaper", "whySwitch", "migrate", "security", "which", "aiAddon"].map((id) => ({
          id,
          question: t(`compare.transifex.faq.items.${id}.question`),
          answer: t(`compare.transifex.faq.items.${id}.answer`),
        }))}
      />

      <Divider />
      <ComparisonRelatedTopics
        heading={t("compare.transifex.relatedTopics")}
        locale={locale}
        links={[
          {
            to: "/$locale/for-developers",
            title: t("compare.transifex.related.forDevs"),
            description: t("compare.transifex.related.forDevsDesc"),
          },
          {
            to: "/$locale/what-is",
            title: t("compare.transifex.related.whatIsI18n"),
            description: t("compare.transifex.related.whatIsI18nDesc"),
          },
          {
            to: "/$locale/i18n/vue",
            title: t("compare.transifex.related.vue"),
            description: t("compare.transifex.related.vueDesc"),
          },
        ]}
      />

      <OtherComparisons
        currentSlug="transifex"
        locale={locale}
        title={t("compare.otherComparisons")}
      />

      <Divider />
      <ClosingCta
        eyebrow={t("compare.transifex.closing.eyebrow")}
        title={t("compare.transifex.cta.title")}
        subtitle={t("compare.transifex.cta.subtitle")}
        primary={{ label: t("compare.transifex.cta.button"), href: "https://dash.better-i18n.com" }}
        secondary={{
          label: t("compare.transifex.closing.ctaSecondary"),
          href: "https://cal.com/better-i18n/30min?overlayCalendar=true",
        }}
      />

      <ComparisonDisclaimer />
    </MarketingLayout>
  );
}
