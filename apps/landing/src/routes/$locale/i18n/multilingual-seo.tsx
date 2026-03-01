import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconGlobe,
  IconCheckmark1,
  IconArrowRight,
  IconMagnifyingGlass,
  IconRocket,
  IconApiConnection,
  IconGroup1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

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
          "Complete guide to multilingual SEO: optimize your website for multiple languages and regions to rank globally with Better i18n.",
      },
    });
  },
  component: MultilingualSeoPage,
});

const challenges = [
  { icon: IconApiConnection, titleKey: "challenges.hreflang.title", descKey: "challenges.hreflang.description", defaultTitle: "Hreflang Implementation", defaultDesc: "Correctly implementing hreflang tags to tell search engines which language version to show each user." },
  { icon: IconGlobe, titleKey: "challenges.urlStructure.title", descKey: "challenges.urlStructure.description", defaultTitle: "URL Structure Decisions", defaultDesc: "Choosing between subdirectories, subdomains, and ccTLDs for your multilingual site architecture." },
  { icon: IconMagnifyingGlass, titleKey: "challenges.keywordResearch.title", descKey: "challenges.keywordResearch.description", defaultTitle: "Multilingual Keyword Research", defaultDesc: "Conducting keyword research in each language rather than translating English keywords directly." },
  { icon: IconRocket, titleKey: "challenges.contentDuplication.title", descKey: "challenges.contentDuplication.description", defaultTitle: "Content Duplication Risks", defaultDesc: "Avoiding duplicate content penalties when similar pages exist across multiple language versions." },
];

function MultilingualSeoPage() {
  const t = useT("marketing.i18n.multilingualSeo");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    { key: "benefits.list.organicReach", defaultValue: "Expand organic reach to non-English speaking markets worldwide" },
    { key: "benefits.list.localSearchVisibility", defaultValue: "Improve visibility in local search results for each target market" },
    { key: "benefits.list.reducedBounceRate", defaultValue: "Reduce bounce rates by serving content in the user's preferred language" },
    { key: "benefits.list.higherConversions", defaultValue: "Increase conversion rates with culturally relevant localized content" },
    { key: "benefits.list.competitiveEdge", defaultValue: "Gain competitive advantage in markets with less SEO competition" },
    { key: "benefits.list.brandAuthority", defaultValue: "Build brand authority and trust with native-language content" },
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description", defaultTitle: "Audit & Plan", defaultDesc: "Assess your current site structure, identify target markets, and plan your multilingual URL architecture." },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description", defaultTitle: "Technical Setup", defaultDesc: "Implement hreflang tags, configure URL structure, and set up international sitemaps for each language." },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description", defaultTitle: "Content Localization", defaultDesc: "Translate and localize content with SEO-optimized keywords for each target language and region." },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description", defaultTitle: "Monitor & Scale", defaultDesc: "Track rankings and organic traffic per locale, then expand to additional markets based on performance data." },
  ];

  const urlStructures = [
    { titleKey: "urlStructures.subdirectory.title", descKey: "urlStructures.subdirectory.description", exampleKey: "urlStructures.subdirectory.example", defaultTitle: "Subdirectory", defaultDesc: "Language versions live under path segments on the same domain. Consolidates domain authority and is easiest to maintain.", defaultExample: "example.com/en/, example.com/fr/" },
    { titleKey: "urlStructures.subdomain.title", descKey: "urlStructures.subdomain.description", exampleKey: "urlStructures.subdomain.example", defaultTitle: "Subdomain", defaultDesc: "Each language gets its own subdomain. Allows separate server configurations but splits domain authority.", defaultExample: "en.example.com, fr.example.com" },
    { titleKey: "urlStructures.cctld.title", descKey: "urlStructures.cctld.description", exampleKey: "urlStructures.cctld.example", defaultTitle: "Country-Code TLD", defaultDesc: "Each country gets its own top-level domain. Strongest geotargeting signal but highest cost and complexity.", defaultExample: "example.com, example.fr, example.de" },
  ];

  const relatedPages = [
    { name: "International SEO Strategy", href: "/$locale/i18n/international-seo", description: t("related.internationalSeo", { defaultValue: "Build a comprehensive international SEO strategy" }) },
    { name: "Technical Multilingual SEO", href: "/$locale/i18n/technical-multilingual-seo", description: t("related.technicalMultilingualSeo", { defaultValue: "Technical implementation of multilingual SEO" }) },
    { name: "Multilingual Website SEO", href: "/$locale/i18n/multilingual-website-seo", description: t("related.multilingualWebsiteSeo", { defaultValue: "Practical guide to multilingual website optimization" }) },
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("related.websiteLocalization", { defaultValue: "Adapt your website for global audiences" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconGlobe className="size-4" />
              <span>{t("badge", { defaultValue: "Multilingual SEO" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Multilingual SEO: Rank in Every Language and Market You Serve" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Multilingual SEO is the practice of optimizing your website to rank in search engines across multiple languages and regions. Learn hreflang tags, URL structures, localization SEO strategies, and how multilingual SEO services can help you capture global organic traffic." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Is Multilingual SEO?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Multilingual SEO is the process of optimizing website content in multiple languages so that search engines can correctly index and rank each language version for users in the appropriate locale. It combines technical SEO with content localization to ensure that a Spanish-speaking user in Madrid sees Spanish content and a French speaker in Paris sees French content." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "A multilingual SEO company or multilingual SEO agency will typically address hreflang tag implementation, localized keyword research, URL architecture decisions, and canonical tag management — all of which signal to Google which version of a page to serve to which audience." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "Localization SEO goes further than translation. It accounts for regional search behavior, local slang, and cultural nuances that affect how people search. This is why multilingual SEO services must combine technical precision with deep linguistic expertise." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("keyStats.title", { defaultValue: "Why Multilingual SEO Matters" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("keyStats.content", { defaultValue: "Over 75% of internet users search in languages other than English. Only 25% of web content is in English, yet businesses that optimize for local languages capture 70% more qualified traffic from those markets. A multilingual SEO strategy is the most cost-effective path to international growth." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("keyStats.content2", { defaultValue: "Google processes billions of searches daily in over 150 languages. Without proper hreflang implementation and localized content, your international pages compete against each other — causing keyword cannibalization and ranking losses." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("challenges.title", { defaultValue: "Common Multilingual SEO Challenges" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("challenges.subtitle", { defaultValue: "These are the technical and strategic obstacles most businesses face when scaling multilingual SEO." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {challenges.map((challenge) => (
              <div key={challenge.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <challenge.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(challenge.titleKey, { defaultValue: challenge.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(challenge.descKey, { defaultValue: challenge.defaultDesc })}
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
              {t("urlStructures.title", { defaultValue: "URL Structure Options for Multilingual Websites" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("urlStructures.subtitle", { defaultValue: "Choosing the right URL architecture is one of the most important multilingual SEO decisions you will make. Each approach has distinct tradeoffs for authority, maintenance, and geotargeting." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {urlStructures.map((structure) => (
              <div key={structure.titleKey} className="p-6 rounded-xl border border-mist-200 bg-mist-50">
                <div className="flex items-center gap-3 mb-3">
                  <IconGroup1 className="size-5 text-mist-700" />
                  <h3 className="text-base font-medium text-mist-950">
                    {t(structure.titleKey, { defaultValue: structure.defaultTitle })}
                  </h3>
                </div>
                <p className="text-sm text-mist-700 leading-relaxed mb-3">
                  {t(structure.descKey, { defaultValue: structure.defaultDesc })}
                </p>
                <code className="text-xs bg-mist-200 text-mist-800 rounded px-2 py-1">
                  {t(structure.exampleKey, { defaultValue: structure.defaultExample })}
                </code>
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
                {t("benefits.title", { defaultValue: "Benefits of a Strong Multilingual SEO Strategy" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "Proper multilingual SEO and localization SEO investment compounds over time, giving you sustainable organic growth across every market you enter." })}
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
              {t("process.title", { defaultValue: "Multilingual SEO Implementation Process" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A structured approach to launching and scaling multilingual SEO for your website." })}
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
              {t("solution.title", { defaultValue: "How Better i18n Powers Your Multilingual SEO" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n automates the translation pipeline that underpins multilingual SEO success. From AI-powered localization that preserves keyword intent to automatic hreflang injection and CDN-delivered locale bundles, Better i18n removes the technical friction of multilingual SEO implementation." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "SEO-Aware Translations" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "AI translations that preserve target keywords, meta tag structure, and semantic intent for each locale." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Hreflang Management" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Automatically generate and maintain hreflang tags across all language variants without manual configuration." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Global CDN Delivery" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Serve locale content from edge locations worldwide to improve Core Web Vitals scores and international rankings." })}
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
            {t("cta.title", { defaultValue: "Launch Your Multilingual SEO Strategy Today" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Automate translation, hreflang management, and locale delivery so your teams can focus on content strategy — not infrastructure." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Get started with Better i18n for multilingual SEO"
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
