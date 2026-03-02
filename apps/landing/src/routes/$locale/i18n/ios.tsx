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

export const Route = createFileRoute("/$locale/i18n/ios")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nIOS",
      pathname: "/i18n/ios",
      pageType: "framework",
      structuredDataOptions: {
        framework: "iOS",
        frameworkDescription:
          "iOS localization with String Catalogs, SwiftUI localization support, and Xcode export/import workflows.",
        dependencies: ["xcode", "@better-i18n/cli"],
      },
    });
  },
  component: IOSI18nPage,
});

function IOSI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.ios.features.stringCatalogs"),
    t("i18n.ios.features.swiftUI"),
    t("i18n.ios.features.pluralization"),
    t("i18n.ios.features.xcloc"),
    t("i18n.ios.features.storyboard"),
    t("i18n.ios.features.autoLayout"),
    t("i18n.ios.features.rtlSupport"),
    t("i18n.ios.features.formatters"),
    t("i18n.ios.features.bundleLocalization"),
  ];

  const codeExample = `// SwiftUI - Automatic localization
struct WelcomeView: View {
    let name: String

    var body: some View {
        VStack {
            // Automatically looks up "Welcome to %@" in String Catalog
            Text("Welcome to \\(name)")

            // Pluralization via String Catalog
            Text("^[\\(itemCount) item](inflect: true)")

            // Date formatting respects locale
            Text(Date.now, format: .dateTime.month(.wide).day())
        }
    }
}

// Localizable.xcstrings (String Catalog)
// Managed in Xcode - supports:
// - Automatic extraction from SwiftUI
// - Pluralization rules per locale
// - String variation by device
// - Translation state tracking`;

  const relatedLinks = [
    {
      title: "Android Localization",
      to: "/$locale/i18n/android",
      description: t("i18n.ios.related.android"),
    },
    {
      title: "Expo i18n",
      to: "/$locale/i18n/expo",
      description: t("i18n.ios.related.expo"),
    },
    {
      title: t("i18n.ios.related.comparisons"),
      to: "/$locale/compare",
      description: t("i18n.ios.related.comparisonsDesc"),
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <FrameworkHero
        title={t("i18n.ios.hero.title")}
        subtitle={t("i18n.ios.hero.subtitle")}
        badgeText="iOS i18n"
      />

      <FeatureList
        title={t("i18n.ios.featuresTitle")}
        features={features}
      />

      <CodeExample
        title={t("i18n.ios.codeExample.title")}
        description={t("i18n.ios.codeExample.description")}
        code={codeExample}
      />

      <ComparisonRelatedTopics
        heading={t("i18n.ios.relatedTitle")}
        links={relatedLinks}
        locale={locale}
      />

      <OtherFrameworks
        title={t("i18n.ios.otherFrameworks")}
        currentFramework="ios"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.ios.cta.title")}
        subtitle={t("i18n.ios.cta.subtitle")}
        primaryCTA={t("i18n.ios.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.ios.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com"
      />
    </MarketingLayout>
  );
}
