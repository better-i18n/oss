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

export const Route = createFileRoute("/$locale/i18n/angular")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
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
  const t = useTranslations("marketing");
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

  const relatedPages = [
    { name: "React i18n", href: "/$locale/i18n/react", description: t("i18n.angular.related.react") },
    { name: "Vue i18n", href: "/$locale/i18n/vue", description: t("i18n.angular.related.vue") },
    { name: t("i18n.angular.related.comparisons"), href: "/$locale/compare", description: t("i18n.angular.related.comparisonsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <FrameworkHero
        title={t("i18n.angular.hero.title")}
        subtitle={t("i18n.angular.hero.subtitle")}
        badgeText="Angular i18n"
      />

      <FeatureList title={t("i18n.angular.featuresTitle")} features={features} />

      <CodeExample
        title={t("i18n.angular.codeExample.title")}
        description={t("i18n.angular.codeExample.description")}
        code={codeExample}
      />

      <RelatedPages title={t("i18n.angular.relatedTitle")} pages={relatedPages} locale={locale} />

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
