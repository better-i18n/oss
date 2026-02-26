import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconGlobe,
  IconCheckmark1,
  IconArrowRight,
  IconCodeBrackets,
  IconZap,
  IconSettingsGear1,
  IconSparklesSoft,
  IconGroup1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/localization-tools")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "localizationTools",
      pathname: "/i18n/localization-tools",
      pageType: "educational",
      structuredDataOptions: {
        title: "Localization Tools Guide",
        description:
          "Complete guide to localization tools: compare TMS platforms, AI translation engines, CAT tools, and developer SDKs to find the best translation app for your stack.",
      },
    });
  },
  component: LocalizationToolsPage,
});

const categories = [
  { icon: IconGroup1, titleKey: "categories.tms.title", descKey: "categories.tms.description" },
  { icon: IconSparklesSoft, titleKey: "categories.ai.title", descKey: "categories.ai.description" },
  { icon: IconCodeBrackets, titleKey: "categories.sdk.title", descKey: "categories.sdk.description" },
  { icon: IconSettingsGear1, titleKey: "categories.cat.title", descKey: "categories.cat.description" },
];

function LocalizationToolsPage() {
  const t = useTranslations("marketing.i18n.localizationTools");
  const tCommon = useTranslations("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    "benefits.list.fasterTTM",
    "benefits.list.consistency",
    "benefits.list.aiEfficiency",
    "benefits.list.developerIntegration",
    "benefits.list.scalability",
    "benefits.list.costReduction",
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description" },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description" },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description" },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description" },
  ];

  const toolComparisons = [
    { titleKey: "comparison.developerFocused.title", descKey: "comparison.developerFocused.description" },
    { titleKey: "comparison.translatorFocused.title", descKey: "comparison.translatorFocused.description" },
    { titleKey: "comparison.aiPowered.title", descKey: "comparison.aiPowered.description" },
  ];

  const relatedPages = [
    { name: "Localization Software", href: "/$locale/i18n/localization-software", description: t("related.localizationSoftware", { defaultValue: "Overview of localization software platforms" }) },
    { name: "Localization Platforms", href: "/$locale/i18n/localization-platforms", description: t("related.localizationPlatforms", { defaultValue: "Compare leading localization platforms" }) },
    { name: "Translation Solutions", href: "/$locale/i18n/translation-solutions", description: t("related.translationSolutions", { defaultValue: "End-to-end translation workflow solutions" }) },
    { name: "Best i18n Library", href: "/$locale/i18n/best-library", description: t("related.bestLibrary", { defaultValue: "Find the best i18n library for your framework" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconZap className="size-4" />
              <span>{t("badge", { defaultValue: "Localization Tools" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Localization Tools: The Best Translation Apps and Software for Every Team" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "From AI-powered translations and machine translation engines to CAT tools and developer SDKs, this guide covers every category of localization tool so you can choose the best translation app for your workflow, stack, and scale." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Are Localization Tools?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Localization tools are software applications that help teams translate, adapt, and manage content for multiple languages and markets. The category spans translation management systems (TMS), computer-assisted translation (CAT) tools, machine translation engines, AI for translation, browser extensions, and developer-focused SDKs." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "The best translation app for a given team depends on who does the localizing. Developer-focused tools prioritize CI/CD integration, type-safe SDKs, and automated key extraction. Translator-focused tools prioritize translation memory, glossary management, and quality assurance workflows." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "AI-powered translations have transformed the landscape. Modern ai for translation goes far beyond word-for-word machine translation — context-aware models respect brand glossaries, preserve formatting, and produce translations that require minimal post-editing, dramatically reducing the cost-per-word of professional localization." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("marketOverview.title", { defaultValue: "The Localization Tools Landscape" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("marketOverview.content", { defaultValue: "The global translation management software market is growing at over 12% annually, driven by AI integration and the explosion of digital content. Teams managing translation applications today choose between all-in-one platforms, specialized CAT tools, and lightweight developer SDKs — often combining multiple tools in a single pipeline." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("marketOverview.content2", { defaultValue: "A translate extension or browser-based tool serves quick review workflows, while an enterprise TMS handles thousands of strings across dozens of locales. Understanding which category addresses your bottleneck is the first step to selecting the right best application for translation." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("categories.title", { defaultValue: "Categories of Localization Tools" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("categories.subtitle", { defaultValue: "Each tool category serves a distinct role in the localization pipeline. Most production workflows combine two or more of these categories." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <div key={category.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <category.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(category.titleKey, { defaultValue: category.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(category.descKey, { defaultValue: "" })}
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
              {t("comparison.title", { defaultValue: "Developer Tools vs. Translator Tools vs. AI-Powered Tools" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("comparison.subtitle", { defaultValue: "The right translation application depends on your primary user — engineers shipping features, linguists refining quality, or product teams automating the entire pipeline with AI powered translations." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {toolComparisons.map((item) => (
              <div key={item.titleKey} className="p-6 rounded-xl border border-mist-200 bg-mist-50">
                <h3 className="text-base font-medium text-mist-950 mb-3">
                  {t(item.titleKey, { defaultValue: item.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(item.descKey, { defaultValue: "" })}
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
                {t("benefits.title", { defaultValue: "Benefits of Using Dedicated Localization Tools" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "Investing in the right localization tool stack delivers compounding returns across speed, quality, and cost — especially as your application scales to new markets." })}
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
              {t("process.title", { defaultValue: "How to Choose and Integrate Localization Tools" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A practical framework for evaluating, selecting, and integrating the best translation application for your team." })}
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
              {t("solution.title", { defaultValue: "Better i18n: The AI-Powered Translation Tool Built for Developers" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n is the best translation app for engineering teams that ship fast. It combines AI powered translations with a developer-first SDK, automated key extraction from your codebase, and a CDN-backed delivery layer — replacing a stack of disparate localization tools with a single integrated platform." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "AI Translation Engine" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Context-aware machine translation with glossary support that produces publication-ready ai powered translations across 50+ languages." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Developer SDK" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Type-safe translation application SDK for React, Next.js, Vue, Svelte, and Expo — with automatic key discovery and CI/CD integration." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Zero-Config Delivery" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Push translations to global CDN or sync via GitHub — no redeploy required. Functions as both a translate extension for teams and a full TMS for enterprises." })}
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
            {t("cta.title", { defaultValue: "Ship Your First Localization in Minutes" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Replace your fragmented localization tool stack with Better i18n's all-in-one AI translation platform built for developers." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Get started with Better i18n localization tools"
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
