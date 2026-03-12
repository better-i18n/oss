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
import { getPageHead } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/i18n/django")({
  loader: ({ context }) => ({ messages: context.messages, locale: context.locale, locales: context.locales }),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
      pageKey: "i18nDjango",
      pathname: "/i18n/django",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Django",
        frameworkDescription:
          "Django internationalization with gettext, .po files, and template i18n tags for Python web applications.",
        dependencies: ["django", "@better-i18n/cli"],
      },
    });
  },
  component: DjangoI18nPage,
});

function DjangoI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.django.features.gettext"),
    t("i18n.django.features.poFiles"),
    t("i18n.django.features.templateTags"),
    t("i18n.django.features.pluralization"),
    t("i18n.django.features.lazyTranslation"),
    t("i18n.django.features.middleware"),
    t("i18n.django.features.urlPatterns"),
    t("i18n.django.features.formLocalization"),
    t("i18n.django.features.timezones"),
  ];

  const codeExample = `# views.py
from django.utils.translation import gettext as _
from django.utils.translation import ngettext

def welcome(request):
    output = _("Welcome to our site")
    count = 5
    output += ngettext(
        "%(count)d item",
        "%(count)d items",
        count
    ) % {"count": count}
    return HttpResponse(output)

# settings.py
LANGUAGE_CODE = 'en'
USE_I18N = True
LANGUAGES = [
    ('en', 'English'),
    ('fr', 'French'),
    ('de', 'German'),
]`;

  const relatedLinks = [
    {
      title: "Ruby i18n",
      to: "/$locale/i18n/ruby",
      description: t("i18n.django.related.ruby"),
    },
    {
      title: "JavaScript i18n",
      to: "/$locale/i18n/javascript",
      description: t("i18n.django.related.javascript"),
    },
    {
      title: t("i18n.django.related.comparisons"),
      to: "/$locale/compare",
      description: t("i18n.django.related.comparisonsDesc"),
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <FrameworkHero
        title={t("i18n.django.hero.title")}
        subtitle={t("i18n.django.hero.subtitle")}
        badgeText="Django i18n"
      />

      <FeatureList
        title={t("i18n.django.featuresTitle")}
        features={features}
      />

      <CodeExample
        title={t("i18n.django.codeExample.title")}
        description={t("i18n.django.codeExample.description")}
        code={codeExample}
      />

      <ComparisonRelatedTopics
        heading={t("i18n.django.relatedTitle")}
        links={relatedLinks}
        locale={locale}
      />

      <OtherFrameworks
        title={t("i18n.django.otherFrameworks")}
        currentFramework="django"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.django.cta.title")}
        subtitle={t("i18n.django.cta.subtitle")}
        primaryCTA={t("i18n.django.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.django.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com"
      />
    </MarketingLayout>
  );
}
