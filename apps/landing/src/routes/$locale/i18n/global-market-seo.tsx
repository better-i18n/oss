import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconMagnifyingGlass,
  IconCheckmark1,
  IconArrowRight,
  IconGlobe,
  IconRocket,
  IconChart1,
  IconCodeBrackets,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/global-market-seo")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "globalMarketSeo",
      pathname: "/i18n/global-market-seo",
      pageType: "educational",
      structuredDataOptions: {
        title: "Global Market SEO Strategy Guide",
        description:
          "SEO strategies for global market expansion: market-specific search engines, local search behavior, building authority across regions, and measuring international SEO success.",
      },
    });
  },
  component: GlobalMarketSeoPage,
});

const searchEngines = [
  { icon: IconMagnifyingGlass, titleKey: "engines.google.title", descKey: "engines.google.description", defaultTitle: "Google (Global)", defaultDesc: "Dominates most Western and emerging markets. Requires hreflang, localized content, and country-specific domain or subdirectory strategies." },
  { icon: IconGlobe, titleKey: "engines.baidu.title", descKey: "engines.baidu.description", defaultTitle: "Baidu (China)", defaultDesc: "Favors .cn domains, simplified Chinese content, and hosting within mainland China. Requires ICP license and unique SEO tactics." },
  { icon: IconRocket, titleKey: "engines.naver.title", descKey: "engines.naver.description", defaultTitle: "Naver (South Korea)", defaultDesc: "Rewards blog-format content on its own platform. Requires a Naver-specific content strategy beyond standard web SEO." },
  { icon: IconChart1, titleKey: "engines.yandex.title", descKey: "engines.yandex.description", defaultTitle: "Yandex (Russia & CIS)", defaultDesc: "Emphasizes regional hosting, Cyrillic content quality, and behavioral ranking factors unique to Russian-speaking markets." },
];

function GlobalMarketSeoPage() {
  const t = useT("marketing.i18n.globalMarketSeo");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const seoKeywords = [
    { key: "keywords.list.localSearchIntent", defaultValue: "Research local search intent independently for each target market" },
    { key: "keywords.list.nativeLanguageQueries", defaultValue: "Build keyword lists from native-language queries, not translations" },
    { key: "keywords.list.longTailByMarket", defaultValue: "Identify long-tail keyword opportunities unique to each locale" },
    { key: "keywords.list.competitorGapAnalysis", defaultValue: "Analyze local competitors to find keyword gaps in every market" },
    { key: "keywords.list.seasonalVariations", defaultValue: "Account for regional seasonal trends and cultural events" },
    { key: "keywords.list.voiceSearchAdaptation", defaultValue: "Adapt for voice search patterns that differ by language and region" },
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description", defaultTitle: "Market Research", defaultDesc: "Identify target markets, analyze local search engine landscape, and assess competitive positioning." },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description", defaultTitle: "Local Keyword Strategy", defaultDesc: "Build native-language keyword lists based on local search volume, intent, and competition data." },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description", defaultTitle: "Content & Link Building", defaultDesc: "Create locally relevant content and earn backlinks from authoritative regional domains." },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description", defaultTitle: "Measure & Iterate", defaultDesc: "Track rankings per market, segment organic traffic by country, and refine strategy based on local performance." },
  ];

  const relatedPages = [
    { name: "International SEO", href: "/$locale/i18n/international-seo", description: t("related.internationalSeo", { defaultValue: "Technical and strategic guide to international SEO" }) },
    { name: "Multilingual SEO", href: "/$locale/i18n/multilingual-seo", description: t("related.multilingualSeo", { defaultValue: "SEO best practices for multilingual websites" }) },
    { name: "SEO for International Audiences", href: "/$locale/i18n/seo-international-audiences", description: t("related.seoAudiences", { defaultValue: "Optimizing for international audience segments" }) },
    { name: "Ecommerce Global SEO", href: "/$locale/i18n/ecommerce-global-seo", description: t("related.ecommerceSeo", { defaultValue: "SEO strategies for global ecommerce expansion" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconMagnifyingGlass className="size-4" />
              <span>{t("badge", { defaultValue: "Global Market SEO" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Global Market SEO: A Complete Strategy for International Search Optimization" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Expanding into new markets means competing in new search landscapes. SEO services that work in your home market often miss the nuances of local search engines like Baidu, Naver, and Yandex. This guide covers the search engine optimization services and strategies you need to rank, attract, and convert audiences in every target market." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Is Global Market SEO?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Global market SEO is the discipline of optimizing your website to rank in search engines across multiple countries and languages simultaneously. It extends beyond standard search engine optimization services by requiring market-specific keyword research, locale-aware technical configurations like hreflang, and content strategies rooted in local search behavior." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "Effective global SEO means understanding which SEO keywords resonate in each market, how search intent differs by culture, and which SEO agencies or in-house teams have the local market knowledge to execute. A keyword that drives volume in the US may have near-zero search volume in Germany — and an entirely different keyword fills the same intent." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "The goal of global market SEO is to achieve sustainable organic search rank across your target markets — reducing paid acquisition costs over time as branded and category-level search authority grows market by market." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("marketExpansion.title", { defaultValue: "Why SEO Strategy Must Evolve for Each Market" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("marketExpansion.paragraph1", { defaultValue: "Search optimization tools built for English-language markets often lack the data depth needed for emerging markets. In South Korea, Naver's search algorithm rewards blog-format content on its own platform. In China, Baidu favors .cn domains, simplified Chinese content, and hosting within mainland infrastructure." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("marketExpansion.paragraph2", { defaultValue: "A market-by-market SEO strategy — rather than a one-size-fits-all approach — consistently outperforms global templates. Teams that build local content, earn local backlinks, and adapt UX for local SEO rank expectations see 3–5x better organic growth in year two of market expansion." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("engines.title", { defaultValue: "Market-Specific Search Engines You Must Know" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("engines.subtitle", { defaultValue: "Each major market has its own dominant search ecosystem with distinct ranking signals and content requirements." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {searchEngines.map((engine) => (
              <div key={engine.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <engine.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(engine.titleKey, { defaultValue: engine.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(engine.descKey, { defaultValue: engine.defaultDesc })}
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
                {t("keywords.title", { defaultValue: "Keyword Strategy Across Global Markets" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("keywords.subtitle", { defaultValue: "SEO keywords are not simply translated from your primary market. Effective global keyword strategy accounts for search volume, competition, and user intent independently in each locale." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {seoKeywords.map((keyword) => (
                  <li key={keyword.key} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(keyword.key, { defaultValue: keyword.defaultValue })}</span>
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
              {t("process.title", { defaultValue: "Building Local Search Authority Step by Step" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "Local authority in search comes from earning signals that search engines interpret as relevance and trustworthiness for that specific market." })}
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

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("content.title", { defaultValue: "Content Strategy for Global Market Expansion" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("content.subtitle", { defaultValue: "Global SEO success is built on locally relevant content that search engines and users trust equally." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <IconCodeBrackets className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("content.technical.title", { defaultValue: "Technical SEO Foundation" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("content.technical.description", { defaultValue: "Hreflang tags, locale-specific sitemaps, canonical URL strategy, and structured data in local formats are the technical bedrock that signals to search engines which content serves which market. Without this foundation, even excellent content will be indexed in the wrong country." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <IconRocket className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("content.localContent.title", { defaultValue: "Local Content Creation" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("content.localContent.description", { defaultValue: "Localized content is not just translated content. High-ranking pages in new markets address locally relevant questions, cite locally recognizable examples, and use keyword variants that reflect how people in that market actually search — not how they translate your target keywords." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <IconChart1 className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("content.measurement.title", { defaultValue: "Measuring International SEO Success" })}
              </h3>
              <p className="text-mist-700 leading-relaxed text-sm">
                {t("content.measurement.description", { defaultValue: "Track SEO rank per market using localized search engine results — not your home market's Google. Segment organic traffic by country, monitor keyword position trends market by market, and measure revenue attributed to organic search in each locale to build a business case for continued global SEO investment." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
              {t("solution.title", { defaultValue: "How Better i18n Strengthens Your Global SEO" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Global market SEO depends on technically correct localization — broken hreflang tags, duplicate content across locales, or untranslated metadata can sink your international search rank regardless of content quality. Better i18n ensures your translations are complete, hreflang signals are consistent, and locale-specific content is deployed without engineering bottlenecks." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Complete Locale Coverage" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Detect and fill translation gaps before they become missing-content penalties in local search rankings." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "SEO Metadata Translation" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Translate meta titles, descriptions, and structured data with the same keyword discipline applied to body content — essential for search optimization tools to surface your pages." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Instant Content Deployment" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Push SEO-optimized translations to production instantly via CDN — no release delays that cost you indexing time in competitive markets." })}
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
            {t("cta.title", { defaultValue: "Accelerate Your Global SEO with Better i18n" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Complete, technically correct localization is the foundation of global search optimization. Start today and rank in every market you target." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start improving your global market SEO with Better i18n for free"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              aria-label="Read the Better i18n documentation"
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
