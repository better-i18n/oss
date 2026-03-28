import { Link } from "@tanstack/react-router";
import type { BlogPostListItem } from "@/lib/content";
import { formatPostDate, getTagColor } from "@/lib/content";
import { buildOgImageUrl } from "@/lib/meta";
import { useT } from "@/lib/i18n";
import { SpriteIcon } from "@/components/SpriteIcon";

interface RelatedPostsProps {
  posts: BlogPostListItem[];
  locale: string;
}

export default function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  const t = useT("blog");

  if (posts.length === 0) return null;

  return (
    <section className="mt-20 pt-12 border-t border-mist-100">
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-mist-500">
          {t("relatedEyebrow", { defaultValue: "Related" })}
        </p>
        <h2 className="mt-2 font-display text-2xl/[1.08] font-medium tracking-[-0.02em] text-mist-950">
          {t("relatedPosts", "Related Posts")}
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const bannerUrl = buildOgImageUrl("og/blog", {
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
            <Link
              key={post.slug}
              to="/$locale/blog/$slug/"
              params={{ locale, slug: post.slug }}
              className="group flex flex-col rounded-2xl border border-mist-200 bg-white overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-mist-300 hover:shadow-md"
            >
              <div className="aspect-[1200/630] overflow-hidden bg-mist-100">
                <img
                  src={bannerUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col flex-1 justify-between p-5">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {post.category && (
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getTagColor(post.category)}`}>
                        {post.category}
                      </span>
                    )}
                    {post.readTime && (
                      <span className="text-xs text-mist-400">
                        {t("minRead", { defaultValue: "{count} min read", count: post.readTime })}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-[15px]/[1.4] font-medium text-mist-950 group-hover:text-mist-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-mist-500 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-mist-400">
                    {post.authorName && (
                      <span className="font-medium text-mist-600">{post.authorName}</span>
                    )}
                    {post.authorName && post.publishedAt && (
                      <span className="text-mist-300">&middot;</span>
                    )}
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt}>
                        {formatPostDate(post.publishedAt, locale)}
                      </time>
                    )}
                  </div>
                  <SpriteIcon
                    name="arrow-right"
                    className="h-4 w-4 text-mist-300 transition-all group-hover:translate-x-0.5 group-hover:text-mist-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
