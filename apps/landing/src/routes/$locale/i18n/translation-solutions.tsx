import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconRocket,
  IconCodeBrackets,
  IconSettingsGear1,
  IconGroup1,
  IconSparklesSoft,
  IconApiConnection,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/translation-solutions")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "translationSolutions",
      pathname: "/i18n/translation-solutions",
      pageType: "educational",
      structuredDataOptions: {
        title: "Website Translation Solutions Guide",
        description:
          "Compare website translation solutions: SaaS platforms, APIs, plugins, and AI tools for translating English to Hindi, Mandarin Chinese, and more.",
      },
    });
  },
  component: TranslationSolutionsPage,
});

const solutionTypes = [
  { icon: IconRocket, titleKey: "types.saas.title", descKey: "types.saas.description" },
  { icon: IconCodeBrackets, titleKey: "types.api.title", descKey: "types.api.description" },
  { icon: IconApiConnection, titleKey: "types.plugins.title", descKey: "types.plugins.description" },
  { icon: IconSparklesSoft, titleKey: "types.aiNative.title", descKey: "types.aiNative.description" },
];

function TranslationSolutionsPage() {
  const t = useT("marketing.i18n.translationSolutions");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const evaluationCriteria = [
    "criteria.list.languageCoverage",
    "criteria.list.integrationOptions",
    "criteria.list.translationMemory",
    "criteria.list.documentSupport",
    "criteria.list.aiQuality",
    "criteria.list.pricingModel",
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description" },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description" },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description" },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description" },
  ];

  const relatedPages = [
    { name: "Website Translation", href: "/$locale/i18n/website-translation", description: t("related.websiteTranslation", { defaultValue: "Comprehensive guide to translating websites into any language" }) },
    { name: "Localization Tools", href: "/$locale/i18n/localization-tools", description: t("related.localizationTools", { defaultValue: "Tools and integrations for streamlined localization workflows" }) },
    { name: "Localization Software", href: "/$locale/i18n/localization-software", description: t("related.localizationSoftware", { defaultValue: "Platforms and software for managing localization at scale" }) },
    { name: "Content Localization Services", href: "/$locale/i18n/content-localization-services", description: t("related.contentLocalizationServices", { defaultValue: "Professional services for localizing your content" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconSettingsGear1 className="size-4" />
              <span>{t("badge", { defaultValue: "Translation Solutions" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Translation Solutions: Choose the Right Platform for Your Needs" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "From translating English to Hindi and Mandarin Chinese to handling document translation and image translation workflows, the right translation solution transforms how you reach global audiences. This guide compares every type of platform so you can make an informed decision." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Are Website Translation Solutions?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Translation solutions are software platforms, APIs, and managed services that help businesses convert website content, documents, and multimedia into other languages. The category spans simple plugins that overlay machine translation onto existing pages through to enterprise-grade translation management systems with full workflow automation." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "Modern translation platforms handle far more than text. When you need to translate an image to English, extract text from PDFs, or convert Mexican Spanish regional copy, a capable solution provides the pipeline from source extraction through to quality-checked delivery. Key capabilities include translation memory, glossary management, and context-aware AI models." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "The distinction between real-time and batch translation is critical for choosing the right tool. SaaS products with dynamic content — pricing, notifications, user-generated content — need real-time translation APIs. Marketing pages and documentation work well with batch workflows that include human review before publishing." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("useCases.title", { defaultValue: "Common Translation Use Cases" })}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-mist-700">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("useCases.hindi", { defaultValue: "Translating English to Hindi for the 600M+ Hindi-speaking market" })}
                </li>
                <li className="flex items-start gap-2 text-sm text-mist-700">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("useCases.mandarin", { defaultValue: "English to Mandarin Chinese for Asia-Pacific expansion" })}
                </li>
                <li className="flex items-start gap-2 text-sm text-mist-700">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("useCases.documents", { defaultValue: "Bulk document translation for legal, compliance, and marketing materials" })}
                </li>
                <li className="flex items-start gap-2 text-sm text-mist-700">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("useCases.images", { defaultValue: "Translating images with embedded text for social media and ads" })}
                </li>
                <li className="flex items-start gap-2 text-sm text-mist-700">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("useCases.mexicanSpanish", { defaultValue: "English to Mexican Spanish for LATAM market localization" })}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("types.title", { defaultValue: "Types of Translation Solutions" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("types.subtitle", { defaultValue: "Each category of solution fits different team sizes, technical requirements, and translation volumes." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solutionTypes.map((type) => (
              <div key={type.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <type.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(type.titleKey, { defaultValue: type.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(type.descKey, { defaultValue: "" })}
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
                {t("criteria.title", { defaultValue: "How to Evaluate Translation Solutions" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("criteria.subtitle", { defaultValue: "Assess translation platforms against these criteria to find the solution that fits your language pairs, volume, and integration requirements." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {evaluationCriteria.map((criterionKey) => (
                  <li key={criterionKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(criterionKey, { defaultValue: criterionKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("multimedia.title", { defaultValue: "Handling Multimedia and Document Translation" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("multimedia.subtitle", { defaultValue: "Modern translation solutions must handle more than plain text — images, documents, and videos all require specialized workflows." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <IconGroup1 className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("multimedia.documents.title", { defaultValue: "Document Translation" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("multimedia.documents.description", { defaultValue: "Translate PDFs, Word documents, and spreadsheets while preserving original formatting. Batch document translation is essential for legal, HR, and compliance teams operating across multiple jurisdictions." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <IconSparklesSoft className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("multimedia.images.title", { defaultValue: "Image Text Translation" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("multimedia.images.description", { defaultValue: "OCR-powered solutions detect and translate text embedded in images — essential for translating image content to English for social media assets, infographics, and product packaging photos." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <IconRocket className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("multimedia.ai.title", { defaultValue: "Emerging AI Translation" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("multimedia.ai.description", { defaultValue: "Large language models now translate with contextual understanding that rivals professional translators for most content types — making AI-native translation solutions the fastest-growing category in the market." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("process.title", { defaultValue: "Implementing a Translation Solution" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A structured approach to selecting and rolling out translation tooling across your organization." })}
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
              {t("solution.title", { defaultValue: "Better i18n: The Developer-First Translation Solution" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n is built for engineering teams that want an AI-native translation solution that fits into their existing workflow. Scan your codebase for strings, translate to Hindi, Mandarin, Mexican Spanish, and 100+ other languages with context-aware AI, then push updates without a new deployment." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Real-Time & Batch Translation" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Serve live translations via CDN or batch-translate entire namespaces on demand — your choice of delivery model." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "API-First Architecture" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Full REST and SDK access means you can integrate Better i18n into any CI/CD pipeline, CMS, or custom workflow." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Glossary & Memory" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Translation memory reuses approved segments automatically, while glossaries enforce brand-specific terminology across all language pairs." })}
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
            {t("cta.title", { defaultValue: "Find Your Translation Solution Today" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Better i18n gives you AI translation, developer SDKs, and global CDN delivery in one platform — free to start." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start using Better i18n translation solutions for free"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              aria-label="Read the Better i18n documentation for translation solutions"
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
