import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconArrowRight,
  IconCodeBrackets,
  IconScript,
  IconMagnifyingGlass,
  IconZap,
  IconSettingsGear1,
  IconShieldCheck,
  IconStar,
  IconChart1,
  IconClipboard,
  IconGlobe,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/doctor")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
      pageKey: "i18nDoctor",
      pathname: "/i18n/doctor",
      pageType: "educational",
      structuredDataOptions: {
        title: "i18n Doctor — Full Translation Health Report for Your Codebase",
        description:
          "Run a single CLI command to get a 0–100 health score for your translations. Detect hardcoded strings, missing keys, placeholder mismatches, orphan keys, and CDN sync issues.",
      },
    }),
  component: I18nDoctorPage,
});

const analysisCategories = [
  {
    icon: IconCodeBrackets,
    titleKey: "categories.code.title",
    descKey: "categories.code.description",
    defaultTitle: "Code — Hardcoded String Detection",
    defaultDesc:
      "AST-based scanning finds every user-facing string not wrapped in t(). Catches JSX text, attributes, ternary locale logic, toast messages, and string variables.",
  },
  {
    icon: IconMagnifyingGlass,
    titleKey: "categories.coverage.title",
    descKey: "categories.coverage.description",
    defaultTitle: "Coverage — Missing Translations",
    defaultDesc:
      "Compares keys present in your source locale against each target locale. Any key missing from a target locale is reported with its exact namespace and path.",
  },
  {
    icon: IconShieldCheck,
    titleKey: "categories.quality.title",
    descKey: "categories.quality.description",
    defaultTitle: "Quality — Placeholder Mismatch",
    defaultDesc:
      "Verifies interpolation placeholders are consistent across all locales. Supports named {}, double-brace {{}}, printf %s, template ${}, and positional {0} formats.",
  },
  {
    icon: IconZap,
    titleKey: "categories.performance.title",
    descKey: "categories.performance.description",
    defaultTitle: "Performance — Orphan Key Detection",
    defaultDesc:
      "Detects keys that exist in your translation files but are never referenced in code. Orphan keys increase payload size and create maintenance debt.",
  },
  {
    icon: IconGlobe,
    titleKey: "categories.sync.title",
    descKey: "categories.sync.description",
    defaultTitle: "Sync — CDN Comparison",
    defaultDesc:
      "Compares keys extracted from your code against published keys in the CDN. Surfaces missing-in-remote and unused-remote-key issues before they hit production.",
  },
];

const healthGrades = [
  { grade: "A+", range: "≥ 90", result: "Pass", color: "bg-emerald-100 text-emerald-800" },
  { grade: "A", range: "≥ 80", result: "Pass", color: "bg-emerald-50 text-emerald-700" },
  { grade: "B", range: "≥ 70", result: "Pass", color: "bg-sky-50 text-sky-700" },
  { grade: "C", range: "≥ 50", result: "Fail", color: "bg-amber-50 text-amber-700" },
  { grade: "F", range: "< 50", result: "Fail", color: "bg-red-50 text-red-700" },
];

const ciFeatures = [
  {
    titleKey: "ci.features.githubActions.title",
    descKey: "ci.features.githubActions.description",
    defaultTitle: "GitHub Actions with OIDC",
    defaultDesc:
      "Authenticate automatically without API keys using GitHub Actions OIDC. Just add id-token: write permission and run doctor --ci --report.",
  },
  {
    titleKey: "ci.features.thresholdGating.title",
    descKey: "ci.features.thresholdGating.description",
    defaultTitle: "Threshold Gating",
    defaultDesc:
      "Set a pass threshold (default: 70) and fail the build when the score drops below it. Start tracking with --report, then enforce with --ci.",
  },
  {
    titleKey: "ci.features.jsonOutput.title",
    descKey: "ci.features.jsonOutput.description",
    defaultTitle: "Machine-Readable JSON",
    defaultDesc:
      "Use --format json for structured output you can pipe into jq, custom dashboards, or downstream automation in your deployment pipeline.",
  },
  {
    titleKey: "ci.features.dashboardReporting.title",
    descKey: "ci.features.dashboardReporting.description",
    defaultTitle: "Dashboard Reporting",
    defaultDesc:
      "Upload results to the Better i18n dashboard with --report for historical tracking, trend analysis, and team-wide visibility into i18n health.",
  },
];

const commandComparison = [
  {
    commandKey: "commands.doctor.name",
    descKey: "commands.doctor.description",
    defaultCommand: "doctor",
    defaultDesc: "Full health score with five analysis layers — the single source of truth for your project's i18n status.",
  },
  {
    commandKey: "commands.scan.name",
    descKey: "commands.scan.description",
    defaultCommand: "scan",
    defaultDesc: "Focused hardcoded string detection. Supports --staged for pre-commit hooks.",
  },
  {
    commandKey: "commands.check.name",
    descKey: "commands.check.description",
    defaultCommand: "check",
    defaultDesc: "Interactive checker for missing or unused translation keys with guided prompts.",
  },
  {
    commandKey: "commands.sync.name",
    descKey: "commands.sync.description",
    defaultCommand: "sync",
    defaultDesc: "Full local-to-remote comparison showing both missing and unused keys at once.",
  },
];

const relatedPages = [
  {
    name: "CLI & Code Scanning",
    href: "/$locale/i18n/cli-code-scanning",
    descKey: "related.cliCodeScanning",
    defaultDesc: "AST-based hardcoded string detection and code scanning tools",
  },
  {
    name: "For Developers",
    href: "/$locale/i18n/for-developers",
    descKey: "related.forDevelopers",
    defaultDesc: "Developer-focused i18n tools with type-safe SDKs and Git-first workflows",
  },
  {
    name: "Localization Tools",
    href: "/$locale/i18n/localization-tools",
    descKey: "related.localizationTools",
    defaultDesc: "Developer tools and integrations for localization workflows",
  },
  {
    name: "Translation Management",
    href: "/$locale/i18n/translation-management-system",
    descKey: "related.translationManagement",
    defaultDesc: "Centralized platform for managing translation workflows at scale",
  },
];

function I18nDoctorPage() {
  const t = useT("marketing.i18n.doctor");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      {/* Hero */}
      <section id="hero" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconClipboard className="size-4" />
              <span>{t("badge", { defaultValue: "i18n Doctor" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", {
                defaultValue: "i18n Doctor: Get a Full Translation Health Report in One Command",
              })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", {
                defaultValue:
                  "Run better-i18n doctor to analyze your entire codebase across five dimensions — code quality, translation coverage, placeholder accuracy, orphan keys, and CDN sync — and get a single 0–100 health score with actionable diagnostics.",
              })}
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <a
                href="https://dash.better-i18n.com"
                aria-label="Start using i18n Doctor for free"
                className="rounded-full bg-mist-950 px-6 py-3 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
              >
                {t("hero.cta.primary", { defaultValue: "Get Started Free" })}
              </a>
              <a
                href="https://docs.better-i18n.com/cli/doctor"
                aria-label="Read i18n Doctor documentation"
                className="rounded-full border border-mist-300 px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-50 transition-colors"
              >
                {t("hero.cta.secondary", { defaultValue: "View Documentation" })}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Preview */}
      <section id="preview" className="pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-xl bg-mist-950 p-6 font-mono text-sm text-mist-300 overflow-x-auto">
              <div className="text-mist-500 mb-3">$ better-i18n doctor</div>
              <div className="border border-mist-700 rounded-lg p-4 mb-4">
                <div className="text-center text-mist-400 text-xs mb-2">
                  {t("preview.brandLine", { defaultValue: "better-i18n · i18n Doctor Report" })}
                </div>
                <div className="text-center mb-2">
                  <span className="text-emerald-400">{"████████████████"}</span>
                  <span className="text-mist-600">{"░░░░"}</span>
                  <span className="text-white font-bold ml-2">82 / 100</span>
                  <span className="text-emerald-400 ml-2">A</span>
                </div>
                <div className="text-center text-emerald-400 text-xs">PASSED (threshold: 70)</div>
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-mist-500">Coverage</span>
                  <span className="text-white ml-6">95</span>
                  <span className="text-mist-500 ml-2">(3 issues)</span>
                </div>
                <div>
                  <span className="text-mist-500">Quality</span>
                  <span className="text-white ml-7">88</span>
                  <span className="text-mist-500 ml-2">(2 issues)</span>
                </div>
                <div>
                  <span className="text-mist-500">Code</span>
                  <span className="text-white ml-10">72</span>
                  <span className="text-mist-500 ml-2">(8 issues)</span>
                </div>
                <div>
                  <span className="text-mist-500">Structure</span>
                  <span className="text-white ml-4">100</span>
                  <span className="text-emerald-400 ml-2">(clean)</span>
                </div>
                <div>
                  <span className="text-mist-500">Performance</span>
                  <span className="text-white ml-2">91</span>
                  <span className="text-mist-500 ml-2">(1 issue)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Five Analysis Categories */}
      <section id="analysis-categories" className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("categories.title", { defaultValue: "Five Analysis Layers in a Single Pass" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("categories.subtitle", {
                defaultValue:
                  "Doctor runs code scanning, coverage analysis, quality verification, performance auditing, and CDN sync checks — all at once, with a unified score.",
              })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {analysisCategories.map((category) => (
              <div key={category.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <category.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(category.titleKey, { defaultValue: category.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(category.descKey, { defaultValue: category.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Score */}
      <section id="health-score" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("healthScore.title", { defaultValue: "A Single Score for Your Translation Health" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("healthScore.paragraph1", {
                  defaultValue:
                    "Doctor computes a score from 0 to 100 based on the diagnostics found. Errors are penalized at 3.0 points each, while each rule's warning contribution is capped at 20 points — preventing a single rule with thousands of warnings from zeroing your entire score.",
                })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("healthScore.paragraph2", {
                  defaultValue:
                    "The default pass threshold is 70 (grade B). Use --ci to fail builds below this threshold, or start with --report to establish a baseline before enforcing the score.",
                })}
              </p>
              <div className="mt-6 rounded-lg bg-mist-50 p-4 font-mono text-sm text-mist-700">
                <div className="text-mist-500 text-xs mb-2">
                  {t("healthScore.formulaLabel", { defaultValue: "Score formula" })}
                </div>
                <code>score = 100 - (errors × 3.0) - Σ min(rule_warnings × 0.15, 20)</code>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="rounded-xl border border-mist-200 overflow-hidden">
                <div className="bg-mist-50 px-4 py-3 border-b border-mist-200">
                  <h3 className="text-sm font-medium text-mist-950">
                    {t("healthScore.gradeTableTitle", { defaultValue: "Grade Thresholds" })}
                  </h3>
                </div>
                <div className="divide-y divide-mist-100">
                  {healthGrades.map((item) => (
                    <div key={item.grade} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center justify-center size-8 rounded-lg text-sm font-bold ${item.color}`}>
                          {item.grade}
                        </span>
                        <span className="text-sm text-mist-700">{item.range}</span>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.result === "Pass" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        {item.result === "Pass"
                          ? t("healthScore.pass", { defaultValue: "Pass" })
                          : t("healthScore.fail", { defaultValue: "Fail" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CI/CD Integration */}
      <section id="ci-integration" className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("ci.title", { defaultValue: "CI/CD Integration — Block Bad Translations Before They Ship" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("ci.subtitle", {
                defaultValue:
                  "Add doctor to your CI pipeline to catch translation regressions on every push. Automatic OIDC auth in GitHub Actions means zero secret management.",
              })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ciFeatures.map((feature) => (
              <div key={feature.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(feature.titleKey, { defaultValue: feature.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(feature.descKey, { defaultValue: feature.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="rounded-xl bg-mist-950 p-6 font-mono text-sm text-mist-300 overflow-x-auto">
              <div className="text-mist-500 mb-2"># GitHub Actions example</div>
              <div>
                <span className="text-sky-400">- run:</span> npx @better-i18n/cli doctor --ci --report
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Command Comparison */}
      <section id="commands" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-4 text-center">
              {t("commands.title", { defaultValue: "When to Use Which Command" })}
            </h2>
            <p className="text-mist-700 text-center mb-10 max-w-2xl mx-auto">
              {t("commands.subtitle", {
                defaultValue:
                  "Doctor is the comprehensive option. Use focused commands when you need a specific check or want faster feedback in pre-commit hooks.",
              })}
            </p>
            <div className="space-y-4">
              {commandComparison.map((cmd) => (
                <div key={cmd.commandKey} className="flex items-start gap-4 p-4 rounded-xl border border-mist-200">
                  <code className="shrink-0 rounded-lg bg-mist-100 px-3 py-1.5 text-sm font-medium text-mist-950">
                    {t(cmd.commandKey, { defaultValue: cmd.defaultCommand })}
                  </code>
                  <p className="text-sm text-mist-700 leading-relaxed pt-1">
                    {t(cmd.descKey, { defaultValue: cmd.defaultDesc })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section id="features" className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("features.title", { defaultValue: "Built for Real-World i18n Workflows" })}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-white border border-mist-100">
              <IconStar className="size-5 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("features.healthScore.title", { defaultValue: "Health Score 0–100" })}
              </h3>
              <p className="text-sm text-mist-700">
                {t("features.healthScore.description", {
                  defaultValue: "Single score with per-category breakdown and CI pass/fail threshold. Track your translation health over time.",
                })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-100">
              <IconScript className="size-5 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("features.lexicalScope.title", { defaultValue: "Lexical Scope Tracking" })}
              </h3>
              <p className="text-sm text-mist-700">
                {t("features.lexicalScope.description", {
                  defaultValue:
                    "Smart namespace detection for both useTranslations and getTranslations. Every t() call maps to its correct namespace.",
                })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-100">
              <IconSettingsGear1 className="size-5 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("features.serverComponents.title", { defaultValue: "Server Component Support" })}
              </h3>
              <p className="text-sm text-mist-700">
                {t("features.serverComponents.description", {
                  defaultValue:
                    "Full support for Next.js App Router async server functions. Server-side getTranslations calls are detected and audited.",
                })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-100">
              <IconChart1 className="size-5 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("features.configurable.title", { defaultValue: "Configurable Rules" })}
              </h3>
              <p className="text-sm text-mist-700">
                {t("features.configurable.description", {
                  defaultValue:
                    'Disable or downgrade rules in i18n.config.ts. Set rules to "error", "warning", or "off" to match your project\'s needs.',
                })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-100">
              <IconMagnifyingGlass className="size-5 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("features.smartFiltering.title", { defaultValue: "Smart Filtering" })}
              </h3>
              <p className="text-sm text-mist-700">
                {t("features.smartFiltering.description", {
                  defaultValue:
                    "Automatically ignores CSS class names, URLs, import paths, and developer constants. Only actionable results.",
                })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-100">
              <IconCodeBrackets className="size-5 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("features.verboseAudit.title", { defaultValue: "Verbose Audit Log" })}
              </h3>
              <p className="text-sm text-mist-700">
                {t("features.verboseAudit.description", {
                  defaultValue:
                    "Deep transparency with --verbose. Scoping summaries, timing information, and namespace resolution traces for debugging.",
                })}
              </p>
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
                  <p className="text-xs text-mist-500 mt-1">{t(page.descKey, { defaultValue: page.defaultDesc })}</p>
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
            {t("cta.title", { defaultValue: "Know Your Translation Health Before You Ship" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", {
              defaultValue:
                "Run better-i18n doctor once to get your baseline. Add it to CI to never ship missing translations again.",
            })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start using i18n Doctor for free"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com/cli/doctor"
              aria-label="Read the i18n Doctor documentation"
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
