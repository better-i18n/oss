import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  FrameworkHero,
  FeatureList,
  CodeExample,
  SetupGuide,
  FrameworkCTA,
  FrameworkFAQ,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/i18n/flutter")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nFlutter",
      pathname: "/i18n/flutter",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Flutter",
        frameworkDescription:
          "Flutter localization with ARB files, intl package, and cross-platform i18n for iOS, Android, and web.",
        dependencies: ["flutter", "flutter_localizations", "intl"],
      },
    });
  },
  component: FlutterI18nPage,
});

function FlutterI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.flutter.features.arbFiles"),
    t("i18n.flutter.features.codeGeneration"),
    t("i18n.flutter.features.pluralization"),
    t("i18n.flutter.features.crossPlatform"),
    t("i18n.flutter.features.hotReload"),
    t("i18n.flutter.features.materialLocalizations"),
    t("i18n.flutter.features.rtlSupport"),
    t("i18n.flutter.features.dateNumberFormat"),
    t("i18n.flutter.features.contextApi"),
  ];

  const setupSteps = [
    {
      step: 1,
      title: "Enable generation",
      description:
        "Add the generate flag to your pubspec.yaml to enable localization code generation.",
      code: `# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  intl: any

flutter:
  generate: true`,
      fileName: "pubspec.yaml",
    },
    {
      step: 2,
      title: "Configure l10n.yaml",
      description:
        "Create l10n.yaml in your project root to configure the localization generator.",
      code: `# l10n.yaml
arb-dir: lib/l10n
template-arb-file: app_en.arb
output-localization-file: app_localizations.dart`,
      fileName: "l10n.yaml",
    },
    {
      step: 3,
      title: "Create ARB template",
      description:
        "Add your source language ARB file with translation keys and metadata.",
      code: `{
  "@@locale": "en",
  "welcome": "Welcome to {appName}",
  "@welcome": {
    "placeholders": {
      "appName": { "type": "String" }
    }
  },
  "itemCount": "{count, plural, =0{No items} =1{1 item} other{{count} items}}",
  "@itemCount": {
    "placeholders": {
      "count": { "type": "int" }
    }
  }
}`,
      fileName: "lib/l10n/app_en.arb",
    },
    {
      step: 4,
      title: "Use in your app",
      description:
        "Wrap your app with localization delegates and use AppLocalizations.of(context) in widgets.",
      code: `import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Text(l10n.welcome('Flutter'));
  }
}`,
      fileName: "lib/main.dart",
    },
  ];

  const codeExample = `import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class ProductPage extends StatelessWidget {
  final int itemCount;
  const ProductPage({required this.itemCount});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Column(
      children: [
        Text(l10n.welcome('My Store')),
        Text(l10n.itemCount(itemCount)),
        // Date formatting respects locale
        Text(DateFormat.yMMMd(
          Localizations.localeOf(context).toString()
        ).format(DateTime.now())),
      ],
    );
  }
}`;

  const relatedLinks = [
    {
      title: "Android Localization",
      to: "/$locale/i18n/android",
      description: t("i18n.flutter.related.android"),
    },
    {
      title: "iOS Localization",
      to: "/$locale/i18n/ios",
      description: t("i18n.flutter.related.ios"),
    },
    {
      title: t("i18n.flutter.related.comparisons"),
      to: "/$locale/compare",
      description: t("i18n.flutter.related.comparisonsDesc"),
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.flutter.hero.title")}
        subtitle={t("i18n.flutter.hero.subtitle")}
        badgeText="Flutter i18n"
      />

      <SetupGuide title="Get started in 4 steps" steps={setupSteps} />

      <FeatureList
        title={t("i18n.flutter.featuresTitle")}
        features={features}
      />

      <CodeExample
        title={t("i18n.flutter.codeExample.title")}
        description={t("i18n.flutter.codeExample.description")}
        code={codeExample}
      />

      <ComparisonRelatedTopics
        heading={t("i18n.flutter.relatedTitle")}
        links={relatedLinks}
        locale={locale}
      />

      <FrameworkFAQ
        title="Flutter i18n — Frequently Asked Questions"
        items={[
          {
            question: "What are ARB files and why does Flutter use them?",
            answer: "ARB (Application Resource Bundle) files are JSON-based localization files used by Flutter's official gen_l10n tool. Each ARB file contains translation key-value pairs plus metadata (placeholders, descriptions, plural rules) in @-prefixed entries. Flutter's build system generates type-safe Dart code from ARB files, so accessing translations via AppLocalizations.of(context).myKey is fully typed and IDE-autocompleted. Better i18n stores and exports translations in ARB format natively.",
          },
          {
            question: "How does Better i18n integrate with Flutter's localization workflow?",
            answer: "Better i18n connects to Flutter projects via the CLI. Run `better-i18n push` to upload your template ARB file (app_en.arb), have translators or AI complete translations in the dashboard, then run `better-i18n pull` to download all localized ARB files into your lib/l10n/ directory. The Flutter build system then regenerates the type-safe AppLocalizations class. This replaces manual file exchange with translators and keeps all languages in sync.",
          },
          {
            question: "Does Flutter support ICU message format for plurals?",
            answer: "Yes. Flutter's gen_l10n tool uses ICU MessageFormat syntax for plural and select messages in ARB files. For example: '{count, plural, =0{No items} =1{1 item} other{{count} items}}'. The generated Dart code handles the correct plural form selection based on the active locale's CLDR plural rules. Better i18n's translation editor supports ICU syntax and validates plural forms for each target language.",
          },
          {
            question: "What is the better_i18n Flutter package?",
            answer: "better_i18n is Better i18n's official Flutter/Dart SDK on pub.dev. It fetches translations from the Better i18n CDN at runtime, supporting over-the-air translation updates without requiring an app store release. The SDK implements a two-phase load pattern: it reads from local SharedPreferences storage first for instant display, then fetches fresh translations from the CDN in the background. Storage keys are compatible with the JavaScript SDKs.",
          },
          {
            question: "How do I add a new language to a Flutter app?",
            answer: "Add the locale to your MaterialApp's supportedLocales list, create a corresponding ARB file (app_fr.arb for French) in your l10n directory, then run `flutter gen-l10n` to regenerate the AppLocalizations class. With Better i18n, you add the language in the dashboard, AI pre-translates all existing keys, your team reviews them, and you pull the ARB file with `better-i18n pull`. The entire process — from adding a language to having production-ready translations — takes hours instead of weeks.",
          },
          {
            question: "Does Flutter i18n work on all platforms — iOS, Android, web, and desktop?",
            answer: "Yes. Flutter's localization system is cross-platform by design. The same ARB files and AppLocalizations class work identically on iOS, Android, web, macOS, Windows, and Linux. Platform-specific behaviors like date formats, number separators, and RTL text direction are handled by the flutter_localizations package and the intl library, which implements Unicode CLDR rules for each locale.",
          },
        ]}
      />

      <OtherFrameworks
        title={t("i18n.flutter.otherFrameworks")}
        currentFramework="flutter"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.flutter.cta.title")}
        subtitle={t("i18n.flutter.cta.subtitle")}
        primaryCTA={t("i18n.flutter.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.flutter.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com"
      />
    </MarketingLayout>
  );
}
