import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconRocket,
  IconGroup1,
  IconChart1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/localization-platforms")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "localizationPlatforms",
      pathname: "/i18n/localization-platforms",
      pageType: "educational",
      structuredDataOptions: {
        title: "Localization Management Platforms Guide",
        description:
          "Complete guide to localization management platforms: project management, workflow automation, translation memory, team collaboration, and analytics.",
      },
    });
  },
  component: LocalizationPlatformsPage,
});

const capabilities = [
  { icon: IconRocket, titleKey: "capabilities.projectManagement.title", descKey: "capabilities.projectManagement.description", defaultTitle: "Project Management", defaultDesc: "Organize translation work by project, locale, and deadline with full visibility into progress and bottlenecks." },
  { icon: IconRocket, titleKey: "capabilities.workflowAutomation.title", descKey: "capabilities.workflowAutomation.description", defaultTitle: "Workflow Automation", defaultDesc: "Automatically route new strings to translators, trigger reviews on completion, and publish approved translations without manual steps." },
  { icon: IconGroup1, titleKey: "capabilities.teamCollaboration.title", descKey: "capabilities.teamCollaboration.description", defaultTitle: "Team Collaboration", defaultDesc: "Enable translators, reviewers, and developers to work together in real time with in-context comments and role-based access." },
  { icon: IconChart1, titleKey: "capabilities.analyticsReporting.title", descKey: "capabilities.analyticsReporting.description", defaultTitle: "Analytics & Reporting", defaultDesc: "Track translation coverage, quality scores, turnaround times, and cost metrics across all projects and locales." },
];

function LocalizationPlatformsPage() {
  const t = useT("marketing.i18n.localizationPlatforms");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    { key: "benefits.list.centralizedWorkflow", defaultValue: "Centralize all translation work in a single dashboard across projects" },
    { key: "benefits.list.automatedRouting", defaultValue: "Automatically route strings to the right translator or AI engine" },
    { key: "benefits.list.consistentTerminology", defaultValue: "Enforce consistent terminology with shared glossaries and translation memory" },
    { key: "benefits.list.realTimeVisibility", defaultValue: "Get real-time visibility into translation progress across all locales" },
    { key: "benefits.list.developerIntegration", defaultValue: "Integrate directly with your development pipeline via CLI, API, or GitHub sync" },
    { key: "benefits.list.offlineCapability", defaultValue: "Support offline translation workflows with sync-on-reconnect capability" },
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description", defaultTitle: "Connect Your Codebase", defaultDesc: "Link your GitHub, GitLab, or Bitbucket repository so the platform can detect translatable strings automatically." },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description", defaultTitle: "Configure Workflows", defaultDesc: "Define translation workflows, assign roles, set up routing rules, and configure quality gates for each locale." },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description", defaultTitle: "Translate & Review", defaultDesc: "Use AI pre-translation or assign to human linguists. Reviewers approve translations in context before publishing." },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description", defaultTitle: "Deploy & Monitor", defaultDesc: "Push approved translations to production via CDN or pull request and monitor coverage and quality metrics." },
  ];

  const relatedPages = [
    { name: "Localization Software", href: "/$locale/i18n/localization-software", description: t("related.localizationSoftware", { defaultValue: "TMS and CAT tools for managing translations at scale" }) },
    { name: "Translation Management System", href: "/$locale/i18n/translation-management-system", description: t("related.tms", { defaultValue: "How a TMS automates and orchestrates your localization workflow" }) },
    { name: "Best TMS", href: "/$locale/i18n/best-tms", description: t("related.bestTms", { defaultValue: "Side-by-side comparison of the top TMS platforms" }) },
    { name: "Localization Tools", href: "/$locale/i18n/localization-tools", description: t("related.localizationTools", { defaultValue: "Developer tools and integrations for localization workflows" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconGroup1 className="size-4" />
              <span>{t("badge", { defaultValue: "Localization Platforms" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Localization Platforms: Manage Every Translation Workflow in One Place" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "A localization management platform goes beyond translation tools — it coordinates your entire multilingual operation. From project assignment and workflow automation to translation memory, glossaries, and analytics, a platform gives teams full visibility and control over every locale they support." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Is a Localization Management Platform?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "A localization management platform is a centralized system that coordinates the people, processes, and technology involved in adapting a product for multiple markets. Where a standalone translation tool handles the act of translating text, a localization platform manages the entire lifecycle — from source content extraction and translator assignment through to quality review, approval, and delivery to production." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "Platforms differ from simpler tools in scope and integration depth. They connect directly to your version control system, CMS, or development pipeline via APIs, webhooks, or native integrations. When a developer merges new copy, the platform automatically surfaces untranslated strings, routes them to the appropriate linguist or AI engine, and tracks completion status without manual intervention." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "Location services and location settings — while primarily a device concept — intersect with localization platforms in geo-targeting scenarios: serving the right language variant based on a user's detected locale requires platform-level coordination between user location data and translation delivery systems." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("platformVsTool.title", { defaultValue: "Platform vs. Translation Tool" })}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-mist-950 mb-1">{t("platformVsTool.tool.title", { defaultValue: "Translation Tool" })}</h4>
                  <p className="text-sm text-mist-700">{t("platformVsTool.tool.description", { defaultValue: "Handles the conversion of text between languages. Outputs translated strings. Limited workflow features and no project management layer." })}</p>
                </div>
                <div className="border-t border-mist-200 pt-4">
                  <h4 className="text-sm font-semibold text-mist-950 mb-1">{t("platformVsTool.platform.title", { defaultValue: "Localization Platform" })}</h4>
                  <p className="text-sm text-mist-700">{t("platformVsTool.platform.description", { defaultValue: "Orchestrates the full workflow: source ingestion, task routing, translation execution, quality review, reporting, and delivery back to production. Enables offline translator app workflows, team collaboration, and analytics." })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("capabilities.title", { defaultValue: "Core Capabilities of Localization Platforms" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("capabilities.subtitle", { defaultValue: "Look for these four capabilities when evaluating any localization management platform for your team." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability) => (
              <div key={capability.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <capability.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(capability.titleKey, { defaultValue: capability.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(capability.descKey, { defaultValue: capability.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("devIntegration.title", { defaultValue: "Integration with Development Tools" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("devIntegration.paragraph1", { defaultValue: "A localization platform earns its place in your stack by reducing the friction between engineering and localization. The best platforms integrate directly with GitHub, GitLab, or Bitbucket, triggering translation jobs automatically when source files change and submitting translated updates as pull requests for review." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("devIntegration.paragraph2", { defaultValue: "CLI tools and REST APIs give developers programmatic access to every platform function. This means you can trigger translation runs from CI pipelines, check completion status before deploying, or batch-import content from a CMS without logging into a web UI." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("devIntegration.paragraph3", { defaultValue: "Native SDK support for React, Next.js, Vue, and mobile frameworks means translated strings can be consumed directly in code with full type safety — eliminating the manual copy-paste steps that slow down releases in teams without a proper platform." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <h3 className="font-display text-lg font-medium text-mist-950 mb-6">
                {t("collaboration.title", { defaultValue: "Team Collaboration Features" })}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <IconGroup1 className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-mist-950 mb-1">{t("collaboration.roles.title", { defaultValue: "Role-Based Access Control" })}</h4>
                    <p className="text-sm text-mist-600">{t("collaboration.roles.description", { defaultValue: "Assign project manager, translator, reviewer, and developer roles with appropriate permissions per project and locale." })}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconGroup1 className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-mist-950 mb-1">{t("collaboration.comments.title", { defaultValue: "In-Context Comments" })}</h4>
                    <p className="text-sm text-mist-600">{t("collaboration.comments.description", { defaultValue: "Translators and reviewers communicate directly on individual segments, reducing email back-and-forth and keeping context attached to the right string." })}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconGroup1 className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-mist-950 mb-1">{t("collaboration.vendors.title", { defaultValue: "External Vendor Management" })}</h4>
                    <p className="text-sm text-mist-600">{t("collaboration.vendors.description", { defaultValue: "Invite freelance translators or translation agencies as external collaborators with scoped access to specific projects and language pairs." })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("benefits.title", { defaultValue: "Why Teams Choose Localization Platforms" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "Organizations managing more than two or three locales find that a dedicated platform pays back its cost many times over through reduced manual coordination, fewer translation errors, and faster time-to-market in new languages." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {benefits.map((benefitKey) => (
                  <li key={benefitKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(benefitKey, { defaultValue: benefitKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("process.title", { defaultValue: "Getting Started with a Localization Platform" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "Adopting a platform successfully requires alignment across engineering, product, and content teams from day one." })}
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
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("localeRouting.title", { defaultValue: "Locale Routing & Delivery" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("localeRouting.description", { defaultValue: "A localization platform handles the mechanics of serving the right content to the right user — from URL structure and browser navigation to device-level detection and offline support." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0 space-y-4">
              <div className="p-4 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-sm font-medium text-mist-950 mb-1">{t("localeRouting.urlPrefix.title", { defaultValue: "URL Prefix Strategy" })}</h3>
                <p className="text-sm text-mist-700">{t("localeRouting.urlPrefix.description", { defaultValue: "Default locale served without a prefix (/about), other locales at /fr/about, /de/about. Clean URLs with proper hreflang tags." })}</p>
              </div>
              <div className="p-4 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-sm font-medium text-mist-950 mb-1">{t("localeRouting.history.title", { defaultValue: "Browser History Support" })}</h3>
                <p className="text-sm text-mist-700">{t("localeRouting.history.description", { defaultValue: "Back and forward navigation works correctly across locale changes, preserving the user's browsing context." })}</p>
              </div>
              <div className="p-4 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-sm font-medium text-mist-950 mb-1">{t("localeRouting.deviceDetection.title", { defaultValue: "Device Locale Detection" })}</h3>
                <p className="text-sm text-mist-700">{t("localeRouting.deviceDetection.description", { defaultValue: "Automatic locale detection on mobile via Expo, and browser-based detection for web apps using Accept-Language headers." })}</p>
              </div>
              <div className="p-4 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-sm font-medium text-mist-950 mb-1">{t("localeRouting.offline.title", { defaultValue: "Offline Caching" })}</h3>
                <p className="text-sm text-mist-700">{t("localeRouting.offline.description", { defaultValue: "Service worker support for caching translations offline. Users see translated content even without a network connection." })}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
              {t("solution.title", { defaultValue: "Better i18n: A Localization Platform Built Around Your Workflow" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n combines the key management of a translation tool with the workflow orchestration of a full localization platform. Connect your GitHub repository, auto-detect new strings via AST scanning, translate with context-aware AI, review in a browser-based editor, and push live without redeployment — all from a single dashboard." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Workflow Automation" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Automatically route new strings to AI translation, flag low-confidence segments for human review, and mark locales complete when all keys are approved." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Analytics & Reporting" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Track translation coverage per locale, monitor quality scores, and export progress reports for stakeholders — all in real time." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Global CDN Delivery" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Approved translations are served from an edge network worldwide — no redeploy needed, and translation updates go live in seconds." })}
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
            {t("cta.title", { defaultValue: "Centralize Your Localization on One Platform" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Better i18n gives your team the project management, automation, and delivery infrastructure to scale to any number of languages without adding headcount." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start using Better i18n localization platform for free"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              aria-label="Read the Better i18n documentation for localization platforms"
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
