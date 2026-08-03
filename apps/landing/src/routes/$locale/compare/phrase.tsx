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
  FeatureGrid,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui/page";
import { ComparisonDisclaimer } from "@/components/ComparisonDisclaimer";
import { featureIcon } from "@/components/icons/feature-icons";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

/**
 * Better I18N vs Phrase. Shape follows compare/crowdin.tsx.
 *
 * VERIFIED FROM PHRASE'S OWN PRICING PAGE (fetched 2026-07-31):
 *   - Team: $1,245/month, billed annually. Business and Enterprise: "Custom".
 *   - ALL THREE tiers are "Get in touch" — there is no self-serve purchase path.
 *   - 14-day free trial of the platform; 24/7 support on all plans.
 *   - Team capacity: 20 Strings seats, 1,200,000 Strings managed words,
 *     2,500,000 TMS processed words/year, 12M MTUs/year, 25,000 AI units/year.
 *   - Business: 150 Strings seats, 3,000,000 managed words, 12M TMS words/year,
 *     50M MTUs/year, 100,000 AI units/year. SSO appears from Business up.
 *   - Multimedia localization (Phrase Studio) is an add-on on Team and Business.
 *
 * ⚠️ STALE PUBLISHED KEY: `compare.phrase.features.pricingPhrase` currently says
 * "From $385/mo". Phrase's own page today lists Team at $1,245/mo annually, so
 * that key is wrong and this page deliberately does NOT use it. It should be
 * corrected or retired — see the summary.
 *
 * The invented "G2 / Capterra" quote block and the `defaultValue` fallbacks were
 * removed for the same reasons as on the Crowdin page.
 */

export const Route = createFileRoute("/$locale/compare/phrase")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "comparePhrase",
      pathname: "/compare/phrase",
      pageType: "comparison",
      structuredDataOptions: { competitorName: "Phrase" },
    });
  },
  component: PhraseComparisonPage,
});

const MATRIX_ROWS: { key: string; emphasis?: boolean }[] = [
  { key: "pricingModel", emphasis: true },
  { key: "entryPrice", emphasis: true },
  { key: "salesGate", emphasis: true },
  { key: "seats" },
  { key: "wordCaps", emphasis: true },
  { key: "aiUnits" },
  { key: "cdnDelivery" },
  { key: "otaUpdates" },
  { key: "gitWorkflow" },
  { key: "cliSdk" },
  { key: "mcp", emphasis: true },
  { key: "typeSafety" },
  { key: "setup" },
  { key: "sso" },
  { key: "support" },
];

/** Phrase's published capacity table, read off their pricing page. */
const PHRASE_TIERS = [
  { plan: "Team", price: "$1,245/mo", access: "sales", note: "annual" },
  { plan: "Business", price: "Custom", access: "sales", note: "quote" },
  { plan: "Enterprise", price: "Custom", access: "sales", note: "quote" },
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
        <CompetitorMark competitor="phrase" size={28} />
        <span className="text-[13px] text-mist-600">Phrase</span>
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

function PhraseComparisonPage() {
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
        pillarLabel={t("compare.phrase.hero.badge")}
        titleId="compare-phrase-title"
        title={t("compare.phrase.hero.title")}
        subtitle={t("compare.phrase.hero.subtitle")}
        primary={{ label: t("compare.phrase.cta.button"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("compare.phrase.hero.ctaSecondary"), href: `/${locale}/pricing/` }}
        visual={<VersusMarks />}
      />

      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.phrase.whySwitch.eyebrow")}
          title={t("compare.phrase.whyBetter.title")}
          subtitle={t("compare.phrase.whySwitch.subtitle")}
        />
        <div className="mt-8">
          <FeatureGrid cols="lg:grid-cols-3" inset={20} padY={24}>
            {[
              { icon: "zap", key: "pricing" },
              { icon: "rocket", key: "simplicity" },
              { icon: "robot", key: "mcpNative" },
            ].map((item) => (
              <div
                key={item.key}
                className="feat-cell flex flex-col gap-3"
              >
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon
                    name={item.icon as "zap" | "rocket" | "robot"}
                    className="size-3.5"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h3 className="text-[15px] font-medium tracking-[-0.02em] text-mist-900">
                    {t(`compare.phrase.whyBetter.${item.key}.title`)}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-mist-600">
                    {t(`compare.phrase.whyBetter.${item.key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </FeatureGrid>
        </div>
      </Section>

      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.phrase.matrix.eyebrow")}
          title={t("compare.phrase.matrix.title")}
          subtitle={t("compare.phrase.matrix.subtitle")}
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
                      <CompetitorMark competitor="phrase" size={20} />
                      Phrase
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
                        <span>{t(`compare.phrase.matrix.rows.${row.key}.label`)}</span>
                      </span>
                    </th>
                    <MatrixCell tone="ours">
                      {t(`compare.phrase.matrix.rows.${row.key}.ours`)}
                    </MatrixCell>
                    <MatrixCell tone="theirs">
                      {t(`compare.phrase.matrix.rows.${row.key}.theirs`)}
                    </MatrixCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-[1.6] text-mist-400">
          {t("compare.phrase.matrix.note")}
        </p>
      </Section>

      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.phrase.pricing.eyebrow")}
          title={t("compare.phrase.pricing.title")}
          subtitle={t("compare.phrase.pricing.subtitle")}
        />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="text-[11px] font-medium text-mist-400">
              {t("compare.phrase.pricing.modelLabel")}
            </p>
            <p className="mt-3 text-[13px] leading-[1.65] text-mist-600">
              {t("compare.phrase.pricing.modelBody")}
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-black/[0.07]">
              <div className="-mt-px">
                {PHRASE_TIERS.map((tier) => (
                  <div
                    key={tier.plan}
                    className="flex items-center gap-3 border-t border-black/[0.05] px-4 py-2.5"
                  >
                    <span className="w-24 shrink-0 text-[13px] text-mist-700">{tier.plan}</span>
                    <span className="font-mono text-[13px] tabular-nums text-mist-900">
                      {tier.price}
                    </span>
                    <span className="text-[11px] text-mist-400">
                      {t(`compare.phrase.pricing.note.${tier.note}`)}
                    </span>
                    <span className="ml-auto text-[11px] text-mist-400">
                      {t("compare.phrase.pricing.access.sales")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-2 text-[11px] text-mist-400">
              {t("compare.phrase.pricing.ladderNote")}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium text-mist-400">
              {t("compare.phrase.pricing.includedLabel")}
            </p>
            <div className="mt-3 overflow-hidden">
              <div className="-mt-px">
                {["selfServe", "cdn", "mcp", "freeTier"].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 border-t border-black/[0.05] py-3"
                  >
                    <span className="mt-px">
                      <SupportMark state="yes" label={markLabels.yes} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-mist-900">
                        {t(`compare.phrase.pricing.included.${item}.title`)}
                      </p>
                      <p className="mt-1 text-[13px] leading-[1.55] text-mist-600">
                        {t(`compare.phrase.pricing.included.${item}.body`)}
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
          eyebrow={t("compare.phrase.migration.eyebrow")}
          title={t("compare.phrase.migration.title")}
          subtitle={t("compare.phrase.migration.subtitle")}
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
                  {t(`compare.phrase.migration.steps.${step}.title`)}
                </h3>
                <p className="mt-1.5 text-[13px] leading-[1.55] text-mist-600">
                  {t(`compare.phrase.migration.steps.${step}.body`)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[12px] leading-[1.6] text-mist-400">
          {t("compare.phrase.migration.note")}
        </p>
      </Section>

      <Divider />
      <FaqSection
        eyebrow={t("compare.phrase.faq.eyebrow")}
        title={t("compare.phrase.faq.title")}
        subtitle={t("compare.phrase.faq.subtitle")}
        items={["cheaper", "whySwitch", "migrate", "security", "which", "smallTeam"].map((id) => ({
          id,
          question: t(`compare.phrase.faq.items.${id}.question`),
          answer: t(`compare.phrase.faq.items.${id}.answer`),
        }))}
      />

      <Divider />
      <ComparisonRelatedTopics
        heading={t("compare.phrase.relatedTopics")}
        locale={locale}
        links={[
          {
            to: "/$locale/features",
            title: t("compare.phrase.related.features"),
            description: t("compare.phrase.related.featuresDesc"),
          },
          {
            to: "/$locale/for-developers",
            title: t("compare.phrase.related.forDevs"),
            description: t("compare.phrase.related.forDevsDesc"),
          },
          {
            to: "/$locale/what-is-localization",
            title: t("compare.phrase.related.l10n"),
            description: t("compare.phrase.related.l10nDesc"),
          },
        ]}
      />

      <OtherComparisons currentSlug="phrase" locale={locale} title={t("compare.otherComparisons")} />

      <Divider />
      <ClosingCta
        eyebrow={t("compare.phrase.closing.eyebrow")}
        title={t("compare.phrase.cta.title")}
        subtitle={t("compare.phrase.cta.subtitle")}
        primary={{ label: t("compare.phrase.cta.button"), href: "https://dash.better-i18n.com" }}
        secondary={{
          label: t("compare.phrase.closing.ctaSecondary"),
          href: "https://cal.com/better-i18n/30min?overlayCalendar=true",
        }}
      />

      <ComparisonDisclaimer />
    </MarketingLayout>
  );
}
