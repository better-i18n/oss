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

      <FrameworkFAQ
        title="Expo i18n — Frequently Asked Questions"
        items={[
          {
            question: "What is the recommended i18n approach for Expo apps?",
            answer: "The recommended stack is react-i18next + expo-localization + @better-i18n/expo. expo-localization reads the device's language setting, react-i18next provides the t() hook and pluralization engine, and @better-i18n/expo fetches translations from the CDN with offline caching. This combination works in Expo Go without ejecting, supports over-the-air translation updates, and is compatible with both Expo Router and bare React Native projects.",
          },
          {
            question: "How does Better i18n work with Expo Router?",
            answer: "With Expo Router, you wrap your root _layout.tsx with the i18n initialization. Import your i18n.ts file at the top of the root layout — this ensures translations are loaded before any screen renders. Expo Router's file-based routing doesn't require URL-based locale prefixes; locale state is managed globally via i18next and the device locale from expo-localization. The Better i18n CDN delivers translations per locale on demand.",
          },
          {
            question: "Can I push translation updates without an app store release?",
            answer: "Yes. Better i18n's Expo adapter fetches translations from the CDN at runtime. When you publish new or corrected translations in the Better i18n dashboard, the next app launch downloads the updated strings — no new app build required. Translations are cached in AsyncStorage or MMKV so users see the last known translations even when offline. This makes translation hotfixes fast without waiting for App Store or Google Play review.",
          },
          {
            question: "How do I detect and use the device language in Expo?",
            answer: "expo-localization's getLocales() returns an array of the user's preferred locales in priority order. @better-i18n/expo reads this automatically via the useDeviceLocale option in initBetterI18n(). If the top locale is supported by your project, it's used; otherwise it falls back to your defaultLocale. The override chain is: user's explicit language selection → device language → default locale.",
          },
          {
            question: "Does @better-i18n/expo work with MMKV for storage?",
            answer: "Yes. @better-i18n/expo uses a duck-typed storage adapter — you pass any storage object that implements getItem, setItem, and removeItem. For MMKV, use the storageAdapter() helper from @better-i18n/expo and pass your MMKV instance. MMKV is significantly faster than AsyncStorage for large translation files, reducing cold-start time for apps with many languages.",
          },
          {
            question: "How do I handle locale switching without a reload in Expo?",
            answer: "@better-i18n/expo overrides i18next's changeLanguage() method to pre-load the target locale's translations before switching. This prevents the English flash that happens when i18next switches locale before the new translations are ready. The result is a smooth transition — users see the fully translated UI immediately, not a flash of the source language.",
          },
        ]}
      />

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
