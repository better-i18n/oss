import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

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
  { icon: "magnifying-glass", titleKey: "features.hardcodedDetection.title", descKey: "features.hardcodedDetection.description", defaultTitle: "Hardcoded String Detection", defaultDesc: "Automatically find every user-facing string that is not wrapped in a translation function, including strings in JSX children and component props." },
  { icon: "code-brackets", titleKey: "features.astParsing.title", descKey: "features.astParsing.description", defaultTitle: "AST-Based Parsing", defaultDesc: "Parses your source code into an Abstract Syntax Tree for precise, context-aware detection that eliminates the false positives of regex-based scanners." },
  { icon: "script", titleKey: "features.jsxText.title", descKey: "features.jsxText.description", defaultTitle: "JSX Text Node Scanning", defaultDesc: "Detects untranslated text content inside JSX elements, including expressions and template literals rendered directly in your components." },
  { icon: "settings-gear", titleKey: "features.jsxAttributes.title", descKey: "features.jsxAttributes.description", defaultTitle: "JSX Attribute Scanning", defaultDesc: "Finds hardcoded strings in JSX attributes like placeholder, aria-label, and title that are often missed during manual i18n audits." },
  { icon: "zap", titleKey: "features.smartFiltering.title", descKey: "features.smartFiltering.description", defaultTitle: "Smart Filtering", defaultDesc: "Ignores non-translatable values like CSS class names, import paths, and numeric literals so you only see actionable results." },
];

function CliCodeScanningPage() {
  const t = useT("marketing");
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
    { number: "1", titleKey: "devops.ciIntegration.title", descKey: "devops.ciIntegration.description", defaultTitle: "CI Pipeline Integration", defaultDesc: "Add a scan step to your CI workflow that fails the build when untranslated strings or missing keys are detected." },
    { number: "2", titleKey: "devops.preCommitHook.title", descKey: "devops.preCommitHook.description", defaultTitle: "Pre-Commit Hooks", defaultDesc: "Run scans on staged files before each commit to catch untranslated strings at the earliest possible point in development." },
    { number: "3", titleKey: "devops.directoryScanning.title", descKey: "devops.directoryScanning.description", defaultTitle: "Directory-Scoped Scanning", defaultDesc: "Target specific directories or file patterns to scan only the parts of your codebase that contain user-facing content." },
    { number: "4", titleKey: "devops.scopeAware.title", descKey: "devops.scopeAware.description", defaultTitle: "Scope-Aware Analysis", defaultDesc: "Automatically resolve translation namespaces through lexical scope tracking so each t() call maps to the correct key set." },
  ];

  const relatedPages = [
    { name: "For Developers", href: "/$locale/i18n/for-developers", description: t("i18n.cliCodeScanning.related.forDevelopers") },
    { name: "Localization Software", href: "/$locale/i18n/localization-software", description: t("i18n.cliCodeScanning.related.localizationSoftware") },
    { name: "Localization Software", href: "/$locale/i18n/localization-software", description: t("i18n.cliCodeScanning.related.localizationSoftware") },
    { name: "Translation Management System", href: "/$locale/i18n/translation-management-system", description: t("i18n.cliCodeScanning.related.tms") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <section id="hero">
        <div className="section">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <SpriteIcon name="script" className="size-4" />
              <span>{t("i18n.cliCodeScanning.badge")}</span>
            </div>
            <h1 className="section-h2">
              {t("i18n.cliCodeScanning.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.cliCodeScanning.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section id="core-features" className="bg-mist-50">
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.cliCodeScanning.features.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.cliCodeScanning.features.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((feature) => (
              <div key={feature.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <SpriteIcon name={feature.icon as SpriteIconName} className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(feature.titleKey, { defaultValue: feature.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(feature.descKey, { defaultValue: feature.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cli-commands" className="bg-white">
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="section-h2 mb-6">
                {t("i18n.cliCodeScanning.cliCommands.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.cliCodeScanning.cliCommands.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.cliCodeScanning.cliCommands.paragraph2")}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <ul className="space-y-4">
                {cliCommands.map((cmd) => (
                  <li key={cmd.key} className="flex items-start gap-3">
                    <SpriteIcon name="checkmark" className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(cmd.key, { defaultValue: cmd.defaultValue })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="output-formats" className="bg-white">
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="section-h2 mb-6">
                {t("i18n.cliCodeScanning.outputs.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.cliCodeScanning.outputs.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.cliCodeScanning.outputs.paragraph2")}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 space-y-4">
              {outputFormats.map((format) => (
                <div key={format.titleKey} className="flex items-start gap-3">
                  <SpriteIcon name="code-brackets" className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-mist-950 mb-1">{t(format.titleKey, { defaultValue: format.defaultTitle })}</h3>
                    <p className="text-sm text-mist-600">{t(format.descKey, { defaultValue: format.defaultDesc })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="devops-integration" className="bg-mist-100">
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.cliCodeScanning.devops.title")}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("i18n.cliCodeScanning.devops.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {devopsSteps.map((step) => (
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

      <section id="better-i18n-solution" className="bg-white">
        <div className="section">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-h2 mb-6">
              {t("i18n.cliCodeScanning.solution.title")}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("i18n.cliCodeScanning.solution.content")}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.cliCodeScanning.solution.feature1.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.cliCodeScanning.solution.feature1.description")}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.cliCodeScanning.solution.feature2.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.cliCodeScanning.solution.feature2.description")}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.cliCodeScanning.solution.feature3.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.cliCodeScanning.solution.feature3.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-mist-200">
        <div className="section">
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
                <SpriteIcon name="arrow-right" className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist-950 rounded-xl mx-6 lg:mx-10 mb-16">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
            {t("i18n.cliCodeScanning.cta.title")}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("i18n.cliCodeScanning.cta.subtitle")}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start using Better I18N CLI and code scanning tools for free"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("i18n.cliCodeScanning.cta.primary")}
            </a>
            <a
              href="https://docs.better-i18n.com"
              aria-label="Read the Better I18N CLI documentation"
              className="rounded-full border border-mist-600 px-6 py-3 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
            >
              {t("i18n.cliCodeScanning.cta.secondary")}
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
