import { Link } from "@tanstack/react-router";
import type { BlogPostListItem } from "@/lib/content";
import { formatPostDate, getTagColor } from "@/lib/content";
import { useT } from "@/lib/i18n";

interface RelatedPostsProps {
  posts: BlogPostListItem[];
  locale: string;
}

export default function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  const t = useT("blog");

  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-mist-100">
      <h2 className="font-display text-2xl font-medium tracking-[-0.02em] text-mist-950 mb-8">
        {t("relatedPosts", "Related Posts")}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to="/$locale/blog/$slug"
            params={{ locale, slug: post.slug }}
            className="group block rounded-xl border border-mist-100 p-5 hover:border-mist-200 hover:shadow-sm transition-all"
          >
            {post.category && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${getTagColor(post.category)}`}
              >
                {post.category}
              </span>
            )}
            <h3 className="mt-3 font-display text-base font-medium text-mist-950 group-hover:text-mist-700 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <div className="mt-3 flex items-center gap-3 text-xs text-mist-500">
              {post.authorName && <span>{post.authorName}</span>}
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {formatPostDate(post.publishedAt, locale)}
                </time>
              )}
              {post.readTime && <span>{post.readTime}</span>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
