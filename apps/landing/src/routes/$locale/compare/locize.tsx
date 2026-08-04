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
 * Better I18N vs Locize — same skeleton as compare/crowdin.tsx (the reference
 * implementation): PageHero → Divider → Sections that each open with a
 * SectionHeader → FaqSection → ClosingCta → legal disclaimer.
 *
 * WHY THIS PAGE EXISTS: Locize published their own "Locize vs. Better i18n"
 * comparison and we had no Locize page at all, so that query was theirs alone.
 *
 * WHY IT CONCEDES SO MUCH: their page is unusually fair — it opens with what we
 * do well and cites our own docs for the gaps. The only credible reply to a fair
 * page is a fair page. Every gap they name that we could confirm is confirmed
 * here (translator tooling, translation memory, non-JSON formats in the platform,
 * EU residency, versioned releases), and `compare.locize.fits.*` is a whole
 * section telling the reader to choose Locize when those things matter. Claiming
 * a translation memory we do not have would be caught by any evaluator in ten
 * minutes and would cost more than the row is worth.
 *
 * SOURCES FOR EVERY LOCIZE VALUE, all read 2026-08-01:
 *  - locize.com/pricing — Free $0, Starter $7, Starter-Plus $19, Growth $49,
 *    Professional $99, Professional-Plus $149, Enterprise $199, all /mo billed
 *    monthly and priced PER PROJECT; usage-based plan with a $5/mo base fee and
 *    no language/user/namespace limits; the "15,000 words ≈ 3,000 source words ×
 *    5 languages" worked example on the Starter plan is theirs verbatim; CDN
 *    downloads included on every plan, split standard / pro.
 *  - locize.com/compare/locize-vs-better-i18n — their MCP server has 26 tools
 *    with OAuth 2.0 read/write/manage/admin scopes and is in the official MCP
 *    registry; format list (XLIFF, PO, Android XML, iOS .strings, resx, YAML,
 *    CSV, XLSX); translation memory + glossary + styleguide; in-context editor,
 *    screenshot context, review workflow, per-user permissions; versioned
 *    publishing, git-style branches, per-tenant overrides; EU infrastructure on
 *    AWS Ireland; BYOK AI (OpenAI, Gemini, Mistral) with quality estimation.
 *    Their own matrix marks "GitHub App with automated PRs" as not available on
 *    their side — that is why `gitWorkflow.theirs` is an em dash rather than a
 *    claim of ours.
 *
 * SOURCES FOR OUR OWN VALUES (we hold ourselves to the same rule):
 *  - Flat $20/mo Pro and the free tier: our own /pricing page.
 *  - 17 translation tools + 11 content tools: docs.better-i18n.com/mcp.
 *  - TypeScript type generation: docs.better-i18n.com/cli.
 *  - Nine-format converter: /tools/translation-file-converter on this site.
 *  - CDN always answers 200 with a stale fallback, ~60s propagation: the CDN
 *    architecture in oss/CLAUDE.md, which the worker implements.
 *  - Expo SDK built on i18next: packages/expo depends on i18next.
 *
 * `dataResidency.ours` is an em dash on purpose. We do not publish a region
 * commitment, and inventing one on a comparison page is exactly the failure this
 * page set exists to avoid.
 */

const PILLAR_KEYWORDS = ["locize", "i18next", "comparison"] as const;

const baseLoader = createPageLoader();

export const Route = createFileRoute("/$locale/compare/locize")({
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
      pageKey: "compareLocize",
      pathname: "/compare/locize",
      pageType: "comparison",
      structuredDataOptions: { competitorName: "Locize" },
    });
  },
  component: LocizeComparisonPage,
});

/* ─── Comparison matrix ───────────────────────────────────────────────────
   Rows carry nuance, not ticks. Four rows resolve to an em dash on OUR side —
   translator tooling, translation memory, data residency, and formats inside
   the platform — and that is the point: this is the one competitor whose own
   comparison of us is accurate, so a matrix that scored 14–0 for us would read
   as a lie next to their page.

   Row keys double as translation-key suffixes under compare.locize.matrix.rows.
   `emphasis` marks the rows where the difference is structural. */
const MATRIX_ROWS: { key: string; emphasis?: boolean }[] = [
  { key: "pricingModel", emphasis: true },
  { key: "i18next", emphasis: true },
  { key: "mcp", emphasis: true },
  { key: "aiApproach" },
  { key: "fileFormats", emphasis: true },
  { key: "gitWorkflow" },
  { key: "cliSdk" },
  { key: "typeSafety" },
  { key: "translatorTooling" },
  { key: "translationMemory" },
  { key: "releaseControl" },
  { key: "cdnDelivery" },
  { key: "dataResidency" },
  { key: "seats" },
];

/* Hero mark pair, identical to the other compare pages: our tile against their
   own mark, so the page names who it is talking about instead of being coy. */
function VersusMarks() {
  return (
    <div className="flex w-fit items-center gap-3 rounded-xl border border-black/[0.07] bg-white px-4 py-3">
      <span className="flex items-center gap-2">
        <ProductTile product="i18n" size="sm" />
        <span className="text-[13px] font-medium text-mist-900">Better I18N</span>
      </span>
      <span className="text-[12px] text-mist-400">vs</span>
      <span className="flex items-center gap-2">
        <CompetitorMark competitor="locize" size={28} />
        <span className="text-[13px] text-mist-600">Locize</span>
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

function LocizeComparisonPage() {
  const t = useT("marketing");
  const tCta = useT("cta");
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
        pillarLabel={t("compare.locize.hero.badge")}
        titleId="compare-locize-title"
        title={t("compare.locize.hero.title")}
        subtitle={t("compare.locize.hero.subtitle")}
        primary={{
          label: t("compare.locize.cta.button"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("compare.locize.hero.ctaSecondary"),
          href: `/${locale}/pricing/`,
        }}
        visual={<VersusMarks />}
      />

      {/* ── What we optimise for ─────────────────────────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.locize.whySwitch.eyebrow")}
          title={t("compare.locize.whyBetter.title")}
          subtitle={t("compare.locize.whySwitch.subtitle")}
        />
        <div className="mt-8">
          <FeatureGrid cols="lg:grid-cols-3" inset={20} padY={24}>
            {[
              { icon: "code", key: "codeNative" },
              { icon: "robot", key: "agentNative" },
              { icon: "sparkles-soft", key: "flatPrice" },
            ].map((item) => (
              <div
                key={item.key}
                className="feat-cell flex flex-col gap-3"
              >
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon
                    name={item.icon as "code" | "robot" | "sparkles-soft"}
                    className="size-3.5"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h3 className="text-[15px] font-medium tracking-[-0.02em] text-mist-900">
                    {t(`compare.locize.whyBetter.${item.key}.title`)}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-mist-600">
                    {t(`compare.locize.whyBetter.${item.key}.description`)}
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
          eyebrow={t("compare.locize.matrix.eyebrow")}
          title={t("compare.locize.matrix.title")}
          subtitle={t("compare.locize.matrix.subtitle")}
        />

        {/* Hairline matrix: cells draw their own top + left rule, the table is
            shifted -1px, and the container clips the overhang. Scroll is
            contained inside the container, never on the page. */}
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
                    <span className="flex items-center gap-1.5">
                      <CompetitorMark competitor="locize" size={20} />
                      Locize
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
                        <span>{t(`compare.locize.matrix.rows.${row.key}.label`)}</span>
                      </span>
                    </th>
                    <MatrixCell tone="ours">
                      {t(`compare.locize.matrix.rows.${row.key}.ours`)}
                    </MatrixCell>
                    <MatrixCell tone="theirs">
                      {t(`compare.locize.matrix.rows.${row.key}.theirs`)}
                    </MatrixCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-[1.6] text-mist-400">
          {t("compare.locize.matrix.note")}
        </p>
      </Section>

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.locize.pricing.eyebrow")}
          title={t("compare.locize.pricing.title")}
          subtitle={t("compare.locize.pricing.subtitle")}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          {/* How their model scales */}
          <div>
            <p className="text-[11px] font-medium text-mist-400">
              {t("compare.locize.pricing.modelLabel")}
            </p>
            <p className="mt-3 text-[13px] leading-[1.65] text-mist-600">
              {t("compare.locize.pricing.modelBody")}
            </p>

            {/* The multiplication, shown rather than described. These three
                numbers are Locize's own worked example for the Starter plan. */}
            <div className="mt-4 overflow-hidden rounded-xl border border-black/[0.07] bg-mist-50 px-4 py-3">
              <p className="font-mono text-[12px] leading-[1.7] text-mist-700">
                3,000 {t("compare.locize.pricing.wordsUnit")}
                <span className="text-mist-400"> × </span>
                5 {t("compare.locize.pricing.localesUnit")}
                <span className="text-mist-400"> = </span>
                <span className="text-mist-900">
                  15,000 {t("compare.locize.pricing.hostedWordsUnit")}
                </span>
              </p>
              <p className="mt-1.5 text-[11px] text-mist-400">
                {t("compare.locize.pricing.exampleNote")}
              </p>
            </div>
          </div>

          {/* What the flat plan covers */}
          <div>
            <p className="text-[11px] font-medium text-mist-400">
              {t("compare.locize.pricing.includedLabel")}
            </p>
            <div className="mt-3 overflow-hidden">
              <div className="-mt-px">
                {["flatPrice", "cdn", "mcp", "freeTier"].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 border-t border-black/[0.05] py-3"
                  >
                    <span className="mt-px">
                      <SupportMark state="yes" label={markLabels.yes} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-mist-900">
                        {t(`compare.locize.pricing.included.${item}.title`)}
                      </p>
                      <p className="mt-1 text-[13px] leading-[1.55] text-mist-600">
                        {t(`compare.locize.pricing.included.${item}.body`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Where Locize wins ────────────────────────────────────────────
          The section that makes the rest of the page believable. Four cases
          where we tell the reader to buy the other product, each one a gap
          Locize named in their own comparison and we confirmed. */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.locize.fits.eyebrow")}
          title={t("compare.locize.fits.title")}
          subtitle={t("compare.locize.fits.subtitle")}
        />
        <div className="mt-8">
          <FeatureGrid cols="sm:grid-cols-2" inset={20} padY={24}>
            {["i18next", "formats", "translators", "compliance"].map((item) => (
              <div
                key={item}
                className="feat-cell flex gap-3"
              >
                <span className="mt-0.5">
                  <CompetitorMark competitor="locize" size={22} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                    {t(`compare.locize.fits.items.${item}.title`)}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-mist-600">
                    {t(`compare.locize.fits.items.${item}.body`)}
                  </p>
                </div>
              </div>
            ))}
          </FeatureGrid>
        </div>
      </Section>

      {/* ── Migration ────────────────────────────────────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.locize.migration.eyebrow")}
          title={t("compare.locize.migration.title")}
          subtitle={t("compare.locize.migration.subtitle")}
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
                  {t(`compare.locize.migration.steps.${step}.title`)}
                </h3>
                <p className="mt-1.5 text-[13px] leading-[1.55] text-mist-600">
                  {t(`compare.locize.migration.steps.${step}.body`)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[12px] leading-[1.6] text-mist-400">
          {t("compare.locize.migration.note")}
        </p>
      </Section>

      <Divider />
      <PillarBlogPosts posts={pillarPosts} locale={locale} />

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <Divider />
      <FaqSection
        eyebrow={t("compare.locize.faq.eyebrow")}
        title={t("compare.locize.faq.title")}
        subtitle={t("compare.locize.faq.subtitle")}
        items={["whichOne", "i18nextUsers", "formats", "pricing", "agents", "migrate"].map(
          (id) => ({
            id,
            question: t(`compare.locize.faq.items.${id}.question`),
            answer: t(`compare.locize.faq.items.${id}.answer`),
          }),
        )}
      />

      <Divider />
      <ComparisonRelatedTopics
        heading={t("compare.locize.relatedTopics")}
        locale={locale}
        links={[
          {
            to: "/$locale/what-is",
            title: t("compare.locize.related.whatIsI18n"),
            description: t("compare.locize.related.whatIsI18nDesc"),
          },
          {
            to: "/$locale/i18n/react",
            title: t("compare.locize.related.react"),
            description: t("compare.locize.related.reactDesc"),
          },
          {
            to: "/$locale/features",
            title: t("compare.locize.related.features"),
            description: t("compare.locize.related.featuresDesc"),
          },
        ]}
      />

      <OtherComparisons
        currentSlug="locize"
        locale={locale}
        title={t("compare.otherComparisons")}
      />

      <Divider />
      <ClosingCta
        eyebrow={t("compare.locize.closing.eyebrow")}
        title={t("compare.locize.cta.title")}
        subtitle={t("compare.locize.cta.subtitle")}
        primary={{
          label: t("compare.locize.cta.button"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("compare.locize.closing.ctaSecondary"),
          href: "https://cal.com/better-i18n/30min?overlayCalendar=true",
        }}
        /* The customer wall on a comparison page: this is where a reader is
           choosing between us and somebody else, which makes it the single
           place on the site where "who already chose this" carries the most
           weight. `trustedBy` is in the shared `cta` namespace, translated in
           all 22 locales. */
        customers={{ label: tCta("trustedBy") }}
      />

      <ComparisonDisclaimer />
    </MarketingLayout>
  );
}
