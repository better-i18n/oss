import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconGlobe,
  IconCheckmark1,
  IconArrowRight,
  IconMagnifyingGlass,
  IconRocket,
  IconChart1,
  IconShieldCheck,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/international-seo-consulting")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "internationalSeoConsulting",
      pathname: "/i18n/international-seo-consulting",
      pageType: "educational",
      structuredDataOptions: {
        title: "International SEO Consulting Guide",
        description:
          "Complete guide to international SEO consulting: when to hire an SEO consultant for global expansion, what the process includes, and how to build an international SEO roadmap.",
      },
    });
  },
  component: InternationalSeoConsultingPage,
});

const problems = [
  { icon: IconMagnifyingGlass, titleKey: "problems.keywordMapping.title", descKey: "problems.keywordMapping.description" },
  { icon: IconRocket, titleKey: "problems.technicalGaps.title", descKey: "problems.technicalGaps.description" },
  { icon: IconChart1, titleKey: "problems.roiMeasurement.title", descKey: "problems.roiMeasurement.description" },
  { icon: IconShieldCheck, titleKey: "problems.competitorAnalysis.title", descKey: "problems.competitorAnalysis.description" },
];

function InternationalSeoConsultingPage() {
  const t = useTranslations("marketing.i18n.internationalSeoConsulting");
  const tCommon = useTranslations("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    "benefits.list.expertGuidance",
    "benefits.list.fasterResults",
    "benefits.list.avoidCostlyMistakes",
    "benefits.list.roiClarity",
    "benefits.list.technicalAudit",
    "benefits.list.competitiveIntelligence",
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description" },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description" },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description" },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description" },
  ];

  const roadmapPhases = [
    { titleKey: "roadmap.discovery.title", descKey: "roadmap.discovery.description" },
    { titleKey: "roadmap.technical.title", descKey: "roadmap.technical.description" },
    { titleKey: "roadmap.content.title", descKey: "roadmap.content.description" },
  ];

  const relatedPages = [
    { name: "International SEO Strategy", href: "/$locale/i18n/international-seo", description: t("related.internationalSeo", { defaultValue: "Build your international SEO strategy from scratch" }) },
    { name: "Global Market SEO", href: "/$locale/i18n/global-market-seo", description: t("related.globalMarketSeo", { defaultValue: "Capture organic traffic in global markets" }) },
    { name: "Multilingual SEO", href: "/$locale/i18n/multilingual-seo", description: t("related.multilingualSeo", { defaultValue: "Optimize for multiple languages and regions" }) },
    { name: "Technical International SEO", href: "/$locale/i18n/technical-international-seo", description: t("related.technicalInternationalSeo", { defaultValue: "Hreflang, URL structure, and technical implementation" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconGlobe className="size-4" />
              <span>{t("badge", { defaultValue: "International SEO Consulting" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "International SEO Consulting: Your Guide to Global Search Visibility" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "International SEO consulting bridges SEO fundamentals with the complexity of multi-market expansion. This guide covers the SEO process for global growth, when to hire a consultant, what the engagement includes, and how to build an international SEO roadmap that delivers measurable ROI." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Is International SEO Consulting?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "International SEO consulting is the practice of advising businesses on how to optimize their websites for search engines across multiple countries and languages. A consultant brings SEO experience across diverse markets, helping teams avoid the common pitfalls of hreflang misconfiguration, duplicate content, and keyword cannibalization that undermine global ranking efforts." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "Unlike general SEO web design advice, international SEO consulting is deeply strategic. It addresses SEO fundamentals like site architecture, crawl budget allocation, and structured data — and then layers in market-specific research such as local keyword intent, competitor landscapes, and content localization requirements for each target region." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "For businesses at the start of global expansion, SEO for beginners in new markets can feel overwhelming. A consultant provides a structured SEO process: audit the current state, identify market opportunities, prioritize quick wins, and build a phased roadmap aligned to business objectives." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("whenToHire.title", { defaultValue: "When to Hire an International SEO Consultant" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("whenToHire.content", { defaultValue: "Hiring an SEO consultant makes economic sense when: you are entering 3 or more new markets simultaneously, organic traffic from international pages has plateaued despite content investment, technical SEO issues are causing indexing failures in specific regions, or your in-house team lacks the SEO experience to diagnose cross-language ranking problems." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("whenToHire.content2", { defaultValue: "The SEO essentials a consultant covers in the first 30 days — a technical audit, hreflang validation, and competitive gap analysis — typically surface opportunities worth 5-10x the engagement cost in recoverable organic traffic." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("problems.title", { defaultValue: "Common International SEO Problems Consultants Solve" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("problems.subtitle", { defaultValue: "These are the most expensive international SEO mistakes businesses make without expert guidance — each one directly suppresses rankings in target markets." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((problem) => (
              <div key={problem.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <problem.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(problem.titleKey, { defaultValue: problem.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(problem.descKey, { defaultValue: "" })}
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
              {t("roadmap.title", { defaultValue: "Building an International SEO Roadmap" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("roadmap.subtitle", { defaultValue: "An SEO guide for international markets structures work into phases — preventing teams from skipping the SEO essentials that form the foundation of sustainable global rankings." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {roadmapPhases.map((phase) => (
              <div key={phase.titleKey} className="p-6 rounded-xl border border-mist-200 bg-mist-50">
                <div className="flex items-center gap-3 mb-3">
                  <IconRocket className="size-5 text-mist-700" />
                  <h3 className="text-base font-medium text-mist-950">
                    {t(phase.titleKey, { defaultValue: phase.titleKey.split(".").pop() })}
                  </h3>
                </div>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(phase.descKey, { defaultValue: "" })}
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
                {t("benefits.title", { defaultValue: "Benefits of Investing in International SEO Consulting" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "The SEO experience a consultant brings compresses years of learning into weeks — avoiding the costly errors that can take 6-12 months to reverse in Google's index." })}
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
              {t("process.title", { defaultValue: "The International SEO Consulting Process" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A structured SEO process that takes teams from diagnosis through execution and ongoing measurement." })}
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
              {t("solution.title", { defaultValue: "How Better i18n Supports Your International SEO Strategy" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "International SEO consulting identifies what needs to happen — Better i18n executes the localization layer that makes it possible. From SEO-aware AI translations that preserve keyword intent to automatic hreflang tag generation and CDN-delivered locale bundles, Better i18n implements the technical SEO essentials that consultants recommend." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "SEO-Aware AI Translations" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Translations that preserve target keywords, meta descriptions, and heading structure so every locale page ranks for its intended queries." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Hreflang Automation" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Automatically generate correct hreflang tags across all language variants — eliminating the most common source of international indexing errors." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Performance-Ready Delivery" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Edge-cached locale bundles that improve Core Web Vitals scores in each target market, supporting the technical SEO fundamentals consultants prioritize." })}
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
            {t("cta.title", { defaultValue: "Start Your International SEO Expansion Today" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Implement the localization infrastructure that international SEO consultants recommend — automated, accurate, and ready to scale." })}
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
