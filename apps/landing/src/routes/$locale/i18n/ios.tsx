import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  FrameworkHero,
  FeatureList,
  CodeExample,
  FrameworkCTA,
  FrameworkFAQ,
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
      <BackToHub hub="i18n" locale={locale} />
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

      <FrameworkFAQ
        title="iOS Localization — Frequently Asked Questions"
        items={[
          {
            question: "What is the recommended approach for iOS localization in 2026?",
            answer: "Apple's recommended approach is String Catalogs (.xcstrings), introduced in Xcode 15. String Catalogs replace the older .strings and .stringsdict files with a single JSON-based file that supports all plural rules, device-specific variants, and string variations. Xcode automatically extracts localizable strings from your Swift and SwiftUI code, and tracks translation completion percentage per locale.",
          },
          {
            question: "How does Better i18n work with Xcode and String Catalogs?",
            answer: "Better i18n uses its CLI to export translations from your String Catalogs, push them to the dashboard for professional translation or AI-assisted translation, then import the translated files back into Xcode. The workflow is: `better-i18n push` exports your .xcstrings file, translators work in the Better i18n dashboard, and `better-i18n pull` downloads the completed translations back into Xcode format. This replaces manual .xcloc file management.",
          },
          {
            question: "What is the difference between NSLocalizedString and SwiftUI's native localization?",
            answer: "NSLocalizedString is the UIKit/AppKit API that looks up a key in your .strings bundle. SwiftUI's Text() view performs automatic localization — it uses the string literal as the key itself, which means your source code is self-documenting. Both approaches work with String Catalogs in Xcode 15+. For new SwiftUI projects, the automatic approach is cleaner; for UIKit projects maintaining existing .strings files, NSLocalizedString remains the standard.",
          },
          {
            question: "How do I implement RTL (right-to-left) support on iOS?",
            answer: "iOS handles RTL layout automatically when the user selects an RTL language like Arabic or Hebrew. SwiftUI's layout system uses leading/trailing instead of left/right, and UIKit respects UIView.semanticContentAttribute. The key is to avoid hardcoded left/right margins and use Auto Layout with leading/trailing constraints. Better i18n supports Arabic and Hebrew as target languages and handles bidirectional text in the translation editor.",
          },
          {
            question: "Can I use over-the-air (OTA) translation updates on iOS?",
            answer: "Apple's App Store review policy requires that core app functionality not change between reviews, but translation content updates are generally permitted via OTA mechanisms. Better i18n's native Swift SDK (BetterI18n) fetches translations from the CDN at runtime, allowing you to push translation corrections and new language support without an app store release. The SDK uses a two-phase load: it reads from local storage first for instant display, then refreshes from CDN in the background.",
          },
          {
            question: "What pluralization rules does iOS support and how many are there?",
            answer: "iOS supports all Unicode CLDR plural categories: zero, one, two, few, many, and other. Not all languages use all categories — English only uses one and other, while Arabic uses all six. String Catalogs in Xcode 15 automatically show the relevant plural forms for each target locale. Better i18n's translation editor also surfaces the correct plural forms per language so translators never miss a required plural case.",
          },
        ]}
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
