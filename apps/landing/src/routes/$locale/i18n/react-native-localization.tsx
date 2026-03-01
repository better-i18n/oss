import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconRocket,
  IconZap,
  IconCodeBrackets,
  IconSparklesSoft,
  IconSettingsGear1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute(
  "/$locale/i18n/react-native-localization",
)({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "reactNativeLocalization",
      pathname: "/i18n/react-native-localization",
      pageType: "educational",
      structuredDataOptions: {
        title: "React Native & Expo Localization Guide",
        description:
          "Complete guide to localizing React Native and Expo mobile apps: device locale detection, offline caching, OTA translation updates, type-safe SDKs, and RTL support.",
      },
    });
  },
  component: ReactNativeLocalizationPage,
});

const coreFeatures = [
  { icon: IconRocket, titleKey: "features.expoSupport.title", descKey: "features.expoSupport.description", defaultTitle: "First-Class Expo Support", defaultDesc: "Works seamlessly with Expo's managed and bare workflows. No native module linking required — just install and start translating." },
  { icon: IconSettingsGear1, titleKey: "features.deviceLocale.title", descKey: "features.deviceLocale.description", defaultTitle: "Device Locale Detection", defaultDesc: "Automatically detects the user's device language and region settings on both iOS and Android, with graceful fallback to your default locale." },
  { icon: IconZap, titleKey: "features.offlineCaching.title", descKey: "features.offlineCaching.description", defaultTitle: "Offline Translation Caching", defaultDesc: "Translations are cached locally on the device so your app works flawlessly in airplane mode, subways, and areas with poor connectivity." },
  { icon: IconCodeBrackets, titleKey: "features.typeSafe.title", descKey: "features.typeSafe.description", defaultTitle: "Type-Safe SDK", defaultDesc: "Full TypeScript support with autocomplete for translation keys. Missing keys are caught at compile time, not discovered by users in production." },
  { icon: IconSparklesSoft, titleKey: "features.otaUpdates.title", descKey: "features.otaUpdates.description", defaultTitle: "OTA Translation Updates", defaultDesc: "Push new translations and languages to production without resubmitting to the App Store or Google Play. Updates go live in seconds via CDN." },
];

function ReactNativeLocalizationPage() {
  const t = useT("marketing.i18n.reactNativeLocalization");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const challenges = [
    { key: "challenges.list.bundleSize", defaultValue: "Keeping translation bundle size small for fast app downloads" },
    { key: "challenges.list.offlineFirst", defaultValue: "Supporting offline-first usage when network is unavailable" },
    { key: "challenges.list.platformFormats", defaultValue: "Handling platform-specific date, number, and currency formats on iOS vs Android" },
    { key: "challenges.list.rtlSupport", defaultValue: "Implementing right-to-left layout support for Arabic, Hebrew, and other RTL languages" },
    { key: "challenges.list.deepLinking", defaultValue: "Maintaining locale-aware deep linking and navigation across app screens" },
  ];

  const processSteps = [
    { number: "1", titleKey: "workflow.step1.title", descKey: "workflow.step1.description", defaultTitle: "Install the SDK", defaultDesc: "Add the Better i18n package to your React Native or Expo project and wrap your root component with the translation provider." },
    { number: "2", titleKey: "workflow.step2.title", descKey: "workflow.step2.description", defaultTitle: "Extract Keys", defaultDesc: "Run the CLI to scan your components and automatically extract all translation keys into your resource files." },
    { number: "3", titleKey: "workflow.step3.title", descKey: "workflow.step3.description", defaultTitle: "Translate with AI", defaultDesc: "Use AI-powered translation to instantly generate translations for all target languages, then review and refine as needed." },
    { number: "4", titleKey: "workflow.step4.title", descKey: "workflow.step4.description", defaultTitle: "Deploy via CDN", defaultDesc: "Push translations to the global CDN. Your app fetches the latest translations automatically — no app store resubmission required." },
  ];

  const relatedPages = [
    { name: "React i18n", href: "/$locale/i18n/react", description: t("related.react", { defaultValue: "Internationalize React apps with hooks, context, and type-safe translations" }) },
    { name: "Localization Tools", href: "/$locale/i18n/localization-tools", description: t("related.localizationTools", { defaultValue: "Developer tools and integrations for localization workflows" }) },
    { name: "For Developers", href: "/$locale/i18n/for-developers", description: t("related.forDevelopers", { defaultValue: "Developer-first localization with CLI, SDK, and CI/CD integrations" }) },
    { name: "Localization Platforms", href: "/$locale/i18n/localization-platforms", description: t("related.localizationPlatforms", { defaultValue: "Manage every translation workflow from a single platform" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconRocket className="size-4" />
              <span>{t("badge", { defaultValue: "React Native & Expo" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "React Native & Expo Localization: Ship Your Mobile App in Every Language" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Localizing a React Native or Expo app means more than translating strings. You need device locale detection, offline-ready translations, platform-specific formatting, and a way to update translations without resubmitting to the App Store or Google Play. Better i18n handles all of it." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("features.title", { defaultValue: "Core Features for Mobile Localization" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("features.subtitle", { defaultValue: "Everything you need to ship a fully localized React Native or Expo app to users worldwide." })}
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

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("challenges.title", { defaultValue: "Mobile-Specific Localization Challenges" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-6">
                {t("challenges.intro", { defaultValue: "Mobile apps face unique constraints that web apps do not. Limited bandwidth, offline usage, platform differences between iOS and Android, and app store review cycles all affect how you approach localization." })}
              </p>
              <ul className="space-y-4">
                {challenges.map((challengeKey) => (
                  <li key={challengeKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(challengeKey, { defaultValue: challengeKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("challenges.rtl.title", { defaultValue: "RTL Layout Support" })}
              </h3>
              <p className="text-sm text-mist-700 mb-4">
                {t("challenges.rtl.paragraph1", { defaultValue: "Arabic, Hebrew, and other right-to-left languages require mirrored layouts, flipped icons, and adjusted text alignment. React Native provides I18nManager for toggling RTL, but coordinating that with your translation system requires careful integration." })}
              </p>
              <p className="text-sm text-mist-700">
                {t("challenges.rtl.paragraph2", { defaultValue: "Better i18n detects the writing direction from the active locale and exposes it through the useLocale hook, so your layout can adapt automatically without manual RTL checks in every component." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("integration.title", { defaultValue: "How Better i18n Integrates with Expo & React Native" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("integration.paragraph1", { defaultValue: "The Better i18n CLI scans your .tsx and .jsx components to extract translation keys automatically. It works the same way on mobile components as it does on web — no configuration changes needed when you add React Native to an existing project." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("integration.paragraph2", { defaultValue: "AI-powered translation understands mobile context. Button labels, push notification copy, and in-app messages are translated with the right tone and length constraints for small screens. Translations are delivered through a global CDN optimized for mobile bandwidth." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("integration.paragraph3", { defaultValue: "OTA translation updates mean you can fix a typo, add a new language, or refine a translation without going through the App Store or Google Play review process. Your users get the latest translations the next time the app fetches from the CDN." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <h3 className="font-display text-lg font-medium text-mist-950 mb-6">
                {t("devExperience.title", { defaultValue: "Developer Experience" })}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <IconCodeBrackets className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-mist-950 mb-1">{t("devExperience.hooks.title", { defaultValue: "useTranslations Hook" })}</h4>
                    <p className="text-sm text-mist-600">{t("devExperience.hooks.description", { defaultValue: "Access translated strings in any React Native component with full TypeScript autocomplete. Keys are type-checked at build time so missing translations surface as compile errors, not runtime bugs." })}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconSettingsGear1 className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-mist-950 mb-1">{t("devExperience.locale.title", { defaultValue: "useLocale & useFormatter" })}</h4>
                    <p className="text-sm text-mist-600">{t("devExperience.locale.description", { defaultValue: "Get and set the current locale, detect writing direction, and format numbers, dates, and currencies according to the user's locale — all through a single, consistent API." })}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconSparklesSoft className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-mist-950 mb-1">{t("devExperience.fallback.title", { defaultValue: "Fallback Locale Handling" })}</h4>
                    <p className="text-sm text-mist-600">{t("devExperience.fallback.description", { defaultValue: "When a user's device locale is not fully supported, Better i18n falls back gracefully — first to a regional variant, then to the base language, then to your default locale. No blank screens, ever." })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("workflow.title", { defaultValue: "Integration Workflow" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("workflow.subtitle", { defaultValue: "From first install to production-ready localization in four steps." })}
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
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
              {t("solution.title", { defaultValue: "Better i18n: Mobile Localization Made Seamless" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n treats mobile as a first-class platform. The same CLI, dashboard, and AI translation engine that powers your web localization works identically for React Native and Expo — so your team manages all platforms from one place without duplicating effort." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "OTA Updates" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Push translation updates to production without app store resubmission. New languages and copy fixes go live in seconds through the CDN." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Offline-Ready" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Translations are cached locally on the device. Your app works flawlessly in airplane mode, subways, and areas with poor connectivity." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Unified Platform" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Manage web and mobile translations in a single dashboard. Share translation memory across platforms so you never pay to translate the same string twice." })}
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
            {t("cta.title", { defaultValue: "Localize Your Mobile App in Minutes" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Better i18n gives React Native and Expo developers the tools to ship localized apps to every market — with OTA updates, offline support, and type-safe SDKs out of the box." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start using Better i18n for React Native localization for free"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              aria-label="Read the Better i18n documentation for mobile localization"
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
