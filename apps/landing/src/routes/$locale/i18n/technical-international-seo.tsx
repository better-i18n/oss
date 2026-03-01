import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconMagnifyingGlass,
  IconChart1,
  IconSettingsGear1,
  IconZap,
  IconRocket,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/technical-international-seo")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "technicalInternationalSeo",
      pathname: "/i18n/technical-international-seo",
      pageType: "educational",
      structuredDataOptions: {
        title: "Technical International SEO Guide",
        description:
          "Technical international SEO: keyword research for global markets, on-page best practices, structured data, Core Web Vitals, and CDN strategies.",
      },
    });
  },
  component: TechnicalInternationalSeoPage,
});

const technicalPillars = [
  { icon: IconMagnifyingGlass, titleKey: "pillars.keywordResearch.title", descKey: "pillars.keywordResearch.description" },
  { icon: IconRocket, titleKey: "pillars.onPageSeo.title", descKey: "pillars.onPageSeo.description" },
  { icon: IconChart1, titleKey: "pillars.structuredData.title", descKey: "pillars.structuredData.description" },
  { icon: IconZap, titleKey: "pillars.coreWebVitals.title", descKey: "pillars.coreWebVitals.description" },
];

function TechnicalInternationalSeoPage() {
  const t = useT("marketing.i18n.technicalInternationalSeo");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const onPageBestPractices = [
    "onPage.localizedTitles",
    "onPage.metaDescriptions",
    "onPage.headingStructure",
    "onPage.imageAltText",
    "onPage.internalLinking",
    "onPage.urlKeywords",
    "onPage.contentDepth",
    "onPage.localKeywords",
  ];

  const keywordResearchSteps = [
    { number: "1", titleKey: "keywordProcess.step1.title", descKey: "keywordProcess.step1.description" },
    { number: "2", titleKey: "keywordProcess.step2.title", descKey: "keywordProcess.step2.description" },
    { number: "3", titleKey: "keywordProcess.step3.title", descKey: "keywordProcess.step3.description" },
    { number: "4", titleKey: "keywordProcess.step4.title", descKey: "keywordProcess.step4.description" },
  ];

  const relatedPages = [
    { name: "Multilingual SEO", href: "/$locale/i18n/multilingual-seo", description: t("related.multilingualSeo", { defaultValue: "Multilingual SEO fundamentals and pillar strategy" }) },
    { name: "Technical Multilingual SEO", href: "/$locale/i18n/technical-multilingual-seo", description: t("related.technicalMultilingualSeo", { defaultValue: "Hreflang, canonicals, and language detection" }) },
    { name: "International SEO Strategy", href: "/$locale/i18n/international-seo", description: t("related.internationalSeo", { defaultValue: "Comprehensive international SEO strategy guide" }) },
    { name: "Local SEO International", href: "/$locale/i18n/local-seo-international", description: t("related.localSeoInternational", { defaultValue: "Local SEO strategies for international markets" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconSettingsGear1 className="size-4" />
              <span>{t("badge", { defaultValue: "Technical International SEO" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Technical International SEO: Keyword Research, On-Page Best Practices, and Performance" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Technical international SEO bridges the gap between market strategy and search performance. This guide covers how to find keywords for SEO in international markets, apply on-page SEO best practices to multilingual content, implement structured data for international audiences, and optimize Core Web Vitals for global visitors. Use it alongside your SEO website ranking report to diagnose and improve international performance." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "How International Keyword Research Differs from Domestic SEO" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Knowing how to find keywords for SEO in a single market is not sufficient for international expansion. Each language market has its own search behavior, keyword volume distributions, and competitive landscape. A keyword research guide for international markets must account for these differences to avoid building a strategy on inaccurate assumptions." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "Local SEO keywords in Germany, for example, often include city or region modifiers that English-speaking users rarely append. In Japan, shorter search queries dominate because the writing system packs more meaning into fewer characters. Understanding these behavioral patterns is the foundation of effective international keyword research." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "Your SEO website ranking report for international pages should segment performance by locale, not just by page. This reveals which markets are underperforming relative to traffic potential and where additional on-page SEO best practices need to be applied." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("keywordGuide.title", { defaultValue: "Keyword Research Guide for International Markets" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("keywordGuide.content", { defaultValue: "Start with seed keywords translated by a native speaker — never rely on machine translation alone for keyword research. Tools like Google Keyword Planner, Ahrefs, and Semrush support country and language filtering, allowing you to see accurate local search volumes rather than global aggregates." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("keywordGuide.content2", { defaultValue: "Supplement tool data with Google Search Console insights from your existing international pages. Pages that already receive impressions in a target locale reveal organic keyword demand that tools may not capture — especially for long-tail local SEO keywords." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("pillars.title", { defaultValue: "Four Technical Pillars of International SEO" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("pillars.subtitle", { defaultValue: "These pillars apply directly to your SEO website ranking report gaps. Each pillar addresses a distinct dimension of technical performance for international markets." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {technicalPillars.map((pillar) => (
              <div key={pillar.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <pillar.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(pillar.titleKey, { defaultValue: pillar.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(pillar.descKey, { defaultValue: "" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("onPage.title", { defaultValue: "On-Page SEO Best Practices for International Content" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-6">
                {t("onPage.subtitle", { defaultValue: "These on-page SEO best practices apply to every localized page. They ensure that each language version is fully optimized for its target market and correctly signals its relevance to search engines." })}
              </p>
              <ul className="space-y-4">
                {onPageBestPractices.map((itemKey) => (
                  <li key={itemKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(itemKey, { defaultValue: itemKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 lg:mt-0 space-y-6">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <div className="flex items-center gap-3 mb-3">
                  <IconChart1 className="size-5 text-mist-700" />
                  <h3 className="text-base font-medium text-mist-950">
                    {t("structuredData.title", { defaultValue: "Structured Data for International Sites" })}
                  </h3>
                </div>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("structuredData.content", { defaultValue: "Implement schema.org markup in the language of each page variant. LocalBusiness, Article, Product, and FAQ schemas all support internationalization. Ensure your structured data uses localized addresses, phone number formats, and currency codes appropriate to each target market." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <div className="flex items-center gap-3 mb-3">
                  <IconZap className="size-5 text-mist-700" />
                  <h3 className="text-base font-medium text-mist-950">
                    {t("cdnStrategy.title", { defaultValue: "CDN Strategy for Global Performance" })}
                  </h3>
                </div>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("cdnStrategy.content", { defaultValue: "Core Web Vitals are a Google ranking factor that affects international pages as much as domestic ones. A CDN with edge nodes close to your target markets reduces Time to First Byte and improves Largest Contentful Paint scores. Serve locale-specific translation bundles from the nearest edge location to each user." })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("keywordProcess.title", { defaultValue: "International Keyword Research Process" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("keywordProcess.subtitle", { defaultValue: "A repeatable process for building an international keyword strategy that supports both on-page optimization and content planning." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {keywordResearchSteps.map((step) => (
              <div key={step.number} className="text-center p-6">
                <div className="size-10 rounded-full bg-mist-950 text-white flex items-center justify-center text-sm font-medium mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(step.titleKey, { defaultValue: step.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-600">
                  {t(step.descKey, { defaultValue: "" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
              {t("solution.title", { defaultValue: "How Better i18n Supports Technical International SEO" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n's translation infrastructure supports every layer of technical international SEO. By delivering server-rendered locale content, optimizing translation bundle size for Core Web Vitals, and keeping meta tag translations current with your content, Better i18n ensures that your on-page SEO best practices carry through to every language variant you publish." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Keyword-Aware AI Translation" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Translations that preserve your target local SEO keywords and natural search phrasing rather than producing literal word-for-word output." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Optimized Bundle Size" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Split translation bundles by namespace and lazy-load per route so locale content never degrades Core Web Vitals scores." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Edge-Native Delivery" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Serve translation assets from CDN edge nodes worldwide to minimize latency and improve Time to First Byte for every international market." })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-lg font-medium text-mist-950 mb-6">{tCommon("whatIs.relatedTopics", { defaultValue: "Related Topics" })}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedPages.map((page) => (
              <Link
                key={page.href}
                to={page.href}
                params={{ locale }}
                className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="text-sm font-medium text-mist-950">{page.name}</h3>
                  <p className="text-xs text-mist-500 mt-1">{page.description}</p>
                </div>
                <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-mist-950 rounded-3xl mx-6 lg:mx-10 mb-16">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
            {t("cta.title", { defaultValue: "Optimize Your International Pages with Confidence" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Give every locale the same on-page SEO quality as your primary language with Better i18n's AI translation and CDN infrastructure." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Get started with Better i18n for technical international SEO"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              className="rounded-full border border-mist-600 px-6 py-3 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
            >
              {t("cta.secondary", { defaultValue: "Read the Docs" })}
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
