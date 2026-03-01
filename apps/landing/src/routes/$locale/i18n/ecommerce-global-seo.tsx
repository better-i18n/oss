import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconGlobe,
  IconCheckmark1,
  IconArrowRight,
  IconChart1,
  IconSettingsGear1,
  IconMagnifyingGlass,
  IconGroup1,
  IconRocket,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/ecommerce-global-seo")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "ecommerceGlobalSeo",
      pathname: "/i18n/ecommerce-global-seo",
      pageType: "educational",
      structuredDataOptions: {
        title: "E-Commerce Global SEO Guide",
        description:
          "Complete guide to SEO ecommerce marketing for global expansion: optimize product pages for multiple languages, handle international pricing, and track e-commerce SEO performance across markets.",
      },
    });
  },
  component: EcommerceGlobalSeoPage,
});

const challenges = [
  { icon: IconGroup1, titleKey: "challenges.productVariants.title", descKey: "challenges.productVariants.description" },
  { icon: IconSettingsGear1, titleKey: "challenges.pricingCurrency.title", descKey: "challenges.pricingCurrency.description" },
  { icon: IconMagnifyingGlass, titleKey: "challenges.canonicalization.title", descKey: "challenges.canonicalization.description" },
  { icon: IconRocket, titleKey: "challenges.shoppingFeeds.title", descKey: "challenges.shoppingFeeds.description" },
];

function EcommerceGlobalSeoPage() {
  const t = useT("marketing.i18n.ecommerceGlobalSeo");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    "benefits.list.internationalRevenue",
    "benefits.list.organicProductDiscovery",
    "benefits.list.reducedAdSpend",
    "benefits.list.brandAuthority",
    "benefits.list.marketplaceSynergy",
    "benefits.list.conversionLift",
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description" },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description" },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description" },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description" },
  ];

  const marketplaces = [
    { titleKey: "marketplaces.google.title", descKey: "marketplaces.google.description" },
    { titleKey: "marketplaces.amazon.title", descKey: "marketplaces.amazon.description" },
    { titleKey: "marketplaces.regional.title", descKey: "marketplaces.regional.description" },
  ];

  const relatedPages = [
    { name: "SEO for International Audiences", href: "/$locale/i18n/seo-international-audiences", description: t("related.seoInternationalAudiences", { defaultValue: "Reach and convert international search traffic" }) },
    { name: "Global Market SEO", href: "/$locale/i18n/global-market-seo", description: t("related.globalMarketSeo", { defaultValue: "Scale organic growth across global markets" }) },
    { name: "International SEO Strategy", href: "/$locale/i18n/international-seo", description: t("related.internationalSeo", { defaultValue: "Build a comprehensive international SEO strategy" }) },
    { name: "Website Translation", href: "/$locale/i18n/website-translation", description: t("related.websiteTranslation", { defaultValue: "Translate your website for global audiences" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconGlobe className="size-4" />
              <span>{t("badge", { defaultValue: "E-Commerce Global SEO" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "E-Commerce Global SEO: Capture Organic Product Traffic in Every Market" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "SEO ecommerce marketing for global expansion requires more than translating product titles. This guide covers the unique challenges of international e-commerce SEO — from multilingual product page optimization and cross-market canonical strategies to shopping feed localization, marketplace integration, and tracking performance across currencies and regions." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Is E-Commerce Global SEO?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "E-commerce global SEO is the discipline of optimizing online stores to rank in search engines across multiple countries and languages, while preserving the product catalog integrity, pricing accuracy, and conversion experience that each local market expects. Unlike content-site SEO, e-commerce introduces unique challenges around product variants, structured data for prices and availability, and shopping feed optimization." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "SEO ecommerce marketing at an international scale must account for how product searches differ across markets. A search for \"running shoes\" in the US has different commercial intent signals, competitor landscapes, and SERP feature compositions than the equivalent search in France or South Korea. Effective global e-commerce SEO treats each market as a distinct keyword and conversion ecosystem." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "The technical complexity multiplies with every market added. Canonical tags must correctly point between language variants. Hreflang must cover all country-language combinations. Product schema must display localized prices and currency symbols. Each of these elements must be implemented correctly across potentially thousands of product pages in dozens of locales." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("opportunity.title", { defaultValue: "The Global E-Commerce SEO Opportunity" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("opportunity.content", { defaultValue: "Cross-border e-commerce exceeded $1 trillion globally and is growing at over 25% annually. Yet fewer than 30% of e-commerce businesses have properly localized their international storefronts for organic search. This gap means that well-executed international SEO ecommerce marketing delivers outsized organic visibility compared to domestic markets where competition is already mature." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("opportunity.content2", { defaultValue: "Organic search remains the highest-ROI acquisition channel for e-commerce at scale. Shoppers who find products through organic search convert at 3x the rate of paid traffic and have a 40% higher average order value. Building international organic product visibility compounds into a durable competitive moat." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("challenges.title", { defaultValue: "International E-Commerce SEO Challenges" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("challenges.subtitle", { defaultValue: "These are the technical and strategic obstacles that prevent e-commerce businesses from ranking effectively in international markets despite having strong domestic SEO performance." })}
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
              {t("marketplaces.title", { defaultValue: "International Marketplace Integration for E-Commerce SEO" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("marketplaces.subtitle", { defaultValue: "International marketplaces — Google Shopping, Amazon, Mercado Libre, Rakuten, and regional equivalents — are search engines in their own right. Optimizing your feeds for each requires the same localization rigor as your owned storefront." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {marketplaces.map((marketplace) => (
              <div key={marketplace.titleKey} className="p-6 rounded-xl border border-mist-200 bg-mist-50">
                <div className="flex items-center gap-3 mb-3">
                  <IconChart1 className="size-5 text-mist-700" />
                  <h3 className="text-base font-medium text-mist-950">
                    {t(marketplace.titleKey, { defaultValue: marketplace.titleKey.split(".").pop() })}
                  </h3>
                </div>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(marketplace.descKey, { defaultValue: "" })}
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
                {t("benefits.title", { defaultValue: "Benefits of International E-Commerce SEO" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "A well-executed global SEO strategy for e-commerce reduces customer acquisition costs while compounding organic product visibility across every market you enter." })}
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
              {t("process.title", { defaultValue: "International E-Commerce SEO Implementation Process" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A step-by-step approach to launching and scaling international e-commerce SEO for global product catalog visibility." })}
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
              {t("solution.title", { defaultValue: "How Better i18n Accelerates Global E-Commerce SEO" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Global e-commerce SEO requires thousands of localized product pages — and Better i18n automates the translation pipeline that makes that possible at scale. AI-powered translations preserve product keyword intent across languages, structured data is automatically adapted per locale, and CDN delivery ensures fast page loads in every market for the Core Web Vitals scores that Google's shopping algorithms prioritize." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Product Content Translation" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "AI translations for product titles, descriptions, and meta tags that preserve local keyword intent and comply with each market's search behavior patterns." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Structured Data Localization" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Localize Product schema including currency-specific price markup, availability strings, and brand name variants to qualify for rich results in each target country." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Performance at Scale" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Edge-cached locale bundles serve your international product catalog at low latency in every market, supporting the Core Web Vitals scores that Google's ranking algorithms demand." })}
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
            {t("cta.title", { defaultValue: "Scale Your E-Commerce SEO to Every Global Market" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Automate multilingual product content, structured data, and locale delivery so your international storefronts rank and convert in every market." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Get started with Better i18n for global e-commerce SEO"
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
