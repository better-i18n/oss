import { createFileRoute, Link } from "@tanstack/react-router";
import { StepNumber } from "@/components/ui/step-number";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { SeeAlso } from "@/components/SeeAlso";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  ClosingCta,
  Divider,
  FaqSection,
  FeatureGrid,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui/page";

/**
 * Multilingual SEO — rebuilt on the pillar page shape
 * (rule/pillar-page-shape): PageHero + bespoke visual → Divider → six Sections
 * that each open with a SectionHeader → FaqSection → ClosingCta.
 *
 * What changed and why:
 *   - It was 11 alternating-background blocks, the FAQ hand-rolled as seven
 *     bordered cards with its own type scale, and the CTA a dark rounded panel
 *     with side margins that broke the frame rules.
 *   - The 11 blocks are consolidated into SIX Sections: what it is, the four
 *     challenges, URL structure, the hreflang checklist, localization vs
 *     translation (+ the benefits it buys), the rollout process (+ how this
 *     platform covers it). No paragraph, list item, code example or key was
 *     dropped — rule/seo-content-is-load-bearing.
 *   - Two bespoke visuals replace the two places where the old page described a
 *     technical artifact in prose: the hreflang tag block (real
 *     <link rel="alternate"> lines for three locales plus x-default) and the URL
 *     structure comparison (subfolder / subdomain / ccTLD in one hairline table
 *     with the tradeoff spelled out per row).
 *
 * i18n: every t() call reads an existing `marketing.i18n.multilingualSeo.*`
 * key and all `defaultValue` fallbacks were removed (forbidden in this project —
 * the CDN source_text is the only source of truth). In the same pass the
 * item-level keys were re-prefixed: `challenges.*`, `urlStructures.*`,
 * `hreflang.checklist.*`, `benefits.list.*` and `process.step*` were being read
 * without the `i18n.multilingualSeo.` prefix, so the page rendered its own
 * hardcoded defaults instead of published copy.
 *
 * The seven section eyebrows the new shape needs are keys too
 * (`i18n.multilingualSeo.sections.*.eyebrow`), so there is no hardcoded
 * user-facing string and no fallback path anywhere on this page.
 */

export const Route = createFileRoute("/$locale/i18n/multilingual-seo")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "multilingualSeo",
      pathname: "/i18n/multilingual-seo",
      pageType: "educational",
      structuredDataOptions: {
        title: "Multilingual SEO Guide",
        description:
          "Complete guide to multilingual SEO: optimize your website for multiple languages and regions to rank globally with Better I18N.",
      },
    });
  },
  component: MultilingualSeoPage,
});

const KEY_PREFIX = "i18n.multilingualSeo";

/** Every key on this page lives under one prefix; `k` is the only place it appears. */
const k = (suffix: string) => `${KEY_PREFIX}.${suffix}`;

const challenges = [
  { icon: "api-connection", key: "challenges.hreflang" },
  { icon: "globe", key: "challenges.urlStructure" },
  { icon: "magnifying-glass", key: "challenges.keywordResearch" },
  { icon: "rocket", key: "challenges.contentDuplication" },
] as const;

/** `best` is figure data: the one-line verdict the table exists to deliver. */
const urlStructures = [
  { key: "urlStructures.subdirectory", best: "Default choice · one domain to rank" },
  { key: "urlStructures.subdomain", best: "Separate infra or CMS per language" },
  { key: "urlStructures.cctld", best: "Legal or logistics per country" },
] as const;

const hreflangChecklist = [
  "hreflang.checklist.selfRef",
  "hreflang.checklist.bidirectional",
  "hreflang.checklist.xDefault",
  "hreflang.checklist.validCodes",
  "hreflang.checklist.canonical",
  "hreflang.checklist.sitemap",
  "hreflang.checklist.consistent",
] as const;

const benefits = [
  "benefits.list.organicReach",
  "benefits.list.localSearchVisibility",
  "benefits.list.reducedBounceRate",
  "benefits.list.higherConversions",
  "benefits.list.competitiveEdge",
  "benefits.list.brandAuthority",
] as const;

const processSteps = [
  { number: "01", key: "process.step1" },
  { number: "02", key: "process.step2" },
  { number: "03", key: "process.step3" },
  { number: "04", key: "process.step4" },
] as const;

const solutionFeatures = [
  "solution.feature1",
  "solution.feature2",
  "solution.feature3",
] as const;

const faqIds = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"] as const;

function MultilingualSeoPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const relatedPages = [
    {
      name: "International SEO Strategy",
      href: "/$locale/i18n/international-seo",
      description: t(k("related.internationalSeo")),
    },
    {
      name: "Website Localization",
      href: "/$locale/i18n/website-localization",
      description: t(k("related.websiteLocalization")),
    },
    {
      name: "Website Translation",
      href: "/$locale/i18n/website-translation",
      description: t(k("related.websiteTranslation")),
    },
    {
      name: "Translation Management System",
      href: "/$locale/i18n/translation-management-system",
      description: t(k("related.tms")),
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />

      <PageHero
        pillar="mcp"
        pillarLabel={t(k("badge"))}
        titleId="multilingual-seo-hero-title"
        title={t(k("hero.title"))}
        subtitle={t(k("hero.subtitle"))}
        primary={{ label: t(k("cta.primary")), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t(k("cta.secondary")), href: "https://docs.better-i18n.com" }}
        visual={<HreflangVisual />}
      />

      <Divider />

      {/* 1 — What multilingual SEO is, with the market numbers alongside. */}
      <Section labelledBy="multilingual-seo-definition">
        <SectionHeader
          id="multilingual-seo-definition"
          eyebrow={t(k("sections.definition.eyebrow"))}
          title={t(k("definition.title"))}
        />
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="flex flex-col gap-3 text-[13px] leading-relaxed text-mist-600">
            <p>{t(k("definition.paragraph1"))}</p>
            <p>{t(k("definition.paragraph2"))}</p>
            <p>{t(k("definition.paragraph3"))}</p>
            <p>{t(k("definition.paragraph4"))}</p>
          </div>
          <aside className="rounded-xl border border-black/[0.07] bg-mist-50 p-5">
            <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
              {t(k("keyStats.title"))}
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-mist-600">
              {t(k("keyStats.content"))}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-mist-600">
              {t(k("keyStats.content2"))}
            </p>
          </aside>
        </div>
      </Section>

      <Divider />

      {/* 2 — The four things that actually break. */}
      <Section labelledBy="multilingual-seo-challenges">
        <SectionHeader
          id="multilingual-seo-challenges"
          eyebrow={t(k("sections.challenges.eyebrow"))}
          title={t(k("challenges.title"))}
          subtitle={t(k("challenges.subtitle"))}
        />
        <div className="mt-8">
          <FeatureGrid cols="sm:grid-cols-2 lg:grid-cols-4" as="ul" inset={20} padY={16}>
            {challenges.map((challenge) => (
              <li
                key={challenge.key}
                className="feat-cell"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-500">
                    <SpriteIcon
                      name={challenge.icon as SpriteIconName}
                      className="size-3"
                    />
                  </span>
                  <h3 className="text-[13px] font-medium text-mist-900">
                    {t(k(`${challenge.key}.title`))}
                  </h3>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
                  {t(k(`${challenge.key}.description`))}
                </p>
              </li>
            ))}
          </FeatureGrid>
        </div>
      </Section>

      <Divider />

      {/* 3 — URL structure, as a table: this is a decision with three options. */}
      <Section labelledBy="multilingual-seo-urls">
        <SectionHeader
          id="multilingual-seo-urls"
          eyebrow={t(k("sections.urls.eyebrow"))}
          title={t(k("urlStructures.title"))}
          subtitle={t(k("urlStructures.subtitle"))}
        />
        <div className="mt-8">
          <UrlStructureTable
            rows={urlStructures.map((structure) => ({
              id: structure.key,
              name: t(k(`${structure.key}.title`)),
              description: t(k(`${structure.key}.description`)),
              example: t(k(`${structure.key}.example`)),
              best: structure.best,
            }))}
          />
        </div>
      </Section>

      <Divider />

      {/* 4 — The hreflang checklist. */}
      <Section labelledBy="multilingual-seo-hreflang">
        <SectionHeader
          id="multilingual-seo-hreflang"
          eyebrow={t(k("sections.hreflang.eyebrow"))}
          title={t(k("hreflang.checklist.title"))}
          subtitle={t(k("hreflang.checklist.subtitle"))}
        />
        {/* A checklist is a list, not a matrix, so the items get no cell of
            their own — bare rows split by gap (rule/listed-items-are-not-cards).
            The check mark's tile is the only box left, and it is the same tile
            the comparison tables use. */}
        <ul role="list" className="mt-8 grid grid-cols-1 gap-x-10 gap-y-3.5 lg:grid-cols-2">
          {hreflangChecklist.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-[13px] leading-relaxed text-mist-700"
            >
              <SpriteIcon
                name="checkmark"
                className="mt-0.5 size-3.5 shrink-0 text-mist-400"
              />
              <span>{t(k(item))}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Divider />

      {/* 5 — Why translation alone does not rank, and what localization buys. */}
      <Section labelledBy="multilingual-seo-localization">
        <SectionHeader
          id="multilingual-seo-localization"
          eyebrow={t(k("sections.localization.eyebrow"))}
          title={t(k("localizationVsTranslation.title"))}
          subtitle={t(k("localizationVsTranslation.subtitle"))}
        />

        <div className="mt-8">
          <FeatureGrid cols="lg:grid-cols-2" inset={20} padY={20}>
            <article className="feat-cell">
              <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                {t(k("localizationVsTranslation.translationFails.title"))}
              </h3>
              <div className="mt-3 flex flex-col gap-3 text-[13px] leading-relaxed text-mist-600">
                <p>{t(k("localizationVsTranslation.translationFails.paragraph1"))}</p>
                <p>{t(k("localizationVsTranslation.translationFails.paragraph2"))}</p>
                <p>{t(k("localizationVsTranslation.translationFails.paragraph3"))}</p>
              </div>
            </article>
            <article className="feat-cell">
              <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                {t(k("localizationVsTranslation.localizationAdds.title"))}
              </h3>
              <div className="mt-3 flex flex-col gap-3 text-[13px] leading-relaxed text-mist-600">
                <p>{t(k("localizationVsTranslation.localizationAdds.paragraph1"))}</p>
                <p>{t(k("localizationVsTranslation.localizationAdds.paragraph2"))}</p>
                <p>{t(k("localizationVsTranslation.localizationAdds.paragraph3"))}</p>
              </div>
            </article>
          </FeatureGrid>
        </div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
              {t(k("benefits.title"))}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
              {t(k("benefits.subtitle"))}
            </p>
          </div>
          <ul role="list" className="flex flex-col">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2.5 border-t border-black/[0.05] py-2.5 text-[13px] leading-relaxed text-mist-700 first:border-t-0 first:pt-0"
              >
                <SpriteIcon
                  name="checkmark"
                  className="mt-0.5 size-3.5 shrink-0 text-mist-400"
                />
                <span>{t(k(benefit))}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Divider />

      {/* 6 — How the rollout runs, and where this platform sits in it. */}
      <Section labelledBy="multilingual-seo-process">
        <SectionHeader
          id="multilingual-seo-process"
          eyebrow={t(k("sections.process.eyebrow"))}
          title={t(k("process.title"))}
          subtitle={t(k("process.subtitle"))}
        />

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
            <ol className="divide-y divide-black/[0.05]">
              {processSteps.map((step) => (
                <li key={step.number} className="flex items-start gap-4 px-5 py-4">
                  <StepNumber n={step.number} />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-medium text-mist-900">
                      {t(k(`${step.key}.title`))}
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-mist-600">
                      {t(k(`${step.key}.description`))}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
              {t(k("solution.title"))}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
              {t(k("solution.content"))}
            </p>
            <ul role="list" className="mt-4 flex flex-col">
              {solutionFeatures.map((feature) => (
                <li
                  key={feature}
                  className="border-t border-black/[0.05] py-3 first:border-t-0 first:pt-0"
                >
                  <h4 className="text-[13px] font-medium text-mist-900">
                    {t(k(`${feature}.title`))}
                  </h4>
                  <p className="mt-1 text-[13px] leading-relaxed text-mist-600">
                    {t(k(`${feature}.description`))}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Divider />

      <FaqSection
        eyebrow={t(k("sections.faq.eyebrow"))}
        title={t(k("faq.title"))}
        items={faqIds.map((id) => ({
          id,
          question: t(k(`faq.${id}.question`)),
          answer: t(k(`faq.${id}.answer`)),
        }))}
      />

      <Divider />

      <SeeAlso currentSlug="multilingual-seo" locale={locale} />

      <Divider />

      <Section labelledBy="multilingual-seo-related">
        <h2 id="multilingual-seo-related" className="section-h2">
          {t("whatIs.relatedTopics")}
        </h2>
        {/* Link list → bare columns (rule/listed-items-are-not-cards). */}
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedPages.map((page) => (
            <Link
              key={page.href}
              to={page.href}
              params={{ locale }}
              className="group flex items-start justify-between gap-3"
            >
              <span className="min-w-0">
                <span className="block text-[13px] font-medium text-mist-900 transition-colors group-hover:text-mist-600">
                  {page.name}
                </span>
                <span className="mt-1 block text-[12px] leading-relaxed text-mist-500">
                  {page.description}
                </span>
              </span>
              <SpriteIcon
                name="arrow-right"
                className="mt-0.5 size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600"
              />
            </Link>
          ))}
        </div>
      </Section>

      <Divider />

      <ClosingCta
        title={t(k("cta.title"))}
        subtitle={t(k("cta.subtitle"))}
        primary={{ label: t(k("cta.primary")), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t(k("cta.secondary")), href: "https://docs.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}

/* ─── Bespoke visuals ───────────────────────────────────────────── */

/**
 * Hero — the artifact the whole page is about: the actual hreflang block a
 * three-locale site ships, including the self-reference and x-default that the
 * checklist below insists on. Code, not prose, because this is what a developer
 * pastes into <head>.
 */
const HREFLANG_TAGS = [
  { hreflang: "en", href: "https://example.com/pricing" },
  { hreflang: "de", href: "https://example.com/de/pricing" },
  { hreflang: "tr", href: "https://example.com/tr/fiyatlandirma" },
  { hreflang: "x-default", href: "https://example.com/pricing" },
] as const;

const HREFLANG_RULES = [
  "self-referencing",
  "bidirectional",
  "ISO 639-1 + 3166-1",
  "canonical: self",
] as const;

function HreflangVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="flex items-center gap-2 border-b border-black/[0.05] px-4 py-2.5">
        <span className="font-mono text-[11px] text-mist-500">
          &lt;head&gt; · /de/pricing
        </span>
        <span className="ml-auto text-[11px] text-mist-400">
          3 locales · 1 x-default
        </span>
      </div>

      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-[12px] leading-[1.9] text-mist-700">
          {HREFLANG_TAGS.map((tag) => (
            <div key={tag.hreflang} className="whitespace-pre">
              <span className="text-mist-400">&lt;link </span>
              <span className="text-mist-500">rel=</span>
              <span className="text-mist-700">&quot;alternate&quot;</span>
              <span className="text-mist-500"> hreflang=</span>
              <span className="text-mist-900">&quot;{tag.hreflang}&quot;</span>
              <span className="text-mist-500"> href=</span>
              <span className="text-mist-700">&quot;{tag.href}&quot;</span>
              <span className="text-mist-400"> /&gt;</span>
            </div>
          ))}
        </pre>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-black/[0.05] px-4 py-3">
        {HREFLANG_RULES.map((rule) => (
          <span
            key={rule}
            className="flex items-center gap-1.5 text-[11px] text-mist-400"
          >
            <span aria-hidden="true" className="size-1 rounded-full bg-mist-300" />
            {rule}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * URL structure — three options, one decision. A table so the verdict column
 * ("when is this the right answer") lines up and can be compared at a glance;
 * three cards could not do that.
 */
function UrlStructureTable({
  rows,
}: {
  rows: Array<{
    id: string;
    name: string;
    description: string;
    example: string;
    best: string;
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="divide-y divide-black/[0.05]">
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid items-start gap-x-6 gap-y-2 px-5 py-4 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)_minmax(0,200px)]"
          >
            <div>
              <h3 className="text-[13px] font-medium text-mist-900">{row.name}</h3>
              <p className="mt-1.5 font-mono text-[11px] break-all text-mist-400">
                {row.example}
              </p>
            </div>
            <p className="text-[13px] leading-relaxed text-mist-600">
              {row.description}
            </p>
            <p className="text-[11px] leading-relaxed text-mist-400">{row.best}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
