import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { CodeBlock } from "@/components/CodeBlock";
import { BackToHub } from "@/components/BackToHub";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { ClosingCta, Divider } from "@/components/ui/page";
import { IconStar, IconClipboard } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/doctor")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
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
    icon: "code-brackets",
    titleKey: "i18n.doctor.categories.code.title",
    descKey: "i18n.doctor.categories.code.description",
  },
  {
    icon: "magnifying-glass",
    titleKey: "i18n.doctor.categories.coverage.title",
    descKey: "i18n.doctor.categories.coverage.description",
  },
  {
    icon: "shield-check",
    titleKey: "i18n.doctor.categories.quality.title",
    descKey: "i18n.doctor.categories.quality.description",
  },
  {
    icon: "zap",
    titleKey: "i18n.doctor.categories.performance.title",
    descKey: "i18n.doctor.categories.performance.description",
  },
  {
    icon: "globe",
    titleKey: "i18n.doctor.categories.sync.title",
    descKey: "i18n.doctor.categories.sync.description",
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
    titleKey: "i18n.doctor.ci.features.githubActions.title",
    descKey: "i18n.doctor.ci.features.githubActions.description",
  },
  {
    titleKey: "i18n.doctor.ci.features.thresholdGating.title",
    descKey: "i18n.doctor.ci.features.thresholdGating.description",
  },
  {
    titleKey: "i18n.doctor.ci.features.jsonOutput.title",
    descKey: "i18n.doctor.ci.features.jsonOutput.description",
  },
  {
    titleKey: "i18n.doctor.ci.features.dashboardReporting.title",
    descKey: "i18n.doctor.ci.features.dashboardReporting.description",
  },
];

const commandComparison = [
  {
    commandKey: "i18n.doctor.commands.doctor.name",
    descKey: "i18n.doctor.commands.doctor.description",
  },
  {
    commandKey: "i18n.doctor.commands.scan.name",
    descKey: "i18n.doctor.commands.scan.description",
  },
  {
    commandKey: "i18n.doctor.commands.check.name",
    descKey: "i18n.doctor.commands.check.description",
  },
  {
    commandKey: "i18n.doctor.commands.sync.name",
    descKey: "i18n.doctor.commands.sync.description",
  },
];

const relatedPages = [
  {
    name: "CLI & Code Scanning",
    href: "/$locale/i18n/cli-code-scanning",
    descKey: "i18n.doctor.related.cliCodeScanning",
  },
  {
    name: "For Developers",
    href: "/$locale/i18n/for-developers",
    descKey: "i18n.doctor.related.forDevelopers",
  },
  {
    name: "Localization Software",
    href: "/$locale/i18n/localization-software",
    descKey: "i18n.doctor.related.localizationSoftware",
  },
  {
    name: "Translation Management",
    href: "/$locale/i18n/translation-management-system",
    descKey: "i18n.doctor.related.translationManagement",
  },
];

function I18nDoctorPage() {
  const t = useT("marketing");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      {/* Hero */}
      <section id="hero">
        <div className="section">
          <div className="max-w-3xl">
            <div className="eyebrow mb-5 flex items-center gap-2">
              <IconClipboard className="size-4" />
              <span>{t("i18n.doctor.badge")}</span>
            </div>
            <h1 className="section-h2">
              {t("i18n.doctor.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.doctor.hero.subtitle")}
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <a
                href="https://dash.better-i18n.com"
                aria-label="Start using i18n Doctor for free"
                className="btn btn-dark btn-lg"
              >
                {t("i18n.doctor.hero.cta.primary")}
              </a>
              <a
                href="https://docs.better-i18n.com/cli/doctor"
                aria-label="Read i18n Doctor documentation"
                className="btn btn-outline btn-lg"
              >
                {t("i18n.doctor.hero.cta.secondary")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Preview */}
      <section id="preview">
        <div className="section">
          <div className="max-w-3xl mx-auto">
            {/* The score panel was hand-drawn in HTML on a dark slab: block
                characters for the bar, six hues for the grades. It is terminal
                output, so it is now terminal text on the page's own surface,
                with every number kept. */}
            <CodeBlock
              lang="bash"
              filename="terminal"
              code={`$ better-i18n doctor

  ${t("i18n.doctor.preview.brandLine")}

  ████████████████░░░░  82 / 100  A
  PASSED (threshold: 70)

  Coverage      95   (3 issues)
  Quality       88   (2 issues)
  Code          72   (8 issues)
  Structure    100   (clean)
  Performance   91   (1 issue)`}
            />
          </div>
        </div>
      </section>

      {/* Five Analysis Categories */}
      <section id="analysis-categories">
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.doctor.categories.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.doctor.categories.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {analysisCategories.map((category) => (
              <div key={category.titleKey} >
                <div className="mb-3 flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon name={category.icon as SpriteIconName} className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(category.titleKey)}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(category.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Score */}
      <section id="health-score">
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="section-h2 mb-6">
                {t("i18n.doctor.healthScore.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.doctor.healthScore.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.doctor.healthScore.paragraph2")}
              </p>
              <div className="mt-6 rounded-lg bg-mist-50 p-4 font-mono text-sm text-mist-700">
                <div className="text-mist-500 text-xs mb-2">
                  {t("i18n.doctor.healthScore.formulaLabel")}
                </div>
                <code>score = 100 - (errors × 3.0) - Σ min(rule_warnings × 0.15, 20)</code>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="rounded-xl border border-mist-200 overflow-hidden">
                <div className="bg-mist-50 px-4 py-3 border-b border-mist-200">
                  <h3 className="text-sm font-medium text-mist-950">
                    {t("i18n.doctor.healthScore.gradeTableTitle")}
                  </h3>
                </div>
                <div className="divide-y divide-mist-100">
                  {healthGrades.map((item) => (
                    <div key={item.grade} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center justify-center size-8 rounded-lg text-sm font-medium ${item.color}`}>
                          {item.grade}
                        </span>
                        <span className="text-sm text-mist-700">{item.range}</span>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${ item.result === "Pass" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700" }`}
                      >
                        {item.result === "Pass"
                          ? t("i18n.doctor.healthScore.pass")
                          : t("i18n.doctor.healthScore.fail")}
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
      <section id="ci-integration">
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.doctor.ci.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.doctor.ci.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ciFeatures.map((feature) => (
              <div key={feature.titleKey} >
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 max-w-2xl mx-auto">
            <CodeBlock
              lang="bash"
              filename=".github/workflows/i18n.yml"
              code={`# GitHub Actions example
- run: npx @better-i18n/cli doctor --ci --report`}
            />
          </div>
        </div>
      </section>

      {/* Command Comparison */}
      <section id="commands">
        <div className="section">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-h2 mb-4 text-center">
              {t("i18n.doctor.commands.title")}
            </h2>
            <p className="text-mist-700 text-center mb-10 max-w-2xl mx-auto">
              {t("i18n.doctor.commands.subtitle")}
            </p>
            <div className="space-y-4">
              {/* Hairline rows, not bordered cards — one item per command. */}
              {commandComparison.map((cmd) => (
                <div
                  key={cmd.commandKey}
                  className="flex items-start gap-4 border-t border-black/[0.05] py-4 first:border-t-0 first:pt-0"
                >
                  <code className="shrink-0 rounded-md border border-black/[0.07] bg-mist-50 px-2.5 py-1 font-mono text-[12px] text-mist-900">
                    {t(cmd.commandKey)}
                  </code>
                  <p className="pt-1 text-[13px] leading-relaxed text-mist-600">
                    {t(cmd.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section id="features">
        <div className="section">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.doctor.features.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            <div >
              <IconStar className="size-5 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("i18n.doctor.features.healthScore.title")}
              </h3>
              <p className="text-sm text-mist-700">
                {t("i18n.doctor.features.healthScore.description")}
              </p>
            </div>
            <div >
              <SpriteIcon name="script" className="size-5 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("i18n.doctor.features.lexicalScope.title")}
              </h3>
              <p className="text-sm text-mist-700">
                {t("i18n.doctor.features.lexicalScope.description")}
              </p>
            </div>
            <div >
              <SpriteIcon name="settings-gear" className="size-5 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("i18n.doctor.features.serverComponents.title")}
              </h3>
              <p className="text-sm text-mist-700">
                {t("i18n.doctor.features.serverComponents.description")}
              </p>
            </div>
            <div >
              <SpriteIcon name="chart" className="size-5 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("i18n.doctor.features.configurable.title")}
              </h3>
              <p className="text-sm text-mist-700">
                {t("i18n.doctor.features.configurable.description")}
              </p>
            </div>
            <div >
              <SpriteIcon name="magnifying-glass" className="size-5 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("i18n.doctor.features.smartFiltering.title")}
              </h3>
              <p className="text-sm text-mist-700">
                {t("i18n.doctor.features.smartFiltering.description")}
              </p>
            </div>
            <div >
              <SpriteIcon name="code-brackets" className="size-5 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("i18n.doctor.features.verboseAudit.title")}
              </h3>
              <p className="text-sm text-mist-700">
                {t("i18n.doctor.features.verboseAudit.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Topics */}
      <section className="border-t border-mist-200">
        <div className="section">
          <h2 className="text-lg font-medium text-mist-950 mb-6">
            {tCommon("whatIs.relatedTopics")}
          </h2>
          {/* Bare columns: a link list's items carry no border, fill or padding
              of their own — the section already frames them. */}
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {relatedPages.map((page) => (
              <Link
                key={page.href}
                to={page.href}
                params={{ locale }}
                className="group flex flex-col gap-1"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-[15px] font-medium tracking-[-0.015em] text-mist-900 transition-colors group-hover:text-mist-600">
                    {page.name}
                  </span>
                  <SpriteIcon
                    name="arrow-right"
                    className="size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600"
                  />
                </span>
                <span className="text-[13px] leading-relaxed text-mist-600">
                  {t(page.descKey)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Divider />

      {/* The ask closes the page. Was a `bg-mist-950` band with `rounded-xl
          mx-6` — a floating dark card on a white document, with its own
          container and its own button scale. <ClosingCta /> is the one closing
          shape in the grammar. */}
      <ClosingCta
        title={t("i18n.doctor.cta.title")}
        subtitle={t("i18n.doctor.cta.subtitle")}
        primary={{ label: t("i18n.doctor.cta.primary"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("i18n.doctor.cta.secondary"), href: "https://docs.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}
