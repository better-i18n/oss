import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  CodeExample,
  FeatureList,
  FrameworkCTA,
  FrameworkHero,
  OtherFrameworks,
  SetupGuide,
} from "@/components/FrameworkComparison";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { createPageLoader, getPageHead } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/i18n/vite")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nVite",
      pathname: "/i18n/vite",
      pageType: "framework",
      metaFallback: {
        title: "Vite i18n Guide",
        description:
          "Use Better I18N with Vite for typed translations, fast local development, and CDN-delivered locale content.",
      },
      structuredDataOptions: {
        framework: "Vite",
        frameworkDescription:
          "Vite internationalization for React, Vue, and SPA projects with fast local development and CDN-delivered translations.",
        dependencies: ["vite", "@better-i18n/use-intl"],
      },
    }),
  component: ViteI18nPage,
});

/* Key suffixes, not copy — resolved with t() in the component. */
const FEATURE_KEYS = [
  "hmr",
  "frameworks",
  "cdn",
  "useCases",
  "onboarding",
  "simplicity",
];

function ViteI18nPage() {
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
      code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BetterI18nProvider } from '@better-i18n/use-intl';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BetterI18nProvider project="your-org/your-project" locale="en">
    <App />
  </BetterI18nProvider>
);`,
      fileName: "src/main.tsx",
    },
    {
      step: 3,
      id: "step3",
      code: `import { useTranslations } from '@better-i18n/use-intl';

export function Hero() {
  const t = useTranslations('landing');

  return <h1>{t('headline')}</h1>;
}`,
      fileName: "src/components/Hero.tsx",
    },
  ];

  /* Copy from the CDN; the code samples and file names stay in the file
     because they are code, not copy. `id` is the key path segment. */
  const steps = setupSteps.map((step) => ({
    ...step,
    title: t(`i18n.vite.setup.${step.id}.title`),
    description: t(`i18n.vite.setup.${step.id}.description`),
  }));

  const features = FEATURE_KEYS.map((k) => t(`i18n.vite.features.${k}`));

  const codeExample = `import { BetterI18nProvider, useTranslations } from '@better-i18n/use-intl';

function LandingHero() {
  const t = useTranslations('landing');

  return (
    <section>
      <h1>{t('headline')}</h1>
      <p>{t('subheadline')}</p>
    </section>
  );
}

export default function App() {
  return (
    <BetterI18nProvider project="your-org/your-project" locale="en">
      <LandingHero />
    </BetterI18nProvider>
  );
}`;

  const relatedLinks = [
    {
      title: "JavaScript i18n",
      to: "/$locale/i18n/javascript",
      description: "Library-agnostic patterns for browser-side internationalization.",
    },
    {
      title: "Next.js i18n",
      to: "/$locale/i18n/nextjs",
      description: "When your Vite app grows into server-rendered routing and SEO needs.",
    },
    {
      title: "CLI Code Scanning",
      to: "/$locale/i18n/cli-code-scanning",
      description: "Automatically detect and audit translation keys in fast-moving frontends.",
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.vite.hero.title")}
        subtitle={t("i18n.vite.hero.subtitle")}
        badgeText={t("i18n.vite.hero.badge")}
      />

      <SetupGuide title={t("i18n.vite.setup.title")} steps={steps} />

      <FeatureList title={t("i18n.vite.featuresTitle")} features={features} />

      <CodeExample
        title={t("i18n.vite.codeExample.title")}
        description={t("i18n.vite.codeExample.description")}
        code={codeExample}
      />

      <ComparisonRelatedTopics
        heading={t("i18n.vite.relatedTitle")}
        links={relatedLinks}
        locale={locale}
      />

      <OtherFrameworks
        title={t("i18n.vite.otherFrameworks")}
        currentFramework="vite"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.vite.cta.title")}
        subtitle={t("i18n.vite.cta.subtitle")}
        primaryCTA={t("i18n.vite.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.vite.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com/"
      />
    </MarketingLayout>
  );
}
