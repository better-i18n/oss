import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { HelpLayout } from "@/components/layout/help-layout";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { Badge } from "@/components/shared/badge";
import { getCollection, getArticles } from "@/lib/content";
import { formatMetaTags, getCanonicalLink, getAlternateLinks } from "@/lib/seo";
import { formatStructuredData, getCollectionPageSchema, getBreadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import { useT } from "@/lib/i18n";
import { IconChevronRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/$collection/")({
  loader: async ({ params }) => {
    const { locale, collection: collectionSlug } = params;
    const [collection, articles] = await Promise.all([
      getCollection(collectionSlug, locale),
      getArticles(locale, collectionSlug),
    ]);
    return { collection, articles, locale, collectionSlug };
  },

  head: ({ loaderData, params }) => {
    const { locale, collection: collectionSlug } = params;
    const collection = loaderData?.collection;
    const title = collection
      ? `${collection.title} | Help Center | Better i18n`
      : "Help Center | Better i18n";
    const description = collection?.description || "Browse help articles for this category."; // i18n: collection.seo.defaultDescription

    return {
      meta: formatMetaTags({ title, description, locale }),
      links: [
        getCanonicalLink(locale, `${collectionSlug}`),
        ...getAlternateLinks(`/${locale}/${collectionSlug}/`),
      ],
      scripts: [
        ...formatStructuredData([
          getCollectionPageSchema({
            name: collection?.title || collectionSlug,
            description,
            url: `${SITE_URL}/${locale}/${collectionSlug}/`,
            inLanguage: locale,
          }),
          getBreadcrumbSchema([
            { name: "Help Center", url: `${SITE_URL}/${locale}/` },
            { name: collection?.title || collectionSlug, url: `${SITE_URL}/${locale}/${collectionSlug}/` },
          ]),
        ]),
      ],
    };
  },

  component: CollectionPage,
});

function CollectionPage() {
  const { collection, articles, locale } = Route.useLoaderData();
  const t = useT("collection");

  if (!collection) {
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

  return (
    <HelpLayout locale={locale}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-5xl px-6 pt-6">
        <Breadcrumb
          locale={locale}
          items={[{ label: collection.title }]}
        />
      </div>

      {/* Collection header */}
      <div className="mx-auto max-w-5xl px-6 pt-6 pb-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl border border-mist-100 bg-mist-50 shadow-sm">
            <DynamicIcon name={collection.icon} className="size-6 text-mist-700" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-mist-950">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="mt-1 text-mist-600">{collection.description}</p>
            )}
            <p className="mt-2 text-sm text-mist-500">
              {articles.length} {t("articles")}
            </p>
          </div>
        </div>
      </div>

      {/* Article list */}
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="divide-y divide-mist-100 rounded-xl border border-mist-200 bg-[var(--color-card)]">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to="/$locale/$collection/$article"
              params={{
                locale,
                collection: collection.slug,
                article: article.slug,
              }}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-mist-50"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-mist-950">{article.title}</h3>
                {article.excerpt && (
                  <p className="mt-0.5 truncate text-sm text-mist-500">{article.excerpt}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {article.difficulty && (
                  <Badge variant={article.difficulty}>
                    {article.difficulty}
                  </Badge>
                )}
                {article.readingTime && (
                  <span className="text-xs text-mist-400">{article.readingTime} {t("minSuffix")}</span>
                )}
                <IconChevronRight className="size-4 text-mist-300" />
              </div>
            </Link>
          ))}
          {articles.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-mist-500">
              {t("noArticles")}
            </div>
          )}
        </div>
      </div>
    </HelpLayout>
  );
}
