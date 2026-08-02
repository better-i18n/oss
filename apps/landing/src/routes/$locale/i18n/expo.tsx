import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  FrameworkHero,
  FeatureList,
  SetupGuide,
  FrameworkCTA,
  FrameworkFAQ,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/i18n/expo")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "expoI18n",
      pathname: "/i18n/expo",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Expo",
        frameworkDescription:
          "Expo (React Native) internationalization with offline caching, device locale detection, and OTA updates.",
        dependencies: ["expo", "@better-i18n/expo", "expo-localization", "react-i18next", "i18next"],
      },
    });
  },
  component: ExpoI18nPage,
});

/* Key suffixes, not copy — resolved with t() inside the component. Same shape
   as the other framework pages, and it keeps the array out of react-doctor's
   prefer-module-scope-static-value. */
const FEATURE_KEYS = [
  "noNativeModules",
  "offlineFirst",
  "deviceLocale",
  "instantSwitching",
  "otaUpdates",
  "reactI18next",
];

function ExpoI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const setupSteps = [
    {
      step: 1,
      id: "step1",
      code: "npm install @better-i18n/expo expo-localization react-i18next i18next",
      fileName: "terminal",
    },
    {
      step: 2,
      id: "step2",
      code: `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { initBetterI18n } from '@better-i18n/expo';

i18n.use(initReactI18next);

export const { languages } = await initBetterI18n({
  projectId: 'your-org/your-project',
  i18n,
  defaultLocale: 'en',
  debug: __DEV__,
});`,
      fileName: "i18n.ts",
    },
    {
      step: 3,
      id: "step3",
      code: `// App.tsx or _layout.tsx (Expo Router)
import './i18n';

export default function App() {
  return <NavigationContainer>...</NavigationContainer>;
}`,
      fileName: "App.tsx",
    },
    {
      step: 4,
      id: "step4",
      code: `import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

function HomeScreen() {
  const { t } = useTranslation();
  return <Text>{t('welcome')}</Text>;
}`,
      fileName: "screens/HomeScreen.tsx",
    },
  ];

  /* Copy from the CDN, code samples from the file above (code is code, not
     copy). `id` is the key path segment, so a step's prose lives in
     i18n.expo.setup.<id>.*. */
  const steps = setupSteps.map((step) => ({
    ...step,
    title: t(`i18n.expo.setup.${step.id}.title`),
    description: t(`i18n.expo.setup.${step.id}.description`),
  }));

  const features = FEATURE_KEYS.map((k) => t(`i18n.expo.features.${k}`));

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.expo.hero.title")}
        subtitle={t("i18n.expo.hero.subtitle")}
        badgeText={t("i18n.expo.hero.badge")}
      />

      <SetupGuide title={t("i18n.expo.setup.title")} steps={steps} />

      <FeatureList title={t("i18n.expo.featuresTitle")} features={features} />

      <FrameworkFAQ
        title={t("i18n.expo.faq.title")}
        items={[
          "approach",
          "expoRouter",
          "otaUpdates",
          "deviceLanguage",
          "mmkv",
          "localeSwitching",
        ].map((id) => ({
          id,
          question: t(`i18n.expo.faq.items.${id}.question`),
          answer: t(`i18n.expo.faq.items.${id}.answer`),
        }))}
      />

      <OtherFrameworks
        title={t("i18n.expo.otherFrameworks")}
        currentFramework="expo"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.expo.cta.title")}
        subtitle={t("i18n.expo.cta.subtitle")}
        primaryCTA={t("i18n.expo.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.expo.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com/frameworks/expo"
      />
    </MarketingLayout>
  );
}
