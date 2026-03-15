import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  FrameworkHero,
  FeatureList,
  SetupGuide,
  FrameworkCTA,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { getPageHead, createPageLoader } from "@/lib/page-seo";

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

function ExpoI18nPage() {
  const { locale } = Route.useParams();

  const setupSteps = [
    {
      step: 1,
      title: "Install packages",
      description:
        "Add the Better i18n Expo adapter along with expo-localization and react-i18next.",
      code: "npm install @better-i18n/expo expo-localization react-i18next i18next",
      fileName: "terminal",
    },
    {
      step: 2,
      title: "Initialize in i18n.ts",
      description:
        "Call initBetterI18n() at module scope. It registers the CDN loader and configures i18next with your project's languages.",
      code: `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { initBetterI18n } from '@better-i18n/expo';

i18n.use(initReactI18next);

export const { languages } = await initBetterI18n({
  project: 'your-org/your-project',
  i18n,
  defaultLocale: 'en',
  debug: __DEV__,
});`,
      fileName: "i18n.ts",
    },
    {
      step: 3,
      title: "Import in App Entry",
      description:
        "Import i18n.ts at the top of your app entry point so it initializes before any screens render. No provider wrapper needed.",
      code: `// App.tsx or _layout.tsx (Expo Router)
import './i18n';

export default function App() {
  return <NavigationContainer>...</NavigationContainer>;
}`,
      fileName: "App.tsx",
    },
    {
      step: 4,
      title: "Translate in Components",
      description:
        "Use the standard react-i18next useTranslation hook in any screen or component.",
      code: `import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

function HomeScreen() {
  const { t } = useTranslation();
  return <Text>{t('welcome')}</Text>;
}`,
      fileName: "screens/HomeScreen.tsx",
    },
  ];

  const features = [
    "Zero native modules — works in Expo Go without ejecting",
    "Offline-first — MMKV or AsyncStorage persistent cache",
    "Device locale — auto-detects language via expo-localization",
    "Instant switching — locale changes without UI flash",
    "OTA updates — push translation changes without an app store release",
    "react-i18next compatible — works with existing i18next setups",
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title="Expo i18n — Localize your React Native app"
        subtitle="Add internationalization to your Expo app with offline support, automatic device locale detection, and OTA translation updates."
        badgeText="Expo i18n"
      />

      <SetupGuide title="Get started in 4 steps" steps={setupSteps} />

      <FeatureList title="Why use Better i18n with Expo?" features={features} />

      <OtherFrameworks
        title="Other frameworks"
        currentFramework="expo"
        locale={locale}
      />

      <FrameworkCTA
        title="Ship your multilingual Expo app today"
        subtitle="Manage translations in the dashboard, push updates over-the-air, and keep your app fully localized."
        primaryCTA="Get started free"
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA="Read the docs"
        secondaryHref="https://docs.better-i18n.com/frameworks/expo"
      />
    </MarketingLayout>
  );
}
