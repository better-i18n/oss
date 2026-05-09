import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { POSTS_PER_PAGE, type BlogPostListItem } from "@/lib/content";
import { loadBlogIndex } from "@/lib/blog-index";
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

export const Route = createFileRoute("/$locale/blog/")({
  loader: async ({ params, context }) => {
    const { filterMessages } = await import("@/lib/page-namespaces");
    const [allMessages, index] = await Promise.all([
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
    if (typeof document !== "undefined" && !loaderData?.messages) {
      return { meta: [{ title: "Blog — Better I18N" }], links: [], scripts: [] };
    }
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

  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main className="pt-10 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[28px]/[1.2] font-semibold tracking-[-0.03em] text-mist-950 sm:text-[32px]/[1.15]">
              {t("title", { defaultValue: "Blog" })}
            </h1>
            <p className="mt-1.5 text-[14px]/[1.5] text-mist-400">
              {t("subtitle", {
                defaultValue:
                  "Insights and updates from our team.",
              })}
            </p>
          </div>

          {/* Category Navigation */}
          {categories.length > 0 && (
            <nav className="flex items-center gap-6 border-b border-mist-200/60 pb-3 mb-0 overflow-x-auto">
              <button
                onClick={() => handleCategoryClick(null)}
                className={`whitespace-nowrap text-[14px] font-medium transition-colors ${
                  selectedCategory === null
                    ? "text-mist-950"
                    : "text-mist-400 hover:text-mist-700"
                }`}
              >
                {t("allPosts", { defaultValue: "All Posts" })}
              </button>
              {categories.map((category: string) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`whitespace-nowrap text-[14px] font-medium transition-colors ${
                    selectedCategory === category
                      ? "text-mist-950"
                      : "text-mist-400 hover:text-mist-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>
          )}

          {/* Posts Grid */}
          {paginatedPosts?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y divide-mist-200/50 md:divide-y-0 md:[&>a]:border-b md:[&>a]:border-mist-200/50 md:[&>a:nth-last-child(-n+2)]:border-b-0 lg:[&>a:nth-last-child(-n+3)]:border-b-0 border-t border-mist-200/50 lg:divide-x lg:divide-mist-200/50 lg:[&>a]:px-6 lg:[&>a:first-child]:pl-0 lg:[&>a:nth-child(3n+1)]:pl-0 lg:[&>a:nth-child(3n)]:pr-0 md:max-lg:divide-x md:max-lg:divide-mist-200/50 md:max-lg:[&>a]:px-5 md:max-lg:[&>a:nth-child(odd)]:pl-0 md:max-lg:[&>a:nth-child(even)]:pr-0">
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
