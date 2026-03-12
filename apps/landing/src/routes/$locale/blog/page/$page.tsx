import { createFileRoute, redirect, notFound, Link } from "@tanstack/react-router";
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

/** Pages at or beyond this threshold get noindex,follow to preserve crawl budget. */
const NOINDEX_THRESHOLD = 8;

const loadPaginatedPosts = createServerFn({ method: "GET" })
  .inputValidator((data: { locale: string; page: number }) => data)
  .handler(async ({ data }) => {
    const result = await getBlogPosts(data.locale, {
      limit: POSTS_PER_PAGE,
      page: data.page,
    });
    return {
      posts: result.posts,
      totalPages: Math.ceil(result.total / POSTS_PER_PAGE),
      currentPage: data.page,
    };
  });

export const Route = createFileRoute("/$locale/blog/page/$page")({
  loader: async ({ params, context }) => {
    const pageNum = parseInt(params.page, 10);

    // /blog/page/1/ → 301 redirect to /blog/
    if (pageNum === 1) {
      throw redirect({
        to: "/$locale/blog",
        params: { locale: params.locale },
        statusCode: 301,
      });
    }

    // Invalid page number → 404
    if (isNaN(pageNum) || pageNum < 1) {
      throw notFound();
    }

    const result = await loadPaginatedPosts({
      data: { locale: params.locale, page: pageNum },
    });

    // Page out of range → 404
    if (pageNum > result.totalPages) {
      throw notFound();
    }

    return {
      ...result,
      messages: context.messages,
      locale: context.locale,
      locales: context.locales,
    };
  },
  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const currentPage = loaderData?.currentPage ?? 2;
    const totalPages = loaderData?.totalPages ?? 1;
    const pathname = `/blog/page/${currentPage}`;

    const meta = getLocalizedMeta(loaderData?.messages || {}, "blog", {
      locale,
      pathname,
      ogImage: buildOgImageUrl("og", {
        title: `Blog — Page ${currentPage}`,
        description: "Latest posts from the Better i18n team",
        site: "blog",
      }),
    });

    const breadcrumbSchema = getBreadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/${locale}/` },
      { name: "Blog", url: `${SITE_URL}/${locale}/blog/` },
      { name: `Page ${currentPage}`, url: `${SITE_URL}/${locale}/blog/page/${currentPage}/` },
    ]);

    // Pagination rel links
    const paginationLinks: { rel: string; href: string }[] = [];
    // rel="prev" — page 2 points to /blog/, page 3+ points to /blog/page/{N-1}/
    if (currentPage === 2) {
      paginationLinks.push({ rel: "prev", href: `${SITE_URL}/${locale}/blog/` });
    } else if (currentPage > 2) {
      paginationLinks.push({ rel: "prev", href: `${SITE_URL}/${locale}/blog/page/${currentPage - 1}/` });
    }
    // rel="next"
    if (currentPage < totalPages) {
      paginationLinks.push({ rel: "next", href: `${SITE_URL}/${locale}/blog/page/${currentPage + 1}/` });
    }

    // Deep pages (>= 8) get noindex to preserve crawl budget
    const robotsMeta = currentPage >= NOINDEX_THRESHOLD
      ? [{ name: "robots", content: "noindex, follow" }]
      : [];

    return {
      meta: [
        ...formatMetaTags(meta, { locale, locales: loaderData?.locales }),
        ...robotsMeta,
      ],
      links: [
        ...getAlternateLinks(pathname, loaderData?.locales),
        getCanonicalLink(locale, pathname),
        ...paginationLinks,
      ],
      scripts: formatStructuredData([
        getOrganizationSchema({ locale }),
        getWebSiteSchema(locale),
        breadcrumbSchema,
        getCollectionPageSchema({
          name: `Better i18n Blog — Page ${currentPage}`,
          description: "Latest updates, tutorials, and insights about internationalization and localization.",
          url: `${SITE_URL}/${locale}/blog/page/${currentPage}/`,
          inLanguage: locale,
        }),
      ]),
    };
  },
  component: PaginatedBlogPage,
  notFoundComponent: PaginatedBlogNotFound,
});

function PaginatedBlogPage() {
  const { posts, locale, totalPages, currentPage } = Route.useLoaderData();
  const t = useT("blog");

  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Header */}
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
              currentPage={currentPage}
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

function PaginatedBlogNotFound() {
  const t = useT("blog");
  const { locale } = Route.useParams();

  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("notFound.title", { defaultValue: "Page not found" })}
          </h1>
          <p className="mt-4 text-lg text-mist-600">
            {t("notFound.description", {
              defaultValue: "The page you're looking for doesn't exist.",
            })}
          </p>
          <Link
            to="/$locale/blog"
            params={{ locale }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
          >
            {t("backToBlog", { defaultValue: "Back to Blog" })}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
