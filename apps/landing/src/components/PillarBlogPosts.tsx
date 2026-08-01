import { Link } from "@tanstack/react-router";
import type { BlogPostListItem } from "@/lib/content";
import { useT } from "@/lib/i18n";

interface PillarBlogPostsProps {
  readonly posts: readonly BlogPostListItem[];
  readonly locale: string;
}

export function PillarBlogPosts({ posts, locale }: PillarBlogPostsProps) {
  const t = useT("blog");

  if (posts.length === 0) return null;

  return (
    <section>
      <div className="section">
        <h2 className="section-h2 mb-8">
          {t("relatedArticles")}
        </h2>
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to="/$locale/blog/$slug/"
              params={{ locale, slug: post.slug }}
              className="group flex flex-col"
            >
              <h3 className="font-display text-[15px]/[1.4] font-medium text-mist-950 group-hover:text-mist-700 transition-colors line-clamp-2">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="mt-2.5 text-sm text-mist-500 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
              <span className="mt-4 text-sm font-medium text-mist-700">
                {t("readMore")} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
