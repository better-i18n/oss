import { createFileRoute } from "@tanstack/react-router";
import { HelpLayout } from "@/components/layout/help-layout";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ArticleBody } from "@/components/article/article-body";
import { TableOfContents } from "@/components/article/table-of-contents";
import { ArticleMeta } from "@/components/article/article-meta";
import { FeedbackWidget } from "@/components/article/feedback-widget";
import { RelatedArticles } from "@/components/article/related-articles";
import { ArticleNav } from "@/components/article/article-nav";
import { getArticle, getArticles, getCollection } from "@/lib/content";
import { addHeadingIds, extractTocFromHtml, stripFirstH1 } from "@/lib/utils";
import { formatMetaTags, getCanonicalLink, getAlternateLinks } from "@/lib/seo";
import { formatStructuredData, getArticleSchema, getBreadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/$collection/$article")({
  loader: async ({ params }) => {
    const { locale, collection: collectionSlug, article: articleSlug } = params;
    const [article, collection, collectionArticles] = await Promise.all([
      getArticle(articleSlug, locale),
      getCollection(collectionSlug, locale),
      getArticles(locale, collectionSlug),
    ]);

    // Find prev/next articles in the collection
    const currentIndex = collectionArticles.findIndex((a) => a.slug === articleSlug);
    const prev = currentIndex > 0 ? collectionArticles[currentIndex - 1] : null;
    const next = currentIndex < collectionArticles.length - 1 ? collectionArticles[currentIndex + 1] : null;

    // Related articles (same collection, excluding current)
    const relatedArticles = collectionArticles
      .filter((a) => a.slug !== articleSlug)
      .slice(0, 3);

    return { article, collection, prev, next, relatedArticles, locale, collectionSlug };
  },

  head: ({ loaderData, params }) => {
    const { locale, collection: collectionSlug, article: articleSlug } = params;
    const article = loaderData?.article;
    const collection = loaderData?.collection;

    const title = article?.seoTitle || article?.title || articleSlug;
    const description = article?.seoDescription || article?.excerpt || "";
    const fullTitle = `${title} | ${collection?.title || collectionSlug} | Better i18n`;

    return {
      meta: [
        ...formatMetaTags({
          title: fullTitle,
          description,
          locale,
        }),
        ...(article?.featuredImage ? [{ property: "og:image", content: article.featuredImage }] : []),
      ],
      links: [
        getCanonicalLink(locale, `${collectionSlug}/${articleSlug}`),
        ...getAlternateLinks(`/${locale}/${collectionSlug}/${articleSlug}/`),
      ],
      scripts: [
        ...formatStructuredData([
          getArticleSchema({
            title: fullTitle,
            description,
            url: `${SITE_URL}/${locale}/${collectionSlug}/${articleSlug}/`,
            dateModified: article?.lastReviewedAt || undefined,
            inLanguage: locale,
          }),
          getBreadcrumbSchema([
            { name: "Help Center", url: `${SITE_URL}/${locale}/` },
            { name: collection?.title || collectionSlug, url: `${SITE_URL}/${locale}/${collectionSlug}/` },
            { name: title, url: `${SITE_URL}/${locale}/${collectionSlug}/${articleSlug}/` },
          ]),
        ]),
      ],
    };
  },

  component: ArticlePage,
});

function ArticlePage() {
  const { article, collection, prev, next, relatedArticles, locale, collectionSlug } =
    Route.useLoaderData();
  const t = useT("article");

  if (!article) {
    return (
      <HelpLayout locale={locale}>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-2xl font-semibold text-mist-950">
            {t("notFound")}
          </h1>
        </div>
      </HelpLayout>
    );
  }

  const processedHtml = article.bodyHtml ? addHeadingIds(stripFirstH1(article.bodyHtml)) : "";
  const tocItems = processedHtml ? extractTocFromHtml(processedHtml) : [];

  return (
    <HelpLayout locale={locale}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <Breadcrumb
          locale={locale}
          items={[
            {
              label: collection?.title || collectionSlug,
              href: `/${locale}/${collectionSlug}/`,
            },
            { label: article.title },
          ]}
        />
      </div>

      {/* 3-column layout: sidebar | content | TOC */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex gap-10">
          {/* Main content */}
          <article className="min-w-0 flex-1 max-w-3xl">
            {/* Article header */}
            <header className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-mist-950 sm:text-3xl">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="mt-3 text-lg text-mist-600">{article.excerpt}</p>
              )}
              <div className="mt-4">
                <ArticleMeta article={article} locale={locale} />
              </div>
            </header>

            {/* Featured image */}
            {article.featuredImage && (
              <div className="mb-8 overflow-hidden rounded-xl border border-mist-200">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-auto"
                  loading="eager"
                />
              </div>
            )}

            {/* Video embed */}
            {article.videoUrl && (
              <div className="mb-8 aspect-video overflow-hidden rounded-xl border border-mist-200">
                <iframe
                  src={article.videoUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={article.title}
                />
              </div>
            )}

            {/* Article body */}
            {processedHtml && <ArticleBody html={processedHtml} />}

            {/* Feedback + Nav */}
            <div className="mt-12 space-y-8">
              <FeedbackWidget articleSlug={article.slug} />
              <ArticleNav prev={prev} next={next} locale={locale} />
            </div>
          </article>

          {/* Right sidebar: TOC + Related */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-20 space-y-8">
              <TableOfContents items={tocItems} />
              <RelatedArticles articles={relatedArticles} locale={locale} />
            </div>
          </aside>
        </div>
      </div>
    </HelpLayout>
  );
}
