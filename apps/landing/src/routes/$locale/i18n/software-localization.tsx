import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconCheckmark1,
  IconArrowRight,
  IconGlobe,
  IconCodeBrackets,
  IconSettingsGear1,
  IconGroup1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/software-localization")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "softwareLocalization",
      pathname: "/i18n/software-localization",
      pageType: "educational",
      structuredDataOptions: {
        title: "Software Localization Guide",
        description:
          "Learn the software localization process: how to adapt your application for global markets with best practices and modern tools.",
      },
    });
  },
  component: SoftwareLocalizationPage,
});

const processSteps = [
  { icon: IconCodeBrackets, titleKey: "process.internationalization.title", descKey: "process.internationalization.description" },
  { icon: IconGlobe, titleKey: "process.translation.title", descKey: "process.translation.description" },
  { icon: IconSettingsGear1, titleKey: "process.adaptation.title", descKey: "process.adaptation.description" },
  { icon: IconGroup1, titleKey: "process.testing.title", descKey: "process.testing.description" },
];

function SoftwareLocalizationPage() {
  const t = useTranslations("marketing.i18n.softwareLocalization");
  const tCommon = useTranslations("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    "benefits.list.marketExpansion",
    "benefits.list.userRetention",
    "benefits.list.competitiveAdvantage",
    "benefits.list.revenue",
    "benefits.list.compliance",
    "benefits.list.brandPerception",
  ];

  const bestPractices = [
    { titleKey: "bestPractices.planEarly.title", descKey: "bestPractices.planEarly.description" },
    { titleKey: "bestPractices.externalizeStrings.title", descKey: "bestPractices.externalizeStrings.description" },
    { titleKey: "bestPractices.useIcu.title", descKey: "bestPractices.useIcu.description" },
    { titleKey: "bestPractices.automate.title", descKey: "bestPractices.automate.description" },
    { titleKey: "bestPractices.testContinuously.title", descKey: "bestPractices.testContinuously.description" },
    { titleKey: "bestPractices.contextForTranslators.title", descKey: "bestPractices.contextForTranslators.description" },
  ];

  const relatedPages = [
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("related.websiteLocalization", { defaultValue: "Adapting websites for global audiences" }) },
    { name: "Software Localization Services", href: "/$locale/i18n/software-localization-services", description: t("related.services", { defaultValue: "Platform vs agency approaches" }) },
    { name: "Localization vs Internationalization", href: "/$locale/i18n/localization-vs-internationalization", description: t("related.l10nVsI18n", { defaultValue: "Understanding the key differences" }) },
    { name: "What is Localization?", href: "/$locale/what-is-localization", description: t("related.whatIsL10n", { defaultValue: "Fundamentals of localization" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconCodeBrackets className="size-4" />
              <span>{t("badge", { defaultValue: "Software Localization" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Software Localization: Adapt Your Application for Global Markets" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Software localization is the process of adapting your application for different languages and regions. Learn the complete software localization process, from internationalization to deployment, with modern tools and best practices." })}
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
                {t("definition.title", { defaultValue: "What Is Software Localization?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Software localization (also spelled software localisation) is the process of adapting a software product to meet the language, cultural, and technical requirements of a target market. It goes beyond simple text translation to include UI adaptation, date and number formatting, and cultural customization." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "Computer software localization encompasses desktop applications, web applications, mobile apps, and embedded systems. Each platform has unique challenges, but the core principles remain the same: externalize strings, support multiple locales, and automate the translation workflow." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "The software localization process typically begins during development (internationalization) and continues through translation, testing, and deployment. Modern platforms like Better i18n streamline this entire pipeline with AI-powered translation and developer-friendly SDKs." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("scope.title", { defaultValue: "Scope of Software Localization" })}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("scope.uiStrings", { defaultValue: "User interface strings and labels" })}
                </li>
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("scope.dateTime", { defaultValue: "Date, time, and number formatting" })}
                </li>
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("scope.layout", { defaultValue: "Layout and RTL language support" })}
                </li>
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("scope.media", { defaultValue: "Images, icons, and multimedia content" })}
                </li>
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("scope.legal", { defaultValue: "Legal and compliance requirements" })}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("process.title", { defaultValue: "The Software Localization Process" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("process.subtitle", { defaultValue: "A structured approach to localizing your software product from start to finish." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={step.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-8 rounded-full bg-mist-950 text-white flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <step.icon className="size-5 text-mist-600" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(step.titleKey, { defaultValue: step.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(step.descKey, { defaultValue: "" })}
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
                {t("benefits.title", { defaultValue: "Why Software Localization Matters" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "Localized software reaches wider audiences and drives measurable business results across engagement, retention, and revenue." })}
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

      {/* Best Practices */}
      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("bestPractices.title", { defaultValue: "Software Localization Best Practices" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("bestPractices.subtitle", { defaultValue: "Follow these proven practices to localize your software efficiently and maintain quality." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bestPractices.map((practice) => (
              <div key={practice.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(practice.titleKey, { defaultValue: practice.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(practice.descKey, { defaultValue: "" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-12 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-lg font-medium text-mist-950 mb-6">
            {tCommon("whatIs.relatedTopics", { defaultValue: "Related Topics" })}
          </h2>
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
            {t("cta.title", { defaultValue: "Simplify Your Software Localization" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "AI-powered translations, developer SDKs, and instant deployment. Start localizing in minutes." })}
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
