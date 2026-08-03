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
 * Better I18N vs Lokalise. Same shape as compare/crowdin.tsx — see that file for
 * why the shape is what it is, and why the invented "G2 / Capterra" quote block
 * is gone from these pages.
 *
 * WHAT THE COMPETITOR CLAIMS BELOW REST ON (Lokalise's own public pricing page,
 * fetched 2026-07-31 — these ARE verifiable, unlike most of what this page
 * carried before):
 *   - Published plans: Explorer $144/mo, Growth $375/mo, Advanced $999/mo,
 *     Enterprise "Book a demo" with no listed price.
 *   - "All plans come with a free 14-day trial, no credit card required."
 *   - Explorer and Growth are self-serve ("Try free"); Advanced and Enterprise
 *     route to "Book a demo" — the top half of the ladder goes through sales.
 *   - Monthly and yearly billing are both offered.
 *
 * The $144 entry point matches the already-published `features.pricingLokalise`
 * key, so that existing claim checks out. Anything not readable off a public page
 * is an em dash rather than a guess, and the `defaultValue` fallbacks were
 * removed — the CDN source_text is the only source of truth in this project.
 */

export const Route = createFileRoute("/$locale/compare/lokalise")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "compareLokalise",
      pathname: "/compare/lokalise",
      pageType: "comparison",
      structuredDataOptions: { competitorName: "Lokalise" },
    });
  },
  component: LokaliseComparisonPage,
});

const MATRIX_ROWS: { key: string; emphasis?: boolean }[] = [
  { key: "pricingModel", emphasis: true },
  { key: "entryPrice", emphasis: true },
  { key: "salesGate", emphasis: true },
  { key: "cdnDelivery" },
  { key: "otaUpdates" },
  { key: "aiApproach" },
  { key: "gitWorkflow" },
  { key: "cliSdk" },
  { key: "mcp", emphasis: true },
  { key: "typeSafety" },
  { key: "setup" },
  { key: "trial" },
  { key: "docs" },
  { key: "security" },
];

/** Their published ladder, read off their own pricing page on the date above. */
const LOKALISE_TIERS = [
  { plan: "Explorer", price: "$144/mo", access: "self" },
  { plan: "Growth", price: "$375/mo", access: "self" },
  { plan: "Advanced", price: "$999/mo", access: "sales" },
  { plan: "Enterprise", price: "—", access: "sales" },
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
        <CompetitorMark competitor="lokalise" size={28} />
        <span className="text-[13px] text-mist-600">Lokalise</span>
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

function LokaliseComparisonPage() {
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
        pillarLabel={t("compare.lokalise.hero.badge")}
        titleId="compare-lokalise-title"
        title={t("compare.lokalise.hero.title")}
        subtitle={t("compare.lokalise.hero.subtitle")}
        primary={{
          label: t("compare.lokalise.cta.button"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("compare.lokalise.hero.ctaSecondary"),
          href: `/${locale}/pricing/`,
        }}
        visual={<VersusMarks />}
      />

      {/* ── Why teams switch ─────────────────────────────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.lokalise.whySwitch.eyebrow")}
          title={t("compare.lokalise.whyBetter.title")}
          subtitle={t("compare.lokalise.whySwitch.subtitle")}
        />
        <div className="mt-8">
          <FeatureGrid cols="lg:grid-cols-3" inset={20} padY={24}>
            {[
              { icon: "zap", key: "pricing" },
              { icon: "robot", key: "mcpNative" },
              { icon: "code", key: "developerFirst" },
            ].map((item) => (
              <div
                key={item.key}
                className="feat-cell flex flex-col gap-3"
              >
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon
                    name={item.icon as "zap" | "robot" | "code"}
                    className="size-3.5"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h3 className="text-[15px] font-medium tracking-[-0.02em] text-mist-900">
                    {t(`compare.lokalise.whyBetter.${item.key}.title`)}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-mist-600">
                    {t(`compare.lokalise.whyBetter.${item.key}.description`)}
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
          eyebrow={t("compare.lokalise.matrix.eyebrow")}
          title={t("compare.lokalise.matrix.title")}
          subtitle={t("compare.lokalise.matrix.subtitle")}
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
                      <CompetitorMark competitor="lokalise" size={20} />
                      Lokalise
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
                        <span>{t(`compare.lokalise.matrix.rows.${row.key}.label`)}</span>
                      </span>
                    </th>
                    <MatrixCell tone="ours">
                      {t(`compare.lokalise.matrix.rows.${row.key}.ours`)}
                    </MatrixCell>
                    <MatrixCell tone="theirs">
                      {t(`compare.lokalise.matrix.rows.${row.key}.theirs`)}
                    </MatrixCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-[1.6] text-mist-400">
          {t("compare.lokalise.matrix.note")}
        </p>
      </Section>

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.lokalise.pricing.eyebrow")}
          title={t("compare.lokalise.pricing.title")}
          subtitle={t("compare.lokalise.pricing.subtitle")}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="text-[11px] font-medium text-mist-400">
              {t("compare.lokalise.pricing.modelLabel")}
            </p>
            <p className="mt-3 text-[13px] leading-[1.65] text-mist-600">
              {t("compare.lokalise.pricing.modelBody")}
            </p>

            {/* The point is not any single number but the step size and where
                self-serve stops. Figures are their own published ones. */}
            <div className="mt-4 overflow-hidden rounded-xl border border-black/[0.07]">
              <div className="-mt-px">
                {LOKALISE_TIERS.map((tier) => (
                  <div
                    key={tier.plan}
                    className="flex items-center gap-3 border-t border-black/[0.05] px-4 py-2.5"
                  >
                    <span className="w-24 shrink-0 text-[13px] text-mist-700">
                      {tier.plan}
                    </span>
                    <span className="font-mono text-[13px] tabular-nums text-mist-900">
                      {tier.price}
                    </span>
                    <span className="ml-auto text-[11px] text-mist-400">
                      {t(`compare.lokalise.pricing.access.${tier.access}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-2 text-[11px] text-mist-400">
              {t("compare.lokalise.pricing.ladderNote")}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium text-mist-400">
              {t("compare.lokalise.pricing.includedLabel")}
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
                        {t(`compare.lokalise.pricing.included.${item}.title`)}
                      </p>
                      <p className="mt-1 text-[13px] leading-[1.55] text-mist-600">
                        {t(`compare.lokalise.pricing.included.${item}.body`)}
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
          eyebrow={t("compare.lokalise.migration.eyebrow")}
          title={t("compare.lokalise.migration.title")}
          subtitle={t("compare.lokalise.migration.subtitle")}
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
                  {t(`compare.lokalise.migration.steps.${step}.title`)}
                </h3>
                <p className="mt-1.5 text-[13px] leading-[1.55] text-mist-600">
                  {t(`compare.lokalise.migration.steps.${step}.body`)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[12px] leading-[1.6] text-mist-400">
          {t("compare.lokalise.migration.note")}
        </p>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <Divider />
      <FaqSection
        eyebrow={t("compare.lokalise.faq.eyebrow")}
        title={t("compare.lokalise.faq.title")}
        subtitle={t("compare.lokalise.faq.subtitle")}
        items={["cheaper", "whySwitch", "migrate", "security", "which", "trial"].map(
          (id) => ({
            id,
            question: t(`compare.lokalise.faq.items.${id}.question`),
            answer: t(`compare.lokalise.faq.items.${id}.answer`),
          }),
        )}
      />

      <Divider />
      <ComparisonRelatedTopics
        heading={t("compare.lokalise.relatedTopics")}
        locale={locale}
        links={[
          {
            to: "/$locale/i18n/best-tms",
            title: t("compare.lokalise.related.bestTms"),
            description: t("compare.lokalise.related.bestTmsDesc"),
          },
          {
            to: "/$locale/integrations",
            title: t("compare.lokalise.related.integrations"),
            description: t("compare.lokalise.related.integrationsDesc"),
          },
          {
            to: "/$locale/i18n/nextjs",
            title: t("compare.lokalise.related.nextjs"),
            description: t("compare.lokalise.related.nextjsDesc"),
          },
        ]}
      />

      <OtherComparisons
        currentSlug="lokalise"
        locale={locale}
        title={t("compare.otherComparisons")}
      />

      <Divider />
      <ClosingCta
        eyebrow={t("compare.lokalise.closing.eyebrow")}
        title={t("compare.lokalise.cta.title")}
        subtitle={t("compare.lokalise.cta.subtitle")}
        primary={{
          label: t("compare.lokalise.cta.button"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("compare.lokalise.closing.ctaSecondary"),
          href: "https://cal.com/better-i18n/30min?overlayCalendar=true",
        }}
      />

      <ComparisonDisclaimer />
    </MarketingLayout>
  );
}
