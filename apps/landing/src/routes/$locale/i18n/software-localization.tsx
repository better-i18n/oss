import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { SeeAlso } from "@/components/SeeAlso";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconGlobe,
  IconCodeBrackets,
  IconSettingsGear1,
  IconGroup1,
  IconRocket,
  IconZap,
  IconChart1,
  IconSparklesSoft,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/software-localization")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
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

const localizationTypes = [
  { icon: IconGlobe, titleKey: "types.web.title", descKey: "types.web.description", defaultTitle: "Web Application Localization", defaultDesc: "Adapting single-page applications (SPAs) and server-rendered frameworks for multiple locales. Involves browser locale detection, CDN-delivered translation bundles, dynamic route-based locale switching, and SEO-friendly hreflang implementation." },
  { icon: IconRocket, titleKey: "types.mobile.title", descKey: "types.mobile.description", defaultTitle: "Mobile App Localization", defaultDesc: "Localizing iOS apps using .strings and .stringsdict files, Android apps using XML string resources, and cross-platform frameworks like React Native and Flutter. Includes app store listing localization for each target market." },
  { icon: IconCodeBrackets, titleKey: "types.desktop.title", descKey: "types.desktop.description", defaultTitle: "Desktop Application Localization", defaultDesc: "Adapting Windows applications using .resx resource files, macOS apps using .lproj bundles, and Linux apps using gettext PO files. Covers installer localization, help documentation, and system-level integration." },
  { icon: IconSettingsGear1, titleKey: "types.saas.title", descKey: "types.saas.description", defaultTitle: "SaaS Platform Localization", defaultDesc: "Multi-tenant locale support for cloud platforms including user-facing dashboards, admin interfaces, transactional emails, API response messages, and in-app notifications. Requires coordinating localization across microservices." },
];

const toolCategories = [
  { icon: IconGroup1, titleKey: "tools.tms.title", descKey: "tools.tms.description", defaultTitle: "Translation Management Systems (TMS)", defaultDesc: "Centralized platforms that manage the full translation lifecycle — organizing string files, coordinating translator assignments, maintaining translation memory, and tracking progress across languages. A TMS is the backbone of any scalable localization workflow." },
  { icon: IconSparklesSoft, titleKey: "tools.cat.title", descKey: "tools.cat.description", defaultTitle: "Computer-Assisted Translation (CAT) Tools", defaultDesc: "Desktop or cloud-based tools that help professional translators work faster with translation memory, glossary lookups, and terminology management. CAT tools suggest previously approved translations and enforce consistency across large projects." },
  { icon: IconZap, titleKey: "tools.continuous.title", descKey: "tools.continuous.description", defaultTitle: "Continuous Localization Platforms", defaultDesc: "Developer-first platforms like Better i18n that integrate directly with CI/CD pipelines and source control. They automatically detect new strings, trigger translations, and deploy updated language files — keeping localization in sync with every code release." },
];

const localizationMetrics = [
  { labelKey: "metrics.coverage.label", descKey: "metrics.coverage.description", defaultLabel: "Translation Coverage", defaultDesc: "Percentage of strings translated per locale. Target: 100% for shipping locales." },
  { labelKey: "metrics.timeToMarket.label", descKey: "metrics.timeToMarket.description", defaultLabel: "Time to Market", defaultDesc: "Days from new English string to deployed translation. Continuous localization can reduce this to under 24 hours." },
  { labelKey: "metrics.lqa.label", descKey: "metrics.lqa.description", defaultLabel: "Linguistic Quality", defaultDesc: "LQA (Linguistic Quality Assurance) score per locale, measuring accuracy, fluency, and terminology consistency." },
  { labelKey: "metrics.pseudoLoc.label", descKey: "metrics.pseudoLoc.description", defaultLabel: "Pseudo-Localization Pass Rate", defaultDesc: "Percentage of UI elements that correctly handle text expansion, special characters, and long strings." },
  { labelKey: "metrics.untranslated.label", descKey: "metrics.untranslated.description", defaultLabel: "Untranslated String Count", defaultDesc: "Number of missing translation keys in production. Should be zero for launched locales." },
];

const processSteps = [
  { icon: IconCodeBrackets, titleKey: "process.internationalization.title", descKey: "process.internationalization.description", defaultTitle: "Internationalization (i18n)", defaultDesc: "Prepare your codebase by externalizing strings, supporting Unicode, and abstracting locale-dependent logic like dates and currencies." },
  { icon: IconGlobe, titleKey: "process.translation.title", descKey: "process.translation.description", defaultTitle: "Translation", defaultDesc: "Translate all user-facing strings using professional translators, AI-powered tools, or a hybrid workflow managed through a TMS." },
  { icon: IconSettingsGear1, titleKey: "process.adaptation.title", descKey: "process.adaptation.description", defaultTitle: "Cultural Adaptation", defaultDesc: "Adjust layouts for text expansion, support RTL languages, localize images and icons, and adapt content to regional cultural norms." },
  { icon: IconGroup1, titleKey: "process.testing.title", descKey: "process.testing.description", defaultTitle: "Localization Testing", defaultDesc: "Run linguistic, functional, and visual QA across every supported locale to catch truncation, encoding issues, and cultural mismatches." },
];

function SoftwareLocalizationPage() {
  const t = useT("marketing.i18n.softwareLocalization");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    { key: "benefits.list.marketExpansion", defaultValue: "Expand into new markets without rebuilding your product" },
    { key: "benefits.list.userRetention", defaultValue: "Increase user retention with native-language experiences" },
    { key: "benefits.list.competitiveAdvantage", defaultValue: "Gain competitive advantage over English-only alternatives" },
    { key: "benefits.list.revenue", defaultValue: "Unlock new revenue streams from international users" },
    { key: "benefits.list.compliance", defaultValue: "Meet regional compliance and accessibility requirements" },
    { key: "benefits.list.brandPerception", defaultValue: "Strengthen brand perception in local markets" },
  ];

  const bestPractices = [
    { titleKey: "bestPractices.planEarly.title", descKey: "bestPractices.planEarly.description", defaultTitle: "Plan for Localization Early", defaultDesc: "Design your architecture with localization in mind from day one. Retrofitting i18n into a mature codebase is far more expensive than building it in from the start." },
    { titleKey: "bestPractices.externalizeStrings.title", descKey: "bestPractices.externalizeStrings.description", defaultTitle: "Externalize All Strings", defaultDesc: "Never hardcode user-facing text. Store all strings in external resource files (JSON, XLIFF) so translators can work without touching code." },
    { titleKey: "bestPractices.useIcu.title", descKey: "bestPractices.useIcu.description", defaultTitle: "Use ICU Message Format", defaultDesc: "Handle plurals, gender, and complex formatting with ICU MessageFormat instead of string concatenation that breaks across languages." },
    { titleKey: "bestPractices.automate.title", descKey: "bestPractices.automate.description", defaultTitle: "Automate the Workflow", defaultDesc: "Integrate your TMS with CI/CD pipelines to automatically sync new strings, trigger translations, and deploy updates without manual handoffs." },
    { titleKey: "bestPractices.testContinuously.title", descKey: "bestPractices.testContinuously.description", defaultTitle: "Test Continuously", defaultDesc: "Run automated localization tests on every build to catch truncation, missing translations, and encoding issues before they reach production." },
    { titleKey: "bestPractices.contextForTranslators.title", descKey: "bestPractices.contextForTranslators.description", defaultTitle: "Provide Context for Translators", defaultDesc: "Add screenshots, character limits, and usage descriptions to translation keys so translators produce accurate, contextually correct results." },
  ];

  const relatedPages = [
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("related.websiteLocalization", { defaultValue: "Adapting websites for global audiences" }) },
    { name: "Localization Software", href: "/$locale/i18n/localization-software", description: t("related.localizationSoftware", { defaultValue: "Platforms and software for managing localization at scale" }) },
    { name: "Localization vs Internationalization", href: "/$locale/i18n/localization-vs-internationalization", description: t("related.l10nVsI18n", { defaultValue: "Understanding the key differences" }) },
    { name: "What is Localization?", href: "/$locale/what-is-localization", description: t("related.whatIsL10n", { defaultValue: "Fundamentals of localization" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
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
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph3", { defaultValue: "The software localization process typically begins during development (internationalization) and continues through translation, testing, and deployment. Modern platforms like Better i18n streamline this entire pipeline with AI-powered translation and developer-friendly SDKs." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph4", { defaultValue: "Software localization has evolved significantly with advances in artificial intelligence. Modern localization platforms use neural machine translation as a first pass, generating draft translations that professional linguists then review and refine for quality-critical strings. This hybrid approach — combining AI speed with human expertise — reduces time-to-market for new locales while maintaining the linguistic quality that users expect. Teams can now ship translations for routine UI strings within hours and reserve human review budgets for marketing copy, legal text, and culturally sensitive content." })}
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

      {/* Types of Software Localization */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("types.title", { defaultValue: "Types of Software Localization" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("types.subtitle", { defaultValue: "Software localization varies by platform. Each type has distinct file formats, toolchains, and deployment considerations that shape the localization workflow." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {localizationTypes.map((type) => (
              <div key={type.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-full bg-mist-100 flex items-center justify-center mb-4">
                  <type.icon className="size-5 text-mist-700" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(type.titleKey, { defaultValue: type.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(type.descKey, { defaultValue: type.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-mist-100">
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
                  {t(step.titleKey, { defaultValue: step.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(step.descKey, { defaultValue: step.defaultDesc })}
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
                {benefits.map((item) => (
                  <li key={item.key} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(item.key, { defaultValue: item.defaultValue })}</span>
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
                  {t(practice.titleKey, { defaultValue: practice.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(practice.descKey, { defaultValue: practice.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools and Platforms */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("tools.title", { defaultValue: "Software Localization Tools and Platforms" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("tools.subtitle", { defaultValue: "The right tooling turns localization from a manual bottleneck into a streamlined, repeatable process. Most teams combine tools from these three categories to build a complete localization stack." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {toolCategories.map((tool) => (
              <div key={tool.titleKey} className="p-6 rounded-xl bg-mist-50 border border-mist-200">
                <div className="size-10 rounded-full bg-mist-100 flex items-center justify-center mb-4">
                  <tool.icon className="size-5 text-mist-700" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(tool.titleKey, { defaultValue: tool.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(tool.descKey, { defaultValue: tool.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("metrics.title", { defaultValue: "Key Metrics for Software Localization" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("metrics.subtitle", { defaultValue: "Track these five metrics to measure localization health and identify bottlenecks before they affect your international users." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {localizationMetrics.map((metric) => (
              <div key={metric.labelKey} className="p-5 rounded-xl bg-white border border-mist-200 text-center">
                <div className="size-8 rounded-full bg-mist-100 flex items-center justify-center mx-auto mb-3">
                  <IconChart1 className="size-4 text-mist-700" />
                </div>
                <h3 className="text-sm font-medium text-mist-950 mb-1">
                  {t(metric.labelKey, { defaultValue: metric.defaultLabel })}
                </h3>
                <p className="text-xs text-mist-600 leading-relaxed">
                  {t(metric.descKey, { defaultValue: metric.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-8 text-center">
              {t("faq.title", { defaultValue: "Frequently Asked Questions About Software Localization" })}
            </h2>
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-mist-200">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("faq.q1.question", { defaultValue: "What is the difference between internationalization and localization?" })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("faq.q1.answer", { defaultValue: "Internationalization (i18n) is the process of designing software so it can be adapted to different languages and regions without code changes — externalizing strings, supporting Unicode, and abstracting locale-dependent formatting. Localization (L10n) is the process of actually adapting the software for a specific locale — translating text, adjusting layouts, and customizing content for cultural relevance. i18n is done once by developers; L10n is done per locale by translators and localization engineers." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white border border-mist-200">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("faq.q2.question", { defaultValue: "When should I start planning for localization?" })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("faq.q2.answer", { defaultValue: "As early as possible — ideally during initial architecture and design. Retrofitting internationalization into an existing codebase is significantly more expensive than building it in from the start. Even if you only support one language at launch, externalizing strings and using proper i18n libraries from day one makes adding languages later straightforward." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white border border-mist-200">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("faq.q3.question", { defaultValue: "How do I handle text that expands in other languages?" })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("faq.q3.answer", { defaultValue: "Text expansion is one of the most common localization issues. German text is typically 30-40% longer than English, while Chinese and Japanese are often more compact. Design flexible layouts using auto-sizing containers, avoid fixed-width elements for text, and test with pseudo-localization tools that simulate text expansion before real translations are available." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white border border-mist-200">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("faq.q4.question", { defaultValue: "What file formats are used for software localization?" })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("faq.q4.answer", { defaultValue: "Common formats include JSON (web and mobile apps), XLIFF (industry standard exchange format), .strings and .stringsdict (iOS), XML resources (Android), .resx (Microsoft .NET), PO/POT files (gettext/open source), and ARB files (Flutter). The best choice depends on your tech stack and tooling. Most translation management systems support all major formats." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white border border-mist-200">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("faq.q5.question", { defaultValue: "Should I use machine translation or human translators?" })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("faq.q5.answer", { defaultValue: "Most teams use a hybrid approach. Machine translation (MT) works well for high-volume, lower-stakes content like support articles and internal documentation. Customer-facing UI strings, marketing copy, and legal content benefit from human translation or machine translation with human post-editing (MTPE). The right balance depends on your content types, quality requirements, and budget." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white border border-mist-200">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("faq.q6.question", { defaultValue: "What is continuous localization?" })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("faq.q6.answer", { defaultValue: "Continuous localization is the practice of integrating translation directly into your CI/CD pipeline so that new and updated strings are automatically detected, sent for translation, and deployed alongside code changes. Instead of batching translations into periodic release cycles, continuous localization keeps every locale in sync with the source language. Platforms that support this workflow monitor your repository for string changes, trigger translation jobs automatically, and merge completed translations back into your build — enabling teams to ship localized releases with every deployment." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white border border-mist-200">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("faq.q7.question", { defaultValue: "How do I handle localization for right-to-left languages?" })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("faq.q7.answer", { defaultValue: "Right-to-left (RTL) localization for languages like Arabic, Hebrew, and Persian requires more than flipping the text direction. Use CSS logical properties (margin-inline-start instead of margin-left) so layouts mirror automatically. Set the dir attribute on your HTML root element based on the active locale. Handle bidirectional text carefully — numbers, URLs, and code snippets remain left-to-right even within RTL content. Test thoroughly with RTL pseudo-localization to catch layout issues, misaligned icons, and truncated text before shipping to real users." })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Pages */}

      <SeeAlso currentSlug="software-localization" locale={locale} />
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
