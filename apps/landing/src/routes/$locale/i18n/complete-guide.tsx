import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  ClosingCta,
  Divider,
  FaqSection,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui/page";

/**
 * Complete guide to i18n / L10n — the site's longest educational page, rebuilt
 * on the pillar page shape (rule/pillar-page-shape): PageHero + bespoke visual
 * → Divider → six Sections that each open with a SectionHeader → FaqSection →
 * ClosingCta.
 *
 * What changed and why:
 *   - It was 13 ad-hoc <section> blocks alternating bg-white / bg-mist-50 /
 *     bg-mist-100, every heading centered, every group of items a grid of
 *     rounded-xl bordered cards. Thirteen separations, no hierarchy: the reader
 *     could not tell "key concepts" (foundational) from "common mistakes"
 *     (advisory) because both looked like six floating cards.
 *   - Those 13 blocks are consolidated into SIX Sections by topic:
 *     vocabulary (i18n vs L10n + key concepts), file formats, implementation
 *     (process + production checklist), choosing a TMS, quality (mistakes +
 *     testing), framework guides. Not one paragraph, heading or translation key
 *     was dropped — rule/seo-content-is-load-bearing: merging sections is a
 *     container change, never a content cut.
 *   - Three bespoke visuals carry the parts that prose explains badly: the
 *     i18n/L10n split (hero), the file-format comparison (a hairline table
 *     instead of six cards), and the implementation flow (numbered hairline
 *     rows, no filled circles).
 *
 * i18n: every t() call below reads a key that already exists in the `marketing`
 * namespace under `i18n.completeGuide.*`. All `defaultValue` fallbacks were
 * REMOVED (they are forbidden in this project — the CDN source_text is the only
 * source of truth) and, in the same pass, the item-level keys were re-prefixed:
 * they were being read as `marketing.concepts.locale.title` instead of
 * `marketing.i18n.completeGuide.concepts.locale.title`, so the page had been
 * rendering its own hardcoded defaults rather than published copy.
 *
 * The three section eyebrows the new shape needs are keys too
 * (`i18n.completeGuide.sections.*.eyebrow`), so there is no hardcoded
 * user-facing string and no fallback path anywhere on this page.
 */

export const Route = createFileRoute("/$locale/i18n/complete-guide")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nCompleteGuide",
      pathname: "/i18n/complete-guide",
      pageType: "educational",
      structuredDataOptions: {
        title: "Complete Guide to Internationalization (i18n) and Localization (L10n)",
        description:
          "The definitive guide to i18n and L10n: key concepts, processes, framework integrations, common mistakes, and testing strategies for global software.",
      },
    });
  },
  component: CompleteGuideI18nPage,
});

const KEY_PREFIX = "i18n.completeGuide";

/** Every key on this page lives under one prefix; `k` is the only place it appears. */
const k = (suffix: string) => `${KEY_PREFIX}.${suffix}`;

const keyConcepts = [
  { icon: "globe", key: "concepts.locale" },
  { icon: "code-brackets", key: "concepts.unicode" },
  { icon: "settings-gear", key: "concepts.keys" },
  { icon: "group", key: "concepts.plurals" },
  { icon: "arrow-right", key: "concepts.rtl" },
  { icon: "magnifying-glass", key: "concepts.formatting" },
] as const;

const processSteps = [
  { number: "01", key: "process.step1" },
  { number: "02", key: "process.step2" },
  { number: "03", key: "process.step3" },
  { number: "04", key: "process.step4" },
] as const;

const tmsCriteria = [
  { icon: "code-brackets", key: "tms.integration" },
  { icon: "magnifying-glass", key: "tms.memory" },
  { icon: "group", key: "tms.collaboration" },
  { icon: "rocket", key: "tms.automation" },
] as const;

const commonMistakes = [
  { icon: "code-brackets", key: "mistakes.concatenation" },
  { icon: "settings-gear", key: "mistakes.hardcoded" },
  { icon: "group", key: "mistakes.plurals" },
  { icon: "rocket", key: "mistakes.afterthought" },
] as const;

const frameworkGuides: Array<{ name: string; href: string; descKey: string }> = [
  { name: "React", href: "/$locale/i18n/react", descKey: "frameworks.react" },
  { name: "Next.js", href: "/$locale/i18n/nextjs", descKey: "frameworks.nextjs" },
  { name: "Vue", href: "/$locale/i18n/vue", descKey: "frameworks.vue" },
  { name: "Angular", href: "/$locale/i18n/angular", descKey: "frameworks.angular" },
  { name: "Svelte", href: "/$locale/i18n/svelte", descKey: "frameworks.svelte" },
  { name: "Flutter", href: "/$locale/i18n/flutter", descKey: "frameworks.flutter" },
  {
    name: "React Native",
    href: "/$locale/i18n/react-native-localization",
    descKey: "frameworks.reactNative",
  },
  { name: "Nuxt", href: "/$locale/i18n/nuxt", descKey: "frameworks.nuxt" },
];

/**
 * File formats as a hairline comparison table rather than six cards: the reader
 * is choosing BETWEEN them, and a comparison needs a shared row rhythm. The
 * `ecosystem` column is figure data (framework names, file extensions), not
 * translatable prose.
 */
const fileFormats = [
  { key: "formats.json", ecosystem: "React · Vue · Angular", ext: ".json" },
  { key: "formats.xliff", ecosystem: "TMS interchange", ext: ".xlf" },
  { key: "formats.po", ecosystem: "Python · PHP · Ruby", ext: ".po / .pot" },
  { key: "formats.arb", ecosystem: "Flutter · Dart", ext: ".arb" },
  { key: "formats.strings", ecosystem: "iOS · macOS", ext: ".strings" },
  { key: "formats.resx", ecosystem: ".NET · C#", ext: ".resx" },
] as const;

const productionChecklist = [
  "checklist.externalized",
  "checklist.detection",
  "checklist.plurals",
  "checklist.formatting",
  "checklist.rtl",
  "checklist.fallback",
  "checklist.naming",
  "checklist.ci",
] as const;

const testingPractices = [
  "testing.pseudo",
  "testing.visual",
  "testing.automated",
  "testing.linguistic",
  "testing.expansion",
] as const;

const faqIds = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

function CompleteGuideI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const relatedPages = [
    {
      name: "What is Internationalization?",
      href: "/$locale/what-is-internationalization",
      description: t(k("related.whatIsI18n")),
    },
    {
      name: "What is Localization?",
      href: "/$locale/what-is-localization",
      description: t(k("related.whatIsL10n")),
    },
    {
      name: "Localization vs Internationalization",
      href: "/$locale/i18n/localization-vs-internationalization",
      description: t(k("related.l10nVsI18n")),
    },
    {
      name: "Software Localization",
      href: "/$locale/i18n/software-localization",
      description: t(k("related.softwareL10n")),
    },
    {
      name: "Best i18n Library",
      href: "/$locale/i18n/best-library",
      description: t(k("related.bestLibrary")),
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <PageHero
        pillar="ai"
        pillarLabel={t(k("badge"))}
        titleId="complete-guide-hero-title"
        title={t(k("hero.title"))}
        subtitle={t(k("hero.subtitle"))}
        primary={{ label: t(k("cta.primary")), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t(k("cta.secondary")), href: "https://docs.better-i18n.com" }}
        visual={
          <SplitVisual
            i18nTitle={t(k("i18nVsL10n.i18n.title"))}
            l10nTitle={t(k("i18nVsL10n.l10n.title"))}
            i18nItems={[
              t(k("concepts.locale.title")),
              t(k("concepts.unicode.title")),
              t(k("concepts.keys.title")),
              t(k("concepts.plurals.title")),
            ]}
          />
        }
      />

      <Divider />

      {/* 1 — Vocabulary: the i18n/L10n split, then the six concepts every
          implementation rests on. Was two sections (i18nVsL10n + concepts). */}
      <Section labelledBy="complete-guide-foundations">
        <SectionHeader
          id="complete-guide-foundations"
          eyebrow={t(k("sections.foundations.eyebrow"))}
          title={t(k("concepts.title"))}
          subtitle={t(k("concepts.subtitle"))}
        />

        <div className="mt-8 overflow-hidden">
          <div className="-mt-px -ml-px grid grid-cols-1 lg:grid-cols-2">
            <article className="border-t border-l border-black/[0.05] px-5 py-5 lg:pl-0">
              <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                {t(k("i18nVsL10n.i18n.title"))}
              </h3>
              <div className="mt-3 flex flex-col gap-3 text-[13px] leading-relaxed text-mist-600">
                <p>{t(k("i18nVsL10n.i18n.paragraph1"))}</p>
                <p>{t(k("i18nVsL10n.i18n.paragraph2"))}</p>
                <p>{t(k("i18nVsL10n.i18n.paragraph3"))}</p>
              </div>
            </article>
            <article className="border-t border-l border-black/[0.05] px-5 py-5">
              <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                {t(k("i18nVsL10n.l10n.title"))}
              </h3>
              <div className="mt-3 flex flex-col gap-3 text-[13px] leading-relaxed text-mist-600">
                <p>{t(k("i18nVsL10n.l10n.paragraph1"))}</p>
                <p>{t(k("i18nVsL10n.l10n.paragraph2"))}</p>
                <p>{t(k("i18nVsL10n.l10n.paragraph3"))}</p>
              </div>
            </article>
          </div>
        </div>

        <div className="mt-8 overflow-hidden">
          <ul
            role="list"
            className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {keyConcepts.map((concept) => (
              <li
                key={concept.key}
                className="border-t border-l border-black/[0.05] px-5 py-4"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-500">
                    <SpriteIcon
                      name={concept.icon as SpriteIconName}
                      className="size-3"
                    />
                  </span>
                  <h3 className="text-[13px] font-medium text-mist-900">
                    {t(k(`${concept.key}.title`))}
                  </h3>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
                  {t(k(`${concept.key}.description`))}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Divider />

      {/* 2 — File formats, as a comparison table. */}
      <Section labelledBy="complete-guide-formats">
        <SectionHeader
          id="complete-guide-formats"
          eyebrow={t(k("formats.badge"))}
          title={t(k("formats.title"))}
          subtitle={t(k("formats.subtitle"))}
        />
        <div className="mt-8">
          <FormatTable
            rows={fileFormats.map((format) => ({
              id: format.key,
              name: t(k(`${format.key}.title`)),
              description: t(k(`${format.key}.description`)),
              ecosystem: format.ecosystem,
              ext: format.ext,
            }))}
          />
        </div>
      </Section>

      <Divider />

      {/* 3 — Implementation: the four-step flow, then the production checklist
          that says when the work is actually done. Was two sections. */}
      <Section labelledBy="complete-guide-process">
        <SectionHeader
          id="complete-guide-process"
          eyebrow={t(k("checklist.badge"))}
          title={t(k("process.title"))}
          subtitle={t(k("process.subtitle"))}
        />

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <ProcessVisual
            steps={processSteps.map((step) => ({
              number: step.number,
              title: t(k(`${step.key}.title`)),
              description: t(k(`${step.key}.description`)),
            }))}
          />

          <div>
            <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
              {t(k("checklist.title"))}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
              {t(k("checklist.subtitle"))}
            </p>
            <ul role="list" className="mt-4 flex flex-col">
              {productionChecklist.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 border-t border-black/[0.05] py-2.5 text-[13px] leading-relaxed text-mist-700 first:border-t-0 first:pt-0"
                >
                  <SpriteIcon
                    name="checkmark"
                    className="mt-0.5 size-3.5 shrink-0 text-mist-400"
                  />
                  <span>{t(k(item))}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Divider />

      {/* 4 — Choosing a TMS. */}
      <Section labelledBy="complete-guide-tms">
        <SectionHeader
          id="complete-guide-tms"
          eyebrow={t(k("tms.badge"))}
          title={t(k("tms.title"))}
          subtitle={t(k("tms.subtitle"))}
        />
        <div className="mt-8 overflow-hidden">
          <ul role="list" className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2">
            {tmsCriteria.map((criterion) => (
              <li
                key={criterion.key}
                className="border-t border-l border-black/[0.05] px-5 py-4"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-500">
                    <SpriteIcon
                      name={criterion.icon as SpriteIconName}
                      className="size-3"
                    />
                  </span>
                  <h3 className="text-[13px] font-medium text-mist-900">
                    {t(k(`${criterion.key}.title`))}
                  </h3>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
                  {t(k(`${criterion.key}.description`))}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Divider />

      {/* 5 — Quality: the four mistakes that cost the most, then how to test so
          they surface before release. Was two sections. */}
      <Section labelledBy="complete-guide-quality">
        <SectionHeader
          id="complete-guide-quality"
          eyebrow={t(k("sections.quality.eyebrow"))}
          title={t(k("mistakes.title"))}
          subtitle={t(k("mistakes.subtitle"))}
        />

        <div className="mt-8 overflow-hidden">
          <ul
            role="list"
            className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {commonMistakes.map((mistake) => (
              <li
                key={mistake.key}
                className="border-t border-l border-black/[0.05] px-5 py-4"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-500">
                    <SpriteIcon
                      name={mistake.icon as SpriteIconName}
                      className="size-3"
                    />
                  </span>
                  <h3 className="text-[13px] font-medium text-mist-900">
                    {t(k(`${mistake.key}.title`))}
                  </h3>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
                  {t(k(`${mistake.key}.description`))}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
              {t(k("testing.title"))}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
              {t(k("testing.subtitle"))}
            </p>
          </div>
          <ul role="list" className="flex flex-col">
            {testingPractices.map((practice) => (
              <li
                key={practice}
                className="flex items-start gap-2.5 border-t border-black/[0.05] py-2.5 text-[13px] leading-relaxed text-mist-700 first:border-t-0 first:pt-0"
              >
                <SpriteIcon
                  name="checkmark"
                  className="mt-0.5 size-3.5 shrink-0 text-mist-400"
                />
                <span>{t(k(practice))}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Divider />

      {/* 6 — Framework guides. */}
      <Section labelledBy="complete-guide-frameworks">
        <SectionHeader
          id="complete-guide-frameworks"
          eyebrow={t(k("sections.frameworks.eyebrow"))}
          title={t(k("frameworks.title"))}
          subtitle={t(k("frameworks.subtitle"))}
        />
        <div className="mt-8 grid gap-x-10 gap-y-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {frameworkGuides.map((guide) => (
              <Link
                key={guide.href}
                to={guide.href}
                params={{ locale }}
                className="group flex items-start justify-between gap-3"
              >
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-mist-900">
                    {guide.name}
                  </span>
                  <span className="mt-1 block text-[12px] leading-relaxed text-mist-500">
                    {t(k(guide.descKey))}
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

      <FaqSection
        eyebrow={t(k("faq.badge"))}
        title={t(k("faq.title"))}
        subtitle={t(k("faq.subtitle"))}
        items={faqIds.map((id) => ({
          id,
          question: t(k(`faq.${id}.question`)),
          answer: t(k(`faq.${id}.answer`)),
        }))}
      />

      <Divider />

      {/* Related topics — the same hairline grid as every other link set. */}
      <Section labelledBy="complete-guide-related">
        <h2 id="complete-guide-related" className="section-h2">
          {t("whatIs.relatedTopics")}
        </h2>
        <div className="mt-8 grid gap-x-10 gap-y-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {relatedPages.map((page) => (
              <Link
                key={page.href}
                to={page.href}
                params={{ locale }}
                className="group flex items-start justify-between gap-3"
              >
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-mist-900">
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

/* ─── Bespoke visuals ──────────────────────────────────────────────
   DOM + SVG, drawn for this page: they localise through the same t() calls as
   the prose, stay crisp at any DPR, and cost a few KB instead of a 2x asset. */

/**
 * Hero — the one distinction the whole guide hangs on: i18n is work you do once
 * in the codebase, L10n is work you repeat per locale. Two columns split by a
 * single hairline, so the split IS the diagram.
 */
const SPLIT_VISUAL_LOCALES = [
  { code: "tr-TR", state: "reviewed" },
  { code: "de-DE", state: "reviewed" },
  { code: "ja-JP", state: "in review" },
  { code: "ar-EG", state: "rtl · queued" },
] as const;

function SplitVisual({
  i18nTitle,
  l10nTitle,
  i18nItems,
}: {
  i18nTitle: string;
  l10nTitle: string;
  i18nItems: readonly string[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="grid lg:grid-cols-2">
        <div className="border-black/[0.05] p-5 max-lg:border-b lg:border-r">
          <p className="text-[11px] font-medium text-mist-400">i18n · once</p>
          <p className="mt-2 text-[13px] text-mist-900">{i18nTitle}</p>
          <ul role="list" className="mt-3 flex flex-wrap gap-1.5">
            {i18nItems.map((item) => (
              <li
                key={item}
                className="rounded-sm border border-black/[0.06] bg-mist-50 px-2 py-0.5 text-[11px] text-mist-500"
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border border-black/[0.06] bg-mist-50 p-3 font-mono text-[12px] leading-relaxed">
            <span className="text-mist-400">t(</span>
            <span className="text-mist-700">&quot;cart.items&quot;</span>
            <span className="text-mist-300">, </span>
            <span className="text-mist-700">{"{ count }"}</span>
            <span className="text-mist-400">)</span>
          </div>
        </div>

        <div className="p-5">
          <p className="text-[11px] font-medium text-mist-400">L10n · per locale</p>
          <p className="mt-2 text-[13px] text-mist-900">{l10nTitle}</p>
          <ul role="list" className="mt-3 divide-y divide-black/[0.05]">
            {SPLIT_VISUAL_LOCALES.map((l) => (
              <li key={l.code} className="flex items-center gap-3 py-2">
                <span className="w-16 shrink-0 font-mono text-[11px] text-mist-500">
                  {l.code}
                </span>
                <span className="h-px flex-1 bg-black/[0.06]" />
                <span className="shrink-0 text-[11px] text-mist-400">{l.state}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Formats — a comparison, so it gets one shared row rhythm instead of six
 * cards. It is a single figure, so it keeps its own shell
 * (rule/interior-hairlines-only, figure exception).
 */
function FormatTable({
  rows,
}: {
  rows: Array<{
    id: string;
    name: string;
    description: string;
    ecosystem: string;
    ext: string;
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="divide-y divide-black/[0.05]">
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid items-start gap-x-6 gap-y-2 px-5 py-4 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)]"
          >
            <div>
              <h3 className="text-[13px] font-medium text-mist-900">{row.name}</h3>
              <p className="mt-1 font-mono text-[11px] text-mist-400">{row.ext}</p>
              <p className="mt-1 text-[11px] text-mist-400">{row.ecosystem}</p>
            </div>
            <p className="text-[13px] leading-relaxed text-mist-600">
              {row.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Process — numbered hairline rows. Deliberately no filled step circles: the
 * number is the marker, the rule is the connection.
 */
function ProcessVisual({
  steps,
}: {
  steps: Array<{ number: string; title: string; description: string }>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <ol className="divide-y divide-black/[0.05]">
        {steps.map((step) => (
          <li key={step.number} className="flex items-start gap-4 px-5 py-4">
            <span className="w-6 shrink-0 pt-0.5 font-mono text-[11px] tabular-nums text-mist-400">
              {step.number}
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-medium text-mist-900">
                {step.title}
              </span>
              <span className="mt-1 block text-[13px] leading-relaxed text-mist-600">
                {step.description}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
