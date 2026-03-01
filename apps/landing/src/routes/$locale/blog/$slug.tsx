import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  getBlogPost,
  getRelatedPosts,
  formatPostDate,
  getTagColor,
} from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RelatedPages } from "@/components/RelatedPages";
import { useT } from "@/lib/i18n";
import BlogContent from "@/components/blog/BlogContent";
import RelatedPosts from "@/components/blog/RelatedPosts";
import TableOfContents from "@/components/blog/TableOfContents";
import {
  IconArrowLeft,
  IconChevronBottom,
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

const loadRelatedPosts = createServerFn({ method: "GET" })
  .inputValidator(
    (data: { slug: string; category: string | null; locale: string }) => data,
  )
  .handler(async ({ data }) => {
    return getRelatedPosts(data.slug, data.category, data.locale);
  });

export const Route = createFileRoute("/$locale/blog/$slug")({
  loader: async ({ params }) => {
    const post = await loadBlogPost({
      data: { slug: params.slug, locale: params.locale },
    });
    if (!post) {
      throw notFound();
    }
    const relatedPosts = await loadRelatedPosts({
      data: {
        slug: params.slug,
        category: post.category,
        locale: params.locale,
      },
    });
    return { post, locale: params.locale, relatedPosts };
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

    const excerpt = post?.excerpt || "";

    const wordCount = post?.body ? post.body.split(/\s+/).filter(Boolean).length : undefined;
    const timeRequired = post?.readTime ? `PT${parseInt(post.readTime)}M` : undefined;

    const articleSchema = post ? getArticleSchema({
      title: post.title,
      description: excerpt,
      url: canonicalUrl,
      image: dynamicOgImage,
      publishedTime: post.publishedAt || "",
      modifiedTime: post.publishedAt || "",
      author: {
        name: post.authorName || "Better i18n Team",
      },
      wordCount,
      timeRequired,
      articleSection: post.category || undefined,
    }) : null;

    const breadcrumbSchema = getBreadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/${locale}` },
      { name: "Blog", url: `${SITE_URL}/${locale}/blog` },
      { name: post?.title || "Post", url: canonicalUrl },
    ]);

    const schemas: object[] = [getOrganizationSchema(), breadcrumbSchema];
    if (articleSchema) {
      schemas.push(articleSchema);
    }

    return {
      meta: [
        { title: `${post?.title || "Post"} - Better i18n Blog` },
        { name: "description", content: excerpt },
        { property: "og:title", content: post?.title || "" },
        { property: "og:description", content: excerpt },
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
        { property: "article:section", content: post?.category || "" },
        { property: "article:tag", content: post?.category || "" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@betteri18n" },
        { name: "twitter:title", content: post?.title || "" },
        { name: "twitter:description", content: excerpt },
        { name: "twitter:image", content: dynamicOgImage },
        { name: "robots", content: "index, follow" },
      ],
      links: [
        ...getAlternateLinks(
          pathname,
          post?.availableLanguages?.length
            ? [...post.availableLanguages]
            : undefined,
        ),
        getCanonicalLink(locale, pathname),
      ],
      scripts: formatStructuredData(schemas),
    };
  },
  component: BlogPostPage,
  notFoundComponent: BlogPostNotFound,
});

function BlogPostPage() {
  const { post, locale, relatedPosts } = Route.useLoaderData();
  const t = useT("blog");

  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main>
        {/* Article header - centered, generous spacing */}
        <div className="mx-auto max-w-3xl px-6 lg:px-10 pt-12 pb-10">
          <Link
            to="/$locale/blog"
            params={{ locale }}
            className="inline-flex items-center gap-1.5 text-sm text-mist-500 hover:text-mist-950 transition-colors mb-10 group"
          >
            <IconArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            {t("backToBlog", { defaultValue: "Back to Blog" })}
          </Link>

          {post.category && (
            <span
              className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-5 ${getTagColor(post.category)}`}
            >
              {post.category}
            </span>
          )}

          <h1 className="font-display text-4xl/[1.15] font-medium tracking-[-0.025em] text-mist-950 sm:text-5xl/[1.1] text-balance">
            {post.title}
          </h1>

          {/* Author & meta row */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {post.authorName && (
                <div className="flex-shrink-0">
                  {post.authorAvatar ? (
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-mist-100"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-mist-200 to-mist-300 flex items-center justify-center text-sm font-semibold text-mist-700">
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-col">
                {post.authorName && (
                  <span className="text-sm font-medium text-mist-950">
                    {post.authorName}
                  </span>
                )}
                <div className="flex items-center gap-2 text-sm text-mist-500">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {formatPostDate(post.publishedAt, locale)}
                    </time>
                  )}
                  {post.readTime && (
                    <>
                      <span className="text-mist-300">&middot;</span>
                      <span>{post.readTime}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <div className="border-t border-mist-100" />
        </div>

        {/* Content area with TOC on the right */}
        {post.bodyHtml && (
          <div className="mx-auto max-w-6xl px-6 lg:px-10 pt-10 pb-16">
            <div className="lg:flex lg:gap-16">
              {/* Main content - left side */}
              <article className="min-w-0 flex-1 max-w-3xl">
                {/* Mobile TOC */}
                <div className="lg:hidden mb-10 rounded-xl bg-mist-50/60 border border-mist-100 overflow-hidden">
                  <details className="group">
                    <summary className="flex items-center justify-between px-5 py-3.5 text-sm font-medium text-mist-700 cursor-pointer select-none">
                      {t("tableOfContents", { defaultValue: "Table of Contents" })}
                      <IconChevronBottom className="w-4 h-4 text-mist-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-5 pb-4 border-t border-mist-100 pt-3">
                      <TableOfContents html={post.bodyHtml} />
                    </div>
                  </details>
                </div>

                <BlogContent
                  html={post.bodyHtml}
                  className="prose prose-lg max-w-none
                    prose-headings:font-display prose-headings:font-medium prose-headings:tracking-[-0.02em] prose-headings:text-mist-950
                    prose-headings:scroll-mt-24
                    prose-p:text-mist-700 prose-p:leading-[1.8]
                    prose-a:text-mist-950 prose-a:underline-offset-4 prose-a:decoration-mist-300 hover:prose-a:decoration-mist-500
                    prose-strong:text-mist-900 prose-strong:font-semibold
                    prose-code:text-mist-900 prose-code:bg-mist-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                    prose-blockquote:border-l-2 prose-blockquote:border-mist-200 prose-blockquote:pl-6 prose-blockquote:text-mist-600 prose-blockquote:not-italic prose-blockquote:font-normal
                    prose-img:rounded-xl prose-img:shadow-sm
                    prose-li:text-mist-700 prose-li:leading-[1.8]
                    prose-hr:border-mist-100"
                />
              </article>

              {/* TOC sidebar - desktop only, right side */}
              <aside className="hidden lg:block lg:w-56 lg:flex-shrink-0">
                <div className="sticky top-24">
                  <TableOfContents html={post.bodyHtml} />
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mx-auto max-w-5xl px-6 lg:px-10 pb-16">
            <RelatedPosts posts={relatedPosts} locale={locale} />
          </div>
        )}
      </main>
      <RelatedPages currentPage="blog" locale={locale} variant="mixed" />
      <Footer />
    </div>
  );
}

function BlogPostNotFound() {
  const t = useT("blog");
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
