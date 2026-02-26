import { createFileRoute, Link } from "@tanstack/react-router";
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

export const Route = createFileRoute("/$locale/i18n/react-intl")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "reactIntl",
      pathname: "/i18n/react-intl",
      pageType: "framework",
      structuredDataOptions: {
        framework: "react-intl",
        frameworkDescription:
          "Guide to react-intl (FormatJS): FormattedMessage, useIntl hook, and integration with Better i18n translation management.",
      },
    });
  },
  component: ReactIntlPage,
});

function ReactIntlPage() {
  const t = useTranslations("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.reactIntl.features.formattedMessage", { defaultValue: "FormattedMessage component for declarative translations" }),
    t("i18n.reactIntl.features.useIntlHook", { defaultValue: "useIntl hook for imperative access to intl messages" }),
    t("i18n.reactIntl.features.pluralization", { defaultValue: "ICU message syntax for pluralization and select" }),
    t("i18n.reactIntl.features.dateTime", { defaultValue: "Built-in date, time, and number formatting" }),
    t("i18n.reactIntl.features.richText", { defaultValue: "Rich text formatting with embedded HTML" }),
    t("i18n.reactIntl.features.typeScript", { defaultValue: "TypeScript support with message type extraction" }),
    t("i18n.reactIntl.features.ssr", { defaultValue: "Server-side rendering support" }),
    t("i18n.reactIntl.features.performance", { defaultValue: "Lazy loading and code splitting for messages" }),
    t("i18n.reactIntl.features.tooling", { defaultValue: "CLI tooling for message extraction and compilation" }),
  ];

  const formattedMessageExample = `import { FormattedMessage, useIntl } from 'react-intl';

// Using FormattedMessage component
function Welcome() {
  return (
    <h1>
      <FormattedMessage
        id="welcome.title"
        defaultMessage="Welcome, {name}!"
        values={{ name: 'World' }}
      />
    </h1>
  );
}

// Using useIntl hook
function SearchBox() {
  const intl = useIntl();
  return (
    <input
      placeholder={intl.formatMessage({
        id: 'search.placeholder',
        defaultMessage: 'Search...',
      })}
    />
  );
}`;

  const relatedPages = [
    { name: "React i18n", href: "/$locale/i18n/react", description: t("i18n.reactIntl.related.react", { defaultValue: "Complete React internationalization guide" }) },
    { name: "Next.js i18n", href: "/$locale/i18n/nextjs", description: t("i18n.reactIntl.related.nextjs", { defaultValue: "i18n for Next.js App Router" }) },
    { name: "Best i18n Library", href: "/$locale/i18n/best-library", description: t("i18n.reactIntl.related.bestLibrary", { defaultValue: "Compare React i18n libraries" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <FrameworkHero
        framework="react-intl"
        title={t("i18n.reactIntl.hero.title", { defaultValue: "react-intl Guide: Internationalize React with FormatJS" })}
        subtitle={t("i18n.reactIntl.hero.subtitle", { defaultValue: "react-intl (part of FormatJS) provides React components and hooks for internationalization using the ICU message format. Learn how to use FormattedMessage, the useIntl hook, and integrate with Better i18n for a complete react intl workflow." })}
        badgeText="react-intl"
      />

      <FeatureList
        title={t("i18n.reactIntl.featuresTitle", { defaultValue: "react-intl Features" })}
        features={features}
      />

      {/* react-intl vs Better i18n */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mb-12">
            <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1]">
              {t("i18n.reactIntl.integrationTitle", { defaultValue: "Using react-intl with Better i18n" })}
            </h2>
            <p className="mt-4 text-mist-600">
              {t("i18n.reactIntl.integrationSubtitle", { defaultValue: "Better i18n works seamlessly alongside react-intl. Use react-intl for rendering and Better i18n for managing translations, AI-powered translation, and deployment." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="p-6 rounded-2xl border border-mist-200 bg-mist-50/50">
              <h3 className="text-lg font-medium text-mist-950 mb-2">
                {t("i18n.reactIntl.reactIntlRole.title", { defaultValue: "react-intl handles rendering" })}
              </h3>
              <p className="text-sm text-mist-600 mb-4">
                {t("i18n.reactIntl.reactIntlRole.description", { defaultValue: "FormattedMessage, useIntl, date/number formatting, pluralization, and ICU message syntax in your React components." })}
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-mist-200 bg-mist-50/50">
              <h3 className="text-lg font-medium text-mist-950 mb-2">
                {t("i18n.reactIntl.betterI18nRole.title", { defaultValue: "Better i18n handles management" })}
              </h3>
              <p className="text-sm text-mist-600 mb-4">
                {t("i18n.reactIntl.betterI18nRole.description", { defaultValue: "Translation management, AI-powered translations, team collaboration, glossary, and instant CDN deployment of your intl messages." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CodeExample
        title={t("i18n.reactIntl.codeExample.title", { defaultValue: "react-intl Example: FormattedMessage & useIntl" })}
        description={t("i18n.reactIntl.codeExample.description", { defaultValue: "Here's how to use react-intl's FormattedMessage component and useIntl hook in a React application." })}
        code={formattedMessageExample}
      />

      <RelatedPages
        title={t("i18n.reactIntl.relatedTitle", { defaultValue: "Related Guides" })}
        pages={relatedPages}
        locale={locale}
      />

      <OtherFrameworks
        title={t("i18n.reactIntl.otherFrameworks", { defaultValue: "Other Framework Guides" })}
        currentFramework="react"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.reactIntl.cta.title", { defaultValue: "Manage Your react-intl Translations" })}
        subtitle={t("i18n.reactIntl.cta.subtitle", { defaultValue: "Better i18n provides the translation management layer for react-intl projects. AI translations, team collaboration, and instant deployment." })}
        primaryCTA={t("i18n.reactIntl.cta.primary", { defaultValue: "Start Free" })}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.reactIntl.cta.secondary", { defaultValue: "Read the Docs" })}
        secondaryHref="https://docs.better-i18n.com"
      />
    </MarketingLayout>
  );
}
