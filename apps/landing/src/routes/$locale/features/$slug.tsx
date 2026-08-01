import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getMarketingPage, getMarketingPages, type MarketingPageListItem } from "@/lib/content";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import BlogContent from "@/components/blog/BlogContent";
import { IconArrowLeft } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { BackToHub } from "@/components/BackToHub";
import {
  SITE_URL,
  getAlternateLinks,
  getCanonicalLink,
  buildOgImageUrl,
  formatMetaTags,
  truncateTitle,
} from "@/lib/meta";
import { getLocaleTier } from "@/seo/locale-tiers";
import {
  getEducationalPageStructuredData,
  getBreadcrumbSchema,
  formatStructuredData,
} from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { PROSE_CLASS } from "@/components/ProseBody";
import { Divider, PageHero, Section } from "@/components/ui/page";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "@/i18n.config";

const loadFeaturePage = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }) => {
    return getMarketingPage(data.slug, data.locale);
  });

const loadRelatedFeatures = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }) => {
    const pages = await getMarketingPages(data.locale, "feature");
    return pages.filter((p) => p.slug !== data.slug).slice(0, 6);
  });

export const Route = createFileRoute("/$locale/features/$slug")({
  loader: async ({ params, context }) => {
    const [page, relatedFeatures, allMessages] = await Promise.all([
      loadFeaturePage({
        data: { slug: params.slug, locale: params.locale },
      }),
      loadRelatedFeatures({
        data: { slug: params.slug, locale: params.locale },
      }),
      getMessages({ project: i18nConfig.project, locale: context.locale }),
    ]);
    if (!page) {
      throw notFound();
    }
    const { filterMessages } = await import("@/lib/page-namespaces");
    const messages = filterMessages(allMessages, ["breadcrumbs"]);
    return { page, locale: params.locale, relatedFeatures, messages };
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page;
    const locale = loaderData?.locale || "en";
    const pathname = `/features/${page?.slug || ""}`;
    const canonicalUrl = `${SITE_URL}/${locale}${pathname}/`;

    const dynamicOgImage = buildOgImageUrl("og", {
      title: page?.title || "Feature",
    });

    const excerpt = page?.excerpt || page?.heroSubtitle || "";

    const educationalScripts = getEducationalPageStructuredData({
      title: page?.title || "Feature",
      description: excerpt,
      url: canonicalUrl,
    });

    const msgs = (loaderData?.messages ?? {}) as Record<string, any>;
    const breadcrumbScripts = formatStructuredData(
      getBreadcrumbSchema([
        { name: msgs["breadcrumbs.home"] ?? "Home", url: `${SITE_URL}/${locale}/` },
        { name: msgs["breadcrumbs.features"] ?? "Features", url: `${SITE_URL}/${locale}/features/` },
        { name: page?.title || "Feature", url: canonicalUrl },
      ]),
    );

    const meta = {
      title: truncateTitle(`${page?.title || "Feature"} | Better I18N`),
      description: excerpt,
      ogTitle: page?.title || "Feature",
      ogDescription: excerpt,
      ogImage: dynamicOgImage,
      ogType: "website" as const,
      canonicalUrl,
    };

    const metaTags = formatMetaTags(meta, {
      locale,
      noindex: getLocaleTier(locale) === "tier3",
    });

    const keywordTags = page?.targetKeywords
      ? [{ name: "keywords", content: page.targetKeywords }]
      : [];

    return {
      meta: [...metaTags, ...keywordTags],
      links: [
        ...getAlternateLinks(pathname),
        getCanonicalLink(locale, pathname),
      ],
      scripts: [...educationalScripts, ...breadcrumbScripts],
    };
  },
  component: FeaturePageComponent,
  notFoundComponent: FeatureNotFound,
});

function FeaturePageComponent() {
  const { page, locale, relatedFeatures } = Route.useLoaderData();
  const t = useT("featuresPage");

  return (
    /* The CMS feature pages now use the same page grammar as the authored ones
       (rule/pillar-page-shape, rule/one-container): MarketingLayout for the
       white ground + frame rules, PageHero for the opening, then the markdown
       body as ONE Section. Before this they were a bare
       `<div><Header/><main className="py-16"><article className="mx-auto max-w-4xl">`
       with a plain prose dump inside, which is why the page had no borders and
       no section rhythm while every neighbouring page did.
       Not one word of CMS copy is touched — the shell and the typography are
       (rule/seo-content-is-load-bearing); head()/loader/structured data are
       untouched above. */
    <MarketingLayout showCTA={false}>
      <BackToHub hub="features" locale={locale} />

      <PageHero
        pillar="ai"
        pillarLabel={t("featureBadge")}
        titleId="feature-hero-title"
        title={page.title}
        subtitle={page.heroSubtitle ?? ""}
      />

      <Divider />

      {/* Markdown is a single flow, so it gets a single Section. The h2 rhythm
          inside it comes from the shared prose scale (hairline rule + --text-h2
          above each h2) rather than from one Section per heading. */}
      {page.bodyHtml && (
        <Section>
          <article className="min-w-0">
            <BlogContent html={page.bodyHtml} className={PROSE_CLASS} />
          </article>
        </Section>
      )}

      {relatedFeatures.length > 0 && (
        <>
          <Divider />
          <Section>
            <h2 className="section-h2">{t("exploreMore")}</h2>
            {/* Hairline index, not a card grid: each cell draws its own top +
                left rule, the grid is shifted -1px, and the wrapper is a bare
                clip box (rule/interior-hairlines-only). */}
            <div className="mt-8 overflow-hidden">
              <div className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {relatedFeatures.map((feature: MarketingPageListItem) => (
                  <Link
                    key={feature.slug}
                    to="/$locale/features/$slug/"
                    params={{ locale, slug: feature.slug }}
                    className="group flex flex-col gap-2 border-t border-l border-black/[0.05] px-5 py-4 transition-colors hover:bg-black/[0.02]"
                  >
                    <h3 className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-mist-900">
                      {feature.title}
                    </h3>
                    {feature.heroSubtitle && (
                      <p className="line-clamp-2 text-[13px] leading-relaxed text-mist-600">
                        {feature.heroSubtitle}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </Section>
        </>
      )}

      <Divider />

      <RelatedPages currentPage="features" locale={locale} variant="for" />
    </MarketingLayout>
  );
}

function FeatureNotFound() {
  const { locale } = Route.useParams();
  const t = useT("featuresPage");

  return (
    <MarketingLayout showCTA={false}>
      <Section>
        <h1 className="section-h2">{t("notFound.title")}</h1>
        <p className="section-p mt-3">{t("notFound.description")}</p>
        <Link
          to="/$locale/features/"
          params={{ locale }}
          className="btn btn-dark btn-lg mt-8 w-fit"
        >
          <IconArrowLeft className="size-4" />
          {t("allFeatures")}
        </Link>
      </Section>
    </MarketingLayout>
  );
}
