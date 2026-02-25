import { Link } from "@tanstack/react-router";
import type { BlogPostListItem } from "@/lib/content";
import { formatPostDate, getTagColor } from "@/lib/content";
import { buildOgImageUrl } from "@/lib/meta";

interface BlogCardProps {
  post: BlogPostListItem;
  locale: string;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
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
      to="/$locale/blog/$slug"
      params={{ locale, slug: post.slug }}
      className="group flex flex-col rounded-xl bg-mist-950/[0.025] p-5 hover:bg-mist-950/[0.05] transition-colors"
    >
      {/* Banner Image */}
      <div className="aspect-[1200/630] mb-4 rounded-lg overflow-hidden bg-mist-950/5">
        <img
          src={bannerUrl}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Meta: Category + Date */}
      <div className="flex items-center gap-3 text-mist-500 mb-3">
        {post.category && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${getTagColor(post.category)}`}
          >
            {post.category}
          </span>
        )}
        {post.publishedAt && (
          <time className="text-sm" dateTime={post.publishedAt}>
            {formatPostDate(post.publishedAt, locale)}
          </time>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base/7 font-medium text-mist-950 group-hover:text-mist-700 transition-colors">
        {post.title}
      </h3>

      {/* Author */}
      {post.authorName && (
        <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-mist-500">
          <div className="flex-shrink-0">
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-mist-200 flex items-center justify-center text-[10px] font-semibold text-mist-600">
                {post.authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="font-medium text-mist-700">{post.authorName}</span>
        </div>
      )}
    </Link>
  );
}
