import { createFileRoute } from "@tanstack/react-router";
import { StepNumber } from "@/components/ui/step-number";
import { testimonialAvatar } from "@/lib/testimonials";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { OtherFrameworks } from "@/components/FrameworkComparison";
import { PillarBlogPosts } from "@/components/PillarBlogPosts";
import { HighlightedCode } from "@/components/CodeBlock";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { loadPillarBlogPosts } from "@/lib/pillar-blog-loader";
import { useT } from "@/lib/i18n";
import { useTranslations } from "@better-i18n/use-intl";
import {
  ClosingCta,
  Divider,
  FeatureGrid,
  PageHero,
  PageTestimonial,
  Section,
  SectionHeader,
} from "@/components/ui/page";
import { FlowHero, FlowCard, FlowMono, FlowText } from "@/components/visuals/FlowHero";
import { LocaleFlag } from "@/components/ui/locale-flag";

const PILLAR_KEYWORDS = ["react", "i18n", "internationalization"] as const;

const baseLoader = createPageLoader();

export const Route = createFileRoute("/$locale/i18n/react")({
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
      pageKey: "i18nReact",
      pathname: "/i18n/react",
      pageType: "framework",
      structuredDataOptions: {
        framework: "React",
        frameworkDescription: "Type-safe React internationalization with hooks, lazy loading, and seamless integration.",
        dependencies: ["react", "@better-i18n/use-intl"],
      },
    });
  },
  component: ReactI18nPage,
});

/* ─── Copy-free constants ─────────────────────────────────────────────
   Code is not copy, so snippets stay in the route file. Everything a reader
   sees as prose is resolved with t() inside the component. Each setup step
   carries a stable `id` so its title/description keys can be looked up. */

const SETUP_STEPS = [
  {
    id: "install",
    fileName: "terminal",
    lang: "bash" as const,
    code: "npm install @better-i18n/use-intl use-intl",
  },
  {
    id: "provider",
    fileName: "App.tsx",
    lang: "tsx" as const,
    code: `import { BetterI18nProvider } from '@better-i18n/use-intl';

function App() {
  return (
    <BetterI18nProvider project="your-org/your-project" locale="en">
      <YourApp />
    </BetterI18nProvider>
  );
}`,
  },
  {
    id: "translate",
    fileName: "MyComponent.tsx",
    lang: "tsx" as const,
    code: `import { useTranslations } from '@better-i18n/use-intl';

function MyComponent() {
  const t = useTranslations('common');
  return <h1>{t('welcome')}</h1>;
}`,
  },
] as const;

const USAGE_CODE = `import { useTranslations } from '@better-i18n/use-intl';

function MyComponent() {
  const t = useTranslations('common');

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('greeting', { name: 'World' })}</p>
    </div>
  );
}`;

/** Nine capability strings, keyed by suffix under `i18n.react.features.*`. */
const FEATURE_KEYS = [
  "hooks",
  "typesafe",
  "lazyLoading",
  "pluralization",
  "interpolation",
  "contextApi",
  "ssr",
  "hotReload",
  "devtools",
] as const;

/** The four libraries the adapter interoperates with. Names are product nouns. */
const LIBRARIES = [
  { id: "reactIntl", name: "react-intl" },
  { id: "reactI18next", name: "react-i18next" },
  { id: "formatjs", name: "FormatJS" },
  { id: "lingui", name: "Lingui" },
] as const;

/** Runtime beats, in order. `code` is a literal API surface, not copy. */
const RUNTIME_STEPS = [
  { id: "provider", code: "<BetterI18nProvider>" },
  { id: "hook", code: "useTranslations('common')" },
  { id: "cache", code: "TtlCache · 60s" },
  { id: "typed", code: "t('welcome')" },
] as const;

function ReactI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();
  const { pillarPosts } = Route.useLoaderData();

  const relatedLinks = [
    { title: "Next.js i18n", to: "/$locale/i18n/nextjs", description: t("i18n.react.related.nextjs") },
    { title: "Vue i18n", to: "/$locale/i18n/vue", description: t("i18n.react.related.vue") },
    { title: t("i18n.react.related.comparisons"), to: "/$locale/compare", description: t("i18n.react.related.comparisonsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />

      <PageHero
        titleId="react-hero-title"
        pillar="sync"
        pillarLabel={t("i18n.react.pillarLabel")}
        title={t("i18n.react.hero.title")}
        subtitle={t("i18n.react.hero.subtitle")}
        visual={<ReactFlowHero t={t} />}
      />

      <Divider />

      {/* Setup — the old page split this across a 3-step guide and a separate
          "Installation & Setup" code block that repeated the same three steps
          as one blob. Merged: one section, three steps, no duplicated snippet.
          Both headings' copy is preserved (install.* opens it, setup.* labels
          the steps). */}
      <Section labelledBy="react-setup">
        <SectionHeader
          id="react-setup"
          eyebrow={t("i18n.react.eyebrow.setup")}
          title={t("i18n.react.install.title")}
          subtitle={t("i18n.react.install.description")}
        />
        {/* Bare steps, not cards: three repeated items in a .map() do not each
            get a box (rule/listed-items-are-not-cards). The only frame here is
            the code block's own — a code figure owns its frame. */}
        <div className="mt-8 flex flex-col gap-10">
          {SETUP_STEPS.map((step, i) => (
            <div key={step.id}>
              <div className="flex items-baseline gap-3">
                <StepNumber n={i + 1} />
                <div className="min-w-0">
                  <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                    {t(`i18n.react.setup.${step.id}.title`)}
                  </h3>
                  <p className="mt-1 max-w-[68ch] text-[13px] leading-relaxed text-mist-600">
                    {t(`i18n.react.setup.${step.id}.description`)}
                  </p>
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-black/[0.07] bg-white">
                <div className="border-b border-black/[0.05] px-5 py-2">
                  <span className="font-mono text-[11px] text-mist-400">{step.fileName}</span>
                </div>
                <HighlightedCode
                  code={step.code}
                  lang={step.lang}
                  className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed whitespace-pre text-mist-800"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Capabilities + the usage snippet. Two thin sections before; the code
          is what the capability list is describing, so they belong together. */}
      <Section labelledBy="react-capabilities">
        <SectionHeader
          id="react-capabilities"
          eyebrow={t("i18n.react.eyebrow.capabilities")}
          title={t("i18n.react.featuresTitle")}
          subtitle={t("i18n.react.codeExample.description")}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          {/* A list of nine capability sentences, not a matrix of equal units —
              so hairline rows without an enclosing box. */}
          <div className="flex flex-col">
            {FEATURE_KEYS.map((key) => (
              <p
                key={key}
                className="border-t border-black/[0.05] py-3 text-[13px] leading-relaxed text-mist-700 first:border-t-0 first:pt-0"
              >
                {t(`i18n.react.features.${key}`)}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
              <div className="border-b border-black/[0.05] px-5 py-2">
                <span className="font-mono text-[11px] text-mist-400">MyComponent.tsx</span>
              </div>
              <HighlightedCode
                code={USAGE_CODE}
                lang="tsx"
                className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed whitespace-pre text-mist-800"
              />
            </div>
            {/* The runtime beats used to be the hero visual; the hero now shows
                the whole pipeline, so this sits next to the code it explains. */}
            <RuntimeVisual t={t} />
          </div>
        </div>
      </Section>

      <Divider />

      {/* Ecosystem — bare columns, not cards: this is four short prose pairs,
          and boxing them would add a container the content doesn't need. */}
      <Section labelledBy="react-ecosystem">
        <SectionHeader
          id="react-ecosystem"
          eyebrow={t("i18n.react.eyebrow.ecosystem")}
          title={t("i18n.react.librariesTitle")}
          subtitle={t("i18n.react.librariesSubtitle")}
        />
        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
          {LIBRARIES.map((lib) => (
            <div key={lib.id}>
              <h3 className="font-mono text-[13px] text-mist-900">{lib.name}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
                {t(`i18n.react.libraries.${lib.id}.description`)}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-mist-500">
                {t(`i18n.react.libraries.${lib.id}.integration`)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Keep reading — the three link sets (posts, related topics, other
          frameworks) were three separate sections with three headings. One
          heading, three link groups underneath. */}
      <Section labelledBy="react-keep-reading">
        <SectionHeader
          id="react-keep-reading"
          eyebrow={t("i18n.react.eyebrow.keepReading")}
          title={t("i18n.react.relatedTitle")}
        />
        <div className="mt-8 flex flex-col gap-10">
          <PillarBlogPosts posts={pillarPosts} locale={locale} />
          {/* Rendered here rather than via <ComparisonRelatedTopics />: that
              component owns its own <section> + h2, which would put a second
              heading inside this one. Bare columns, same as the ecosystem row. */}
          <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-3">
            {relatedLinks.map((link) => (
              <a
                key={link.to}
                href={`/${locale}${link.to.replace("/$locale", "")}/`}
                className="group"
              >
                <span className="block text-[15px] font-medium tracking-[-0.015em] text-mist-900 transition-colors group-hover:text-mist-600">
                  {link.title}
                </span>
                <span className="mt-1.5 block text-[13px] leading-relaxed text-mist-600">
                  {link.description}
                </span>
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      <OtherFrameworks
        title={t("i18n.react.otherFrameworks")}
        currentFramework="react"
        locale={locale}
      />

      <Divider />

      <ReactTestimonial />

      <Divider />

      <ClosingCta
        title={t("i18n.react.cta.title")}
        subtitle={t("i18n.react.cta.subtitle")}
        primary={{ label: t("i18n.react.cta.primary"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("i18n.react.cta.secondary"), href: "https://docs.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}

/**
 * Hero — the same pipeline diagram the other pillar pages mount, with the React
 * adapter as the entry point. Card copy is shared (`marketing.flowHero.*`); only
 * the framing differs per page.
 */
function ReactFlowHero({ t }: { t: (key: string) => string }) {
  const published = t("flowHero.published.eyebrow");

  const localeCard = (locale: string) => (
    <FlowCard eyebrow={published} corner={<LocaleFlag locale={locale} size={14} />}>
      <FlowMono>{`${locale}.json`}</FlowMono>
      <div style={{ marginTop: 4 }}>
        <FlowText muted>{t("flowHero.published.body")}</FlowText>
      </div>
    </FlowCard>
  );

  return (
    <FlowHero
      pillar="sync"
      title={t("flowHero.title")}
      center={{
        mark: (
          <img src="/brand/logo.svg" alt="" width={26} height={26} style={{ width: 26, height: 26 }} />
        ),
        label: "Better I18N",
        sublabel: t("flowHero.centerSublabel"),
      }}
      cards={[
        <FlowCard
          key="source"
          eyebrow={t("flowHero.source.eyebrow")}
          corner={<LocaleFlag locale="en" size={14} />}
        >
          <FlowMono>useTranslations(&apos;common&apos;)</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("flowHero.source.file")}</FlowText>
          </div>
        </FlowCard>,
        <FlowCard key="glossary" eyebrow={t("flowHero.glossary.eyebrow")}>
          <FlowText>{t("flowHero.glossary.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="ai" eyebrow={t("flowHero.ai.eyebrow")}>
          <FlowText>{t("flowHero.ai.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="git" eyebrow={t("flowHero.git.eyebrow")}>
          <FlowMono>chore/i18n-sync</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("flowHero.git.body")}</FlowText>
          </div>
        </FlowCard>,
        <div key="de">{localeCard("de")}</div>,
        <div key="fr">{localeCard("fr")}</div>,
        <div key="ja">{localeCard("ja")}</div>,
        <div key="tr">{localeCard("tr")}</div>,
      ]}
    />
  );
}

/** One quote, from the grammar's existing <PageTestimonial />. */
function ReactTestimonial() {
  const tq = useTranslations("testimonials");
  return (
    <PageTestimonial
      quote={tq("1.quote")}
      name={tq("1.name")}
      role={tq("1.title")}
      avatar={testimonialAvatar(1)}
      patternId="dots-react"
    />
  );
}

/**
 * How the React adapter actually behaves at runtime: the provider
 * pulls messages once, every hook reads from context, and the core's TtlCache
 * keeps it off the network for 60s. Purpose-drawn (DOM + SVG) rather than a
 * screenshot: it localises with the page and stays crisp at any DPR.
 */
function RuntimeVisual({ t }: { t: (key: string) => string }) {
  return (
    /* The four steps are separated by their own hairlines, so the frame around
       them was a second container around one thing (rule/one-container). Gone,
       the first step's code line now starts on the section's left edge. */
    <FeatureGrid cols="sm:grid-cols-2 lg:grid-cols-4">
      {RUNTIME_STEPS.map((s, i) => (
        <div key={s.id} className="feat-cell flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <StepNumber n={i + 1} />
            <span className="truncate font-mono text-[12px] text-mist-900">{s.code}</span>
          </div>
          <p className="text-[13px] leading-relaxed text-mist-600">
            {t(`i18n.react.visual.${s.id}`)}
          </p>
        </div>
      ))}
    </FeatureGrid>
  );
}
