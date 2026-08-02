import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  FrameworkHero,
  FeatureList,
  SetupGuide,
  TabbedCode,
  FrameworkCTA,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/i18n/server")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "serverI18n",
      pathname: "/i18n/server",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Server / Hono",
        frameworkDescription:
          "Server-side internationalization for Hono, Express, Fastify, and edge runtimes with singleton caching.",
        dependencies: ["hono", "@better-i18n/server"],
      },
    });
  },
  component: ServerI18nPage,
});

/* Key suffixes, not copy — resolved with t() in the component. */
const FEATURE_KEYS = [
  "webStandards",
  "nodeAdaptor",
  "acceptLanguage",
  "singletonCache",
  "typeSafe",
  "edgeReady",
];

function ServerI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const setupSteps = [
    {
      step: 1,
      id: "step1",
      code: `npm install @better-i18n/server
# Hono: npm install hono
# Express: npm install express`,
      fileName: "terminal",
    },
    {
      step: 2,
      id: "step2",
      code: `import { createServerI18n } from '@better-i18n/server';

export const i18n = createServerI18n({
  projectId: 'your-org/your-api',
  defaultLocale: 'en',
});`,
      fileName: "i18n.ts",
    },
    {
      step: 3,
      id: "step3",
    },
  ];

  /* Copy from the CDN; the code samples and file names stay in the file
     because they are code, not copy. `id` is the key path segment. */
  const steps = setupSteps.map((step) => ({
    ...step,
    title: t(`i18n.server.setup.${step.id}.title`),
    description: t(`i18n.server.setup.${step.id}.description`),
  }));

  const middlewareTabs = [
    {
      label: "Hono",
      fileName: "app.ts",
      code: `import { Hono } from 'hono';
import { betterI18n } from '@better-i18n/server/hono';
import { i18n } from './i18n';

type Variables = { locale: string; t: Translator };
const app = new Hono<{ Variables: Variables }>();

app.use('*', betterI18n(i18n));

app.get('/api/users/:id', (c) => {
  const t = c.get('t');
  return c.json({ error: t('errors.notFound') }, 404);
});`,
    },
    {
      label: "Express",
      fileName: "server.ts",
      code: `import express from 'express';
import { betterI18nMiddleware } from '@better-i18n/server/node';
import { i18n } from './i18n';

const app = express();
app.use(betterI18nMiddleware(i18n));

app.get('/api/users/:id', (req, res) => {
  res.status(404).json({ error: req.t('errors.notFound') });
});`,
    },
  ];

  const features = FEATURE_KEYS.map((k) => t(`i18n.server.features.${k}`));

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.server.hero.title")}
        subtitle={t("i18n.server.hero.subtitle")}
        badgeText={t("i18n.server.hero.badge")}
      />

      <SetupGuide title={t("i18n.server.setup.title")} steps={steps} />

      <TabbedCode
        title={t("i18n.server.tabbed.title")}
        description={t("i18n.server.tabbed.description")}
        tabs={middlewareTabs}
      />

      <FeatureList
        title={t("i18n.server.featuresTitle")}
        features={features}
      />

      <OtherFrameworks
        title={t("i18n.server.otherFrameworks")}
        currentFramework="server"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.server.cta.title")}
        subtitle={t("i18n.server.cta.subtitle")}
        primaryCTA={t("i18n.server.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.server.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com/frameworks/server"
      />
    </MarketingLayout>
  );
}
