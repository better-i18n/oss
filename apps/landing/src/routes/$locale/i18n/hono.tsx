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

/**
 * `/i18n/hono/` — a search gap with a real product behind it.
 *
 * GSC shows 21 impressions for "hono i18n" and no page of ours to receive them;
 * GitHub shows no established answer either (the only match, `serhat-m/hono-i18n`,
 * has 4 stars). Unlike the astro / "i18n json" / open-source-TMS queries, there
 * is no blog post of ours already ranking here, so this page cannibalises
 * nothing.
 *
 * Every sample below is lifted from shipping code, not invented:
 *   - `betterI18n(i18n)` and the `c.get("t")` pattern are `packages/server/src/hono.ts`
 *   - the `OpenAPIHono<{ Variables: { locale, t } }>` wiring is
 *     `apps/hono-example/src/index.ts`
 */
export const Route = createFileRoute("/$locale/i18n/hono")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nHono",
      pathname: "/i18n/hono",
      pageType: "framework",
      metaFallback: {
        title: "Hono i18n Guide",
        description:
          "Localize a Hono API with Better I18N: one middleware detects the request locale and injects a translator into every route handler, with messages served from the CDN.",
      },
      structuredDataOptions: {
        framework: "Hono",
        frameworkDescription:
          "Hono internationalization for edge and Node APIs — locale detection from request headers and translated responses without a rebuild.",
        dependencies: ["hono", "@better-i18n/server"],
      },
    }),
  component: HonoI18nPage,
});

/* Key suffixes, not copy — resolved with t() in the component. */
const FEATURE_KEYS = [
  "middleware",
  "webStandards",
  "edge",
  "singleton",
  "cdn",
  "typed",
];

function HonoI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const setupSteps = [
    {
      step: 1,
      id: "step1",
      code: "npm install hono @better-i18n/server",
      fileName: "terminal",
    },
    {
      step: 2,
      id: "step2",
      code: `import { createServerI18n } from '@better-i18n/server';

// Module scope, not per request: the TtlCache is shared across requests.
export const i18n = createServerI18n({
  project: 'your-org/your-project',
  defaultLocale: 'en',
});`,
      fileName: "src/i18n.ts",
    },
    {
      step: 3,
      id: "step3",
      code: `import { Hono } from 'hono';
import { betterI18n } from '@better-i18n/server/hono';
import type { Translator } from '@better-i18n/server';
import { i18n } from './i18n';

const app = new Hono<{
  Variables: { locale: string; t: Translator };
}>();

app.use('*', betterI18n(i18n));

app.get('/users/:id', (c) => {
  const t = c.get('t');
  return c.json({ error: t('errors.notFound') }, 404);
});

export default app;`,
      fileName: "src/index.ts",
    },
  ];

  const steps = setupSteps.map((step) => ({
    ...step,
    title: t(`i18n.hono.setup.${step.id}.title`),
    description: t(`i18n.hono.setup.${step.id}.description`),
  }));

  const features = FEATURE_KEYS.map((k) => t(`i18n.hono.features.${k}`));

  /* Straight from apps/hono-example/src/index.ts — the middleware runs once and
     every handler after it reads `locale` and `t` off the context. */
  const codeExample = `import { OpenAPIHono } from '@hono/zod-openapi';
import { betterI18n } from '@better-i18n/server/hono';
import type { Translator } from '@better-i18n/server';
import { i18n } from './i18n';

const app = new OpenAPIHono<{
  Variables: { locale: string; t: Translator };
}>();

// Detect locale + inject \`locale\` and \`t\` into every request context
app.use('*', betterI18n(i18n));

app.get('/greeting', (c) => {
  const t = c.get('t');
  const locale = c.get('locale');

  return c.json({
    locale,
    message: t('greeting.hello'),
  });
});

export default app;`;

  const relatedLinks = [
    {
      title: "Server-side i18n",
      to: "/$locale/i18n/server",
      description:
        "The Node and framework-agnostic side of the same package, including the raw adapter.",
    },
    {
      title: "TanStack Start i18n",
      to: "/$locale/i18n/tanstack-start",
      description:
        "The full-stack side: the same messages consumed by a server-rendered React app.",
    },
    {
      title: "JavaScript i18n",
      to: "/$locale/i18n/javascript",
      description:
        "Library-agnostic patterns for the client that talks to this API.",
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.hono.hero.title")}
        subtitle={t("i18n.hono.hero.subtitle")}
        badgeText={t("i18n.hono.hero.badge")}
      />

      <SetupGuide title={t("i18n.hono.setup.title")} steps={steps} />

      <FeatureList title={t("i18n.hono.featuresTitle")} features={features} />

      <CodeExample
        title={t("i18n.hono.codeExample.title")}
        description={t("i18n.hono.codeExample.description")}
        code={codeExample}
      />

      <ComparisonRelatedTopics
        heading={t("i18n.hono.relatedTitle")}
        links={relatedLinks}
        locale={locale}
      />

      <OtherFrameworks
        title={t("i18n.hono.otherFrameworks")}
        currentFramework="hono"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.hono.cta.title")}
        subtitle={t("i18n.hono.cta.subtitle")}
        primaryCTA={t("i18n.hono.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.hono.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com/"
      />
    </MarketingLayout>
  );
}
