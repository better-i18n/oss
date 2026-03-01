import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconGlobe,
  IconCheckmark1,
  IconArrowRight,
  IconAiTranslate,
  IconZap,
  IconShieldCheck,
  IconMagnifyingGlass,
  IconRocket,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/website-translation")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "websiteTranslation",
      pathname: "/i18n/website-translation",
      pageType: "educational",
      structuredDataOptions: {
        title: "Website Translation Guide",
        description:
          "Complete guide to website translation: translate your website from English to Spanish, French, German, Arabic, Chinese, and more with AI-powered tools.",
      },
    });
  },
  component: WebsiteTranslationPage,
});

const approaches = [
  { icon: IconAiTranslate, titleKey: "approaches.manual.title", descKey: "approaches.manual.description", defaultTitle: "Manual Translation", defaultDesc: "Professional human translators handle every string. Highest quality for marketing copy and legal content, but slower turnaround and higher per-word cost." },
  { icon: IconZap, titleKey: "approaches.machine.title", descKey: "approaches.machine.description", defaultTitle: "Machine Translation", defaultDesc: "Automated engines like Google Translate or DeepL process content instantly. Fast and cheap, but often produces awkward phrasing that needs human review." },
  { icon: IconShieldCheck, titleKey: "approaches.hybrid.title", descKey: "approaches.hybrid.description", defaultTitle: "Hybrid Translation", defaultDesc: "Machine translation generates a first draft, then professional translators review and polish the output. Balances speed with quality for most content types." },
  { icon: IconRocket, titleKey: "approaches.aiNative.title", descKey: "approaches.aiNative.description", defaultTitle: "AI-Native Translation", defaultDesc: "Modern AI models trained on your glossary and brand voice produce context-aware translations that require minimal post-editing. The fastest path to high-quality multilingual content." },
];

function WebsiteTranslationPage() {
  const t = useT("marketing.i18n.websiteTranslation");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    { key: "benefits.list.reachSpanishSpeakers", defaultValue: "Reach 500M+ Spanish speakers with professionally translated content" },
    { key: "benefits.list.frenchMarkets", defaultValue: "Expand into French-speaking markets across Europe, Canada, and Africa" },
    { key: "benefits.list.germanAudiences", defaultValue: "Engage German audiences who strongly prefer browsing in their native language" },
    { key: "benefits.list.arabicExpansion", defaultValue: "Unlock Arabic-speaking markets with RTL-ready translated pages" },
    { key: "benefits.list.chineseGrowth", defaultValue: "Tap into Chinese-language growth with culturally adapted translations" },
    { key: "benefits.list.seoRankings", defaultValue: "Improve organic search rankings in every target language and locale" },
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description", defaultTitle: "Content Audit", defaultDesc: "Inventory all translatable strings, pages, and metadata to define your translation scope." },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description", defaultTitle: "String Extraction", defaultDesc: "Extract all text into structured translation files using your i18n framework." },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description", defaultTitle: "Translation", defaultDesc: "Translate content using AI, human translators, or a hybrid of both approaches." },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description", defaultTitle: "Quality Review", defaultDesc: "Review translations for accuracy, consistency, and cultural appropriateness." },
    { number: "5", titleKey: "process.step5.title", descKey: "process.step5.description", defaultTitle: "Publish & Monitor", defaultDesc: "Deploy translated content to production and monitor performance across locales." },
  ];

  const relatedPages = [
    { name: "Translation Solutions", href: "/$locale/i18n/translation-solutions", description: t("related.translationSolutions", { defaultValue: "Compare platforms and tools for website translation" }) },
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("related.websiteLocalization", { defaultValue: "Beyond translation — full cultural adaptation for global markets" }) },
    { name: "Localization Tools", href: "/$locale/i18n/localization-tools", description: t("related.localizationTools", { defaultValue: "The best localization tools for modern development teams" }) },
    { name: "Content Localization", href: "/$locale/i18n/content-localization", description: t("related.contentLocalization", { defaultValue: "Adapt every piece of content for every market" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconGlobe className="size-4" />
              <span>{t("badge", { defaultValue: "Website Translation" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Website Translation: Translate Your Site into Any Language" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Whether you need to translate English to Spanish, French to English, or Chinese to English, a professional website translation strategy reaches billions of new users. Discover every approach — from manual to AI-native — and learn how to choose the right solution for your scale." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Is Website Translation?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Website translation is the process of converting your site's text, metadata, and UI strings from a source language into one or more target languages. The most common pairs include Spanish to English, English to Spanish, French to English, and English to German — collectively reaching over two billion native speakers worldwide." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "High-quality website translation goes beyond word-for-word conversion. A skilled Spanish translator or Portuguese to English specialist understands regional dialects: Mexican Spanish differs from Castilian Spanish, and Brazilian Portuguese differs from European Portuguese. Getting these nuances right determines whether your site resonates or alienates." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "Modern AI-powered translation tools have dramatically reduced the cost and time required. What once took weeks of work from a professional translator can now happen in hours, with human review ensuring accuracy for business-critical copy." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("languageStats.title", { defaultValue: "Top Languages by Search Volume" })}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between text-sm">
                  <span className="text-mist-700">{t("languageStats.spanish", { defaultValue: "Spanish to English / English to Spanish" })}</span>
                  <span className="font-medium text-mist-950">16M+ searches/mo</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-mist-700">{t("languageStats.french", { defaultValue: "French to English" })}</span>
                  <span className="font-medium text-mist-950">1M+ searches/mo</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-mist-700">{t("languageStats.german", { defaultValue: "English to German" })}</span>
                  <span className="font-medium text-mist-950">450K searches/mo</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-mist-700">{t("languageStats.chinese", { defaultValue: "Chinese to English" })}</span>
                  <span className="font-medium text-mist-950">368K searches/mo</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-mist-700">{t("languageStats.arabic", { defaultValue: "English to Arabic" })}</span>
                  <span className="font-medium text-mist-950">246K searches/mo</span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-mist-500">
                {t("languageStats.note", { defaultValue: "Each language pair represents a distinct market opportunity for your website." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("approaches.title", { defaultValue: "Website Translation Approaches" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("approaches.subtitle", { defaultValue: "Choose the right translation method based on your content volume, quality requirements, and available budget." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {approaches.map((approach) => (
              <div key={approach.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <approach.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(approach.titleKey, { defaultValue: approach.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(approach.descKey, { defaultValue: approach.defaultDesc })}
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
                {t("seo.title", { defaultValue: "SEO Considerations for Translated Websites" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("seo.paragraph1", { defaultValue: "Translating your website unlocks organic search traffic in entirely new markets. A Spanish translator working on your site creates pages that rank for Spanish-language queries — searches like 'spanish translator' alone receive 368,000 monthly searches. Proper implementation of hreflang tags tells search engines which version of your page to serve in each locale." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("seo.paragraph2", { defaultValue: "Each translated URL should live on a dedicated path or subdomain (e.g., /es/, /fr/, /de/) so search engines can index them independently. Avoid translating content directly into query parameters — it prevents Google from crawling and indexing your multilingual pages." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("seo.paragraph3", { defaultValue: "Metadata — including page titles, meta descriptions, and Open Graph tags — must also be translated. Leaving English metadata on Portuguese to English translated pages signals mixed signals to search engines and reduces click-through rates from non-English results pages." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="flex items-start gap-3 mb-4">
                <IconMagnifyingGlass className="size-5 text-mist-700 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-mist-950 mb-1">{t("seo.hreflang.title", { defaultValue: "Implement hreflang Tags" })}</h3>
                  <p className="text-sm text-mist-600">{t("seo.hreflang.description", { defaultValue: "Signal to Google which language version to serve to each user for correct international targeting." })}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <IconMagnifyingGlass className="size-5 text-mist-700 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-mist-950 mb-1">{t("seo.urls.title", { defaultValue: "Use Locale-Specific URLs" })}</h3>
                  <p className="text-sm text-mist-600">{t("seo.urls.description", { defaultValue: "Dedicated /es/, /fr/, /de/ paths allow independent indexing and ranking for each translated language." })}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IconMagnifyingGlass className="size-5 text-mist-700 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-mist-950 mb-1">{t("seo.metadata.title", { defaultValue: "Translate All Metadata" })}</h3>
                  <p className="text-sm text-mist-600">{t("seo.metadata.description", { defaultValue: "Titles, descriptions, alt text, and structured data must all be translated to maximize search visibility." })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("benefits.title", { defaultValue: "Benefits of Professional Website Translation" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "Translating your site into Spanish, French, German, Arabic, or Chinese unlocks markets with hundreds of millions of potential customers who prefer browsing and buying in their native language." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit.key} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(benefit.key, { defaultValue: benefit.defaultValue })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("process.title", { defaultValue: "The Website Translation Workflow" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A repeatable five-step process for translating your website accurately and efficiently at scale." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-5">
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
              {t("solution.title", { defaultValue: "Translate Your Website Faster with Better i18n" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n connects your codebase directly to an AI translation engine trained on your glossary and brand voice. Automatically extract every string — from English to Spanish, English to German, English to Arabic, and beyond — then publish translations to a global CDN without touching your deployment pipeline." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Any Language Pair" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Translate to Spanish, French, German, Chinese, Arabic, Portuguese, and 100+ other languages from a single dashboard." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Quality Assurance Built In" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Glossary enforcement, consistency checks, and human review workflows ensure translation quality across every locale." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "SEO-Ready Output" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Automatically generates translated metadata, hreflang attributes, and locale-specific sitemaps for maximum search visibility." })}
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
            {t("cta.title", { defaultValue: "Start Translating Your Website Today" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Reach Spanish, French, German, Arabic, and Chinese speakers with AI-powered translations that sound natural and convert." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start translating your website for free with Better i18n"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              aria-label="Read the Better i18n documentation for website translation"
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
