import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
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

export const Route = createFileRoute("/$locale/i18n/android")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
      pageKey: "i18nAndroid",
      pathname: "/i18n/android",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Android",
        frameworkDescription:
          "Android localization with strings.xml resource files, Jetpack Compose support, and per-app language preferences.",
        dependencies: ["android-sdk", "@better-i18n/cli"],
      },
    });
  },
  component: AndroidI18nPage,
});

function AndroidI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.android.features.stringsXml"),
    t("i18n.android.features.plurals"),
    t("i18n.android.features.jetpackCompose"),
    t("i18n.android.features.perAppLanguage"),
    t("i18n.android.features.resourceQualifiers"),
    t("i18n.android.features.rtlSupport"),
    t("i18n.android.features.dateNumberFormat"),
    t("i18n.android.features.stringArrays"),
    t("i18n.android.features.translationEditor"),
  ];

  const codeExample = `<!-- res/values/strings.xml -->
<resources>
    <string name="welcome">Welcome to %1$s</string>
    <plurals name="items">
        <item quantity="one">%d item</item>
        <item quantity="other">%d items</item>
    </plurals>
</resources>

<!-- res/values-fr/strings.xml -->
<resources>
    <string name="welcome">Bienvenue sur %1$s</string>
    <plurals name="items">
        <item quantity="one">%d article</item>
        <item quantity="other">%d articles</item>
    </plurals>
</resources>

// Kotlin - Jetpack Compose
@Composable
fun WelcomeScreen() {
    Text(text = stringResource(R.string.welcome, "My App"))
    Text(text = pluralStringResource(R.plurals.items, 5, 5))
}`;

  const relatedLinks = [
    {
      title: "iOS Localization",
      to: "/$locale/i18n/ios",
      description: t("i18n.android.related.ios"),
    },
    {
      title: "React Native i18n",
      to: "/$locale/i18n/react-native-localization",
      description: t("i18n.android.related.reactNative"),
    },
    {
      title: t("i18n.android.related.comparisons"),
      to: "/$locale/compare",
      description: t("i18n.android.related.comparisonsDesc"),
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.android.hero.title")}
        subtitle={t("i18n.android.hero.subtitle")}
        badgeText="Android i18n"
      />

      <FeatureList
        title={t("i18n.android.featuresTitle")}
        features={features}
      />

      <CodeExample
        title={t("i18n.android.codeExample.title")}
        description={t("i18n.android.codeExample.description")}
        code={codeExample}
      />

      <ComparisonRelatedTopics
        heading={t("i18n.android.relatedTitle")}
        links={relatedLinks}
        locale={locale}
      />

      <OtherFrameworks
        title={t("i18n.android.otherFrameworks")}
        currentFramework="android"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.android.cta.title")}
        subtitle={t("i18n.android.cta.subtitle")}
        primaryCTA={t("i18n.android.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.android.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com"
      />
    </MarketingLayout>
  );
}
