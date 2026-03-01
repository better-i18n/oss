import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconCodeBrackets,
  IconSettingsGear1,
  IconMagnifyingGlass,
  IconShieldCheck,
  IconZap,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/technical-multilingual-seo")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "technicalMultilingualSeo",
      pathname: "/i18n/technical-multilingual-seo",
      pageType: "educational",
      structuredDataOptions: {
        title: "Technical Multilingual SEO Guide",
        description:
          "Technical implementation guide for multilingual SEO: hreflang tags, URL structures, sitemaps, canonical URLs, and language detection.",
      },
    });
  },
  component: TechnicalMultilingualSeoPage,
});

const technicalAreas = [
  { icon: IconCodeBrackets, titleKey: "technicalAreas.hreflang.title", descKey: "technicalAreas.hreflang.description", defaultTitle: "Hreflang Tags", defaultDesc: "Declare every language variant with bidirectional hreflang annotations so search engines serve the correct locale to each user." },
  { icon: IconSettingsGear1, titleKey: "technicalAreas.canonicals.title", descKey: "technicalAreas.canonicals.description", defaultTitle: "Canonical URLs", defaultDesc: "Set self-referencing canonicals on each language variant to prevent duplicate content penalties across locales." },
  { icon: IconMagnifyingGlass, titleKey: "technicalAreas.sitemaps.title", descKey: "technicalAreas.sitemaps.description", defaultTitle: "Locale-Specific Sitemaps", defaultDesc: "Generate per-locale XML sitemaps with hreflang entries so crawlers discover and index every language version efficiently." },
  { icon: IconZap, titleKey: "technicalAreas.languageDetection.title", descKey: "technicalAreas.languageDetection.description", defaultTitle: "Language Detection", defaultDesc: "Implement server-side language detection using Accept-Language headers and geolocation to route users to the right locale automatically." },
];

function TechnicalMultilingualSeoPage() {
  const t = useT("marketing.i18n.technicalMultilingualSeo");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const implementationChecklist = [
    { key: "checklist.hreflangAllVariants", defaultValue: "Add hreflang tags pointing to all language variants on every page" },
    { key: "checklist.xDefaultTag", defaultValue: "Include an x-default hreflang tag for the fallback language" },
    { key: "checklist.canonicalConsistency", defaultValue: "Ensure canonical URLs are self-referencing and consistent across locales" },
    { key: "checklist.localeSitemaps", defaultValue: "Generate locale-specific XML sitemaps with hreflang annotations" },
    { key: "checklist.languageDetector", defaultValue: "Implement a server-side language detector for automatic user routing" },
    { key: "checklist.urlConsistency", defaultValue: "Maintain consistent URL structure across all language versions" },
    { key: "checklist.robotsTxt", defaultValue: "Verify robots.txt does not block crawlers from any locale subdirectory" },
    { key: "checklist.seoTitle", defaultValue: "Localize SEO titles and meta descriptions with region-specific keywords" },
  ];

  const urlOptions = [
    { titleKey: "urlOptions.subdirectory.title", descKey: "urlOptions.subdirectory.description", defaultTitle: "Subdirectory (example.com/fr/)", defaultDesc: "Consolidates domain authority under one root domain. Easiest to implement and maintain, and the recommended approach for most multilingual sites." },
    { titleKey: "urlOptions.subdomain.title", descKey: "urlOptions.subdomain.description", defaultTitle: "Subdomain (fr.example.com)", defaultDesc: "Separates locale content at the subdomain level. Useful when regional teams manage independent content, but authority is not shared with the main domain." },
    { titleKey: "urlOptions.cctld.title", descKey: "urlOptions.cctld.description", defaultTitle: "Country-Code TLD (example.fr)", defaultDesc: "Provides the strongest geotargeting signal to search engines. Requires purchasing and maintaining separate domains for each market." },
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description", defaultTitle: "Audit Existing Setup", defaultDesc: "Crawl your site to identify missing hreflang tags, broken canonicals, and orphaned locale pages before making changes." },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description", defaultTitle: "Define URL Structure", defaultDesc: "Choose subdirectory, subdomain, or ccTLD and apply the pattern consistently across all existing and future pages." },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description", defaultTitle: "Implement Hreflang & Sitemaps", defaultDesc: "Add bidirectional hreflang annotations and generate locale-specific XML sitemaps with all language variants listed." },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description", defaultTitle: "Validate & Monitor", defaultDesc: "Use Google Search Console and crawl tools to verify correct indexing, then monitor international search performance continuously." },
  ];

  const relatedPages = [
    { name: "Multilingual SEO", href: "/$locale/i18n/multilingual-seo", description: t("related.multilingualSeo", { defaultValue: "Multilingual SEO strategy fundamentals and overview" }) },
    { name: "Technical International SEO", href: "/$locale/i18n/technical-international-seo", description: t("related.technicalInternationalSeo", { defaultValue: "Technical SEO for international keyword strategy" }) },
    { name: "Multilingual Website SEO", href: "/$locale/i18n/multilingual-website-seo", description: t("related.multilingualWebsiteSeo", { defaultValue: "Practical multilingual website optimization guide" }) },
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("related.websiteLocalization", { defaultValue: "Full website localization strategy and process" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconCodeBrackets className="size-4" />
              <span>{t("badge", { defaultValue: "Technical Multilingual SEO" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Technical Multilingual SEO: The Complete Implementation Guide" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Technical multilingual SEO covers everything a developer or SEO specialist must implement to ensure search engines correctly crawl, index, and rank multilingual content. From hreflang tags and language detectors to sitemap configuration and website optimization for global audiences, this guide covers every technical dimension." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "Why Technical SEO Is Critical for Multilingual Sites" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "A multilingual website without correct technical SEO signals will underperform in search regardless of content quality. Search engines must unambiguously understand the language and target region of every page. Without proper implementation, pages in different languages compete against each other, diluting rankings across all markets." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "Technical SEO for multilingual sites involves more than simply checking website keyword rankings. It requires configuring hreflang attributes in HTTP headers or HTML, maintaining consistent canonical URLs across language variants, building locale-specific XML sitemaps, and implementing a reliable language detector for user routing." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "The SEO title and meta description must also be localized — not just translated. Each locale requires unique, keyword-optimized metadata that reflects how local users search. A correctly configured technical foundation enables your content and authority-building work to generate maximum ranking impact." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("hreflang.title", { defaultValue: "Understanding Hreflang Tags" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("hreflang.content", { defaultValue: "Hreflang is an HTML attribute that tells search engines the language and geographic region a page targets. Every language variant must include hreflang tags pointing to all other variants plus an x-default fallback. Missing or incorrect hreflang implementation is the single most common reason multilingual sites fail to rank correctly." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("hreflang.content2", { defaultValue: "Hreflang can be implemented in three places: HTML head section, HTTP response headers, or XML sitemaps. The sitemap approach is often preferred for large sites because it centralizes management and reduces per-page HTML payload." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("technicalAreas.title", { defaultValue: "Core Technical Implementation Areas" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("technicalAreas.subtitle", { defaultValue: "Master these four technical areas to build a multilingual SEO foundation that search engines can reliably crawl and rank." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {technicalAreas.map((area) => (
              <div key={area.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <area.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(area.titleKey, { defaultValue: area.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(area.descKey, { defaultValue: area.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("urlOptions.title", { defaultValue: "URL Structure Options: A Technical Comparison" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("urlOptions.subtitle", { defaultValue: "Your URL structure choice affects crawl efficiency, domain authority distribution, and geotargeting signals. Each approach suits different business models and technical constraints." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {urlOptions.map((option) => (
              <div key={option.titleKey} className="p-6 rounded-xl border border-mist-200 bg-mist-50">
                <div className="flex items-center gap-3 mb-3">
                  <IconSettingsGear1 className="size-5 text-mist-700" />
                  <h3 className="text-base font-medium text-mist-950">
                    {t(option.titleKey, { defaultValue: option.defaultTitle })}
                  </h3>
                </div>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(option.descKey, { defaultValue: option.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("checklist.title", { defaultValue: "Technical Multilingual SEO Implementation Checklist" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-6">
                {t("checklist.subtitle", { defaultValue: "Use this checklist to audit your multilingual SEO setup and identify gaps before they impact your check website keyword ranking results." })}
              </p>
              <ul className="space-y-4">
                {implementationChecklist.map((item) => (
                  <li key={item.key} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(item.key, { defaultValue: item.defaultValue })}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <div className="flex items-center gap-3 mb-4">
                <IconShieldCheck className="size-6 text-mist-700" />
                <h3 className="text-lg font-medium text-mist-950">
                  {t("ssr.title", { defaultValue: "Server-Side Rendering and SEO" })}
                </h3>
              </div>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("ssr.content", { defaultValue: "Client-side rendering of translated content is one of the most damaging website optimization mistakes for multilingual SEO. If search engine crawlers receive a JavaScript shell with no content, they cannot index your localized pages. Always render locale content on the server or use static generation with pre-rendered locale bundles." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("ssr.content2", { defaultValue: "Server-side rendering also improves Core Web Vitals — particularly Largest Contentful Paint — by delivering fully rendered locale content immediately. This improves both user experience and SEO ranking signals simultaneously." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("process.title", { defaultValue: "Technical Multilingual SEO Implementation Steps" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "Follow this sequence to implement technical multilingual SEO correctly from the ground up." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div key={step.number} className="text-center p-6">
                <div className="size-10 rounded-full bg-mist-950 text-white flex items-center justify-center text-sm font-medium mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(step.titleKey, { defaultValue: step.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-600">
                  {t(step.descKey, { defaultValue: step.defaultDesc })}
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
              {t("solution.title", { defaultValue: "How Better i18n Solves Technical Multilingual SEO" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n handles the translation pipeline that feeds your technical multilingual SEO infrastructure. With framework-native SDKs for Next.js, Nuxt, and SvelteKit, Better i18n delivers server-rendered locale content, automatically structures locale URL patterns, and integrates with your build pipeline to keep translations fresh without manual intervention." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "SSR-Compatible Translations" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Deliver fully-rendered locale content on the server so every language variant is immediately indexable by search engines." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Locale URL Integration" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Built-in support for subdirectory and subdomain URL patterns with consistent locale routing across all pages." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Build-Time Translation Sync" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Sync translations at build time or runtime via CDN, ensuring your site always serves the latest localized content without redeploys." })}
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
            {t("cta.title", { defaultValue: "Implement Multilingual SEO the Right Way" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Let Better i18n handle the translation infrastructure so you can focus on technical SEO strategy and content quality." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Get started with Better i18n for technical multilingual SEO"
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
