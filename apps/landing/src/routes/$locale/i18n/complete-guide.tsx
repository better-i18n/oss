import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconGlobe,
  IconCheckmark1,
  IconArrowRight,
  IconCodeBrackets,
  IconSettingsGear1,
  IconGroup1,
  IconMagnifyingGlass,
  IconRocket,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/complete-guide")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nCompleteGuide",
      pathname: "/i18n/complete-guide",
      pageType: "educational",
      structuredDataOptions: {
        title: "Complete Guide to Internationalization (i18n) and Localization (L10n)",
        description:
          "The definitive guide to i18n and L10n: key concepts, processes, framework integrations, common mistakes, and testing strategies for global software.",
      },
    });
  },
  component: CompleteGuideI18nPage,
});

const keyConcepts = [
  { icon: IconGlobe, titleKey: "concepts.locale.title", descKey: "concepts.locale.description", defaultTitle: "Locale Identifiers (BCP 47)", defaultDesc: "BCP 47 tags like en-US or zh-Hans-CN encode language, script, and region. They are the foundation of every i18n system and determine which translations, formats, and rules apply." },
  { icon: IconCodeBrackets, titleKey: "concepts.unicode.title", descKey: "concepts.unicode.description", defaultTitle: "Unicode & UTF-8", defaultDesc: "Unicode assigns a unique code point to every character in every script. UTF-8 is the dominant encoding on the web and ensures text renders correctly regardless of language." },
  { icon: IconSettingsGear1, titleKey: "concepts.keys.title", descKey: "concepts.keys.description", defaultTitle: "Translation Keys", defaultDesc: "Translation keys are stable identifiers that map to locale-specific strings. They decouple your source code from translatable content, enabling parallel development and translation." },
  { icon: IconGroup1, titleKey: "concepts.plurals.title", descKey: "concepts.plurals.description", defaultTitle: "Pluralization (ICU)", defaultDesc: "Languages have different plural rules — English has two forms, Arabic has six. ICU MessageFormat handles plurals, gender, and select expressions in a single syntax." },
  { icon: IconArrowRight, titleKey: "concepts.rtl.title", descKey: "concepts.rtl.description", defaultTitle: "RTL Support", defaultDesc: "Arabic, Hebrew, and other scripts read right-to-left. RTL support requires mirroring layouts, flipping icons, and using CSS logical properties instead of left/right." },
  { icon: IconMagnifyingGlass, titleKey: "concepts.formatting.title", descKey: "concepts.formatting.description", defaultTitle: "Date / Number / Currency", defaultDesc: "Dates, numbers, and currencies vary by locale. The Intl API and libraries like date-fns provide locale-aware formatting so 1,000.50 renders as 1.000,50 in German." },
];

const processSteps = [
  { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description", defaultTitle: "Audit Your Codebase", defaultDesc: "Identify every hardcoded string, date format, and locale-dependent pattern. Map which components and pages contain user-facing text that needs extraction." },
  { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description", defaultTitle: "Externalize Strings", defaultDesc: "Move all user-facing text into structured resource files (JSON, XLIFF, or PO). Replace inline strings with translation function calls that reference keys." },
  { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description", defaultTitle: "Choose Your Tools", defaultDesc: "Select an i18n library for your framework, a translation management system (TMS) for collaboration, and decide between human, AI, or hybrid translation workflows." },
  { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description", defaultTitle: "Integrate & Ship", defaultDesc: "Wire your i18n library into routing and rendering, connect your TMS to CI/CD for automatic syncing, and deploy locale bundles via CDN for fast delivery." },
];

const commonMistakes = [
  { icon: IconCodeBrackets, titleKey: "mistakes.concatenation.title", descKey: "mistakes.concatenation.description", defaultTitle: "String Concatenation", defaultDesc: "Building sentences by concatenating fragments breaks in languages with different word order. Use ICU MessageFormat with placeholders instead." },
  { icon: IconSettingsGear1, titleKey: "mistakes.hardcoded.title", descKey: "mistakes.hardcoded.description", defaultTitle: "Hardcoded Strings", defaultDesc: "Embedding user-facing text directly in source code makes translation impossible without code changes. Externalize every string from day one." },
  { icon: IconGroup1, titleKey: "mistakes.plurals.title", descKey: "mistakes.plurals.description", defaultTitle: "Ignoring Plurals", defaultDesc: "Simple if/else for singular/plural only works in English. Many languages have multiple plural forms that require proper ICU plural rules." },
  { icon: IconRocket, titleKey: "mistakes.afterthought.title", descKey: "mistakes.afterthought.description", defaultTitle: "Translation as Afterthought", defaultDesc: "Bolting on i18n after launch means expensive refactoring. Designing for internationalization from the start saves time and prevents architectural debt." },
];

const frameworkGuides = [
  { name: "React", href: "/$locale/i18n/react", descKey: "frameworks.react", defaultDesc: "react-intl, react-i18next, and FormatJS patterns" },
  { name: "Next.js", href: "/$locale/i18n/nextjs", descKey: "frameworks.nextjs", defaultDesc: "App Router, middleware, and server component i18n" },
  { name: "Vue", href: "/$locale/i18n/vue", descKey: "frameworks.vue", defaultDesc: "vue-i18n composition API and SFC integration" },
  { name: "Angular", href: "/$locale/i18n/angular", descKey: "frameworks.angular", defaultDesc: "Built-in i18n, ngx-translate, and Transloco" },
  { name: "Svelte", href: "/$locale/i18n/svelte", descKey: "frameworks.svelte", defaultDesc: "svelte-i18n, SvelteKit routing, and stores" },
  { name: "Flutter", href: "/$locale/i18n/flutter", descKey: "frameworks.flutter", defaultDesc: "intl package, ARB files, and gen-l10n tooling" },
  { name: "React Native", href: "/$locale/i18n/react-native-localization", descKey: "frameworks.reactNative", defaultDesc: "i18next, Expo localization, and native modules" },
  { name: "Nuxt", href: "/$locale/i18n/nuxt", descKey: "frameworks.nuxt", defaultDesc: "@nuxtjs/i18n module with auto-routing" },
];

function CompleteGuideI18nPage() {
  const t = useT("marketing.i18n.completeGuide");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const relatedPages = [
    { name: "What is Internationalization?", href: "/$locale/what-is-internationalization", description: t("related.whatIsI18n", { defaultValue: "Core concepts behind i18n" }) },
    { name: "What is Localization?", href: "/$locale/what-is-localization", description: t("related.whatIsL10n", { defaultValue: "Fundamentals of L10n" }) },
    { name: "Localization vs Internationalization", href: "/$locale/i18n/localization-vs-internationalization", description: t("related.l10nVsI18n", { defaultValue: "Key differences explained" }) },
    { name: "Software Localization", href: "/$locale/i18n/software-localization", description: t("related.softwareL10n", { defaultValue: "Adapt your app for global markets" }) },
    { name: "Best i18n Library", href: "/$locale/i18n/best-library", description: t("related.bestLibrary", { defaultValue: "Compare top i18n libraries" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconGlobe className="size-4" />
              <span>{t("badge", { defaultValue: "i18n & L10n Guide" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "The Complete Guide to Internationalization and Localization" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Everything you need to take your software global — from core i18n concepts and framework integrations to localization workflows, testing strategies, and common pitfalls to avoid." })}
            </p>
          </div>
        </div>
      </section>

      {/* What Is i18n vs L10n */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("i18nVsL10n.i18n.title", { defaultValue: "Internationalization (i18n)" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18nVsL10n.i18n.paragraph1", { defaultValue: "Internationalization is the process of designing and engineering your software so it can be adapted to different languages and regions without requiring code changes. The abbreviation i18n comes from the 18 letters between the 'i' and the 'n' in internationalization." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18nVsL10n.i18n.paragraph2", { defaultValue: "i18n covers externalizing strings, supporting Unicode, abstracting date and number formats, building locale-aware routing, and structuring your codebase so that adding a new language is a configuration step — not a development project." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("i18nVsL10n.l10n.title", { defaultValue: "Localization (L10n)" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18nVsL10n.l10n.paragraph1", { defaultValue: "Localization is the process of adapting your internationalized product for a specific locale. This includes translating text, adjusting layouts for RTL scripts, localizing images and media, and ensuring content is culturally appropriate for the target audience." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18nVsL10n.l10n.paragraph2", { defaultValue: "L10n is an ongoing effort. As your product evolves, new strings need translation, new markets require cultural adaptation, and formatting rules must stay current. Automation through a translation management system keeps this sustainable." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Concepts */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("concepts.title", { defaultValue: "Key i18n Concepts You Need to Know" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("concepts.subtitle", { defaultValue: "Master these foundational concepts before implementing internationalization in any framework." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {keyConcepts.map((concept) => (
              <div key={concept.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <concept.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(concept.titleKey, { defaultValue: concept.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(concept.descKey, { defaultValue: concept.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The i18n Process */}
      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("process.title", { defaultValue: "The i18n Implementation Process" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A step-by-step approach to internationalizing your application from scratch." })}
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

      {/* Framework Overview */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("frameworks.title", { defaultValue: "Framework-Specific i18n Guides" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("frameworks.subtitle", { defaultValue: "Every framework has its own i18n ecosystem. Dive into the guide for your stack." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {frameworkGuides.map((guide) => (
              <Link
                key={guide.href}
                to={guide.href}
                params={{ locale }}
                className="group flex items-center justify-between p-5 rounded-xl border border-mist-200 bg-mist-50 hover:border-mist-300 hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="text-sm font-medium text-mist-950">{guide.name}</h3>
                  <p className="text-xs text-mist-500 mt-1">
                    {t(guide.descKey, { defaultValue: guide.defaultDesc })}
                  </p>
                </div>
                <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("mistakes.title", { defaultValue: "Common i18n Mistakes to Avoid" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("mistakes.subtitle", { defaultValue: "These pitfalls are easy to fall into and expensive to fix later. Avoid them from the start." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {commonMistakes.map((mistake) => (
              <div key={mistake.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <mistake.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(mistake.titleKey, { defaultValue: mistake.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(mistake.descKey, { defaultValue: mistake.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testing */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("testing.title", { defaultValue: "Localization Testing Strategies" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("testing.subtitle", { defaultValue: "Shipping untested translations leads to truncated text, broken layouts, and embarrassing cultural missteps. Build testing into your workflow from the beginning." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-mist-700">{t("testing.pseudo", { defaultValue: "Use pseudo-localization to catch hardcoded strings and layout issues before real translations arrive" })}</span>
                </li>
                <li className="flex items-start gap-3">
                  <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-mist-700">{t("testing.visual", { defaultValue: "Run visual regression tests across locales to detect text overflow, truncation, and RTL mirroring bugs" })}</span>
                </li>
                <li className="flex items-start gap-3">
                  <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-mist-700">{t("testing.automated", { defaultValue: "Automate missing-key detection in CI so untranslated strings never reach production" })}</span>
                </li>
                <li className="flex items-start gap-3">
                  <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-mist-700">{t("testing.linguistic", { defaultValue: "Conduct linguistic QA with native speakers to verify tone, context, and cultural accuracy" })}</span>
                </li>
                <li className="flex items-start gap-3">
                  <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-mist-700">{t("testing.expansion", { defaultValue: "Test with text expansion (German, Finnish) and contraction (Chinese, Japanese) to ensure UI flexibility" })}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Topics */}
      <section className="py-12 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-lg font-medium text-mist-950 mb-6">
            {tCommon("whatIs.relatedTopics", { defaultValue: "Related Topics" })}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-mist-950 rounded-3xl mx-6 lg:mx-10 mb-16">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
            {t("cta.title", { defaultValue: "Start Localizing Your App Today" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "AI-powered translations, developer-friendly SDKs, and automated workflows. Go global in minutes, not months." })}
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
