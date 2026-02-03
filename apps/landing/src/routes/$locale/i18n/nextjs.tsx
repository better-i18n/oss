import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import {
  FrameworkHero,
  FeatureList,
  CodeExample,
  RelatedPages,
  FrameworkCTA,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";

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
      },
    });
  },
  component: NextjsI18nPage,
});

function NextjsI18nPage() {
  const t = useTranslations("marketing");
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

  const relatedPages = [
    { name: "React i18n", href: "/$locale/i18n/react", description: t("i18n.nextjs.related.react") },
    { name: "next-intl Alternative", href: "/$locale/compare", description: t("i18n.nextjs.related.nextIntl") },
    { name: t("i18n.nextjs.related.docs"), href: "https://docs.better-i18n.com/frameworks/nextjs", description: t("i18n.nextjs.related.docsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <FrameworkHero
        framework="Next.js"
        title={t("i18n.nextjs.hero.title")}
        subtitle={t("i18n.nextjs.hero.subtitle")}
        badgeText="Next.js i18n"
      />

      <FeatureList title={t("i18n.nextjs.featuresTitle")} features={features} />

      <CodeExample
        title={t("i18n.nextjs.codeExample.title")}
        description={t("i18n.nextjs.codeExample.description")}
        code={codeExample}
      />

      <RelatedPages title={t("i18n.nextjs.relatedTitle")} pages={relatedPages} locale={locale} />

      <OtherFrameworks
        title={t("i18n.react.otherFrameworks")}
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
