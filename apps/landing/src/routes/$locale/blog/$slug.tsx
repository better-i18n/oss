import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getPost, formatPostDate, getDisplayTags } from "@/lib/ghost";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "@better-i18n/use-intl";
import BlogContent from "@/components/blog/BlogContent";
import {
  IconArrowLeft,
  IconCircleInfo,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

// Map tag slugs to badge colors
function getTagColor(slug: string): string {
  const colors: Record<string, string> = {
    news: "bg-emerald-500/10 text-emerald-700",
    feature: "bg-violet-500/10 text-violet-700",
    tutorial: "bg-blue-500/10 text-blue-700",
    update: "bg-amber-500/10 text-amber-700",
    announcement: "bg-rose-500/10 text-rose-700",
    guide: "bg-cyan-500/10 text-cyan-700",
  };
  return colors[slug] || "bg-mist-500/10 text-mist-700";
}

export const Route = createFileRoute("/$locale/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPost(params.slug, params.locale);
    if (!post) {
      throw notFound();
    }
    return { post, locale: params.locale };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.post?.title ?? "Post"} — Better i18n Blog`,
      },
      {
        name: "description",
        content: loaderData?.post?.excerpt ?? "",
      },
      // Open Graph
      {
        property: "og:title",
        content: loaderData?.post?.title ?? "",
      },
      {
        property: "og:description",
        content: loaderData?.post?.excerpt ?? "",
      },
      {
        property: "og:image",
        content: loaderData?.post?.feature_image ?? "",
      },
      {
        property: "og:type",
        content: "article",
      },
    ],
  }),
  component: BlogPostPage,
  notFoundComponent: BlogPostNotFound,
});

function BlogPostPage() {
  const { post, locale } = Route.useLoaderData();
  const t = useTranslations("blog");
  const displayTags = getDisplayTags(post.tags);

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
            {/* Tags */}
            {displayTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {displayTags.map((tag) => (
                  <span
                    key={tag.id}
                    className={`text-xs font-medium px-2.5 py-1 rounded ${getTagColor(tag.slug)}`}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="mt-6 flex items-center gap-4 pb-8 border-b border-mist-100">
              {post.primary_author?.profile_image && (
                <img
                  src={post.primary_author.profile_image}
                  alt={post.primary_author.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              )}
              <div>
                {post.primary_author && (
                  <p className="text-sm font-medium text-mist-950">
                    {post.primary_author.name}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-mist-500">
                  <time dateTime={post.published_at}>
                    {formatPostDate(post.published_at, locale)}
                  </time>
                  {post.reading_time > 0 && (
                    <>
                      <span>·</span>
                      <span>
                        {t("readingTime", {
                          defaultValue: "{{minutes}} min read",
                          minutes: post.reading_time,
                        })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Feature Image */}
          {post.feature_image && (
            <figure className="mt-8">
              <img
                src={post.feature_image}
                alt={post.feature_image_alt || post.title}
                className="w-full rounded-2xl object-cover aspect-video"
              />
              {post.feature_image_caption && (
                <figcaption
                  className="mt-3 text-center text-sm text-mist-500"
                  dangerouslySetInnerHTML={{
                    __html: post.feature_image_caption,
                  }}
                />
              )}
            </figure>
          )}

          {/* Content - using mist color palette */}
          <BlogContent
            html={post.html}
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
