import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
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

export const Route = createFileRoute("/$locale/i18n/vite")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
      pageKey: "i18nVite",
      pathname: "/i18n/vite",
      pageType: "framework",
      metaFallback: {
        title: "Vite i18n Guide",
        description:
          "Use Better i18n with Vite for typed translations, fast local development, and CDN-delivered locale content.",
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

function ViteI18nPage() {
  const { locale } = Route.useParams();

  const setupSteps = [
    {
      step: 1,
      title: "Install the React-friendly SDK",
      description:
        "For most Vite projects, start with @better-i18n/use-intl and use-intl so translations work in standard component trees.",
      code: "npm install @better-i18n/use-intl use-intl",
      fileName: "terminal",
    },
    {
      step: 2,
      title: "Wrap your app once",
      description:
        "Mount BetterI18nProvider in your Vite entry file so locale data is available before the first render.",
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
      title: "Translate inside components",
      description:
        "Use typed hooks for keys and interpolation while keeping Vite hot reload fast during content iteration.",
      code: `import { useTranslations } from '@better-i18n/use-intl';

export function Hero() {
  const t = useTranslations('landing');

  return <h1>{t('headline')}</h1>;
}`,
      fileName: "src/components/Hero.tsx",
    },
  ];

  const features = [
    "Fast local iteration with Vite HMR while translation keys stay typed",
    "Works well for React, Vue, and other Vite-powered frontends",
    "CDN-delivered messages keep builds lighter and updates faster",
    "Good fit for marketing sites, dashboards, and hybrid app shells",
    "Easy onboarding for teams moving from hand-rolled JSON files",
    "Keeps framework-specific complexity out of your translation workflow",
  ];

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
      <FrameworkHero
        title="Vite i18n without slowing down development"
        subtitle="Use Better i18n with Vite projects to keep hot reload fast, translation keys typed, and locale content easy to ship across app and marketing surfaces."
        badgeText="Vite i18n"
      />

      <SetupGuide title="Get started in 3 steps" steps={setupSteps} />

      <FeatureList title="Why use Better i18n with Vite?" features={features} />

      <CodeExample
        title="Typical Vite setup"
        description="A minimal provider-based setup for Vite apps that need typed translations and fast iteration."
        code={codeExample}
      />

      <ComparisonRelatedTopics
        heading="Related guides"
        links={relatedLinks}
        locale={locale}
      />

      <OtherFrameworks
        title="Other frameworks"
        currentFramework="vite"
        locale={locale}
      />

      <FrameworkCTA
        title="Ship localized Vite apps faster"
        subtitle="Keep your development speed, move translations to a real workflow, and publish updates without hand-editing locale files."
        primaryCTA="Get started free"
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA="Read the docs"
        secondaryHref="https://docs.better-i18n.com/"
      />
    </MarketingLayout>
  );
}
