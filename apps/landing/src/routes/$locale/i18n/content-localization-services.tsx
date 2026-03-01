import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconMagnifyingGlass,
  IconSettingsGear1,
  IconShieldCheck,
  IconZap,
  IconGroup1,
  IconGlobe,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/content-localization-services")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "contentLocalizationServices",
      pathname: "/i18n/content-localization-services",
      pageType: "educational",
      structuredDataOptions: {
        title: "Content Localization Services Guide",
        description:
          "How to choose content localization services: types of providers, AI vs human translation, multilingual content marketing, game translation services, and quality assurance.",
      },
    });
  },
  component: ContentLocalizationServicesPage,
});

const serviceTypes = [
  { icon: IconGlobe, titleKey: "services.website.title", descKey: "services.website.description", defaultTitle: "Website Localization", defaultDesc: "Full website translation including UI strings, metadata, multimedia, and SEO-optimized content for each target market." },
  { icon: IconSettingsGear1, titleKey: "services.app.title", descKey: "services.app.description", defaultTitle: "App Localization", defaultDesc: "Mobile and desktop application translation covering UI, push notifications, app store listings, and in-app content." },
  { icon: IconZap, titleKey: "services.game.title", descKey: "services.game.description", defaultTitle: "Game Translation", defaultDesc: "Game localization services including UI strings, subtitles, voice scripts, and marketing assets adapted for each region." },
  { icon: IconGroup1, titleKey: "services.marketing.title", descKey: "services.marketing.description", defaultTitle: "Marketing Content", defaultDesc: "Multilingual content marketing including blog posts, ad copy, email campaigns, and social media adapted for local audiences." },
];

function ContentLocalizationServicesPage() {
  const t = useT("marketing.i18n.contentLocalizationServices");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const selectionCriteria = [
    { key: "criteria.list.languageCoverage", defaultValue: "Language coverage and native-speaker availability for your target markets" },
    { key: "criteria.list.subjectMatterExpertise", defaultValue: "Subject matter expertise in your industry and content domain" },
    { key: "criteria.list.tmsIntegration", defaultValue: "TMS and developer tool integration for seamless workflow automation" },
    { key: "criteria.list.qaProcess", defaultValue: "Quality assurance process including review cycles and error tracking" },
    { key: "criteria.list.turnaroundTime", defaultValue: "Turnaround time guarantees and scalability for high-volume projects" },
    { key: "criteria.list.pricing", defaultValue: "Transparent pricing model that aligns with your content volume and budget" },
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description", defaultTitle: "Linguistic Review", defaultDesc: "Native-speaking linguists review translations for grammar, fluency, and adherence to brand style guides." },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description", defaultTitle: "Functional Testing", defaultDesc: "Verify that translated content displays correctly in context, including text expansion, truncation, and layout integrity." },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description", defaultTitle: "Terminology Consistency", defaultDesc: "Cross-check translations against approved glossaries and translation memory to ensure consistent terminology across all content." },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description", defaultTitle: "Final Sign-Off", defaultDesc: "Stakeholder review and approval before publishing, with tracked change history and audit trail for compliance." },
  ];

  const relatedPages = [
    { name: "Content Localization", href: "/$locale/i18n/content-localization", description: t("related.contentLocalization", { defaultValue: "Comprehensive guide to the content localization process" }) },
    { name: "Localization Tools", href: "/$locale/i18n/localization-tools", description: t("related.localizationTools", { defaultValue: "Top tools for managing your localization workflow" }) },
    { name: "Localization Platforms", href: "/$locale/i18n/localization-platforms", description: t("related.localizationPlatforms", { defaultValue: "Choosing the best localization platform for your team" }) },
    { name: "Website Translation", href: "/$locale/i18n/website-translation", description: t("related.websiteTranslation", { defaultValue: "Translating and localizing your website at scale" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconMagnifyingGlass className="size-4" />
              <span>{t("badge", { defaultValue: "Localization Services" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Content Localization Services: How to Choose the Right Provider" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "From multilingual content marketing to game translation services, the landscape of content localization services is broad. This guide helps you evaluate providers, understand localization vs internationalization, and build a workflow that scales from a startup to a global enterprise." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Are Content Localization Services?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Content localization services are professional offerings that transform source content into culturally appropriate, market-ready material for target locales. They go beyond linguistic translation to include desktop publishing, cultural consulting, quality assurance, and technology integration." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "Modern services range from full-service agencies handling multilingual marketing campaigns end-to-end, to specialized game translation services that adapt UI strings, subtitles, voice scripts, and marketing assets simultaneously. The right choice depends on your content type, volume, and time-to-market requirements." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "Understanding localization vs internationalization is essential before engaging a service provider. Internationalization (i18n) is the technical preparation of your codebase to support multiple locales. Localization (l10n) is the content and cultural adaptation for each specific market. Services typically cover l10n, while your engineering team handles i18n." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("aiVsHuman.title", { defaultValue: "AI-Powered vs. Human Translation Services" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("aiVsHuman.paragraph1", { defaultValue: "AI translation services have matured rapidly. For high-volume, structured content — UI strings, product descriptions, knowledge base articles — AI combined with human post-editing reduces costs by 60–80% while maintaining quality. Multilingual content marketing, however, often requires native copywriters who understand local humor, idioms, and brand positioning." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("aiVsHuman.paragraph2", { defaultValue: "The best localization services combine both: AI handles volume and speed while human linguists review tone-sensitive content, marketing copy, and anything customer-facing where brand voice matters most." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("services.title", { defaultValue: "Types of Content Localization Services" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("services.subtitle", { defaultValue: "Each content category has unique requirements. Match your service provider to your content type for the best results." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serviceTypes.map((service) => (
              <div key={service.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <service.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(service.titleKey, { defaultValue: service.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(service.descKey, { defaultValue: service.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("criteria.title", { defaultValue: "How to Choose a Localization Provider" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("criteria.subtitle", { defaultValue: "Evaluate content localization services against these six criteria to find a provider that fits your workflow, budget, and quality bar." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {selectionCriteria.map((criterionKey) => (
                  <li key={criterionKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(criterionKey, { defaultValue: criterionKey.split(".").pop() })}</span>
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
              {t("process.title", { defaultValue: "Quality Assurance in Localization Services" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A rigorous QA process separates professional content localization services from commodity translation." })}
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

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("cost.title", { defaultValue: "Cost Considerations for Localization Services" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("cost.subtitle", { defaultValue: "Pricing models vary widely. Understanding them upfront prevents budget surprises mid-project." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <IconShieldCheck className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("cost.perWord.title", { defaultValue: "Per-Word Pricing" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("cost.perWord.description", { defaultValue: "Traditional agencies charge per source word — typically $0.08–$0.25 for human translation, $0.01–$0.04 for AI with human review. Suitable for large, predictable content volumes like multilingual content marketing campaigns." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <IconZap className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("cost.subscription.title", { defaultValue: "Subscription Platforms" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("cost.subscription.description", { defaultValue: "SaaS localization platforms charge monthly fees based on seats, projects, or translated characters. Ideal for teams with continuous localization needs — video game localisation studios and SaaS products launching updates regularly." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <IconGroup1 className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("cost.managed.title", { defaultValue: "Managed Service Retainers" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("cost.managed.description", { defaultValue: "Enterprise-grade localization services often run on retainer agreements with dedicated linguist teams, project managers, and SLAs. Best for companies with complex, brand-critical multilingual marketing in regulated industries." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
              {t("solution.title", { defaultValue: "Better i18n: Localization Services Built for Developers" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n bridges the gap between localization services and your engineering workflow. Connect your repository, auto-extract translation keys, apply AI translations with your brand glossary, and sync with human translators — all in one platform. It is the missing layer between your codebase and your content localization service." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Vendor-Agnostic" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Connect any translation agency or freelancer via our open integration layer — no lock-in." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "AI Pre-Translation" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Reduce billable word count with AI drafts that human reviewers simply polish — cutting localization costs by up to 70%." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Built-in QA" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Automated checks flag missing placeholders, length violations, and terminology inconsistencies before translations ship." })}
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
            {t("cta.title", { defaultValue: "Simplify Your Localization Services Workflow" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Manage multilingual content marketing, game translation, and app localization from a single developer-friendly platform." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start managing your localization services with Better i18n for free"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              aria-label="Read the Better i18n documentation"
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
