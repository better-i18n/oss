import { useEffect } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { createServerFn } from "@tanstack/react-start";
import {
  getBlogPost,
  getRelatedPosts,
  formatPostDate,
} from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RelatedPages } from "@/components/RelatedPages";
import { useT } from "@/lib/i18n";
import { PROSE_CLASS } from "@/components/ProseBody";
import BlogContent from "@/components/blog/BlogContent";
import RelatedPosts from "@/components/blog/RelatedPosts";
import TableOfContents from "@/components/blog/TableOfContents";
import ReadingProgress from "@/components/blog/ReadingProgress";
import InlineCTA from "@/components/blog/InlineCTA";
import FloatingCTA from "@/components/blog/FloatingCTA";
import CommentSection from "@/components/blog/CommentSection";
import { getBlogCTA } from "@/lib/blog-ctas";
import { trackBlogView } from "@/lib/analytics-events";
import { useEngagedTime } from "@/hooks/use-engaged-time";
import { useTrackView } from "@better-i18n/content/adapters/react";
import { getRelatedPages } from "@/seo/internal-links";
// Breadcrumb removed from UI but kept for SEO structured data
import ShareButtons from "@/components/blog/ShareButtons";
import { Frame, Section, Divider } from "@/components/ui/page";
import { BlogEmptyState } from "@/components/blog/BlogGrid";
import { IconArrowLeft } from "@central-icons-react/round-outlined-radius-2-stroke-2";
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
    const { filterMessagesByPath } = await import("@/lib/page-namespaces");
    // Delegate to the single source of truth for blog namespaces
    // (blog + relatedPages + shared + page meta) instead of a hand-rolled
    // list — otherwise RelatedPages falls back to humanized key names.
    const messages = filterMessagesByPath(
      allMessages,
      `/${params.locale}/blog/${params.slug}/`,
    );
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
    const postTitle = post?.title || "Post";
    const authorName = post?.authorName || "Better I18N Team";

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
      title: truncateTitle(`${postTitle} | Better I18N`),
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

    const msgs = (loaderData?.messages ?? {}) as Record<string, any>;
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

  // Analytics: blog view + engaged time.
  // Every value the effect reads is listed. The dependency list is not a
  // throttle — the route remounts per post, so this still fires once per view,
  // and an honest list means a late-arriving field can't be silently dropped.
  useEffect(() => {
    trackBlogView({
      slug: post.slug,
      title: post.title,
      category: post.category ?? undefined,
      author: post.authorName ?? undefined,
      locale,
    });
  }, [post.slug, post.title, post.category, post.authorName, locale]);
  useEngagedTime("blog", post.slug);

  // Better i18n Content Analytics — tracks per-entry views by locale
  useTrackView("content.view", {
    entryId: post.id,
    contentModelSlug: "blog-posts",
    entrySlug: post.slug,
    language: locale,
    framework: "tanstack-start",
  });

  return (
    <div className="bg-white">
      <ReadingProgress slug={post.slug} />
      <Header className="bg-white" />
      <main>
        {/* Reading column + rail. 720px is the measure the body type was tuned
            for; the 240px rail carries navigation and attribution so neither
            competes with the prose. Both live inside the one <Frame>, so the
            page's vertical hairlines still run behind the article. */}
        <Frame style={{ paddingTop: 44, paddingBottom: 56 }}>
          {/* justify-START, not center. Centering the 720+64+240=1024px pair
              inside the 1160px frame pushed the reading column ~68px right,
              while the Related Posts <Section> below started at the frame's
              left edge — so the article, its CTA and its comments all read as
              indented against the section that follows them. The frame's left
              edge is the page's one vertical alignment line; leftover space
              belongs on the right, behind the rail. */}
          <div className="grid justify-start gap-16 lg:grid-cols-[minmax(0,720px)_240px]">
            <article className="min-w-0">
              <Link
                to="/$locale/blog/"
                params={{ locale }}
                className="inline-flex items-center gap-1.5 text-[13px] text-mist-500 transition-colors hover:text-mist-900"
              >
                <IconArrowLeft className="size-3.5" />
                {t("backToBlog")}
              </Link>

              {post.category && (
                <div className="mt-5">
                  <span className="inline-flex items-center rounded-md border border-black/[0.07] px-2.5 py-1 text-[11px] font-medium text-mist-600">
                    {post.category}
                  </span>
                </div>
              )}

              <h1
                className="mt-3.5 font-medium leading-[1.12] tracking-[-0.03em] text-mist-950"
                style={{ fontSize: "clamp(28px, 4vw, 38px)", textWrap: "balance" }}
              >
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-3.5 max-w-[60ch] text-[16px] leading-relaxed text-mist-600">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                {post.authorAvatar ? (
                  <img
                    src={post.authorAvatar}
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 shrink-0 rounded-full border border-black/[0.06] object-cover [image-orientation:from-image]"
                  />
                ) : null}
                {post.authorName && (
                  <span className="text-[13px] font-medium text-mist-900">{post.authorName}</span>
                )}
                {post.publishedAt && (
                  <time className="text-[13px] text-mist-400" dateTime={post.publishedAt}>
                    {formatPostDate(post.publishedAt, locale)}
                  </time>
                )}
                {post.readTime && (
                  <span className="text-[13px] text-mist-400">
                    {t("minRead", { count: post.readTime })}
                  </span>
                )}
                {/* Share lives in the rail on desktop; below lg the rail is gone,
                    so it rides along the byline instead of disappearing. */}
                <div className="ml-auto lg:hidden">
                  <ShareButtons url={canonicalUrl} title={post.title} slug={post.slug} />
                </div>
              </div>

              {/* Hero image only when the CMS actually has one — a placeholder
                  panel here would read as a failed image load. */}
              {post.bannerImage && (
                <img
                  src={post.bannerImage}
                  alt=""
                  className="mt-6 aspect-[16/8] w-full rounded-xl border border-black/[0.07] object-cover"
                />
              )}

              <div className="my-7 h-px bg-black/[0.06]" aria-hidden="true" />

              {post.bodyHtml && (
                <>
                {/* Mobile TOC — the rail is hidden below lg, so the same nav
                    collapses into a disclosure at the top of the article. */}
                <div className="mb-8 overflow-hidden rounded-xl border border-black/[0.07] bg-white lg:hidden">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between px-5 py-3.5 text-[13px] font-medium text-mist-700 select-none">
                      {t("tableOfContents")}
                      <SpriteIcon name="chevron-bottom" className="size-4 text-mist-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="border-t border-black/[0.05] px-5 pt-3 pb-4">
                      <TableOfContents html={post.bodyHtml} />
                    </div>
                  </details>
                </div>

                {/* One shared prose scale (components/ProseBody.tsx) — the blog
                    chain this page used to inline IS that standard now. */}
                <BlogContent html={post.bodyHtml} className={PROSE_CLASS} />

                {/* Contextual CTA — matches blog post topic */}
                <InlineCTA
                  title={cta.title}
                  description={cta.description}
                  ctaText={cta.ctaText}
                  ctaUrl={cta.ctaUrl.startsWith("http") ? cta.ctaUrl : `/${locale}${cta.ctaUrl}/`}
                  slug={post.slug}
                />
                </>
              )}

              {/* Internal links — topical cluster connections */}
              {internalLinks.length > 0 && (
                <nav className="not-prose mt-10 border-t border-black/[0.06] pt-8" aria-label="Related guides">
                  <p className="eyebrow">{t("continueReading")}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {internalLinks.map((link) => (
                      <li key={link.path}>
                        <a
                          href={`/${locale}/${link.path}/`}
                          className="inline-flex items-center rounded-md border border-black/[0.07] px-3 py-1.5 text-[13px] text-mist-700 transition-colors hover:bg-black/[0.02] hover:text-mist-900"
                        >
                          {link.anchor}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {/* Comments */}
              <CommentSection slug={post.slug} />
            </article>

            {/* Rail: contents → attribution → share. Desktop only; every item
                here has a mobile counterpart inside the article column. */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 flex flex-col gap-6">
                {post.bodyHtml && <TableOfContents html={post.bodyHtml} />}

                <div>
                  <p className="eyebrow">{t("writtenBy")}</p>
                  <div className="mt-3 flex items-center gap-2.5">
                    {post.authorAvatar ? (
                      <img
                        src={post.authorAvatar}
                        alt=""
                        width={32}
                        height={32}
                        className="size-8 shrink-0 rounded-full border border-black/[0.06] object-cover [image-orientation:from-image]"
                      />
                    ) : null}
                    {post.authorName && (
                      <p className="text-[13px] font-medium text-mist-900">{post.authorName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="eyebrow">{t("share")}</p>
                  <div className="mt-3">
                    <ShareButtons url={canonicalUrl} title={post.title} slug={post.slug} />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Frame>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <>
            <Divider />
            <Section>
              <RelatedPosts posts={relatedPosts} locale={locale} />
            </Section>
          </>
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
      <main>
        <Section>
          <BlogEmptyState
            title={t("notFound.title")}
            description={t("notFound.description")}
          >
            <Link to="/$locale/blog/" params={{ locale }} className="btn btn-dark btn-sm">
              <IconArrowLeft className="size-4" />
              {t("backToBlog")}
            </Link>
          </BlogEmptyState>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
