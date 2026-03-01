import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconRocket,
  IconChart1,
  IconGlobe,
  IconZap,
  IconApiConnection,
  IconMagnifyingGlass,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/seo-international-audiences")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "seoInternationalAudiences",
      pathname: "/i18n/seo-international-audiences",
      pageType: "educational",
      structuredDataOptions: {
        title: "SEO for International Audiences Guide",
        description:
          "How to optimize for international audiences: local SEO vs international SEO, ecommerce SEO for global markets, cross-cultural search intent, and measuring engagement across locales.",
      },
    });
  },
  component: SeoInternationalAudiencesPage,
});

const audienceSegments = [
  { icon: IconMagnifyingGlass, titleKey: "segments.localSearch.title", descKey: "segments.localSearch.description" },
  { icon: IconGlobe, titleKey: "segments.international.title", descKey: "segments.international.description" },
  { icon: IconRocket, titleKey: "segments.ecommerce.title", descKey: "segments.ecommerce.description" },
  { icon: IconChart1, titleKey: "segments.contentMarketing.title", descKey: "segments.contentMarketing.description" },
];

function SeoInternationalAudiencesPage() {
  const t = useT("marketing.i18n.seoInternationalAudiences");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const localSeoTips = [
    "tips.list.googleBusinessProfile",
    "tips.list.localCitations",
    "tips.list.localizedLandingPages",
    "tips.list.reviewManagement",
    "tips.list.schemaMarkup",
    "tips.list.mobileOptimization",
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description" },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description" },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description" },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description" },
  ];

  const relatedPages = [
    { name: "International SEO", href: "/$locale/i18n/international-seo", description: t("related.internationalSeo", { defaultValue: "Technical guide to international search engine optimization" }) },
    { name: "Global Market SEO", href: "/$locale/i18n/global-market-seo", description: t("related.globalMarketSeo", { defaultValue: "SEO strategies for expanding into new global markets" }) },
    { name: "Ecommerce Global SEO", href: "/$locale/i18n/ecommerce-global-seo", description: t("related.ecommerceSeo", { defaultValue: "Search optimization for global ecommerce stores" }) },
    { name: "Local SEO International", href: "/$locale/i18n/local-seo-international", description: t("related.localSeoInternational", { defaultValue: "Running local SEO strategies across international markets" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconRocket className="size-4" />
              <span>{t("badge", { defaultValue: "SEO for International Audiences" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "SEO for International Audiences: Local Strategy, Global Scale" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Whether you are targeting ecommerce SEO in new markets or building local search engine optimization in five countries simultaneously, the principles are the same: understand your audience's search intent, adapt your content to their expectations, and signal relevance to the search engines they use. This guide covers the full spectrum — from local SEO optimization tactics to international audience segmentation and cross-market measurement." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "Local SEO vs. International SEO: Understanding the Difference" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Local search engine optimization focuses on ranking in location-based queries — 'coffee shop near me', 'plumber in Berlin', 'best sushi in Tokyo'. It relies on Google Business Profiles, local citations, and proximity signals. When you replicate this in multiple countries, you are doing international local SEO: running a coherent local SEO strategy in each market where you operate." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "International SEO, by contrast, targets audiences regardless of specific location — ranking for 'ecommerce SEO guide', 'local SEO optimization checklist', or 'search engine optimization for ecommerce' across all English-speaking markets at once. The technical requirements overlap significantly: hreflang tags, locale-aware canonicals, and separate content per region." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "Most global businesses need both. A SaaS company might run international SEO for its product pages while running local SEO optimization for its offices in key cities. An ecommerce brand might target category-level international queries while also optimizing individual product pages for local search in each market." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("searchIntent.title", { defaultValue: "Understanding Search Intent Across Cultures" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("searchIntent.paragraph1", { defaultValue: "Search intent — the underlying goal behind a query — varies significantly by market. In Germany, informational queries often precede purchase decisions by weeks or months; detailed, trust-building content outperforms direct sales pages in early funnel ranking. In the US, transactional queries drive more immediate commercial intent." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("searchIntent.paragraph2", { defaultValue: "Local SEO tips that work in one market may backfire in another. Japanese users rely heavily on mobile search and prefer structured, formal content. Brazilian users engage more with social signals embedded in the search experience. A local SEO strategy built without this audience intelligence is optimizing for signals that do not match local behavior." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("segments.title", { defaultValue: "Audience Segments in International SEO" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("segments.subtitle", { defaultValue: "Different audience segments require different SEO approaches, even within the same target market." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audienceSegments.map((segment) => (
              <div key={segment.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <segment.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(segment.titleKey, { defaultValue: segment.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(segment.descKey, { defaultValue: "" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("ecommerce.title", { defaultValue: "Ecommerce SEO for Global Markets" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("ecommerce.subtitle", { defaultValue: "Search engine optimization for ecommerce in international markets requires a specialized approach that standard ecommerce SEO guides rarely cover." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
              <IconApiConnection className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("ecommerce.productPages.title", { defaultValue: "Localized Product Pages" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("ecommerce.productPages.description", { defaultValue: "Ecommerce SEO for global markets means more than translating product descriptions. Product names, sizing conventions, material descriptions, and customer reviews must reflect local market expectations. A shoe size 9 in the US is a 43 in Europe — a simple discrepancy that kills conversion and signals poor localization to search engines ranking product pages." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
              <IconZap className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("ecommerce.categoryPages.title", { defaultValue: "Category Page Optimization" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("ecommerce.categoryPages.description", { defaultValue: "Category pages are the highest-volume SEO opportunity in ecommerce. For international audiences, category names and H1s should match locally searched terms — not direct translations of your home-market category structure. Local keyword research per market reveals where your taxonomy is missing search volume." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
              <IconChart1 className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("ecommerce.structured.title", { defaultValue: "Structured Data for Global Ecommerce" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("ecommerce.structured.description", { defaultValue: "Product schema markup — price, availability, reviews — must be localized per market. Prices in local currency with correct locale formatting, availability signals per shipping region, and review counts from local platforms all contribute to rich result eligibility in local search engine optimization for ecommerce." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("localSeoTips.title", { defaultValue: "Local SEO Tips for International Markets" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("localSeoTips.subtitle", { defaultValue: "Apply these local SEO optimization practices in each market where you want to build geographic search presence." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {localSeoTips.map((tipKey) => (
                  <li key={tipKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(tipKey, { defaultValue: tipKey.split(".").pop() })}</span>
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
              {t("process.title", { defaultValue: "Measuring Engagement Across International Markets" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A four-step framework for tracking and improving SEO performance per international audience segment." })}
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
              {t("solution.title", { defaultValue: "How Better i18n Supports International SEO" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Effective local SEO optimization across international markets requires complete, high-quality localized content on every page that matters for search. Better i18n ensures your entire application — including SEO-critical metadata, alt text, and structured content — is translated consistently and deployed without gaps that leave search engines indexing English fallback content in your target locales." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Zero Translation Gaps" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Continuous scanning surfaces untranslated keys before they reach production — preventing English fallback content that confuses search engines in non-English locales." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Locale-Accurate Metadata" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Meta titles, Open Graph tags, and JSON-LD structured data are translated with the same keyword precision as body content — critical for ecommerce SEO and local search engine optimization rich results." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Fast Market Entry" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Launch fully localized pages in new markets within days instead of sprint cycles — giving your content the maximum time to build search authority before competitors notice the opportunity." })}
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
            {t("cta.title", { defaultValue: "Win International Search with Better i18n" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Local SEO optimization and international audience reach both depend on complete, high-quality localization. Start building your global search presence today." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start optimizing for international audiences with Better i18n for free"
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
