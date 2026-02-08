import { createFileRoute, Link } from "@tanstack/react-router";
import { getPosts, type GhostPost } from "@/lib/ghost";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconArrowRight,
  IconPageText,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
  SITE_URL,
} from "@/lib/meta";
import {
  getBreadcrumbSchema,
  formatStructuredData,
  getOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/structured-data";

export const Route = createFileRoute("/$locale/blog/")({
  loader: async ({ params, context }) => {
    const { posts, pagination } = await getPosts(params.locale, { limit: 12 });
    return {
      posts,
      pagination,
      messages: context.messages,
      locale: context.locale,
    };
  },
  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const pathname = "/blog";
    const meta = getLocalizedMeta(loaderData?.messages || {}, "blog", {
      locale,
      pathname,
    });

    const breadcrumbSchema = getBreadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Blog", url: `${SITE_URL}/blog` },
    ]);

    return {
      meta: formatMetaTags(meta, { locale }),
      links: [
        ...getAlternateLinks(pathname),
        getCanonicalLink(locale, pathname),
      ],
      scripts: formatStructuredData([
        getOrganizationSchema(),
        getWebSiteSchema(),
        breadcrumbSchema,
      ]),
    };
  },
  component: BlogPage,
});

function BlogPage() {
  const { posts, locale } = Route.useLoaderData();
  const t = useTranslations("blog");

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

          {/* Posts Grid - matching Changelog grid style */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: GhostPost) => (
                <BlogCard key={post.id} post={post} locale={locale} />
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

          {/* See all link - matching Changelog style */}
          {posts.length > 0 && (
            <div className="mt-8 flex justify-center">
              <span className="inline-flex items-center gap-1 text-sm font-medium text-mist-500">
                {t("showingPosts", {
                  count: posts.length,
                  defaultValue: `Showing ${posts.length} posts`,
                })}
              </span>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
