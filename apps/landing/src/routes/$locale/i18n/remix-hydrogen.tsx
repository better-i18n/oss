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

export const Route = createFileRoute("/$locale/i18n/remix-hydrogen")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nRemixHydrogen",
      pathname: "/i18n/remix-hydrogen",
      pageType: "framework",
      metaFallback: {
        title: "Remix & Hydrogen i18n Guide",
        description:
          "Use Better I18N with Remix and Shopify Hydrogen for localized route trees, server-loaded locale state, and SEO-friendly storefront content.",
      },
      structuredDataOptions: {
        framework: "Remix & Hydrogen",
        frameworkDescription:
          "Remix and Shopify Hydrogen internationalization with server-loaded locale state, route-driven UX, and search-friendly localized content.",
        dependencies: ["remix", "shopify hydrogen", "@better-i18n/use-intl"],
      },
    }),
  component: RemixHydrogenI18nPage,
});

/* Key suffixes, not copy — resolved with t() in the component. */
const FEATURE_KEYS = [
  "loaders",
  "seoPages",
  "oneWorkflow",
  "routeStrategies",
  "noRedeploy",
  "buyerIntent",
];

function RemixHydrogenI18nPage() {
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
      code: `export async function loader({ request }: LoaderFunctionArgs) {
  const locale = resolveLocaleFromRequest(request);

  return json({ locale });
}`,
      fileName: "app/root.tsx",
    },
    {
      step: 3,
      id: "step3",
      code: `export default function App() {
  const { locale } = useLoaderData<typeof loader>();

  return (
    <BetterI18nProvider project="your-org/your-storefront" locale={locale}>
      <Outlet />
    </BetterI18nProvider>
  );
}`,
      fileName: "app/root.tsx",
    },
  ];

  /* Copy from the CDN; the code samples and file names stay in the file
     because they are code, not copy. `id` is the key path segment. */
  const steps = setupSteps.map((step) => ({
    ...step,
    title: t(`i18n.remixHydrogen.setup.${step.id}.title`),
    description: t(`i18n.remixHydrogen.setup.${step.id}.description`),
  }));

  const features = FEATURE_KEYS.map((k) => t(`i18n.remixHydrogen.features.${k}`));

  const codeExample = `import { BetterI18nProvider, useTranslations } from '@better-i18n/use-intl';

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    locale: resolveLocaleFromRequest(request),
  });
}

function ProductHero() {
  const t = useTranslations('product');
  return <h1>{t('title')}</h1>;
}

export default function App() {
  const { locale } = useLoaderData<typeof loader>();

  return (
    <BetterI18nProvider project="your-org/your-storefront" locale={locale}>
      <ProductHero />
      <Outlet />
    </BetterI18nProvider>
  );
}`;

  const relatedLinks = [
    {
      title: "Server-Side i18n",
      to: "/$locale/i18n/server",
      description: "Middleware and server patterns for backend and edge runtimes.",
    },
    {
      title: "Next.js i18n",
      to: "/$locale/i18n/nextjs",
      description: "A parallel path for teams comparing full-stack React frameworks.",
    },
    {
      title: "Best TMS",
      to: "/$locale/i18n/best-tms",
      description: "Capture high-intent buyers comparing localization platforms and workflows.",
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.remixHydrogen.hero.title")}
        subtitle={t("i18n.remixHydrogen.hero.subtitle")}
        badgeText={t("i18n.remixHydrogen.hero.badge")}
      />

      <SetupGuide title={t("i18n.remixHydrogen.setup.title")} steps={steps} />

      <FeatureList
        title={t("i18n.remixHydrogen.featuresTitle")}
        features={features}
      />

      <CodeExample
        title={t("i18n.remixHydrogen.codeExample.title")}
        description={t("i18n.remixHydrogen.codeExample.description")}
        code={codeExample}
      />

      <ComparisonRelatedTopics
        heading={t("i18n.remixHydrogen.relatedTitle")}
        links={relatedLinks}
        locale={locale}
      />

      <OtherFrameworks
        title={t("i18n.remixHydrogen.otherFrameworks")}
        currentFramework="remix-hydrogen"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.remixHydrogen.cta.title")}
        subtitle={t("i18n.remixHydrogen.cta.subtitle")}
        primaryCTA={t("i18n.remixHydrogen.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.remixHydrogen.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com/"
      />
    </MarketingLayout>
  );
}
