import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconGlobe,
  IconCheckmark1,
  IconArrowRight,
  IconCodeBrackets,
  IconGroup1,
  IconZap,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/website-localization")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "websiteLocalization",
      pathname: "/i18n/website-localization",
      pageType: "educational",
      structuredDataOptions: {
        title: "Website Localization Guide",
        description:
          "Complete guide to website localization: translate and adapt your web application for global audiences with Better i18n.",
      },
    });
  },
  component: WebsiteLocalizationPage,
});

const challenges = [
  { icon: IconCodeBrackets, titleKey: "challenges.contentManagement.title", descKey: "challenges.contentManagement.description", defaultTitle: "Content Management", defaultDesc: "Managing translations across hundreds of pages, components, and dynamic content while keeping everything in sync with source updates." },
  { icon: IconGlobe, titleKey: "challenges.culturalAdaptation.title", descKey: "challenges.culturalAdaptation.description", defaultTitle: "Cultural Adaptation", defaultDesc: "Adapting imagery, colors, layouts, and messaging to resonate with local audiences beyond simple text translation." },
  { icon: IconGroup1, titleKey: "challenges.teamCoordination.title", descKey: "challenges.teamCoordination.description", defaultTitle: "Team Coordination", defaultDesc: "Coordinating developers, translators, and reviewers across time zones without bottlenecks or miscommunication." },
  { icon: IconZap, titleKey: "challenges.performance.title", descKey: "challenges.performance.description", defaultTitle: "Performance Optimization", defaultDesc: "Loading translations efficiently without impacting page speed, bundle size, or time to first meaningful paint." },
];

function WebsiteLocalizationPage() {
  const t = useT("marketing.i18n.websiteLocalization");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    { key: "benefits.list.globalReach", defaultValue: "Expand your reach to users in new markets and languages" },
    { key: "benefits.list.userExperience", defaultValue: "Deliver a native-quality experience that builds user trust" },
    { key: "benefits.list.seo", defaultValue: "Improve search rankings with locale-specific content and metadata" },
    { key: "benefits.list.revenue", defaultValue: "Increase conversion rates and revenue in international markets" },
    { key: "benefits.list.brandTrust", defaultValue: "Build brand credibility by speaking your customers' language" },
    { key: "benefits.list.compliance", defaultValue: "Meet regional regulatory requirements for content and data privacy" },
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description", defaultTitle: "Audit & Plan", defaultDesc: "Analyze your website structure, identify translatable content, and define target locales and priorities." },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description", defaultTitle: "Internationalize", defaultDesc: "Prepare your codebase with i18n frameworks, extract strings, and set up locale routing." },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description", defaultTitle: "Translate & Adapt", defaultDesc: "Translate content with AI and human reviewers, adapting layouts and media for each locale." },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description", defaultTitle: "Test & Launch", defaultDesc: "QA translations in context, verify locale-specific formatting, and deploy to production." },
  ];

  const relatedPages = [
    { name: "Software Localization", href: "/$locale/i18n/software-localization", description: t("related.softwareLocalization", { defaultValue: "Complete guide to software localization" }) },
    { name: "Translation Management System", href: "/$locale/i18n/translation-management-system", description: t("related.tms", { defaultValue: "How TMS platforms streamline localization" }) },
    { name: "Localization vs Internationalization", href: "/$locale/i18n/localization-vs-internationalization", description: t("related.l10nVsI18n", { defaultValue: "Understanding the key differences" }) },
    { name: "What is Localization?", href: "/$locale/what-is-localization", description: t("related.whatIsL10n", { defaultValue: "Definition and fundamentals of l10n" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconGlobe className="size-4" />
              <span>{t("badge", { defaultValue: "Website Localization" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Website Localization: Adapt Your Web Application for Global Audiences" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Website localization goes beyond translation. Learn how to adapt your web application's content, design, and functionality for users worldwide with web localization services powered by AI." })}
            </p>
          </div>
        </div>
      </section>

      {/* Definition */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Is Website Localization?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Website localization is the process of adapting a web application or website for a specific locale or market. It encompasses translating text, adjusting layouts for right-to-left languages, formatting dates and currencies, and adapting images and colors to match cultural expectations." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "Unlike simple translation, website localisation services consider the full user experience. This includes SEO optimization for local search engines, adapting payment methods, and ensuring compliance with regional regulations like GDPR or CCPA." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "Modern web localization leverages translation management systems and AI-powered tools to streamline the process, reducing time-to-market for multilingual websites from months to days." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("whyItMatters.title", { defaultValue: "Why Website Localization Matters" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("whyItMatters.content", { defaultValue: "75% of consumers prefer to buy products in their native language. Companies that localize their websites see up to 70% higher conversion rates in target markets. Web localization is not optional for global businesses - it's a competitive necessity." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("challenges.title", { defaultValue: "Common Website Localization Challenges" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("challenges.subtitle", { defaultValue: "Understanding these challenges helps you choose the right web localization services and tools for your project." })}
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

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("benefits.title", { defaultValue: "Benefits of Website Localization" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "Investing in website translation localization delivers measurable returns across user engagement, search visibility, and revenue." })}
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

      {/* Process */}
      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("process.title", { defaultValue: "The Website Localization Process" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A proven workflow for localizing your web application efficiently." })}
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

      {/* How Better i18n Helps */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
              {t("solution.title", { defaultValue: "Streamline Website Localization with Better i18n" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n combines AI-powered translation with developer-friendly tools to make website localization seamless. Auto-discover translation keys from your codebase, translate with context-aware AI, and deploy to global CDN instantly." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "AI Translation" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Context-aware translations that respect your brand glossary and terminology." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Developer SDK" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Type-safe SDKs for React, Next.js, Vue, and more with automatic key discovery." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Instant Deploy" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Push translations to global CDN or sync via GitHub - no redeploy needed." })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Pages */}
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

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-mist-950 rounded-3xl mx-6 lg:mx-10 mb-16">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
            {t("cta.title", { defaultValue: "Start Localizing Your Website Today" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Set up website localization in minutes with AI-powered translations and developer-friendly tools." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
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
