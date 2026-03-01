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
  IconAiTranslate,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/local-seo-international")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "localSeoInternational",
      pathname: "/i18n/local-seo-international",
      pageType: "educational",
      structuredDataOptions: {
        title: "Local SEO for International Markets Guide",
        description:
          "Complete guide to local SEO for international markets: adapt local search strategies for different countries, optimize Google Business Profiles globally, and manage citations across markets.",
      },
    });
  },
  component: LocalSeoInternationalPage,
});

const challenges = [
  { icon: IconMagnifyingGlass, titleKey: "challenges.localKeywords.title", descKey: "challenges.localKeywords.description" },
  { icon: IconApiConnection, titleKey: "challenges.citations.title", descKey: "challenges.citations.description" },
  { icon: IconGroup1, titleKey: "challenges.reviews.title", descKey: "challenges.reviews.description" },
  { icon: IconRocket, titleKey: "challenges.geotargeting.title", descKey: "challenges.geotargeting.description" },
];

function LocalSeoInternationalPage() {
  const t = useT("marketing.i18n.localSeoInternational");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    "benefits.list.localVisibility",
    "benefits.list.qualifiedTraffic",
    "benefits.list.brandTrust",
    "benefits.list.competitiveEdge",
    "benefits.list.reviewAuthority",
    "benefits.list.mapsPresence",
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description" },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description" },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description" },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description" },
  ];

  const strategies = [
    { titleKey: "strategies.gbp.title", descKey: "strategies.gbp.description" },
    { titleKey: "strategies.localCitations.title", descKey: "strategies.localCitations.description" },
    { titleKey: "strategies.localContent.title", descKey: "strategies.localContent.description" },
  ];

  const relatedPages = [
    { name: "Multilingual SEO", href: "/$locale/i18n/multilingual-seo", description: t("related.multilingualSeo", { defaultValue: "SEO strategies for multiple languages and regions" }) },
    { name: "SEO for International Audiences", href: "/$locale/i18n/seo-international-audiences", description: t("related.seoInternationalAudiences", { defaultValue: "Reach and convert international search traffic" }) },
    { name: "Global Market SEO", href: "/$locale/i18n/global-market-seo", description: t("related.globalMarketSeo", { defaultValue: "Scale organic growth across global markets" }) },
    { name: "International SEO Strategy", href: "/$locale/i18n/international-seo", description: t("related.internationalSeo", { defaultValue: "Build a comprehensive international SEO strategy" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconGlobe className="size-4" />
              <span>{t("badge", { defaultValue: "Local SEO International" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Local SEO for International Markets: Dominate Local Search in Every Country" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Local search SEO strategies that work in one market rarely transfer directly to another. This guide explains how to adapt local SEO for different countries — covering Google Business Profile optimization, local citation building, review management, geo-targeting, and local content strategy for global businesses." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Is Local SEO for International Markets?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Local SEO for international markets is the practice of optimizing a business's presence in local search results — Google Maps, Google Business Profile, and locally-relevant organic results — across multiple countries simultaneously. While local search SEO in a single market focuses on one geographic area, the international version requires adapting every tactic to the cultural and algorithmic context of each country." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "Search engine optimization for local business in, say, Germany looks fundamentally different from the same effort in Brazil or Japan. Directory ecosystems differ, review platforms vary, address formats change, and consumer expectations about business information completeness are culturally shaped. A unified local SEO strategy that ignores these differences will underperform in every market it tries to serve." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "How to improve local SEO rankings internationally starts with understanding that Google's local ranking factors — relevance, distance, and prominence — are evaluated through locally-crawled signals. A German Business Profile needs German-language reviews, citations from German directories, and localized content to achieve the prominence score that triggers top-3 pack placement for German searchers." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("whyItMatters.title", { defaultValue: "Why Localized Local SEO Drives Outsized Results" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("whyItMatters.content", { defaultValue: "\"Near me\" searches have grown by over 500% in the past five years — and that trend is accelerating in every major market. Consumers searching for local services in their own language convert at 3-5x the rate of international-language visitors. Local search SEO is the highest-intent traffic channel available to multi-market businesses." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("whyItMatters.content2", { defaultValue: "Businesses that localize their Google Business Profiles — translating descriptions, responding to reviews in the local language, and building citations in local directories — consistently outrank competitors who rely on a single-market profile duplicated across regions." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("challenges.title", { defaultValue: "International Local SEO Challenges" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("challenges.subtitle", { defaultValue: "These are the most common obstacles businesses encounter when scaling local search SEO across multiple countries." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {challenges.map((challenge) => (
              <div key={challenge.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <challenge.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(challenge.titleKey, { defaultValue: challenge.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(challenge.descKey, { defaultValue: "" })}
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
              {t("strategies.title", { defaultValue: "Core Strategies for International Local SEO Success" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("strategies.subtitle", { defaultValue: "These three pillars form the foundation of any effective local SEO strategy for businesses competing in multiple national markets." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {strategies.map((strategy) => (
              <div key={strategy.titleKey} className="p-6 rounded-xl border border-mist-200 bg-mist-50">
                <div className="flex items-center gap-3 mb-3">
                  <IconAiTranslate className="size-5 text-mist-700" />
                  <h3 className="text-base font-medium text-mist-950">
                    {t(strategy.titleKey, { defaultValue: strategy.titleKey.split(".").pop() })}
                  </h3>
                </div>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(strategy.descKey, { defaultValue: "" })}
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
                {t("benefits.title", { defaultValue: "Benefits of a Localized Local SEO Strategy" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "Properly localized local SEO captures the highest-intent traffic in every market — driving qualified visits, in-store footfall, and local conversions that broad SEO strategies miss." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {benefits.map((benefitKey) => (
                  <li key={benefitKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(benefitKey, { defaultValue: benefitKey.split(".").pop() })}</span>
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
              {t("process.title", { defaultValue: "How to Build an International Local SEO Program" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A phased approach to scaling local search SEO across multiple countries without fragmenting brand consistency." })}
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
              {t("solution.title", { defaultValue: "How Better i18n Powers International Local SEO" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Local SEO for international markets depends on high-quality, localized content — and Better i18n automates the translation layer that makes it possible at scale. Translate Google Business Profile descriptions, local landing pages, review response templates, and schema markup with context-aware AI that preserves the local keywords and tone required to rank in each market." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Localized Page Content" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "AI translations for local landing pages that incorporate market-specific keywords, address formats, and cultural references that search engines reward." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Schema Markup Translation" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Translate LocalBusiness schema, FAQPage, and Review structured data so Google correctly interprets your local signals in every target language." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Instant Locale Delivery" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Edge-delivered locale content improves page speed in each target country — a direct local ranking factor Google uses to decide which results to show first." })}
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
            {t("cta.title", { defaultValue: "Localize Your Local SEO Strategy for Every Market" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Automate local content translation across all your international markets and improve local search rankings in every country you serve." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Get started with Better i18n for local SEO in international markets"
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
