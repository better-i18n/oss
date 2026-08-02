import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { ClosingCta, Divider } from "@/components/ui/page";

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
  { icon: "magnifying-glass", titleKey: "i18n.cliCodeScanning.features.hardcodedDetection.title", descKey: "i18n.cliCodeScanning.features.hardcodedDetection.description" },
  { icon: "code-brackets", titleKey: "i18n.cliCodeScanning.features.astParsing.title", descKey: "i18n.cliCodeScanning.features.astParsing.description" },
  { icon: "script", titleKey: "i18n.cliCodeScanning.features.jsxText.title", descKey: "i18n.cliCodeScanning.features.jsxText.description" },
  { icon: "settings-gear", titleKey: "i18n.cliCodeScanning.features.jsxAttributes.title", descKey: "i18n.cliCodeScanning.features.jsxAttributes.description" },
  { icon: "zap", titleKey: "i18n.cliCodeScanning.features.smartFiltering.title", descKey: "i18n.cliCodeScanning.features.smartFiltering.description" },
];

function CliCodeScanningPage() {
  const t = useT("marketing");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const cliCommands = [
    { key: "i18n.cliCodeScanning.cliCommands.list.checkCommand" },
    { key: "i18n.cliCodeScanning.cliCommands.list.missingKeys" },
    { key: "i18n.cliCodeScanning.cliCommands.list.unusedKeys" },
    { key: "i18n.cliCodeScanning.cliCommands.list.dynamicPatterns" },
    { key: "i18n.cliCodeScanning.cliCommands.list.comparisonReports" },
  ];

  const outputFormats = [
    { titleKey: "i18n.cliCodeScanning.outputs.eslint.title", descKey: "i18n.cliCodeScanning.outputs.eslint.description" },
    { titleKey: "i18n.cliCodeScanning.outputs.json.title", descKey: "i18n.cliCodeScanning.outputs.json.description" },
    { titleKey: "i18n.cliCodeScanning.outputs.verbose.title", descKey: "i18n.cliCodeScanning.outputs.verbose.description" },
    { titleKey: "i18n.cliCodeScanning.outputs.stats.title", descKey: "i18n.cliCodeScanning.outputs.stats.description" },
  ];

  const devopsSteps = [
    { number: "1", titleKey: "i18n.cliCodeScanning.devops.ciIntegration.title", descKey: "i18n.cliCodeScanning.devops.ciIntegration.description" },
    { number: "2", titleKey: "i18n.cliCodeScanning.devops.preCommitHook.title", descKey: "i18n.cliCodeScanning.devops.preCommitHook.description" },
    { number: "3", titleKey: "i18n.cliCodeScanning.devops.directoryScanning.title", descKey: "i18n.cliCodeScanning.devops.directoryScanning.description" },
    { number: "4", titleKey: "i18n.cliCodeScanning.devops.scopeAware.title", descKey: "i18n.cliCodeScanning.devops.scopeAware.description" },
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
            <div className="eyebrow mb-5 flex items-center gap-2">
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
              <div key={feature.titleKey}>
                <div className="mb-3 flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon name={feature.icon as SpriteIconName} className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(feature.descKey)}
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
                    <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                    <span className="text-mist-700">{t(cmd.key)}</span>
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
                    <h3 className="text-sm font-medium text-mist-950 mb-1">{t(format.titleKey)}</h3>
                    <p className="text-sm text-mist-600">{t(format.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="devops-integration">
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
                <div className="mb-3 block text-[11px] font-medium tabular-nums text-mist-400">
                  {step.number}
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(step.titleKey)}
                </h3>
                <p className="text-sm text-mist-600">
                  {t(step.descKey)}
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
              <div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.cliCodeScanning.solution.feature1.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.cliCodeScanning.solution.feature1.description")}
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.cliCodeScanning.solution.feature2.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.cliCodeScanning.solution.feature2.description")}
                </p>
              </div>
              <div>
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
          <h2 className="text-lg font-medium text-mist-950 mb-6">{tCommon("whatIs.relatedTopics")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedPages.map((page) => (
              <Link
                key={page.href}
                to={page.href}
                params={{ locale }}
                className="group flex items-start justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-medium text-mist-950">{page.name}</h3>
                  <p className="text-xs text-mist-500 mt-1">{page.description}</p>
                </div>
                <SpriteIcon name="arrow-right" className="size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* The ask closes the page. Was a `bg-mist-950` band with `rounded-xl
          mx-6` — a floating dark card on a white document, carrying its own
          container and its own button scale. <ClosingCta /> is the one closing
          shape in the grammar. */}
      <ClosingCta
        title={t("i18n.cliCodeScanning.cta.title")}
        subtitle={t("i18n.cliCodeScanning.cta.subtitle")}
        primary={{ label: t("i18n.cliCodeScanning.cta.primary"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("i18n.cliCodeScanning.cta.secondary"), href: "https://docs.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}
