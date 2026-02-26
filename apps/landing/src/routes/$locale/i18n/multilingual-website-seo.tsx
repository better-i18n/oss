import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconGlobe,
  IconCheckmark1,
  IconArrowRight,
  IconSettingsGear1,
  IconMagnifyingGlass,
  IconSparklesSoft,
  IconRocket,
  IconGroup1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/multilingual-website-seo")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "multilingualWebsiteSeo",
      pathname: "/i18n/multilingual-website-seo",
      pageType: "educational",
      structuredDataOptions: {
        title: "Multilingual Website SEO Guide",
        description:
          "Practical guide to multilingual website SEO: URL structure, content translation best practices, meta tags, image localization, and language switching.",
      },
    });
  },
  component: MultilingualWebsiteSeoPage,
});

const practicalAreas = [
  { icon: IconSettingsGear1, titleKey: "practicalAreas.urlStructure.title", descKey: "practicalAreas.urlStructure.description" },
  { icon: IconSparklesSoft, titleKey: "practicalAreas.transcreation.title", descKey: "practicalAreas.transcreation.description" },
  { icon: IconMagnifyingGlass, titleKey: "practicalAreas.metaTags.title", descKey: "practicalAreas.metaTags.description" },
  { icon: IconGroup1, titleKey: "practicalAreas.imageLocalization.title", descKey: "practicalAreas.imageLocalization.description" },
];

function MultilingualWebsiteSeoPage() {
  const t = useTranslations("marketing.i18n.multilingualWebsiteSeo");
  const tCommon = useTranslations("marketing");
  const { locale } = Route.useParams();

  const actionableChecklist = [
    "checklist.consistentUrlPattern",
    "checklist.uniqueMetaPerLocale",
    "checklist.localizedImageAlt",
    "checklist.seoFriendlyLanguageSwitch",
    "checklist.localizedSitemap",
    "checklist.transcreatedHeadings",
    "checklist.languageSelectorIndexable",
    "checklist.noAutoRedirect",
  ];

  const urlDecisions = [
    { titleKey: "urlDecisions.useSubdirectory.title", descKey: "urlDecisions.useSubdirectory.description" },
    { titleKey: "urlDecisions.avoidQueryParams.title", descKey: "urlDecisions.avoidQueryParams.description" },
    { titleKey: "urlDecisions.trailingSlash.title", descKey: "urlDecisions.trailingSlash.description" },
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description" },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description" },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description" },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description" },
  ];

  const relatedPages = [
    { name: "Multilingual SEO", href: "/$locale/i18n/multilingual-seo", description: t("related.multilingualSeo", { defaultValue: "Multilingual SEO pillar guide covering all fundamentals" }) },
    { name: "Technical Multilingual SEO", href: "/$locale/i18n/technical-multilingual-seo", description: t("related.technicalMultilingualSeo", { defaultValue: "Technical implementation of multilingual SEO signals" }) },
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("related.websiteLocalization", { defaultValue: "Full website localization strategy and workflow" }) },
    { name: "Website Translation", href: "/$locale/i18n/website-translation", description: t("related.websiteTranslation", { defaultValue: "Best practices for translating website content" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconGlobe className="size-4" />
              <span>{t("badge", { defaultValue: "Multilingual Website SEO" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Multilingual Website SEO: A Practical Optimization Guide" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Multilingual website SEO is about more than setting up hreflang tags — it is the ongoing practice of optimizing every localized page for both users and search engines. This practical guide covers multilingual website URL structure decisions, website translation best practices for SEO, meta tag optimization per locale, image localization, and building a language switcher that does not hurt your rankings." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "Multilingual Website SEO vs. General Multilingual SEO" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "General multilingual SEO strategy covers market selection, authority building, and technical signals at a high level. Multilingual website SEO focuses on the page-by-page, element-by-element work required to make each locale version rank as well as your primary language version." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "A common mistake is treating website translation as a set-and-forget task. Search rankings for localized pages deteriorate when content becomes stale, when meta tags are not updated after the primary language changes, or when new pages are published in the primary language but not translated promptly." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "Website translation best practices for SEO require treating each locale version as a first-class citizen — not an afterthought. This means dedicated keyword research per locale, localized meta content, and a publishing workflow that keeps all language versions synchronized." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("urlStructure.title", { defaultValue: "Multilingual Website URL Structure Best Practices" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("urlStructure.content", { defaultValue: "The multilingual website URL structure you choose affects how search engines allocate crawl budget, how domain authority flows to language variants, and how users understand the site hierarchy. Subdirectories (example.com/fr/) are the most widely recommended structure for most businesses because they consolidate authority under one domain." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("urlStructure.content2", { defaultValue: "Avoid using query parameters (?lang=fr) to serve different language versions — search engines may treat these as the same URL or fail to crawl all variants. Use static, indexable paths that clearly signal the locale in the URL structure." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("practicalAreas.title", { defaultValue: "Four Practical Areas of Multilingual Website SEO" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("practicalAreas.subtitle", { defaultValue: "These actionable areas distinguish high-performing multilingual websites from sites that translate content but fail to rank in target markets." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {practicalAreas.map((area) => (
              <div key={area.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <area.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(area.titleKey, { defaultValue: area.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(area.descKey, { defaultValue: "" })}
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
              {t("urlDecisions.title", { defaultValue: "URL Structure Decision Guide" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("urlDecisions.subtitle", { defaultValue: "These specific URL decisions affect how search engines crawl and index your multilingual content. Apply them before launch to avoid costly migrations later." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {urlDecisions.map((decision) => (
              <div key={decision.titleKey} className="p-6 rounded-xl border border-mist-200 bg-mist-50">
                <div className="flex items-center gap-3 mb-3">
                  <IconRocket className="size-5 text-mist-700" />
                  <h3 className="text-base font-medium text-mist-950">
                    {t(decision.titleKey, { defaultValue: decision.titleKey.split(".").pop() })}
                  </h3>
                </div>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(decision.descKey, { defaultValue: "" })}
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
                {t("checklist.title", { defaultValue: "Multilingual Website SEO Optimization Checklist" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-6">
                {t("checklist.subtitle", { defaultValue: "Apply this checklist to each new locale you add to your multilingual website. Each item directly affects your ability to rank in that market." })}
              </p>
              <ul className="space-y-4">
                {actionableChecklist.map((itemKey) => (
                  <li key={itemKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(itemKey, { defaultValue: itemKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <div className="flex items-center gap-3 mb-4">
                <IconSparklesSoft className="size-6 text-mist-700" />
                <h3 className="text-lg font-medium text-mist-950">
                  {t("transcreation.title", { defaultValue: "Translation vs. Transcreation for SEO" })}
                </h3>
              </div>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("transcreation.content", { defaultValue: "Website translation best practices distinguish between translation — converting text word-for-word — and transcreation — adapting content to resonate with local audiences. For SEO-critical pages like landing pages, product pages, and blog posts, transcreation delivers better results because it naturally incorporates local search phrasing." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("transcreation.content2", { defaultValue: "Headings and page titles benefit most from transcreation. A direct translation of your English title may not match how local users search. Transcreated headings that incorporate local keyword patterns improve click-through rates from search results pages significantly." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("process.title", { defaultValue: "Multilingual Website SEO Optimization Process" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A repeatable four-step process for launching and maintaining fully optimized multilingual website pages." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
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
              {t("solution.title", { defaultValue: "How Better i18n Optimizes Your Multilingual Website for SEO" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n's developer SDK makes it straightforward to build a multilingual website with a URL structure that search engines can reliably crawl. With type-safe translation hooks, automatic key discovery, and AI-powered translation that respects your glossary and keyword intent, Better i18n removes the operational burden of keeping all locale versions optimized and up to date." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Locale-Aware URL Routing" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Framework integrations for Next.js, Nuxt, and SvelteKit that produce clean subdirectory URL structures out of the box." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Glossary-Based Translations" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Define your brand terms and SEO keywords per locale and Better i18n ensures every AI translation respects them consistently." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Synchronized Content Updates" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "When your primary language content changes, Better i18n flags outdated translations and re-translates automatically to keep all locales current." })}
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
            {t("cta.title", { defaultValue: "Build a Multilingual Website That Actually Ranks" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Better i18n gives you the URL structure, translation quality, and delivery infrastructure your multilingual website needs to rank in every target market." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Get started with Better i18n for multilingual website SEO"
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
