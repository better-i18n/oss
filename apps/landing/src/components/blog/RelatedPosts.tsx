import { Link } from "@tanstack/react-router";
import type { BlogPostListItem } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/page";
import { assetImage } from "@/lib/asset-image";

interface RelatedPostsProps {
  posts: BlogPostListItem[];
  locale: string;
}

/**
 * "Read next" — plain columns separated by gap, no frame.
 *
 * Deliberately NOT the hairline grid used by the blog index: this block closes an
 * article rather than presenting a browsable collection, so boxing four items
 * inside a bordered container would add a second, competing card right under the
 * prose. Same treatment as the pricing comparison columns — the gap does the
 * separating and the type hierarchy does the rest.
 */
export default function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  const t = useT("blog");

  if (posts.length === 0) return null;

  return (
    <>
      <SectionHeader eyebrow={t("relatedEyebrow")} title={t("relatedPosts")} />
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to="/$locale/blog/$slug/"
            params={{ locale, slug: post.slug }}
            className="group flex flex-col"
          >
            {post.category && (
              <p className="text-[11px] font-medium text-mist-400">{post.category}</p>
            )}

            <h3 className="mt-2 line-clamp-3 flex-1 text-[15px] font-medium leading-[1.35] tracking-[-0.015em] text-mist-900 transition-colors group-hover:text-mist-600">
              {post.title}
            </h3>

            <div className="mt-3 flex items-center gap-2">
              {post.authorAvatar ? (
                <img
                  src={assetImage(post.authorAvatar, 18)}
                  alt=""
                  width={18}
                  height={18}
                  loading="lazy"
                  className="size-[18px] shrink-0 rounded-full border border-black/[0.06] object-cover [image-orientation:from-image]"
                />
              ) : null}
              {post.authorName && (
                <span className="truncate text-[12px] text-mist-500">{post.authorName}</span>
              )}
              {post.readTime && (
                <span className="ml-auto shrink-0 text-[12px] tabular-nums text-mist-500">
                  {t("minRead", { count: post.readTime })}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
