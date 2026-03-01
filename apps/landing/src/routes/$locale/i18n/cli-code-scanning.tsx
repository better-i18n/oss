import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconCodeBrackets,
  IconScript,
  IconMagnifyingGlass,
  IconSettingsGear1,
  IconZap,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/cli-code-scanning")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "cliCodeScanning",
      pathname: "/i18n/cli-code-scanning",
      pageType: "educational",
      structuredDataOptions: {
        title: "CLI & Code Scanning Tools for i18n",
        description:
          "Automatically detect hardcoded strings, missing translation keys, and unused keys with AST-based code scanning and developer-friendly CLI commands.",
      },
    });
  },
  component: CliCodeScanningPage,
});

const coreFeatures = [
  { icon: IconMagnifyingGlass, titleKey: "features.hardcodedDetection.title", descKey: "features.hardcodedDetection.description", defaultTitle: "Hardcoded String Detection", defaultDesc: "Automatically find every user-facing string that is not wrapped in a translation function, including strings in JSX children and component props." },
  { icon: IconCodeBrackets, titleKey: "features.astParsing.title", descKey: "features.astParsing.description", defaultTitle: "AST-Based Parsing", defaultDesc: "Parses your source code into an Abstract Syntax Tree for precise, context-aware detection that eliminates the false positives of regex-based scanners." },
  { icon: IconScript, titleKey: "features.jsxText.title", descKey: "features.jsxText.description", defaultTitle: "JSX Text Node Scanning", defaultDesc: "Detects untranslated text content inside JSX elements, including expressions and template literals rendered directly in your components." },
  { icon: IconSettingsGear1, titleKey: "features.jsxAttributes.title", descKey: "features.jsxAttributes.description", defaultTitle: "JSX Attribute Scanning", defaultDesc: "Finds hardcoded strings in JSX attributes like placeholder, aria-label, and title that are often missed during manual i18n audits." },
  { icon: IconZap, titleKey: "features.smartFiltering.title", descKey: "features.smartFiltering.description", defaultTitle: "Smart Filtering", defaultDesc: "Ignores non-translatable values like CSS class names, import paths, and numeric literals so you only see actionable results." },
];

function CliCodeScanningPage() {
  const t = useT("marketing.i18n.cliCodeScanning");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const cliCommands = [
    { key: "cliCommands.list.checkCommand", defaultValue: "Run a full translation audit with a single check command" },
    { key: "cliCommands.list.missingKeys", defaultValue: "Surface missing translation keys that exist in code but not in your remote store" },
    { key: "cliCommands.list.unusedKeys", defaultValue: "Identify unused keys in your remote store that are no longer referenced in code" },
    { key: "cliCommands.list.dynamicPatterns", defaultValue: "Detect dynamic key patterns like template literals and flag them for review" },
    { key: "cliCommands.list.comparisonReports", defaultValue: "Generate comparison reports between local usage and remote translation state" },
  ];

  const outputFormats = [
    { titleKey: "outputs.eslint.title", descKey: "outputs.eslint.description", defaultTitle: "ESLint-Style Output", defaultDesc: "Human-readable reports with file path, line number, and column references for fast navigation in any editor." },
    { titleKey: "outputs.json.title", descKey: "outputs.json.description", defaultTitle: "JSON Output", defaultDesc: "Machine-readable structured data ideal for CI/CD automation, custom dashboards, and integration with other tooling." },
    { titleKey: "outputs.verbose.title", descKey: "outputs.verbose.description", defaultTitle: "Verbose Mode", defaultDesc: "Detailed audit logs with scoping summaries, timing information, and namespace resolution traces for debugging." },
    { titleKey: "outputs.stats.title", descKey: "outputs.stats.description", defaultTitle: "Scan Statistics", defaultDesc: "File counts, key discovery metrics, and performance data so you always know the health of your translation coverage." },
  ];

  const devopsSteps = [
    { number: "1", titleKey: "devops.ciIntegration.title", descKey: "devops.ciIntegration.description" },
    { number: "2", titleKey: "devops.preCommitHook.title", descKey: "devops.preCommitHook.description" },
    { number: "3", titleKey: "devops.directoryScanning.title", descKey: "devops.directoryScanning.description" },
    { number: "4", titleKey: "devops.scopeAware.title", descKey: "devops.scopeAware.description" },
  ];

  const relatedPages = [
    { name: "For Developers", href: "/$locale/i18n/for-developers", description: t("related.forDevelopers", { defaultValue: "Developer-focused i18n tools with type-safe SDKs and Git-first workflows" }) },
    { name: "Localization Tools", href: "/$locale/i18n/localization-tools", description: t("related.localizationTools", { defaultValue: "Developer tools and integrations for localization workflows" }) },
    { name: "Localization Software", href: "/$locale/i18n/localization-software", description: t("related.localizationSoftware", { defaultValue: "TMS and CAT tools for managing translations at scale" }) },
    { name: "Localization Platforms", href: "/$locale/i18n/localization-platforms", description: t("related.localizationPlatforms", { defaultValue: "Manage every translation workflow in one centralized platform" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section id="hero" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconScript className="size-4" />
              <span>{t("badge", { defaultValue: "CLI & Code Scanning" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "CLI & Code Scanning: Find Every Untranslated String Automatically" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Stop hunting through source files for hardcoded strings. Better i18n's CLI uses AST-based parsing to scan your entire codebase, detect untranslated text in JSX components and attributes, report missing and unused keys, and integrate seamlessly into your CI pipeline." })}
            </p>
          </div>
        </div>
      </section>

      <section id="core-features" className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("features.title", { defaultValue: "AST-Powered Code Scanning" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("features.subtitle", { defaultValue: "Unlike regex-based scanners that produce false positives, Better i18n parses your code into an Abstract Syntax Tree for precise, context-aware string detection." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((feature) => (
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

      <section id="cli-commands" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("cliCommands.title", { defaultValue: "CLI Commands for Translation Auditing" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("cliCommands.paragraph1", { defaultValue: "The check command provides an interactive, developer-friendly auditing experience. It compares the translation keys used in your source code against the keys stored in Better i18n's remote, surfacing both missing keys that need translation and unused keys that can be cleaned up." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("cliCommands.paragraph2", { defaultValue: "Dynamic key patterns like template literals are detected automatically. When your code uses t(`key.${variable}`), the CLI recognizes the dynamic segment and includes it in pattern-matched reports, so nothing slips through the cracks." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <ul className="space-y-4">
                {cliCommands.map((cmdKey) => (
                  <li key={cmdKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(cmdKey, { defaultValue: cmdKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="output-formats" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("outputs.title", { defaultValue: "Flexible Output Formats" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("outputs.paragraph1", { defaultValue: "Scan results are available in multiple formats to fit your workflow. ESLint-style output gives human-readable reports with file, line, and column references. JSON output provides machine-readable data for CI/CD automation and custom tooling." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("outputs.paragraph2", { defaultValue: "Verbose mode delivers deep transparency with detailed audit logs, scoping summaries, and timing information. Scan statistics show file counts, discovery metrics, and performance data so you always know the health of your translation coverage." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 space-y-4">
              {outputFormats.map((format) => (
                <div key={format.titleKey} className="flex items-start gap-3">
                  <IconCodeBrackets className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-mist-950 mb-1">{t(format.titleKey, { defaultValue: format.titleKey.split(".").pop() })}</h4>
                    <p className="text-sm text-mist-600">{t(format.descKey, { defaultValue: "" })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="devops-integration" className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("devops.title", { defaultValue: "DevOps & CI/CD Integration" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("devops.subtitle", { defaultValue: "Embed translation checks into your existing development pipeline to catch missing strings before they reach production." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {devopsSteps.map((step) => (
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

      <section id="better-i18n-solution" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
              {t("solution.title", { defaultValue: "Better i18n CLI: Code Scanning Built for Localization" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n's CLI combines AST-based code scanning with remote key management in a single tool. Scan your codebase for hardcoded strings, compare local usage against your remote translation store, detect unused keys that inflate bundle size, and generate reports for your CI pipeline — all without leaving your terminal." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Scope-Aware Scanning" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Tracks useTranslations and getTranslations calls through lexical scopes, binding each t() call to its correct namespace automatically." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Server Component Support" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Full support for Next.js App Router async server components, so getTranslations calls in server code are detected and audited alongside client-side usage." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Pre-Commit Hooks" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Run scans on staged files only with the --staged flag, catching untranslated strings before they are committed without slowing down your workflow." })}
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
            {t("cta.title", { defaultValue: "Ship Translations Without Missing a String" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Better i18n's CLI scans your code, detects every untranslated string, and fits into your CI pipeline so nothing reaches production without a translation." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start using Better i18n CLI and code scanning tools for free"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              aria-label="Read the Better i18n CLI documentation"
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
