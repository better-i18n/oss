import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import {
  FrameworkHero,
  FeatureList,
  CodeExample,
  FrameworkCTA,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/i18n/javascript")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nJavaScript",
      pathname: "/i18n/javascript",
      pageType: "framework",
      structuredDataOptions: {
        framework: "JavaScript",
        frameworkDescription:
          "JavaScript internationalization with the Intl API, ICU MessageFormat, and library-agnostic i18n patterns.",
        dependencies: ["@better-i18n/js"],
      },
    });
  },
  component: JavaScriptI18nPage,
});

function JavaScriptI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.javascript.features.intlApi"),
    t("i18n.javascript.features.numberFormat"),
    t("i18n.javascript.features.dateTimeFormat"),
    t("i18n.javascript.features.pluralRules"),
    t("i18n.javascript.features.messageFormat"),
    t("i18n.javascript.features.relativeTime"),
    t("i18n.javascript.features.listFormat"),
    t("i18n.javascript.features.collator"),
    t("i18n.javascript.features.segmenter"),
  ];

  const codeExample = `// Using the built-in Intl API
const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});
console.log(formatter.format(1234.56)); // "1.234,56 €"

// Date formatting
const date = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
console.log(date.format(new Date())); // "2026年3月2日"

// Pluralization
const plural = new Intl.PluralRules('en');
const suffixes = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
function ordinal(n) {
  return \`\${n}\${suffixes[plural.select(n)]}\`;
}`;

  const relatedLinks = [
    {
      title: "React i18n",
      to: "/$locale/i18n/react",
      description: t("i18n.javascript.related.react"),
    },
    {
      title: "Next.js i18n",
      to: "/$locale/i18n/nextjs",
      description: t("i18n.javascript.related.nextjs"),
    },
    {
      title: t("i18n.javascript.related.comparisons"),
      to: "/$locale/compare",
      description: t("i18n.javascript.related.comparisonsDesc"),
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <FrameworkHero
        title={t("i18n.javascript.hero.title")}
        subtitle={t("i18n.javascript.hero.subtitle")}
        badgeText="JavaScript i18n"
      />

      <FeatureList
        title={t("i18n.javascript.featuresTitle")}
        features={features}
      />

      <CodeExample
        title={t("i18n.javascript.codeExample.title")}
        description={t("i18n.javascript.codeExample.description")}
        code={codeExample}
      />

      <ComparisonRelatedTopics
        heading={t("i18n.javascript.relatedTitle")}
        links={relatedLinks}
        locale={locale}
      />

      <OtherFrameworks
        title={t("i18n.javascript.otherFrameworks")}
        currentFramework="javascript"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.javascript.cta.title")}
        subtitle={t("i18n.javascript.cta.subtitle")}
        primaryCTA={t("i18n.javascript.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.javascript.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com"
      />
    </MarketingLayout>
  );
}
