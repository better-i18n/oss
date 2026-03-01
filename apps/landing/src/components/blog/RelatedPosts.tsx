import { Link } from "@tanstack/react-router";
import type { BlogPostListItem } from "@/lib/content";
import { formatPostDate, getTagColor } from "@/lib/content";
import { buildOgImageUrl } from "@/lib/meta";
import { useT } from "@/lib/i18n";

interface RelatedPostsProps {
  posts: BlogPostListItem[];
  locale: string;
}

export default function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  const t = useT("blog");

  if (posts.length === 0) return null;

  return (
    <section className="mt-20 pt-12 border-t border-mist-100">
      <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-mist-950 mb-8">
        {t("relatedPosts", "Related Posts")}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              to="/$locale/blog/$slug"
              params={{ locale, slug: post.slug }}
              className="group block rounded-2xl bg-mist-50/50 hover:bg-mist-50 transition-all duration-200 overflow-hidden"
            >
              <div className="aspect-[1200/630] overflow-hidden bg-mist-950/5">
                <img
                  src={bannerUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  {post.category && (
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getTagColor(post.category)}`}
                    >
                      {post.category}
                    </span>
                  )}
                  {post.readTime && (
                    <span className="text-xs text-mist-400">{post.readTime}</span>
                  )}
                </div>
                <h3 className="font-display text-[15px]/[1.4] font-medium text-mist-950 group-hover:text-mist-700 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2.5 text-sm text-mist-500 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2.5 text-xs text-mist-400">
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
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
