import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { POSTS_PER_PAGE, type BlogPostListItem } from "@/lib/content";
import { loadBlogIndex } from "@/lib/blog-index";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { BlogGrid, BlogEmptyState } from "@/components/blog/BlogGrid";
import Pagination from "@/components/blog/Pagination";
import { RelatedPages } from "@/components/RelatedPages";
import { useT } from "@/lib/i18n";
import { PageHero, Section, Divider } from "@/components/ui/page";
import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
  buildOgImageUrl,
  SITE_URL,
} from "@/lib/meta";
import {
  getBreadcrumbSchema,
  formatStructuredData,
  getOrganizationSchema,
  getWebSiteSchema,
  getCollectionPageSchema,
} from "@/lib/structured-data";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "@/i18n.config";
import { getLocaleTier } from "@/seo/locale-tiers";

export const Route = createFileRoute("/$locale/blog/")({
  loader: async ({ params, context }) => {
    // The namespace helper import is independent of both fetches, so it joins
    // the same Promise.all instead of adding a serial round-trip in front.
    const [{ filterMessages }, allMessages, index] = await Promise.all([
      import("@/lib/page-namespaces"),
      getMessages({ project: i18nConfig.project, locale: context.locale }),
      loadBlogIndex(params.locale),
    ]);
    const messages = filterMessages(allMessages, ["meta", "breadcrumbs"]);
    return {
      allPosts: index.allPosts,
      categories: index.categories,
      totalPages: index.totalPages,
      messages,
      locale: context.locale,
    };
  },
  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const pathname = "/blog";
    const meta = getLocalizedMeta(loaderData?.messages || {}, "blog", {
      locale,
      pathname,
      ogImage: buildOgImageUrl("og", {
        title: "Blog",
        description: "Latest posts from the Better I18N team",
        site: "blog",
      }),
    });

    const msgs = (loaderData?.messages ?? {}) as Record<string, any>;
    const breadcrumbSchema = getBreadcrumbSchema([
      { name: msgs["breadcrumbs.home"] ?? "Home", url: `${SITE_URL}/${locale}/` },
      { name: msgs["breadcrumbs.blog"] ?? "Blog", url: `${SITE_URL}/${locale}/blog/` },
    ]);

    return {
      meta: formatMetaTags(meta, { locale, noindex: getLocaleTier(locale) === "tier3" }),
      links: [
        ...getAlternateLinks(pathname),
        getCanonicalLink(locale, pathname),
        ...((loaderData?.totalPages ?? 0) > 1
          ? [{ rel: "next", href: `${SITE_URL}/${locale}/blog/page/2/` }]
          : []),
      ],
      scripts: formatStructuredData([
        getOrganizationSchema({ locale }),
        getWebSiteSchema(locale),
        breadcrumbSchema,
        getCollectionPageSchema({
          name: `${msgs["breadcrumbs.blog"] ?? "Blog"} | Better I18N`,
          description: meta.description || "Tutorials, guides, and best practices for internationalization, localization, and translation management.",
          url: `${SITE_URL}/${locale}/blog/`,
          inLanguage: locale,
        }),
      ]),
    };
  },
  component: BlogPage,
});

function BlogPage() {
  const { allPosts, categories, locale, totalPages } = Route.useLoaderData();
  const t = useT("blog");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return allPosts ?? [];
    return (allPosts ?? []).filter((p: BlogPostListItem) => p.category === selectedCategory);
  }, [allPosts, selectedCategory]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const filteredTotalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  function handleCategoryClick(category: string | null) {
    setSelectedCategory(category);
    setCurrentPage(1);
  }

  const hasPosts = paginatedPosts.length > 0;

  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main>
        {/* The filter pills belong to the hero: they scope the collection the
            hero just introduced, so they ride in the hero's `visual` slot rather
            than opening a section of their own (a section must open with a
            SectionHeader). */}
        <PageHero
          titleId="blog-title"
          title={t("title")}
          subtitle={t("subtitle")}
          visual={
            categories.length > 0 ? (
              <nav aria-label={t("filterLabel")} className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCategoryClick(null)}
                  aria-pressed={selectedCategory === null}
                  className={selectedCategory === null ? "btn btn-dark btn-sm" : "btn btn-outline btn-sm"}
                >
                  {t("allPosts")}
                </button>
                {categories.map((category: string) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    aria-pressed={selectedCategory === category}
                    className={selectedCategory === category ? "btn btn-dark btn-sm" : "btn btn-outline btn-sm"}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            ) : undefined
          }
        />

        <Divider />

        <Section labelledBy="blog-title">
          {hasPosts ? (
            <BlogGrid>
              {paginatedPosts.map((post: BlogPostListItem) => (
                <BlogCard key={post.slug} post={post} locale={locale} />
              ))}
            </BlogGrid>
          ) : selectedCategory ? (
            <BlogEmptyState title={t("noResults.title")} description={t("noResults.description")}>
              <button
                type="button"
                onClick={() => handleCategoryClick(null)}
                className="btn btn-dark btn-sm"
              >
                {t("allPosts")}
              </button>
            </BlogEmptyState>
          ) : (
            <BlogEmptyState title={t("noPosts.title")} description={t("noPosts.description")}>
              <Link to="/$locale/" params={{ locale }} className="btn btn-dark btn-sm">
                {t("backToHome")}
              </Link>
            </BlogEmptyState>
          )}

          {/* Pagination — client-side while a category filter is active (the
              filtered set only exists in memory), server-rendered routes
              otherwise so page 2+ stays crawlable. */}
          {hasPosts &&
            (selectedCategory ? (
              filteredTotalPages > 1 && (
                <nav
                  aria-label="Blog pagination"
                  className="mt-8 flex items-center justify-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-outline btn-sm disabled:opacity-40"
                  >
                    {t("pagination.previous")}
                  </button>
                  <span className="px-2 text-[13px] tabular-nums text-mist-500">
                    {currentPage} / {filteredTotalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(filteredTotalPages, p + 1))}
                    disabled={currentPage === filteredTotalPages}
                    className="btn btn-outline btn-sm disabled:opacity-40"
                  >
                    {t("pagination.next")}
                  </button>
                </nav>
              )
            ) : (
              <Pagination currentPage={1} totalPages={totalPages} locale={locale} />
            ))}
        </Section>
      </main>
      <RelatedPages currentPage="blog" locale={locale} variant="educational" />
      <Footer />
    </div>
  );
}
