import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import {
  FrameworkHero,
  FeatureList,
  CodeExample,
  SetupGuide,
  FrameworkCTA,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/i18n/nextjs")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nNextjs",
      pathname: "/i18n/nextjs",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Next.js",
        frameworkDescription: "Next.js internationalization with App Router, Server Components, ISR, and edge CDN delivery.",
        dependencies: ["next", "react", "@better-i18n/use-intl"],
      },
    });
  },
  component: NextjsI18nPage,
});

function NextjsI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.nextjs.features.appRouter"),
    t("i18n.nextjs.features.middleware"),
    t("i18n.nextjs.features.serverComponents"),
    t("i18n.nextjs.features.staticGeneration"),
    t("i18n.nextjs.features.isr"),
    t("i18n.nextjs.features.typesafe"),
    t("i18n.nextjs.features.cdn"),
    t("i18n.nextjs.features.seo"),
    t("i18n.nextjs.features.routing"),
  ];

  const nextjsSetupSteps = [
    {
      step: 1,
      title: "Install",
      description:
        "Add @better-i18n/use-intl, use-intl, and the Next.js adapter to your project.",
      code: "npm install @better-i18n/use-intl use-intl",
      fileName: "terminal",
    },
    {
      step: 2,
      title: "Add middleware for locale detection",
      description:
        "The middleware reads the Accept-Language header and URL prefix to detect the user's locale and redirect accordingly.",
      code: `import { betterI18nMiddleware } from '@better-i18n/next';
export const middleware = betterI18nMiddleware;
export const config = { matcher: ['/((?!api|_next).*)'] };`,
      fileName: "middleware.ts",
    },
    {
      step: 3,
      title: "Load messages in a Server Component",
      description:
        "Use getMessages() in your root layout to fetch translations server-side and pass them to BetterI18nProvider.",
      code: `// app/[locale]/layout.tsx
import { BetterI18nProvider } from '@better-i18n/use-intl';
import { getMessages } from '@better-i18n/use-intl/server';

export default async function RootLayout({ children, params }) {
  const messages = await getMessages({
    project: 'your-org/your-project',
    locale: params.locale,
  });
  return (
    <html lang={params.locale}>
      <body>
        <BetterI18nProvider messages={messages} locale={params.locale} project="your-org/your-project">
          {children}
        </BetterI18nProvider>
      </body>
    </html>
  );
}`,
      fileName: "app/[locale]/layout.tsx",
    },
    {
      step: 4,
      title: "Use translations in Client Components",
      description:
        "Call useTranslations() in any Client Component. Messages are already hydrated from the server — no extra fetch.",
      code: `'use client';
import { useTranslations } from '@better-i18n/use-intl';

export function HeroSection() {
  const t = useTranslations('home');
  return <h1>{t('title')}</h1>;
}`,
      fileName: "components/HeroSection.tsx",
    },
  ];

  const middlewareCode = `// middleware.ts — locale detection
import { betterI18nMiddleware } from '@better-i18n/next'
export const middleware = betterI18nMiddleware
export const config = { matcher: ['/((?!api|_next).*)'] }`;

  const codeExample = `// app/[locale]/page.tsx
import { getTranslations } from '@better-i18n/next';

export default async function Page({ params }: { params: { locale: string } }) {
  const t = await getTranslations(params.locale, 'home');

  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </main>
  );
}`;

  const relatedLinks = [
    { title: "React i18n", to: "/$locale/i18n/react", description: t("i18n.nextjs.related.react") },
    { title: "next-intl Alternative", to: "/$locale/compare", description: t("i18n.nextjs.related.nextIntl") },
    { title: t("i18n.nextjs.related.docs"), to: "https://docs.better-i18n.com/frameworks/nextjs", description: t("i18n.nextjs.related.docsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <FrameworkHero
        title={t("i18n.nextjs.hero.title")}
        subtitle={t("i18n.nextjs.hero.subtitle")}
        badgeText="Next.js i18n"
      />

      <SetupGuide title="Set up in 4 steps" steps={nextjsSetupSteps} />

      <FeatureList title={t("i18n.nextjs.featuresTitle")} features={features} />

      <CodeExample
        title="Middleware Setup"
        description="Add locale detection and routing to your Next.js app with a single middleware file."
        code={middlewareCode}
      />

      <CodeExample
        title={t("i18n.nextjs.codeExample.title")}
        description={t("i18n.nextjs.codeExample.description")}
        code={codeExample}
      />

      <ComparisonRelatedTopics heading={t("i18n.nextjs.relatedTitle")} links={relatedLinks} locale={locale} />

      <OtherFrameworks
        title={t("i18n.nextjs.otherFrameworks")}
        currentFramework="nextjs"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.nextjs.cta.title")}
        subtitle={t("i18n.nextjs.cta.subtitle")}
        primaryCTA={t("i18n.nextjs.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.nextjs.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com/frameworks/nextjs"
      />
    </MarketingLayout>
  );
}
