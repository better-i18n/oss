import { Link } from "@tanstack/react-router";
import type { BlogPostListItem } from "@/lib/content";
import { useT } from "@/lib/i18n";

interface RelatedPostsProps {
  posts: BlogPostListItem[];
  locale: string;
}

export default function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  const t = useT("blog");

  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-mist-200/50 pt-8">
      <h2 className="text-[14px] font-semibold text-mist-950 mb-4">
        {t("relatedPosts", "Related")}
      </h2>

      <div className="grid gap-px grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-mist-200/50">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to="/$locale/blog/$slug/"
            params={{ locale, slug: post.slug }}
            className="group flex flex-col gap-2 py-5 sm:pr-5 border-b border-mist-200/50 sm:border-r sm:last:border-r-0"
          >
            <div className="flex items-center justify-between">
              {post.category && (
                <span className="text-[12px] text-mist-400">{post.category}</span>
              )}
              {post.readTime && (
                <span className="text-[12px] text-mist-300">{post.readTime}m</span>
              )}
            </div>

            <h3 className="text-[14px]/[1.4] font-medium text-mist-950 group-hover:text-mist-600 transition-colors line-clamp-2">
              {post.title}
            </h3>

            {post.authorName && (
              <div className="flex items-center gap-1.5 mt-auto">
                {post.authorAvatar && (
                  <img
                    src={post.authorAvatar}
                    alt=""
                    className="size-4 rounded-full object-cover [image-orientation:from-image]"
                  />
                )}
                <span className="text-[12px] text-mist-400">{post.authorName}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
