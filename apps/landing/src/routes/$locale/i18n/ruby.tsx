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

export const Route = createFileRoute("/$locale/i18n/ruby")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nRuby",
      pathname: "/i18n/ruby",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Ruby on Rails",
        frameworkDescription:
          "Ruby on Rails internationalization with YAML locale files, I18n API, and pluralization support.",
        dependencies: ["rails", "@better-i18n/cli"],
      },
    });
  },
  component: RubyI18nPage,
});

function RubyI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.ruby.features.yamlLocales"),
    t("i18n.ruby.features.i18nApi"),
    t("i18n.ruby.features.pluralization"),
    t("i18n.ruby.features.interpolation"),
    t("i18n.ruby.features.lazyLookup"),
    t("i18n.ruby.features.fallbacks"),
    t("i18n.ruby.features.routeTranslation"),
    t("i18n.ruby.features.activeRecord"),
    t("i18n.ruby.features.dateTimeFormats"),
  ];

  const codeExample = `# config/locales/en.yml
en:
  welcome: "Welcome to %{app_name}"
  items:
    one: "%{count} item"
    other: "%{count} items"

# app/controllers/home_controller.rb
class HomeController < ApplicationController
  def index
    @welcome = t('welcome', app_name: 'My App')
    @items = t('items', count: 5)
  end
end

# app/views/home/index.html.erb
<h1><%= @welcome %></h1>
<p><%= @items %></p>`;

  const relatedLinks = [
    {
      title: "Django i18n",
      to: "/$locale/i18n/django",
      description: t("i18n.ruby.related.django"),
    },
    {
      title: "JavaScript i18n",
      to: "/$locale/i18n/javascript",
      description: t("i18n.ruby.related.javascript"),
    },
    {
      title: t("i18n.ruby.related.comparisons"),
      to: "/$locale/compare",
      description: t("i18n.ruby.related.comparisonsDesc"),
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.ruby.hero.title")}
        subtitle={t("i18n.ruby.hero.subtitle")}
        badgeText="Ruby on Rails i18n"
      />

      <FeatureList
        title={t("i18n.ruby.featuresTitle")}
        features={features}
      />

      <CodeExample
        title={t("i18n.ruby.codeExample.title")}
        description={t("i18n.ruby.codeExample.description")}
        code={codeExample}
      />

      <ComparisonRelatedTopics
        heading={t("i18n.ruby.relatedTitle")}
        links={relatedLinks}
        locale={locale}
      />

      <OtherFrameworks
        title={t("i18n.ruby.otherFrameworks")}
        currentFramework="ruby"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.ruby.cta.title")}
        subtitle={t("i18n.ruby.cta.subtitle")}
        primaryCTA={t("i18n.ruby.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.ruby.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com"
      />
    </MarketingLayout>
  );
}
