import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { ClosingCta, Divider } from "@/components/ui/page";

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
  { icon: "rocket", titleKey: "i18n.reactNativeLocalization.features.expoSupport.title", descKey: "i18n.reactNativeLocalization.features.expoSupport.description" },
  { icon: "settings-gear", titleKey: "i18n.reactNativeLocalization.features.deviceLocale.title", descKey: "i18n.reactNativeLocalization.features.deviceLocale.description" },
  { icon: "zap", titleKey: "i18n.reactNativeLocalization.features.offlineCaching.title", descKey: "i18n.reactNativeLocalization.features.offlineCaching.description" },
  { icon: "code-brackets", titleKey: "i18n.reactNativeLocalization.features.typeSafe.title", descKey: "i18n.reactNativeLocalization.features.typeSafe.description" },
  { icon: "sparkles-soft", titleKey: "i18n.reactNativeLocalization.features.otaUpdates.title", descKey: "i18n.reactNativeLocalization.features.otaUpdates.description" },
];

function ReactNativeLocalizationPage() {
  const t = useT("marketing");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const challenges = [
    { key: "i18n.reactNativeLocalization.challenges.list.bundleSize" },
    { key: "i18n.reactNativeLocalization.challenges.list.offlineFirst" },
    { key: "i18n.reactNativeLocalization.challenges.list.platformFormats" },
    { key: "i18n.reactNativeLocalization.challenges.list.rtlSupport" },
    { key: "i18n.reactNativeLocalization.challenges.list.deepLinking" },
  ];

  const processSteps = [
    { number: "1", titleKey: "i18n.reactNativeLocalization.workflow.step1.title", descKey: "i18n.reactNativeLocalization.workflow.step1.description" },
    { number: "2", titleKey: "i18n.reactNativeLocalization.workflow.step2.title", descKey: "i18n.reactNativeLocalization.workflow.step2.description" },
    { number: "3", titleKey: "i18n.reactNativeLocalization.workflow.step3.title", descKey: "i18n.reactNativeLocalization.workflow.step3.description" },
    { number: "4", titleKey: "i18n.reactNativeLocalization.workflow.step4.title", descKey: "i18n.reactNativeLocalization.workflow.step4.description" },
  ];

  const relatedPages = [
    { name: "React i18n", href: "/$locale/i18n/react", description: t("i18n.reactNativeLocalization.related.react") },
    { name: "Localization Software", href: "/$locale/i18n/localization-software", description: t("i18n.reactNativeLocalization.related.localizationSoftware") },
    { name: "For Developers", href: "/$locale/i18n/for-developers", description: t("i18n.reactNativeLocalization.related.forDevelopers") },
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("i18n.reactNativeLocalization.related.websiteLocalization") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <section>
        <div className="section">
          <div className="max-w-3xl">
            <div className="eyebrow mb-5 flex items-center gap-2">
              <SpriteIcon name="rocket" className="size-4" />
              <span>{t("i18n.reactNativeLocalization.badge")}</span>
            </div>
            <h1 className="section-h2">
              {t("i18n.reactNativeLocalization.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.reactNativeLocalization.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.reactNativeLocalization.features.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.reactNativeLocalization.features.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((feature) => (
              <div key={feature.titleKey} >
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

      <section>
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="section-h2 mb-6">
                {t("i18n.reactNativeLocalization.challenges.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-6">
                {t("i18n.reactNativeLocalization.challenges.intro")}
              </p>
              <ul className="space-y-4">
                {challenges.map((challenge) => (
                  <li key={challenge.key} className="flex items-start gap-3">
                    <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                    <span className="text-mist-700">{t(challenge.key)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 lg:mt-0">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("i18n.reactNativeLocalization.challenges.rtl.title")}
              </h3>
              <p className="text-sm text-mist-700 mb-4">
                {t("i18n.reactNativeLocalization.challenges.rtl.paragraph1")}
              </p>
              <p className="text-sm text-mist-700">
                {t("i18n.reactNativeLocalization.challenges.rtl.paragraph2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="section-h2 mb-6">
                {t("i18n.reactNativeLocalization.integration.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.reactNativeLocalization.integration.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.reactNativeLocalization.integration.paragraph2")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.reactNativeLocalization.integration.paragraph3")}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <h3 className="font-display text-lg font-medium text-mist-950 mb-6">
                {t("i18n.reactNativeLocalization.devExperience.title")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <SpriteIcon name="code-brackets" className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-mist-950 mb-1">{t("i18n.reactNativeLocalization.devExperience.hooks.title")}</h4>
                    <p className="text-sm text-mist-600">{t("i18n.reactNativeLocalization.devExperience.hooks.description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <SpriteIcon name="settings-gear" className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-mist-950 mb-1">{t("i18n.reactNativeLocalization.devExperience.locale.title")}</h4>
                    <p className="text-sm text-mist-600">{t("i18n.reactNativeLocalization.devExperience.locale.description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <SpriteIcon name="sparkles-soft" className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-mist-950 mb-1">{t("i18n.reactNativeLocalization.devExperience.fallback.title")}</h4>
                    <p className="text-sm text-mist-600">{t("i18n.reactNativeLocalization.devExperience.fallback.description")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.reactNativeLocalization.workflow.title")}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("i18n.reactNativeLocalization.workflow.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
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

      <section>
        <div className="section">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-h2 mb-6">
              {t("i18n.reactNativeLocalization.solution.title")}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("i18n.reactNativeLocalization.solution.content")}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div >
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.reactNativeLocalization.solution.feature1.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.reactNativeLocalization.solution.feature1.description")}
                </p>
              </div>
              <div >
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.reactNativeLocalization.solution.feature2.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.reactNativeLocalization.solution.feature2.description")}
                </p>
              </div>
              <div >
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.reactNativeLocalization.solution.feature3.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.reactNativeLocalization.solution.feature3.description")}
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
                className="group flex flex-col gap-1"
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
        title={t("i18n.reactNativeLocalization.cta.title")}
        subtitle={t("i18n.reactNativeLocalization.cta.subtitle")}
        primary={{ label: t("i18n.reactNativeLocalization.cta.primary"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("i18n.reactNativeLocalization.cta.secondary"), href: "https://docs.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}
