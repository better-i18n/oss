import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { createServerFn } from "@tanstack/react-start";
import { getAllBlogPostsForLocale, POSTS_PER_PAGE, type BlogPostListItem } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import Pagination from "@/components/blog/Pagination";
import { RelatedPages } from "@/components/RelatedPages";
import { useT } from "@/lib/i18n";
import { IconPageText } from "@central-icons-react/round-outlined-radius-2-stroke-2";
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

const loadBlogPosts = createServerFn({ method: "GET" })
  .inputValidator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    const allPosts = await getAllBlogPostsForLocale(data.locale);
    const categories = [...new Set(
      allPosts.flatMap((p) => (p.category ? [p.category] : []))
    )].sort();
    return {
      allPosts,
      categories,
      totalPages: Math.ceil(allPosts.length / POSTS_PER_PAGE),
    };
  });

export const Route = createFileRoute("/$locale/blog/")({
  loader: async ({ params, context }) => {
    const { filterMessages } = await import("@/lib/page-namespaces");
    const [allMessages, result] = await Promise.all([
      getMessages({ project: i18nConfig.project, locale: context.locale }),
      loadBlogPosts({ data: { locale: params.locale } }),
    ]);
    const messages = filterMessages(allMessages, ["meta", "breadcrumbs"]);
    return {
      ...result,
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
        description: "Latest posts from the Better i18n team",
        site: "blog",
      }),
    });

    const breadcrumbSchema = getBreadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/${locale}/` },
      { name: "Blog", url: `${SITE_URL}/${locale}/blog/` },
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
          name: "Better i18n Blog",
          description: "Tutorials, guides, and best practices for internationalization, localization, and translation management.",
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

  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl">
              <h1 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
                {t("title", { defaultValue: "Blog" })}
              </h1>
              <p className="mt-4 text-lg/8 text-mist-700">
                {t("subtitle", {
                  defaultValue:
                    "Tutorials, guides, and best practices for internationalization.",
                })}
              </p>
            </div>
            <Link
              to="/$locale/"
              params={{ locale }}
              className="inline-flex items-center gap-1 text-sm font-medium text-mist-700 hover:text-mist-950 shrink-0"
            >
              {t("backToHome", { defaultValue: "Back to home" })}
              <SpriteIcon name="arrow-right" className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => handleCategoryClick(null)}
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? "bg-mist-950 text-white"
                    : "bg-mist-100 text-mist-700 hover:bg-mist-200"
                }`}
              >
                {t("allPosts", { defaultValue: "All" })}
                <span className={`ml-1.5 text-xs ${selectedCategory === null ? "text-mist-300" : "text-mist-500"}`}>
                  {allPosts.length}
                </span>
              </button>
              {categories.map((category) => {
                const count = (allPosts ?? []).filter((p: BlogPostListItem) => p.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-mist-950 text-white"
                        : "bg-mist-100 text-mist-700 hover:bg-mist-200"
                    }`}
                  >
                    {category}
                    <span className={`ml-1.5 text-xs ${selectedCategory === category ? "text-mist-300" : "text-mist-500"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Posts Grid */}
          {paginatedPosts?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post: BlogPostListItem, index: number) => (
                <BlogCard key={post.slug} post={post} locale={locale} priority={index === 0} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-mist-950/[0.025] p-12 text-center">
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-mist-100 flex items-center justify-center">
                  <IconPageText className="h-6 w-6 text-mist-400" />
                </div>
                <h3 className="text-base font-medium text-mist-950">
                  {t("noPosts.title", { defaultValue: "No posts yet" })}
                </h3>
                <p className="mt-2 text-sm text-mist-600">
                  {t("noPosts.description", {
                    defaultValue: "Check back soon for new content!",
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Pagination — client-side when filtering, server-side otherwise */}
          {paginatedPosts?.length > 0 && (
            selectedCategory ? (
              filteredTotalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-mist-200 text-sm text-mist-700 disabled:opacity-40 hover:bg-mist-50 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-mist-600">
                    {currentPage} / {filteredTotalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(filteredTotalPages, p + 1))}
                    disabled={currentPage === filteredTotalPages}
                    className="px-4 py-2 rounded-lg border border-mist-200 text-sm text-mist-700 disabled:opacity-40 hover:bg-mist-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )
            ) : (
              <Pagination
                currentPage={1}
                totalPages={totalPages}
                locale={locale}
              />
            )
          )}
        </div>
      </main>
      <RelatedPages currentPage="blog" locale={locale} variant="educational" />
      <Footer />
    </div>
  );
}
