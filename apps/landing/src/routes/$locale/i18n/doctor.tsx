import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { CodeBlock } from "@/components/CodeBlock";
import { BackToHub } from "@/components/BackToHub";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  ClosingCta,
  Divider,
  FeatureCell,
  FeatureGrid,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui/page";
import { IconStar } from "@central-icons-react/round-outlined-radius-2-stroke-2";

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

/**
 * The grade bands, as the CLI computes them.
 *
 * Each row used to carry its own hue — emerald-100, emerald-50, sky, amber, red
 * — so five of the six colours on the page were spent restating an order the
 * numbers already state (90, 80, 70, 50, <50 reads as descending without help).
 * `pass` survives as data because it is not decoration: it is the threshold the
 * CI job actually gates on, and it does not track the grade letter linearly.
 */
const healthGrades = [
  { grade: "A+", range: "≥ 90", pass: true },
  { grade: "A", range: "≥ 80", pass: true },
  { grade: "B", range: "≥ 70", pass: true },
  { grade: "C", range: "≥ 50", pass: false },
  { grade: "F", range: "< 50", pass: false },
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

/**
 * `nameKey`, not `name`.
 *
 * These four were hardcoded English strings ("CLI & Code Scanning", "For
 * Developers"), so the related-topics block stayed English on all twenty-two
 * locales while the descriptions beside it translated — the one part of the
 * page a reader uses to keep reading.
 *
 * The names come from the shared `relatedPages` namespace, not from new keys
 * under `i18n.doctor.*`. That namespace is a registry of destination names that
 * already travels with every `/i18n/*` page (`resolveDynamicConfig`) and is
 * already translated in all twenty-two locales — three of these four were
 * literally already in it. Minting `i18n.doctor.relatedNames.forDevelopers`
 * beside the existing `relatedPages.forDevelopers` would have been a fourteenth
 * copy of the string "For Developers" in this project.
 *
 * The descriptions stay page-local: they are written for a reader who is on the
 * doctor page specifically, which the generic registry blurbs are not.
 */
const relatedPages = [
  {
    nameKey: "cliCodeScanning",
    href: "/$locale/i18n/cli-code-scanning",
    descKey: "i18n.doctor.related.cliCodeScanning",
  },
  {
    nameKey: "forDevelopers",
    href: "/$locale/i18n/for-developers",
    descKey: "i18n.doctor.related.forDevelopers",
  },
  {
    nameKey: "localizationSoftware",
    href: "/$locale/i18n/localization-software",
    descKey: "i18n.doctor.related.localizationSoftware",
  },
  {
    nameKey: "translationManagement",
    href: "/$locale/i18n/translation-management-system",
    descKey: "i18n.doctor.related.translationManagement",
  },
];

const capabilities = [
  { icon: <IconStar className="size-3" />, key: "healthScore" },
  { icon: <SpriteIcon name="script" className="size-3" />, key: "lexicalScope" },
  { icon: <SpriteIcon name="settings-gear" className="size-3" />, key: "serverComponents" },
  { icon: <SpriteIcon name="chart" className="size-3" />, key: "configurable" },
  { icon: <SpriteIcon name="magnifying-glass" className="size-3" />, key: "smartFiltering" },
  { icon: <SpriteIcon name="code-brackets" className="size-3" />, key: "verboseAudit" },
];

function I18nDoctorPage() {
  const t = useT("marketing");
  /* The destination names live in their own top-level namespace — see the
     `relatedPages` docstring above for why they are not `marketing` keys. */
  const tRelated = useT("relatedPages");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />

      {/* Was a hand-rolled hero: its own <section>, its own eyebrow div, its
          own button pair, and `section-h2` doing the work of an h1 — so the
          page opened one size smaller than every other page on the site.
          <PageHero> is the one opening shape, and it takes the terminal as its
          visual rather than leaving it stranded in a section of its own. */}
      <PageHero
        pillar="mcp"
        pillarLabel={t("i18n.doctor.badge")}
        title={t("i18n.doctor.hero.title")}
        subtitle={t("i18n.doctor.hero.subtitle")}
        primary={{
          label: t("i18n.doctor.hero.cta.primary"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("i18n.doctor.hero.cta.secondary"),
          href: "https://docs.better-i18n.com/cli/doctor",
        }}
        visual={
          /* The score panel was hand-drawn in HTML on a dark slab: block
             characters for the bar, six hues for the grades. It is terminal
             output, so it is terminal text, with every number kept. */
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
        }
      />
      <Divider />

      {/* Five analysis categories. Was `grid gap-6` — gutters between items,
          which reads as five cards with the card removed. The hairline grid
          shares its rules, so the items line up with the icon column of every
          other grid on the site. */}
      <Section id="analysis-categories" labelledBy="doctor-categories">
        <SectionHeader
          id="doctor-categories"
          eyebrow={t("i18n.doctor.eyebrow.categories")}
          title={t("i18n.doctor.categories.title")}
          subtitle={t("i18n.doctor.categories.subtitle")}
        />
        <div className="mt-10">
          <FeatureGrid cols="sm:grid-cols-2 lg:grid-cols-3" inset={16} padY={12}>
            {analysisCategories.map((category) => (
              <FeatureCell
                key={category.titleKey}
                icon={<SpriteIcon name={category.icon as SpriteIconName} className="size-3" />}
                title={t(category.titleKey)}
                description={t(category.descKey)}
              />
            ))}
          </FeatureGrid>
        </div>
      </Section>
      <Divider />

      {/* How the score is computed, beside the bands it produces. */}
      <Section id="health-score" labelledBy="doctor-score">
        <SectionHeader
          id="doctor-score"
          eyebrow={t("i18n.doctor.eyebrow.score")}
          title={t("i18n.doctor.healthScore.title")}
        />
        <div className="mt-10 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div>
            <p className="text-[15px] leading-relaxed text-mist-700">
              {t("i18n.doctor.healthScore.paragraph1")}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-mist-700">
              {t("i18n.doctor.healthScore.paragraph2")}
            </p>
            {/* The formula is a quotation from the source, so it keeps the
                mono face — but on a hairline rule rather than a filled,
                rounded box, which was the page's only floating panel. */}
            <div className="mt-6 border-t border-black/[0.06] pt-4">
              <p className="eyebrow">{t("i18n.doctor.healthScore.formulaLabel")}</p>
              <code className="mt-2 block font-mono text-[12.5px] leading-relaxed text-mist-800">
                score = 100 - (errors × 3.0) - Σ min(rule_warnings × 0.15, 20)
              </code>
            </div>
          </div>

          {/* Was `rounded-xl border border-mist-200` with a tinted header bar
              — a bordered card, on a page whose other tables are hairline
              rows. Five rows do not need a container to be read as five
              rows. */}
          <div className="mt-10 lg:mt-0">
            <p className="eyebrow">{t("i18n.doctor.healthScore.gradeTableTitle")}</p>
            <dl className="mt-3">
              {healthGrades.map((item) => (
                <div
                  key={item.grade}
                  className="flex items-center justify-between border-t border-black/[0.06] py-3"
                >
                  <div className="flex items-baseline gap-3">
                    <dt className="w-8 font-mono text-[13px] font-medium text-mist-900">
                      {item.grade}
                    </dt>
                    <dd className="text-[13px] tabular-nums text-mist-600">{item.range}</dd>
                  </div>
                  <span
                    className={`text-[12px] font-medium ${
                      item.pass ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {item.pass
                      ? t("i18n.doctor.healthScore.pass")
                      : t("i18n.doctor.healthScore.fail")}
                  </span>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>
      <Divider />

      <Section id="ci-integration" labelledBy="doctor-ci">
        <SectionHeader
          id="doctor-ci"
          eyebrow={t("i18n.doctor.eyebrow.ci")}
          title={t("i18n.doctor.ci.title")}
          subtitle={t("i18n.doctor.ci.subtitle")}
        />
        <div className="mt-10">
          <FeatureGrid cols="sm:grid-cols-2 lg:grid-cols-4" inset={16} padY={12}>
            {ciFeatures.map((feature) => (
              <FeatureCell
                key={feature.titleKey}
                title={t(feature.titleKey)}
                description={t(feature.descKey)}
              />
            ))}
          </FeatureGrid>
        </div>
        <div className="mt-8">
          <CodeBlock
            lang="bash"
            filename=".github/workflows/i18n.yml"
            code={`# GitHub Actions example
- run: npx @better-i18n/cli doctor --ci --report`}
          />
        </div>
      </Section>
      <Divider />

      <Section id="commands" labelledBy="doctor-commands">
        <SectionHeader
          id="doctor-commands"
          eyebrow={t("i18n.doctor.eyebrow.commands")}
          title={t("i18n.doctor.commands.title")}
          subtitle={t("i18n.doctor.commands.subtitle")}
        />
        {/* Hairline rows, not bordered cards — one item per command. */}
        <div className="mt-10">
          {commandComparison.map((cmd) => (
            <div
              key={cmd.commandKey}
              className="flex items-start gap-4 border-t border-black/[0.06] py-4"
            >
              <code className="shrink-0 rounded-md border border-black/[0.07] bg-mist-50 px-2.5 py-1 font-mono text-[12px] text-mist-900">
                {t(cmd.commandKey)}
              </code>
              <p className="pt-1 text-[13px] leading-relaxed text-mist-600">{t(cmd.descKey)}</p>
            </div>
          ))}
        </div>
      </Section>
      <Divider />

      {/* Was six `<div>`s written out one by one, each repeating the same icon
          and heading markup. Same six capabilities, one shape. */}
      <Section id="features" labelledBy="doctor-features">
        <SectionHeader
          id="doctor-features"
          eyebrow={t("i18n.doctor.eyebrow.capabilities")}
          title={t("i18n.doctor.features.title")}
        />
        <div className="mt-10">
          <FeatureGrid cols="sm:grid-cols-2 lg:grid-cols-3" inset={16} padY={12}>
            {capabilities.map((cap) => (
              <FeatureCell
                key={cap.key}
                icon={cap.icon}
                title={t(`i18n.doctor.features.${cap.key}.title`)}
                description={t(`i18n.doctor.features.${cap.key}.description`)}
              />
            ))}
          </FeatureGrid>
        </div>
      </Section>
      <Divider />

      <Section labelledBy="doctor-related">
        <h2 id="doctor-related" className="text-lg font-medium text-mist-950">
          {t("whatIs.relatedTopics")}
        </h2>
        {/* Bare columns: a link list's items carry no border, fill or padding
            of their own — the section already frames them. */}
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {relatedPages.map((page) => (
            <Link
              key={page.href}
              to={page.href}
              params={{ locale }}
              className="group flex flex-col gap-1"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-[15px] font-medium tracking-[-0.015em] text-mist-900 transition-colors group-hover:text-mist-600">
                  {tRelated(page.nameKey)}
                </span>
                <SpriteIcon
                  name="arrow-right"
                  className="size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600"
                />
              </span>
              <span className="text-[13px] leading-relaxed text-mist-600">{t(page.descKey)}</span>
            </Link>
          ))}
        </div>
      </Section>
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
