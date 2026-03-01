import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconGroup1,
  IconGlobe,
  IconSettingsGear1,
  IconZap,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/localization-management")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "localizationManagement",
      pathname: "/i18n/localization-management",
      pageType: "educational",
      structuredDataOptions: {
        title: "Localization Management Guide",
        description:
          "Master localization management: workflows, tools, and strategies for managing translation and localization at scale.",
      },
    });
  },
  component: LocalizationManagementPage,
});

function LocalizationManagementPage() {
  const t = useT("marketing.i18n.localizationManagement");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const pillars = [
    { icon: IconSettingsGear1, titleKey: "pillars.workflow.title", descKey: "pillars.workflow.description", defaultTitle: "Workflow Design", defaultDesc: "Define clear translation workflows with stage gates, role assignments, and approval chains that keep content moving from source to published." },
    { icon: IconGroup1, titleKey: "pillars.collaboration.title", descKey: "pillars.collaboration.description", defaultTitle: "Team Collaboration", defaultDesc: "Connect developers, translators, and product managers in a shared workspace with contextual commenting and real-time progress visibility." },
    { icon: IconGlobe, titleKey: "pillars.quality.title", descKey: "pillars.quality.description", defaultTitle: "Quality Assurance", defaultDesc: "Enforce glossary consistency, run automated QA checks, and leverage translation memory to maintain quality across every language." },
    { icon: IconZap, titleKey: "pillars.automation.title", descKey: "pillars.automation.description", defaultTitle: "Automation", defaultDesc: "Automate key extraction, string syncing, and CI/CD integration so localization keeps pace with your development cycle." },
  ];

  const challenges = [
    { titleKey: "challenges.fragmentation.title", descKey: "challenges.fragmentation.description", defaultTitle: "Tool Fragmentation", defaultDesc: "Translation assets scattered across spreadsheets, email threads, and disconnected tools lead to duplicated effort and lost context." },
    { titleKey: "challenges.consistency.title", descKey: "challenges.consistency.description", defaultTitle: "Terminology Consistency", defaultDesc: "Without a centralized glossary and translation memory, different translators use different terms for the same concept across your product." },
    { titleKey: "challenges.scaling.title", descKey: "challenges.scaling.description", defaultTitle: "Scaling to New Languages", defaultDesc: "Adding each new language multiplies coordination overhead unless your workflow and tooling are designed to scale horizontally." },
    { titleKey: "challenges.speed.title", descKey: "challenges.speed.description", defaultTitle: "Release Speed", defaultDesc: "Manual handoffs between engineering and translation teams create bottlenecks that delay multilingual releases by days or weeks." },
  ];

  const benefits = [
    { key: "benefits.list.centralizedWorkflow", defaultValue: "Centralized workflow that eliminates scattered spreadsheets and email chains" },
    { key: "benefits.list.fasterDelivery", defaultValue: "Faster delivery with automated key extraction and CI/CD integration" },
    { key: "benefits.list.consistentQuality", defaultValue: "Consistent quality enforced by glossaries and translation memory" },
    { key: "benefits.list.reducedCost", defaultValue: "Reduced cost through translation reuse and AI-assisted suggestions" },
    { key: "benefits.list.betterCollaboration", defaultValue: "Better collaboration between developers, translators, and product teams" },
    { key: "benefits.list.measurableProgress", defaultValue: "Measurable progress with real-time translation coverage dashboards" },
  ];

  const relatedPages = [
    { name: "Translation Management System", href: "/$locale/i18n/translation-management-system", description: t("related.tms", { defaultValue: "TMS platforms for localization teams" }) },
    { name: "Software Localization", href: "/$locale/i18n/software-localization", description: t("related.softwareLocalization", { defaultValue: "The complete localization process" }) },
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("related.websiteLocalization", { defaultValue: "Localizing web applications" }) },
    { name: "Best TMS Platforms", href: "/$locale/i18n/best-tms", description: t("related.bestTms", { defaultValue: "Compare localization management tools" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconGroup1 className="size-4" />
              <span>{t("badge", { defaultValue: "Localization Management" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Localization Management: Streamline Your Translation Workflow" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Localization management is the practice of coordinating translation and localization across teams, tools, and languages. Learn how to build efficient translation and localization management workflows that scale with your product." })}
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
                {t("definition.title", { defaultValue: "What Is Localization Management?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Localization management encompasses the processes, tools, and strategies used to coordinate the translation and cultural adaptation of software products for multiple markets. It bridges the gap between development, translation, and product teams." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph2", { defaultValue: "Effective translation and localization management requires the right combination of automation, human oversight, and tooling. Modern localization management tools handle everything from key extraction and translation memory to quality assurance and deployment." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("scope.title", { defaultValue: "What Localization Management Covers" })}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("scope.workflowDesign", { defaultValue: "Translation workflow design and optimization" })}
                </li>
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("scope.teamCoordination", { defaultValue: "Cross-functional team coordination" })}
                </li>
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("scope.qualityAssurance", { defaultValue: "Translation quality assurance" })}
                </li>
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("scope.toolSelection", { defaultValue: "Tooling and platform selection" })}
                </li>
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <IconCheckmark1 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {t("scope.progressTracking", { defaultValue: "Progress tracking and reporting" })}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("pillars.title", { defaultValue: "Four Pillars of Localization Management" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("pillars.subtitle", { defaultValue: "Successful localization management rests on these four foundations." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <div key={pillar.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <pillar.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(pillar.titleKey, { defaultValue: pillar.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(pillar.descKey, { defaultValue: pillar.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("challenges.title", { defaultValue: "Common Localization Management Challenges" })}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {challenges.map((challenge) => (
              <div key={challenge.titleKey} className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(challenge.titleKey, { defaultValue: challenge.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(challenge.descKey, { defaultValue: challenge.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("benefits.title", { defaultValue: "Benefits of Strong Localization Management" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "Teams with mature localization management processes ship multilingual products faster and with higher quality." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit.key} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(benefit.key, { defaultValue: benefit.defaultValue })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Pages */}
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
            {t("cta.title", { defaultValue: "Modern Localization Management, Built for Developers" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Better i18n gives your team the localization management tools to ship multilingual products at startup speed." })}
          </p>
          <div className="mt-8">
            <a
              href="https://dash.better-i18n.com"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
