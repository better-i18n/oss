import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import {
  FrameworkHero,
  FeatureList,
  SetupGuide,
  FrameworkCTA,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { getPageHead, createPageLoader } from "@/lib/page-seo";

export const Route = createFileRoute("/$locale/i18n/tanstack-start")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
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

function TanStackStartI18nPage() {
  const { locale } = Route.useParams();

  const setupSteps = [
    {
      step: 1,
      title: "Install packages",
      description:
        "Install @better-i18n/use-intl and use-intl. No additional build plugins or Babel transforms required.",
      code: "npm install @better-i18n/use-intl use-intl",
      fileName: "terminal",
    },
    {
      step: 2,
      title: "Load messages server-side",
      description:
        "Fetch translations in the root loader so they are available on the very first server render. No separate API call from the client.",
      code: `// app/routes/__root.tsx
import { getMessages } from '@better-i18n/use-intl/server';

export const Route = createRootRoute({
  loader: async ({ context }) => {
    const messages = await getMessages({
      project: 'your-org/your-project',
      locale: context.locale ?? 'en',
    });
    return { messages, locale: context.locale ?? 'en' };
  },
});`,
      fileName: "app/routes/__root.tsx",
    },
    {
      step: 3,
      title: "Wrap with BetterI18nProvider",
      description:
        "Pass the loader data into BetterI18nProvider. The provider hydrates the client with the same messages loaded on the server.",
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
      title: "Use in routes",
      description:
        "Call useTranslations() in any route component. The same hook works on both client and server components.",
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

  const features = [
    "SSR hydration — server-loaded messages hydrate client without re-fetch",
    "No content flash — translated content on the very first render",
    "Dynamic locale — language list from CDN manifest, no hardcoding",
    "Path-based routing — /tr/about, /de/about URL structure",
    "Full-stack type safety — loader and component share the same type system",
    "Cookie + header detection — URL → cookie → Accept-Language fallback chain",
  ];

  return (
    <MarketingLayout showCTA={false}>
      <FrameworkHero
        title="TanStack Start i18n — Full-Stack Localization"
        subtitle="Add internationalization to your TanStack Start app with SSR support, automatic locale detection, and type-safe translations that work on both client and server."
        badgeText="TanStack Start i18n"
      />

      <SetupGuide title="Set up in 4 steps" steps={setupSteps} />

      <FeatureList
        title="Why use Better i18n with TanStack Start?"
        features={features}
      />

      <OtherFrameworks
        title="Other frameworks"
        currentFramework="tanstack-start"
        locale={locale}
      />

      <FrameworkCTA
        title="Build a multilingual TanStack Start app"
        subtitle="Manage all your translations in one dashboard with AI-powered suggestions, context-aware translations, and CDN delivery."
        primaryCTA="Get started free"
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA="Read the docs"
        secondaryHref="https://docs.better-i18n.com/frameworks/tanstack-start"
      />
    </MarketingLayout>
  );
}
