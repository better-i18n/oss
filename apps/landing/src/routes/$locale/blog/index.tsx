import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getBlogPosts, POSTS_PER_PAGE, type BlogPostListItem } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import Pagination from "@/components/blog/Pagination";
import { RelatedPages } from "@/components/RelatedPages";
import { useT } from "@/lib/i18n";
import {
  IconArrowRight,
  IconPageText,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
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

const loadBlogPosts = createServerFn({ method: "GET" })
  .inputValidator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    const result = await getBlogPosts(data.locale, {
      limit: POSTS_PER_PAGE,
      page: 1,
    });
    return {
      posts: result.posts,
      totalPages: Math.ceil(result.total / POSTS_PER_PAGE),
      currentPage: 1,
    };
  });

export const Route = createFileRoute("/$locale/blog/")({
  loader: async ({ params, context }) => {
    const [messages, result] = await Promise.all([
      getMessages({ project: i18nConfig.project, locale: context.locale }),
      loadBlogPosts({ data: { locale: params.locale } }),
    ]);
    return {
      ...result,
      messages,
      locale: context.locale,
      locales: context.locales,
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
      meta: formatMetaTags(meta, { locale, locales: loaderData?.locales }),
      links: [
        ...getAlternateLinks(pathname, loaderData?.locales),
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
          description: "Latest updates, tutorials, and insights about internationalization and localization.",
          url: `${SITE_URL}/${locale}/blog/`,
          inLanguage: locale,
        }),
      ]),
    };
  },
  component: BlogPage,
});

function BlogPage() {
  const { posts, locale, totalPages } = Route.useLoaderData();
  const t = useT("blog");

  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Header - matching Features/Changelog section style */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
            <div className="max-w-2xl">
              <h1 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
                {t("title", { defaultValue: "Blog" })}
              </h1>
              <p className="mt-4 text-lg/8 text-mist-700">
                {t("subtitle", {
                  defaultValue:
                    "Latest updates, tutorials, and insights about internationalization.",
                })}
              </p>
            </div>
            <Link
              to="/$locale"
              params={{ locale }}
              className="inline-flex items-center gap-1 text-sm font-medium text-mist-700 hover:text-mist-950 shrink-0"
            >
              {t("backToHome", { defaultValue: "Back to home" })}
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Posts Grid */}
          {posts?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: BlogPostListItem) => (
                <BlogCard key={post.slug} post={post} locale={locale} />
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

          {/* Pagination */}
          {posts?.length > 0 && (
            <Pagination
              currentPage={1}
              totalPages={totalPages}
              locale={locale}
            />
          )}
        </div>
      </main>
      <RelatedPages currentPage="blog" locale={locale} variant="educational" />
      <Footer />
    </div>
  );
}
