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

export const Route = createFileRoute("/$locale/i18n/server")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
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

function ServerI18nPage() {
  const { locale } = Route.useParams();

  const setupSteps = [
    {
      step: 1,
      title: "Install the package",
      description:
        "Install @better-i18n/server. Optionally install Hono or Express depending on your framework.",
      code: `npm install @better-i18n/server
# Hono: npm install hono
# Express: npm install express`,
      fileName: "terminal",
    },
    {
      step: 2,
      title: "Create a singleton",
      description:
        "Instantiate createServerI18n() once at module scope. The TtlCache is shared across all requests — no CDN fetch per request.",
      code: `import { createServerI18n } from '@better-i18n/server';

export const i18n = createServerI18n({
  project: 'your-org/your-api',
  defaultLocale: 'en',
});`,
      fileName: "i18n.ts",
    },
    {
      step: 3,
      title: "Register middleware",
      description:
        "Wire up the middleware for your framework. The middleware reads Accept-Language, resolves the locale, and injects t() into the request context.",
    },
  ];

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

  const features = [
    "Web Standards middleware — Hono, Cloudflare Workers, Deno Deploy",
    "Node.js adaptor — Express, Fastify, Koa via fromNodeHeaders()",
    "Auto Accept-Language — RFC 5646 compliant locale detection",
    "Singleton TtlCache — zero CDN fetches per request after warm-up",
    "Type-safe t() — full TypeScript inference for translation keys",
    "Edge-ready — native Cloudflare Workers support",
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title="Server-Side i18n for Hono, Express & Edge"
        subtitle="Internationalize your API and server-rendered apps. Better i18n provides middleware for Hono, Express, Fastify, and edge runtimes with automatic locale detection."
        badgeText="Server-Side i18n"
      />

      <SetupGuide title="Set up in 3 steps" steps={setupSteps} />

      <TabbedCode
        title="Framework middleware"
        description="Choose your server framework — the middleware API is consistent across Hono and Node.js adapters."
        tabs={middlewareTabs}
      />

      <FeatureList
        title="Why use Better i18n on the server?"
        features={features}
      />

      <OtherFrameworks
        title="Other frameworks"
        currentFramework="server"
        locale={locale}
      />

      <FrameworkCTA
        title="Localize your API responses today"
        subtitle="Serve translated error messages, notifications, and content from your backend with zero overhead."
        primaryCTA="Get started free"
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA="Read the docs"
        secondaryHref="https://docs.better-i18n.com/frameworks/server"
      />
    </MarketingLayout>
  );
}
