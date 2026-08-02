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
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/i18n/tanstack-start")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "tanstackStartI18n",
      pathname: "/i18n/tanstack-start",
      pageType: "framework",
      structuredDataOptions: {
        framework: "TanStack Start",
        frameworkDescription:
          "TanStack Start internationalization with SSR hydration, file-based routing, and full-stack type safety.",
        dependencies: ["@tanstack/start", "@better-i18n/use-intl", "use-intl"],
      },
    });
  },
  component: TanStackStartI18nPage,
});

/* Key suffixes, not copy — resolved with t() in the component. */
const FEATURE_KEYS = [
  "ssrHydration",
  "noFlash",
  "dynamicLocale",
  "pathRouting",
  "typeSafety",
  "detection",
];

function TanStackStartI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const setupSteps = [
    {
      step: 1,
      id: "step1",
      code: "npm install @better-i18n/use-intl use-intl",
      fileName: "terminal",
    },
    {
      step: 2,
      id: "step2",
      code: `// app/routes/__root.tsx
import { getMessages } from '@better-i18n/use-intl/server';

export const Route = createRootRoute({
  loader: async ({ context }) => {
    const messages = await getMessages({
      projectId: 'your-org/your-project',
      locale: context.locale ?? 'en',
    });
    return { messages, locale: context.locale ?? 'en' };
  },
});`,
      fileName: "app/routes/__root.tsx",
    },
    {
      step: 3,
      id: "step3",
      code: `// app/routes/__root.tsx (continued)
import { BetterI18nProvider } from '@better-i18n/use-intl';

export function RootComponent() {
  const { messages, locale } = Route.useLoaderData();
  return (
    <BetterI18nProvider
      messages={messages}
      locale={locale}
      project="your-org/your-project"
    >
      <Outlet />
    </BetterI18nProvider>
  );
}`,
      fileName: "app/routes/__root.tsx",
    },
    {
      step: 4,
      id: "step4",
      code: `// app/routes/about.tsx
import { useTranslations } from '@better-i18n/use-intl';

export default function AboutPage() {
  const t = useTranslations('pages');
  return (
    <main>
      <h1>{t('about.title')}</h1>
      <p>{t('about.description')}</p>
    </main>
  );
}`,
      fileName: "app/routes/about.tsx",
    },
  ];

  /* Copy from the CDN; the code samples and file names stay in the file
     because they are code, not copy. `id` is the key path segment. */
  const steps = setupSteps.map((step) => ({
    ...step,
    title: t(`i18n.tanstackStart.setup.${step.id}.title`),
    description: t(`i18n.tanstackStart.setup.${step.id}.description`),
  }));

  const features = FEATURE_KEYS.map((k) => t(`i18n.tanstackStart.features.${k}`));

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.tanstackStart.hero.title")}
        subtitle={t("i18n.tanstackStart.hero.subtitle")}
        badgeText={t("i18n.tanstackStart.hero.badge")}
      />

      <SetupGuide title={t("i18n.tanstackStart.setup.title")} steps={steps} />

      <FeatureList
        title={t("i18n.tanstackStart.featuresTitle")}
        features={features}
      />

      <OtherFrameworks
        title={t("i18n.tanstackStart.otherFrameworks")}
        currentFramework="tanstack-start"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.tanstackStart.cta.title")}
        subtitle={t("i18n.tanstackStart.cta.subtitle")}
        primaryCTA={t("i18n.tanstackStart.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.tanstackStart.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com/frameworks/tanstack-start"
      />
    </MarketingLayout>
  );
}
