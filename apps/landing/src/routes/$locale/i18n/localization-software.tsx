import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconSettingsGear1,
  IconCodeBrackets,
  IconShieldCheck,
  IconZap,
  IconGroup1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/localization-software")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "localizationSoftware",
      pathname: "/i18n/localization-software",
      pageType: "educational",
      structuredDataOptions: {
        title: "Localization Software Guide",
        description:
          "Guide to localization software and platforms: key features, pricing models, and how to choose the right TMS or CAT tool for your development workflow.",
      },
    });
  },
  component: LocalizationSoftwarePage,
});

const keyFeatures = [
  { icon: IconCodeBrackets, titleKey: "features.tmsCat.title", descKey: "features.tmsCat.description" },
  { icon: IconZap, titleKey: "features.apiCicd.title", descKey: "features.apiCicd.description" },
  { icon: IconShieldCheck, titleKey: "features.glossaryMemory.title", descKey: "features.glossaryMemory.description" },
  { icon: IconGroup1, titleKey: "features.collaboration.title", descKey: "features.collaboration.description" },
];

function LocalizationSoftwarePage() {
  const t = useT("marketing.i18n.localizationSoftware");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    "benefits.list.fasterRelease",
    "benefits.list.consistentQuality",
    "benefits.list.reducedCosts",
    "benefits.list.devIntegration",
    "benefits.list.scalability",
    "benefits.list.translationMemory",
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description" },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description" },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description" },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description" },
  ];

  const relatedPages = [
    { name: "Localization Platforms", href: "/$locale/i18n/localization-platforms", description: t("related.localizationPlatforms", { defaultValue: "How localization management platforms differ from standalone tools" }) },
    { name: "Localization Tools", href: "/$locale/i18n/localization-tools", description: t("related.localizationTools", { defaultValue: "The best developer-facing localization tools available today" }) },
    { name: "Translation Management System", href: "/$locale/i18n/translation-management-system", description: t("related.tms", { defaultValue: "How a TMS centralizes your entire localization workflow" }) },
    { name: "Best TMS", href: "/$locale/i18n/best-tms", description: t("related.bestTms", { defaultValue: "Compare the top TMS platforms side by side" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconSettingsGear1 className="size-4" />
              <span>{t("badge", { defaultValue: "Localization Software" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Localization Software: Platforms and Tools That Power Global Products" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Localization software encompasses the platforms, TMS tools, and CAT environments that engineering and content teams use to manage multilingual products. Whether you're localizing Japanese to English content or scaling from two languages to twenty, the right software determines how efficiently you can ship." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Is Localization Software?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Localization software refers to the category of tools designed specifically to manage the translation, cultural adaptation, and deployment of multilingual content. Unlike generic project management tools, localization software understands the relationship between source strings, target languages, translation memory, and glossaries." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "The category divides into Translation Management Systems (TMS) — which handle workflow, assignments, and delivery — and Computer-Assisted Translation (CAT) tools, which aid human translators with segment-by-segment editing, terminology lookup, and quality assurance checks. Many modern platforms combine both." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "This page focuses specifically on the software platforms themselves — the tools your team installs, subscribes to, and integrates with your codebase. It is distinct from the practice of software localization, which describes the work of adapting a software product for a new market." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("tmsVsCat.title", { defaultValue: "TMS vs. CAT Tools: What's the Difference?" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("tmsVsCat.paragraph1", { defaultValue: "A Translation Management System (TMS) orchestrates the end-to-end localization workflow: it receives source content, routes tasks to translators or AI engines, tracks progress, enforces deadlines, and delivers translated output to your production systems." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("tmsVsCat.paragraph2", { defaultValue: "A CAT tool is the editing environment where translators do their work. It segments source text, displays translation memory matches, enforces glossaries, and runs QA checks. Popular standalone CAT tools include SDL Trados and memoQ — while many cloud TMS platforms now include built-in CAT editors." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("features.title", { defaultValue: "Key Features to Look For in Localization Software" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("features.subtitle", { defaultValue: "Evaluate every platform against these capabilities before committing to a subscription or integration project." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {keyFeatures.map((feature) => (
              <div key={feature.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(feature.titleKey, { defaultValue: feature.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(feature.descKey, { defaultValue: "" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("deployment.title", { defaultValue: "Cloud vs. On-Premise Localization Software" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("deployment.paragraph1", { defaultValue: "Cloud-based localization software — typically delivered as SaaS — offers instant access, automatic updates, and pay-as-you-go pricing. Teams working across time zones benefit from real-time collaboration without server infrastructure overhead. Most modern platforms, including those targeting Japanese to English and Russian translation workflows, are cloud-first." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("deployment.paragraph2", { defaultValue: "On-premise solutions give enterprises with strict data residency requirements full control over their translation assets. They carry higher setup costs and require dedicated IT resources, but are sometimes mandated in regulated industries such as healthcare, finance, or government." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("deployment.paragraph3", { defaultValue: "Hybrid models — cloud orchestration with on-premise data storage — are gaining traction as enterprises seek the speed of SaaS without sacrificing compliance. Evaluate your data classification requirements before choosing a deployment model." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <h3 className="font-display text-lg font-medium text-mist-950 mb-6">
                {t("pricing.title", { defaultValue: "Localization Software Pricing Models" })}
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-mist-50 border border-mist-100">
                  <h4 className="text-sm font-medium text-mist-950 mb-1">{t("pricing.perWord.title", { defaultValue: "Per-Word Pricing" })}</h4>
                  <p className="text-sm text-mist-700">{t("pricing.perWord.description", { defaultValue: "Common for managed translation services. Costs scale directly with content volume — predictable but can become expensive for large sites." })}</p>
                </div>
                <div className="p-4 rounded-xl bg-mist-50 border border-mist-100">
                  <h4 className="text-sm font-medium text-mist-950 mb-1">{t("pricing.subscription.title", { defaultValue: "Monthly Subscription" })}</h4>
                  <p className="text-sm text-mist-700">{t("pricing.subscription.description", { defaultValue: "Fixed monthly fee based on seat count, project volume, or managed keys. Predictable costs that suit teams with steady translation throughput." })}</p>
                </div>
                <div className="p-4 rounded-xl bg-mist-50 border border-mist-100">
                  <h4 className="text-sm font-medium text-mist-950 mb-1">{t("pricing.usageBased.title", { defaultValue: "Usage-Based Pricing" })}</h4>
                  <p className="text-sm text-mist-700">{t("pricing.usageBased.description", { defaultValue: "Pay for API calls, AI translation credits, or CDN bandwidth consumed. Ideal for startups with variable translation loads." })}</p>
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
                {t("benefits.title", { defaultValue: "Benefits of Dedicated Localization Software" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "Teams that adopt purpose-built localization software ship multilingual features faster, maintain higher translation quality, and reduce per-locale operational costs compared to ad-hoc spreadsheet or manual workflows." })}
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
              {t("process.title", { defaultValue: "Integrating Localization Software into Your Dev Workflow" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "Successful adoption follows a clear sequence from evaluation through production deployment." })}
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
              {t("solution.title", { defaultValue: "Better i18n: Modern Localization Software for Developer Teams" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n is cloud-based localization software built for engineering teams. It ships with AST-powered key discovery, a built-in AI translation engine, GitHub sync, and a global CDN — covering everything from Japanese to English translation workflows through to French and Russian localization, all with free-tier access." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "AST Key Discovery" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Automatically detect every translation key in your codebase — no manual extraction scripts or missed strings." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "CI/CD Native" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "GitHub Actions and CLI integrations keep your translation files in sync with every pull request and release." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "MCP Support" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Model Context Protocol support lets AI assistants in your IDE read and write translations directly from your editor." })}
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
            {t("cta.title", { defaultValue: "Try the Localization Software Built for Developers" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Set up Better i18n in minutes, connect your repository, and ship multilingual features without slowing down your release cycle." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start using Better i18n localization software for free"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              aria-label="Read the Better i18n documentation for localization software"
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
