import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import {
  FrameworkHero,
  FeatureList,
  CodeExample,
  SetupGuide,
  FrameworkCTA,
  LibraryIntegration,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { getPageHead } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/i18n/angular")({
  loader: ({ context }) => ({ messages: context.messages, locale: context.locale, locales: context.locales }),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
      pageKey: "i18nAngular",
      pathname: "/i18n/angular",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Angular",
        frameworkDescription: "Angular localization with built-in i18n tools, AOT compilation support, and multi-language SSR.",
        dependencies: ["@angular/core", "@better-i18n/angular"],
      },
    });
  },
  component: AngularI18nPage,
});

function AngularI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.angular.features.standalone"),
    t("i18n.angular.features.pipes"),
    t("i18n.angular.features.directives"),
    t("i18n.angular.features.services"),
    t("i18n.angular.features.lazyLoading"),
    t("i18n.angular.features.aot"),
    t("i18n.angular.features.ssr"),
    t("i18n.angular.features.signals"),
    t("i18n.angular.features.cli"),
  ];

  const setupSteps = [
    {
      step: 1,
      title: "Install",
      description: "Add the Better i18n Angular package to your project.",
      code: "npm install @better-i18n/angular",
      fileName: "terminal",
    },
    {
      step: 2,
      title: "Import the module",
      description:
        "Import BetterI18nModule in your AppModule or standalone component.",
      code: `import { BetterI18nModule } from '@better-i18n/angular';

@NgModule({
  imports: [
    BetterI18nModule.forRoot({
      project: 'your-org/your-project',
      defaultLocale: 'en',
    }),
  ],
})
export class AppModule {}`,
      fileName: "app.module.ts",
    },
    {
      step: 3,
      title: "Use the translate pipe",
      description:
        "Use the translate pipe or directive in your templates to display translations.",
      code: `<h1>{{ 'welcome' | translate }}</h1>
<p>{{ 'greeting' | translate: { name: userName } }}</p>`,
      fileName: "app.component.html",
    },
  ];

  const codeExample = `// app.component.ts
import { Component } from '@angular/core';
import { TranslateService } from '@better-i18n/angular';

@Component({
  selector: 'app-root',
  template: \`
    <h1>{{ 'welcome' | translate }}</h1>
    <p>{{ 'greeting' | translate: { name: 'World' } }}</p>
  \`
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
  }
}`;

  const libraries = [
    {
      name: "@ngx-translate/core",
      description: t("i18n.angular.libraries.ngxTranslate.description"),
      integrationText: t("i18n.angular.libraries.ngxTranslate.integration"),
    },
    {
      name: "Angular i18n (built-in)",
      description: t("i18n.angular.libraries.builtIn.description"),
      integrationText: t("i18n.angular.libraries.builtIn.integration"),
    },
    {
      name: "Transloco",
      description: t("i18n.angular.libraries.transloco.description"),
      integrationText: t("i18n.angular.libraries.transloco.integration"),
    },
  ];

  const relatedLinks = [
    { title: "React i18n", to: "/$locale/i18n/react", description: t("i18n.angular.related.react") },
    { title: "Vue i18n", to: "/$locale/i18n/vue", description: t("i18n.angular.related.vue") },
    { title: t("i18n.angular.related.comparisons"), to: "/$locale/compare", description: t("i18n.angular.related.comparisonsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <FrameworkHero
        title={t("i18n.angular.hero.title")}
        subtitle={t("i18n.angular.hero.subtitle")}
        badgeText="Angular i18n"
      />

      <SetupGuide title="Get started in 3 steps" steps={setupSteps} />

      <FeatureList title={t("i18n.angular.featuresTitle")} features={features} />

      <CodeExample
        title={t("i18n.angular.codeExample.title")}
        description={t("i18n.angular.codeExample.description")}
        code={codeExample}
      />

      <LibraryIntegration
        title={t("i18n.angular.librariesTitle")}
        subtitle={t("i18n.angular.librariesSubtitle")}
        libraries={libraries}
      />

      <ComparisonRelatedTopics heading={t("i18n.angular.relatedTitle")} links={relatedLinks} locale={locale} />

      <OtherFrameworks
        title={t("i18n.angular.otherFrameworks")}
        currentFramework="angular"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.angular.cta.title")}
        subtitle={t("i18n.angular.cta.subtitle")}
        primaryCTA={t("i18n.angular.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.angular.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com"
      />
    </MarketingLayout>
  );
}
