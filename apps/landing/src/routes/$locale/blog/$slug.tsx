import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getBlogPost, formatPostDate, getTagColor } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "@better-i18n/use-intl";
import BlogContent from "@/components/blog/BlogContent";
import {
  IconArrowLeft,
  IconCircleInfo,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import {
  SITE_URL,
  getAlternateLinks,
  getCanonicalLink,
  buildOgImageUrl,
} from "@/lib/meta";
import {
  getArticleSchema,
  formatStructuredData,
  getOrganizationSchema,
  getBreadcrumbSchema,
} from "@/lib/structured-data";

const loadBlogPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }) => {
    return getBlogPost(data.slug, data.locale);
  });

export const Route = createFileRoute("/$locale/blog/$slug")({
  loader: async ({ params }) => {
    const post = await loadBlogPost({ data: { slug: params.slug, locale: params.locale } });
    if (!post) {
      throw notFound();
    }
    return { post, locale: params.locale };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    const locale = loaderData?.locale || "en";
    const pathname = `/blog/${post?.slug || ""}`;
    const canonicalUrl = `${SITE_URL}/${locale}${pathname}`;

    // Generate dynamic OG image URL via external OG service
    const dynamicOgImage = buildOgImageUrl("og/blog", {
      title: post?.title || "Blog Post",
      author: post?.authorName ?? undefined,
      authorImage: post?.authorAvatar ?? undefined,
      date: post?.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : undefined,
      tag: post?.category ?? undefined,
    });

    const articleSchema = post ? getArticleSchema({
      title: post.title,
      description: "",
      url: canonicalUrl,
      image: dynamicOgImage,
      publishedTime: post.publishedAt || "",
      modifiedTime: post.publishedAt || "",
      author: {
        name: post.authorName || "Better i18n Team",
      },
    }) : null;

    const breadcrumbSchema = getBreadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Blog", url: `${SITE_URL}/blog` },
      { name: post?.title || "Post", url: canonicalUrl },
    ]);

    const schemas: object[] = [getOrganizationSchema(), breadcrumbSchema];
    if (articleSchema) {
      schemas.push(articleSchema);
    }

    return {
      meta: [
        { title: `${post?.title || "Post"} - Better i18n Blog` },
        { name: "description", content: "" },
        { property: "og:title", content: post?.title || "" },
        { property: "og:description", content: "" },
        { property: "og:image", content: dynamicOgImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:site_name", content: "Better i18n" },
        { property: "og:locale", content: locale },
        { property: "article:published_time", content: post?.publishedAt || "" },
        { property: "article:modified_time", content: post?.publishedAt || "" },
        { property: "article:author", content: post?.authorName || "" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@betteri18n" },
        { name: "twitter:title", content: post?.title || "" },
        { name: "twitter:description", content: "" },
        { name: "twitter:image", content: dynamicOgImage },
        { name: "robots", content: "index, follow" },
      ],
      links: [
        ...getAlternateLinks(pathname),
        getCanonicalLink(locale, pathname),
      ],
      scripts: formatStructuredData(schemas),
    };
  },
  component: BlogPostPage,
  notFoundComponent: BlogPostNotFound,
});

function BlogPostPage() {
  const { post, locale } = Route.useLoaderData();
  const t = useTranslations("blog");

  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main className="py-16">
        <article className="mx-auto max-w-3xl px-6 lg:px-10">
          {/* Back link */}
          <Link
            to="/$locale/blog"
            params={{ locale }}
            className="inline-flex items-center gap-2 text-sm font-medium text-mist-700 hover:text-mist-950 transition-colors mb-8"
          >
            <IconArrowLeft className="w-4 h-4" />
            {t("backToBlog", { defaultValue: "Back to Blog" })}
          </Link>

          {/* Header */}
          <header>
            {/* Category */}
            {post.category && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded ${getTagColor(post.category)}`}
                >
                  {post.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="mt-6 flex items-center gap-4 pb-8 border-b border-mist-100">
              {post.authorName && (
                <div className="flex-shrink-0">
                  {post.authorAvatar ? (
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-mist-200 flex items-center justify-center text-sm font-semibold text-mist-600">
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
              <div>
                {post.authorName && (
                  <p className="text-sm font-medium text-mist-950">
                    {post.authorName}
                  </p>
                )}
                {post.publishedAt && (
                  <p className="text-sm text-mist-500">
                    <time dateTime={post.publishedAt}>
                      {formatPostDate(post.publishedAt, locale)}
                    </time>
                  </p>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          {post.bodyHtml && (
            <BlogContent
              html={post.bodyHtml}
              className="prose prose-lg max-w-none mt-10
                prose-headings:font-display prose-headings:font-medium prose-headings:tracking-[-0.02em] prose-headings:text-mist-950
                prose-p:text-mist-700 prose-p:leading-relaxed
                prose-a:text-mist-950 prose-a:underline-offset-4 prose-a:decoration-mist-300 hover:prose-a:decoration-mist-500
                prose-strong:text-mist-900 prose-strong:font-semibold
                prose-code:text-mist-900 prose-code:bg-mist-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                prose-blockquote:border-l-mist-300 prose-blockquote:text-mist-600 prose-blockquote:not-italic
                prose-img:rounded-xl
                prose-li:text-mist-700
                prose-hr:border-mist-100"
            />
          )}

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-mist-100">
            <Link
              to="/$locale/blog"
              params={{ locale }}
              className="inline-flex items-center gap-2 text-sm font-medium text-mist-700 hover:text-mist-950 transition-colors"
            >
              <IconArrowLeft className="w-4 h-4" />
              {t("backToBlog", { defaultValue: "Back to Blog" })}
            </Link>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function BlogPostNotFound() {
  const t = useTranslations("blog");
  const { locale } = Route.useParams();

  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-mist-100 flex items-center justify-center">
            <IconCircleInfo className="h-8 w-8 text-mist-400" />
          </div>

          <h1 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("notFound.title", { defaultValue: "Post not found" })}
          </h1>
          <p className="mt-4 text-lg text-mist-600">
            {t("notFound.description", {
              defaultValue:
                "The post you're looking for doesn't exist or has been removed.",
            })}
          </p>
          <Link
            to="/$locale/blog"
            params={{ locale }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            {t("backToBlog", { defaultValue: "Back to Blog" })}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
