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
  IconFileText,
  IconCircleQuestionmark,
  IconClipboard,
  IconLightBulb,
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

const fileFormats = [
  { titleKey: "formats.json.title", descKey: "formats.json.description", defaultTitle: "JSON", defaultDesc: "Most popular for web apps (React, Vue, Angular). Human-readable, supports nesting for organized key structures. No built-in pluralization standard, so libraries like ICU MessageFormat fill the gap." },
  { titleKey: "formats.xliff.title", descKey: "formats.xliff.description", defaultTitle: "XLIFF", defaultDesc: "XML-based industry standard for translation exchange between tools. Supported by all professional TMS platforms. Verbose but feature-rich, with built-in support for notes, state tracking, and metadata." },
  { titleKey: "formats.po.title", descKey: "formats.po.description", defaultTitle: "PO/POT (Gettext)", defaultDesc: "Classic open-source format used in Python, PHP, and Ruby ecosystems. Built-in plural support with dedicated plural forms syntax. Widely supported by translators and translation tools." },
  { titleKey: "formats.arb.title", descKey: "formats.arb.description", defaultTitle: "ARB", defaultDesc: "Application Resource Bundle is the Flutter and Dart standard format. JSON-based with ICU message syntax support, enabling plurals and selects natively. Used by Flutter's gen-l10n tooling." },
  { titleKey: "formats.strings.title", descKey: "formats.strings.description", defaultTitle: ".strings / .stringsdict", defaultDesc: "Apple platform native formats for iOS and macOS development. .strings handles simple key-value pairs while .stringsdict uses XML plist structure for pluralization rules." },
  { titleKey: "formats.resx.title", descKey: "formats.resx.description", defaultTitle: ".resx", defaultDesc: ".NET resource file format used for C# and VB.NET applications. XML-based with strong Visual Studio tooling integration. Supports typed resources for strings, images, and other assets." },
];

const tmsCriteria = [
  { icon: IconCodeBrackets, titleKey: "tms.integration.title", descKey: "tms.integration.description", defaultTitle: "Developer Integration", defaultDesc: "Evaluate CLI tools, SDK support, Git-based workflows, and CI/CD hooks. The best TMS platforms integrate directly into your development pipeline so translations stay in sync with code changes automatically." },
  { icon: IconMagnifyingGlass, titleKey: "tms.memory.title", descKey: "tms.memory.description", defaultTitle: "Translation Memory", defaultDesc: "Translation memory stores previously approved translations and suggests them for similar or identical strings. This reduces translation cost, speeds up turnaround, and maintains consistency across your product." },
  { icon: IconGroup1, titleKey: "tms.collaboration.title", descKey: "tms.collaboration.description", defaultTitle: "Collaboration Features", defaultDesc: "Look for reviewer workflows, inline comments, shared glossaries, and approval chains. These features enable translators, reviewers, and developers to work together without bottlenecks or miscommunication." },
  { icon: IconRocket, titleKey: "tms.automation.title", descKey: "tms.automation.description", defaultTitle: "AI and Automation", defaultDesc: "Modern TMS platforms offer machine translation suggestions, automated quality checks, batch operations, and smart routing. AI-assisted workflows reduce manual effort while maintaining translation quality." },
];

const productionChecklist = [
  { key: "checklist.externalized", defaultValue: "All user-facing strings externalized to resource files" },
  { key: "checklist.detection", defaultValue: "Locale detection implemented (browser, URL, user preference)" },
  { key: "checklist.plurals", defaultValue: "Pluralization handled with ICU MessageFormat for all target languages" },
  { key: "checklist.formatting", defaultValue: "Date, time, number, and currency formatting uses Intl API or equivalent" },
  { key: "checklist.rtl", defaultValue: "RTL layout support tested with CSS logical properties" },
  { key: "checklist.fallback", defaultValue: "Fallback locale configured for missing translations" },
  { key: "checklist.naming", defaultValue: "Translation keys follow a consistent naming convention" },
  { key: "checklist.ci", defaultValue: "CI pipeline validates no missing or unused translation keys" },
];

const faqItems = [
  { questionKey: "faq.q1.question", answerKey: "faq.q1.answer", defaultQuestion: "What is the difference between i18n and L10n?", defaultAnswer: "Internationalization (i18n) is the engineering process of designing software so it can support multiple languages and regions. Localization (L10n) is the content process of adapting that software for a specific locale, including translating text, adjusting formats, and ensuring cultural appropriateness. i18n happens once in your codebase; L10n happens for every locale you support." },
  { questionKey: "faq.q2.question", answerKey: "faq.q2.answer", defaultQuestion: "Which i18n library should I use?", defaultAnswer: "The best library depends on your framework. For React, react-intl (FormatJS) and react-i18next are the most widely adopted. Vue developers typically use vue-i18n. Angular has built-in i18n support alongside community options like Transloco. Svelte projects use svelte-i18n. Evaluate each option based on bundle size, ICU support, and how well it integrates with your rendering model." },
  { questionKey: "faq.q3.question", answerKey: "faq.q3.answer", defaultQuestion: "How many languages should I launch with?", defaultAnswer: "Start with two to three high-impact languages based on your existing user data or target market research. This lets you validate your i18n architecture, translation workflow, and QA process at a manageable scale. Expand to additional languages once you have a reliable pipeline in place, using analytics to prioritize which locales to add next." },
  { questionKey: "faq.q4.question", answerKey: "faq.q4.answer", defaultQuestion: "Can I use machine translation for my app?", defaultAnswer: "A hybrid approach works well: use machine translation for initial drafts and high-volume, low-criticality content, then have human reviewers refine quality-critical strings like marketing copy, error messages, and legal text. Modern neural machine translation has improved significantly, but human review remains essential for nuance, brand voice, and cultural accuracy." },
  { questionKey: "faq.q5.question", answerKey: "faq.q5.answer", defaultQuestion: "What is pseudo-localization?", defaultAnswer: "Pseudo-localization is a testing technique that replaces text with accented or extended characters (e.g., turning 'Hello' into '[~Hellllo~]') without changing meaning. It helps developers spot hardcoded strings, text truncation, and layout issues before real translations are available. Most i18n libraries and TMS tools support generating pseudo-localized output automatically." },
  { questionKey: "faq.q6.question", answerKey: "faq.q6.answer", defaultQuestion: "How do I handle dynamic content localization?", defaultAnswer: "Use ICU MessageFormat placeholders for interpolation (e.g., 'Hello, {name}') instead of concatenating strings. For plurals, use ICU plural syntax that adapts to each language's rules. Avoid building sentences from fragments, since word order varies across languages. For rich text, use tagged placeholders that let translators reorder HTML elements without breaking markup." },
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
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18nVsL10n.i18n.paragraph2", { defaultValue: "i18n covers externalizing strings, supporting Unicode, abstracting date and number formats, building locale-aware routing, and structuring your codebase so that adding a new language is a configuration step — not a development project." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18nVsL10n.i18n.paragraph3", { defaultValue: "Internationalization is a one-time engineering investment that pays dividends over the lifetime of your product. Once your codebase is properly internationalized, adding a new language becomes primarily a content task — not an engineering task. Teams that internationalize early spend significantly less time and budget on each subsequent locale compared to those who retrofit i18n into an existing codebase." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("i18nVsL10n.l10n.title", { defaultValue: "Localization (L10n)" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18nVsL10n.l10n.paragraph1", { defaultValue: "Localization is the process of adapting your internationalized product for a specific locale. This includes translating text, adjusting layouts for RTL scripts, localizing images and media, and ensuring content is culturally appropriate for the target audience." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18nVsL10n.l10n.paragraph2", { defaultValue: "L10n is an ongoing effort. As your product evolves, new strings need translation, new markets require cultural adaptation, and formatting rules must stay current. Automation through a translation management system keeps this sustainable." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18nVsL10n.l10n.paragraph3", { defaultValue: "Localization quality directly impacts user trust and business outcomes. Users are more likely to engage with and purchase products presented in their native language, and poor translations can actively damage brand perception. Investing in professional localization — whether through human translators, carefully reviewed machine translation, or a hybrid approach — is essential for any product targeting international markets." })}
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

      {/* i18n File Format Comparison */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-4">
              <IconFileText className="size-4" />
              <span>{t("formats.badge", { defaultValue: "Format Reference" })}</span>
            </div>
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("formats.title", { defaultValue: "i18n File Format Comparison" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("formats.subtitle", { defaultValue: "Choosing the right file format for your translation resources depends on your framework, toolchain, and team workflow. Here are the most widely used formats." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fileFormats.map((format) => (
              <div key={format.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(format.titleKey, { defaultValue: format.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(format.descKey, { defaultValue: format.defaultDesc })}
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

      {/* Choosing a TMS */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-4">
              <IconLightBulb className="size-4" />
              <span>{t("tms.badge", { defaultValue: "TMS Guide" })}</span>
            </div>
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("tms.title", { defaultValue: "Choosing a Translation Management System" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("tms.subtitle", { defaultValue: "A translation management system (TMS) is the central hub where developers, translators, and reviewers collaborate on localized content. It stores your translation keys, manages workflows, and connects to your codebase. When evaluating a TMS, prioritize these four criteria." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {tmsCriteria.map((criterion) => (
              <div key={criterion.titleKey} className="p-6 rounded-xl bg-mist-50 border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <criterion.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(criterion.titleKey, { defaultValue: criterion.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(criterion.descKey, { defaultValue: criterion.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Overview */}
      <section className="py-16 bg-mist-50">
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
      <section className="py-16 bg-mist-100">
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

      {/* i18n Checklist for Production Readiness */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-4">
              <IconClipboard className="size-4" />
              <span>{t("checklist.badge", { defaultValue: "Production Checklist" })}</span>
            </div>
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("checklist.title", { defaultValue: "i18n Checklist for Production Readiness" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("checklist.subtitle", { defaultValue: "Verify these eight items before shipping your internationalized application to production. Each one addresses a common gap that causes issues in real-world deployments." })}
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ul className="space-y-4">
              {productionChecklist.map((item) => (
                <li key={item.key} className="flex items-start gap-3">
                  <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-mist-700">{t(item.key, { defaultValue: item.defaultValue })}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testing */}
      <section className="py-16 bg-mist-50">
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

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-4">
              <IconCircleQuestionmark className="size-4" />
              <span>{t("faq.badge", { defaultValue: "FAQ" })}</span>
            </div>
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("faq.title", { defaultValue: "Frequently Asked Questions About i18n" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("faq.subtitle", { defaultValue: "Answers to the most common questions teams ask when planning and implementing internationalization." })}
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-8">
            {faqItems.map((item) => (
              <div key={item.questionKey} className="border-b border-mist-200 pb-8 last:border-b-0">
                <h3 className="text-base font-medium text-mist-950 mb-3">
                  {t(item.questionKey, { defaultValue: item.defaultQuestion })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(item.answerKey, { defaultValue: item.defaultAnswer })}
                </p>
              </div>
            ))}
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
