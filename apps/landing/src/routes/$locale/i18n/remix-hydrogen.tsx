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

export const Route = createFileRoute("/$locale/i18n/remix-hydrogen")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
      pageKey: "i18nRemixHydrogen",
      pathname: "/i18n/remix-hydrogen",
      pageType: "framework",
      metaFallback: {
        title: "Remix & Hydrogen i18n Guide",
        description:
          "Use Better i18n with Remix and Shopify Hydrogen for localized route trees, server-loaded locale state, and SEO-friendly storefront content.",
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

function RemixHydrogenI18nPage() {
  const { locale } = Route.useParams();

  const setupSteps = [
    {
      step: 1,
      title: "Install the app-side SDK",
      description:
        "Use the provider-based SDK in your Remix or Hydrogen app so translated content can be shared across route modules.",
      code: "npm install @better-i18n/use-intl use-intl",
      fileName: "terminal",
    },
    {
      step: 2,
      title: "Resolve locale on the server",
      description:
        "Read locale from request, route params, or storefront context and pass it into your app root.",
      code: `export async function loader({ request }: LoaderFunctionArgs) {
  const locale = resolveLocaleFromRequest(request);

  return json({ locale });
}`,
      fileName: "app/root.tsx",
    },
    {
      step: 3,
      title: "Hydrate the provider in the root route",
      description:
        "Provide the locale once so nested routes, product pages, and cart UI all share the same translation source.",
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

  const features = [
    "Server-loaded locale handling that fits Remix loaders and Hydrogen storefront flows",
    "Good fit for SEO-sensitive category, product, and content pages",
    "One translation workflow for storefront UI, account pages, and marketing routes",
    "Supports route-based locale strategies without fragile file duplication",
    "Lets developers ship localized storefront updates without blocking on redeploys",
    "Keeps comparison and buyer-intent content aligned with product localization pages",
  ];

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
        title="Remix & Hydrogen i18n for storefront and route-driven apps"
        subtitle="Use Better i18n to keep server-rendered locale state, localized storefront content, and search-facing routes aligned in one workflow."
        badgeText="Remix & Hydrogen i18n"
      />

      <SetupGuide title="Get started in 3 steps" steps={setupSteps} />

      <FeatureList
        title="Why use Better i18n with Remix and Hydrogen?"
        features={features}
      />

      <CodeExample
        title="Route-level locale wiring"
        description="A provider-based setup that fits loader-driven frameworks and storefront route trees."
        code={codeExample}
      />

      <ComparisonRelatedTopics
        heading="Related guides"
        links={relatedLinks}
        locale={locale}
      />

      <OtherFrameworks
        title="Other frameworks"
        currentFramework="remix-hydrogen"
        locale={locale}
      />

      <FrameworkCTA
        title="Ship localized storefronts without fragmented workflows"
        subtitle="Keep server locale handling, product content, and buyer-intent pages in one localization system."
        primaryCTA="Get started free"
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA="Read the docs"
        secondaryHref="https://docs.better-i18n.com/"
      />
    </MarketingLayout>
  );
}
