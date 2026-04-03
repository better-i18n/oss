import { useEffect } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
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
import ReadingProgress from "@/components/blog/ReadingProgress";
import InlineCTA from "@/components/blog/InlineCTA";
import FloatingCTA from "@/components/blog/FloatingCTA";
import { getBlogCTA } from "@/lib/blog-ctas";
import { trackBlogView } from "@/lib/analytics-events";
import { useEngagedTime } from "@/hooks/use-engaged-time";
import { getRelatedPages } from "@/seo/internal-links";
import Breadcrumb from "@/components/blog/Breadcrumb";
import ShareButtons from "@/components/blog/ShareButtons";
import { IconArrowLeft, IconCircleInfo } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import {
  SITE_URL,
  getAlternateLinks,
  getCanonicalLink,
  getLocalizedMeta,
  formatMetaTags,
  buildOgImageUrl,
  truncateTitle,
} from "@/lib/meta";
import {
  getArticleSchema,
  formatStructuredData,
  getOrganizationSchema,
  getBreadcrumbSchema,
} from "@/lib/structured-data";
import { getLocaleTier } from "@/seo/locale-tiers";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "@/i18n.config";

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
    return getRelatedPosts(data.slug, data.category, data.locale, 4);
  });

export const Route = createFileRoute("/$locale/blog/$slug")({
  loader: async ({ params, context }) => {
    const [post, allMessages] = await Promise.all([
      loadBlogPost({ data: { slug: params.slug, locale: params.locale } }),
      getMessages({ project: i18nConfig.project, locale: context.locale }),
    ]);
    if (!post) {
      throw notFound();
    }
    const { filterMessages } = await import("@/lib/page-namespaces");
    const messages = filterMessages(allMessages, ["breadcrumbs"]);
    const relatedPosts = await loadRelatedPosts({
      data: {
        slug: params.slug,
        category: post.category,
        locale: params.locale,
      },
    });
    return { post, locale: params.locale, relatedPosts, messages };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    const locale = loaderData?.locale || "en";
    const pathname = `/blog/${post?.slug || ""}`;

    // Prefer CMS banner image for OG meta, fall back to dynamic OG service
    const dynamicOgImage = post?.bannerImage ?? buildOgImageUrl("og/blog", {
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
    const postTitle = post?.title || "Post";
    const authorName = post?.authorName || "Better i18n Team";

    // Build base meta using getLocalizedMeta with article type
    const meta = getLocalizedMeta(
      {},
      "",
      {
        locale,
        pathname,
        ogImage: dynamicOgImage,
        ogType: "article",
      },
    );

    // Override with blog-specific values (immutable spread)
    const blogMeta = {
      ...meta,
      title: truncateTitle(`${postTitle} | Better i18n`),
      description: excerpt,
      ogTitle: postTitle,
      ogDescription: excerpt,
    };

    // Use formatMetaTags for consistent meta tag generation
    const availableLanguages = post?.availableLanguages ?? [];
    const baseTags = formatMetaTags(blogMeta, {
      locale,
      locales: availableLanguages.length > 0 ? [...availableLanguages] : undefined,
      publishedTime: post?.publishedAt || post?.createdAt || "",
      modifiedTime: post?.updatedAt || post?.publishedAt || post?.createdAt || "",
      author: authorName,
      noindex: getLocaleTier(locale) === "tier3",
    });

    // Article-specific tags that formatMetaTags does not cover
    const articleSpecificTags = [
      ...(post?.category ? [{ property: "article:section", content: post.category }] : []),
      ...(post?.category ? [{ property: "article:tag", content: post.category }] : []),
      ...(post?.category ? [{ name: "keywords", content: post.category }] : []),
    ];

    // Override the default author with blog-specific author name
    const metaTags = baseTags.map((tag) =>
      "name" in tag && tag.name === "author"
        ? { ...tag, content: authorName }
        : tag,
    );

    // Structured data: organization + breadcrumb + article schema
    const canonicalUrl = blogMeta.canonicalUrl;
    const wordCount = post?.body ? post.body.split(/\s+/).filter(Boolean).length : undefined;
    const timeRequired = post?.readTime ? `PT${parseInt(post.readTime)}M` : undefined;

    const articleSchema = post ? getArticleSchema({
      title: post.title,
      description: excerpt,
      url: canonicalUrl,
      image: dynamicOgImage,
      publishedTime: post.publishedAt || post.createdAt || "",
      modifiedTime: post.updatedAt || post.publishedAt || post.createdAt || "",
      author: {
        name: authorName,
        url: `${SITE_URL}/en/about`,
        sameAs: ["https://better-i18n.com", "https://twitter.com/betteri18n"],
      },
      wordCount,
      timeRequired,
      articleSection: post.category || undefined,
      type: "BlogPosting",
      inLanguage: locale,
    }) : null;

    const msgs = (loaderData?.messages ?? {}) as Record<string, string>;
    const breadcrumbSchema = getBreadcrumbSchema([
      { name: msgs["breadcrumbs.home"] ?? "Home", url: `${SITE_URL}/${locale}/` },
      { name: msgs["breadcrumbs.blog"] ?? "Blog", url: `${SITE_URL}/${locale}/blog/` },
      { name: postTitle, url: canonicalUrl },
    ]);

    const schemas: object[] = [getOrganizationSchema(), breadcrumbSchema];
    if (articleSchema) {
      schemas.push(articleSchema);
    }

    return {
      meta: [...metaTags, ...articleSpecificTags],
      links: [
        ...getAlternateLinks(
          pathname,
          availableLanguages.length > 0
            ? [...availableLanguages]
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
  const cta = getBlogCTA(post.slug, post.category);
  const internalLinks = getRelatedPages(`blog/${post.slug}`);

  const canonicalUrl = `${SITE_URL}/${locale}/blog/${post.slug}`;

  // Analytics: blog view + engaged time
  useEffect(() => {
    trackBlogView({
      slug: post.slug,
      title: post.title,
      category: post.category ?? undefined,
      author: post.authorName ?? undefined,
      locale,
    });
  }, [post.slug]);
  useEngagedTime("blog", post.slug);

  // Prefer CMS banner image for hero, fall back to dynamic OG service
  const heroBannerUrl = post.bannerImage ?? buildOgImageUrl("og/blog", {
    title: post.title,
    author: post.authorName ?? undefined,
    authorImage: post.authorAvatar ?? undefined,
    tag: post.category ?? undefined,
    date: post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined,
  });

  return (
    <div className="bg-white">
      <ReadingProgress slug={post.slug} />
      <Header className="bg-white" />
      <main>
        {/* Article header - centered, generous spacing */}
        <div className="mx-auto max-w-3xl px-6 lg:px-10 pt-12 pb-10">
          <Breadcrumb locale={locale} title={post.title} />

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
                      width={44}
                      height={44}
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
                      <span>{t("minRead", { defaultValue: "{count} min read", count: post.readTime })}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <ShareButtons url={canonicalUrl} title={post.title} slug={post.slug} />
          </div>

          {/* Hero banner image */}
          <div className="mt-10 aspect-[1200/630] rounded-xl overflow-hidden bg-mist-50">
            <img
              src={heroBannerUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
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
                      <SpriteIcon name="chevron-bottom" className="w-4 h-4 text-mist-400 transition-transform group-open:rotate-180" />
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
                    prose-pre:p-0 prose-pre:bg-transparent prose-pre:rounded-none prose-pre:my-0 prose-pre:border-0 prose-pre:shadow-none
                    prose-code:text-mist-900 prose-code:bg-mist-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                    prose-blockquote:border-l-2 prose-blockquote:border-mist-200 prose-blockquote:pl-6 prose-blockquote:text-mist-600 prose-blockquote:not-italic prose-blockquote:font-normal
                    prose-img:rounded-xl prose-img:shadow-sm
                    prose-li:text-mist-700 prose-li:leading-[1.8]
                    prose-hr:border-mist-100"
                />

                {/* Contextual CTA — matches blog post topic */}
                <InlineCTA
                  title={cta.title}
                  description={cta.description}
                  ctaText={cta.ctaText}
                  ctaUrl={cta.ctaUrl.startsWith("http") ? cta.ctaUrl : `/${locale}${cta.ctaUrl}/`}
                  slug={post.slug}
                />

                {/* Internal links — topical cluster connections */}
                {internalLinks.length > 0 && (
                  <nav className="mt-10 not-prose border-t border-mist-100 pt-8" aria-label="Related guides">
                    <p className="text-sm font-medium text-mist-500 uppercase tracking-wider mb-3">
                      {t("continueReading", { defaultValue: "Continue reading" })}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {internalLinks.map((link) => (
                        <li key={link.path}>
                          <a
                            href={`/${locale}/${link.path}/`}
                            className="inline-flex items-center gap-1 rounded-lg border border-mist-200 bg-mist-50/50 px-3 py-1.5 text-sm text-mist-700 hover:bg-mist-100 hover:text-mist-900 transition-colors"
                          >
                            {link.anchor}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
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
          <div className="mx-auto max-w-7xl px-6 lg:px-10 pb-16">
            <RelatedPosts posts={relatedPosts} locale={locale} />
          </div>
        )}
      </main>
      <RelatedPages currentPage="blog" locale={locale} variant="mixed" />
      <Footer />

      {/* Floating CTA — appears after 40% scroll */}
      <FloatingCTA
        ctaText={cta.ctaText}
        ctaUrl={cta.ctaUrl.startsWith("http") ? cta.ctaUrl : `/${locale}${cta.ctaUrl}/`}
        slug={post.slug}
      />
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

          <p className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("notFound.title", { defaultValue: "Post not found" })}
          </p>
          <p className="mt-4 text-lg text-mist-600">
            {t("notFound.description", {
              defaultValue:
                "The post you're looking for doesn't exist or has been removed.",
            })}
          </p>
          <Link
            to="/$locale/blog/"
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
