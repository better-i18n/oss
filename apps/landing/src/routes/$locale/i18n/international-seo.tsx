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
  IconChart1,
  IconGroup1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/international-seo")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "internationalSeo",
      pathname: "/i18n/international-seo",
      pageType: "educational",
      structuredDataOptions: {
        title: "International SEO Strategy Guide",
        description:
          "Comprehensive international SEO strategy: market research, keyword localization, technical SEO, and content strategy for global markets.",
      },
    });
  },
  component: InternationalSeoPage,
});

const pillars = [
  { icon: IconMagnifyingGlass, titleKey: "pillars.keywordResearch.title", descKey: "pillars.keywordResearch.description" },
  { icon: IconRocket, titleKey: "pillars.contentLocalization.title", descKey: "pillars.contentLocalization.description" },
  { icon: IconChart1, titleKey: "pillars.technicalSeo.title", descKey: "pillars.technicalSeo.description" },
  { icon: IconGroup1, titleKey: "pillars.linkBuilding.title", descKey: "pillars.linkBuilding.description" },
];

function InternationalSeoPage() {
  const t = useT("marketing.i18n.internationalSeo");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const checklist = [
    "checklist.marketResearch",
    "checklist.competitorAnalysis",
    "checklist.keywordLocalization",
    "checklist.hreflangTags",
    "checklist.localizedContent",
    "checklist.technicalAudit",
    "checklist.linkBuilding",
    "checklist.analyticsTracking",
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description" },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description" },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description" },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description" },
  ];

  const relatedPages = [
    { name: "Multilingual SEO", href: "/$locale/i18n/multilingual-seo", description: t("related.multilingualSeo", { defaultValue: "Core fundamentals of multilingual SEO optimization" }) },
    { name: "Technical International SEO", href: "/$locale/i18n/technical-international-seo", description: t("related.technicalInternationalSeo", { defaultValue: "Technical deep-dive into international SEO" }) },
    { name: "Global Market SEO", href: "/$locale/i18n/global-market-seo", description: t("related.globalMarketSeo", { defaultValue: "SEO strategies for entering global markets" }) },
    { name: "SEO for International Audiences", href: "/$locale/i18n/seo-international-audiences", description: t("related.seoInternationalAudiences", { defaultValue: "Targeting international audiences with SEO" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconGlobe className="size-4" />
              <span>{t("badge", { defaultValue: "International SEO" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "International SEO Strategy: Rank Globally and Grow Beyond Borders" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "International SEO is the discipline of optimizing your website to attract organic traffic from multiple countries and language markets. Whether you are an SEO specialist entering new regions or a business deploying its first international SEO strategy, this guide covers market research, technical SEO checklist essentials, and SEO basics for global audiences." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Is International SEO?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "International SEO is the process of optimizing your website so that search engines like Google can identify which countries and languages you want to target. An effective international SEO strategy ensures that your pages rank for the right search queries in the right markets — not just in your home country." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "SEO tips for international markets differ significantly from domestic SEO. You must conduct separate keyword research for each language, adapt your content to cultural norms, implement proper hreflang signals, and build local authority through region-specific link acquisition." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "This SEO checklist for international expansion addresses the technical, content, and authority dimensions of global search visibility. From SEO basics like page titles to advanced structured data for international audiences, this guide equips you with everything an SEO specialist needs." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("opportunity.title", { defaultValue: "The International SEO Opportunity" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("opportunity.content", { defaultValue: "Search engines process over 8 billion queries daily, and over 60% originate in non-English languages. Businesses that implement a structured international SEO strategy capture organic traffic from markets where paid advertising costs are lower and organic competition is less mature." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("opportunity.content2", { defaultValue: "Markets like Brazil, Germany, Japan, and South Korea each have unique search behaviors and preferred platforms. An international SEO specialist who understands these nuances can unlock traffic channels completely ignored by English-only competitors." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("pillars.title", { defaultValue: "The Four Pillars of International SEO" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("pillars.subtitle", { defaultValue: "Every successful international SEO strategy rests on these core disciplines. Neglecting any one will limit your global ranking potential." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
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
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("checklist.title", { defaultValue: "International SEO Checklist" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-6">
                {t("checklist.subtitle", { defaultValue: "Use this SEO checklist as a foundation for every new market you enter. Each item represents a distinct task that affects your international search visibility." })}
              </p>
              <ul className="space-y-4">
                {checklist.map((itemKey) => (
                  <li key={itemKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(itemKey, { defaultValue: itemKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("seoTips.title", { defaultValue: "SEO Tips for International Markets" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("seoTips.content", { defaultValue: "Conduct localized keyword research in each target language — never rely on direct translation of English keywords. Search intent varies significantly by market. Germans may search more formally, while Brazilian users prefer conversational queries." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("seoTips.content2", { defaultValue: "Analyze local competitors, not global ones. A site ranking #1 in Germany for your category may use strategies entirely different from what works in the US. Study their domain structure, backlink profile, and content depth." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("process.title", { defaultValue: "International SEO Strategy Rollout" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A phased approach to launching international SEO without disrupting existing rankings." })}
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
              {t("solution.title", { defaultValue: "How Better i18n Accelerates International SEO" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n provides the localization infrastructure that powers international SEO at scale. When your translation pipeline is fast and accurate, you can enter new markets faster, keep content freshness signals strong, and maintain keyword relevance across every language variant your site serves." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Localized Meta Tags" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Translate and localize page titles, meta descriptions, and OG tags with SEO-aware AI that understands keyword placement." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Continuous Translation" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Automatically translate new content as it is published so your international pages never lag behind your primary language." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Market Entry Speed" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Launch full multilingual SEO coverage for a new locale in days, not months, with AI-assisted workflows and developer SDKs." })}
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
            {t("cta.title", { defaultValue: "Build Your International SEO Foundation Today" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Give your international SEO strategy the localization infrastructure it needs to scale across every market." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Get started with Better i18n for international SEO"
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
