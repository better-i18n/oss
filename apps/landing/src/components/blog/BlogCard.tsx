import { Link } from "@tanstack/react-router";
import type { BlogPostListItem } from "@/lib/content";

interface BlogCardProps {
  post: BlogPostListItem;
  locale: string;
  priority?: boolean;
}

function formatShortDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  return (
    <Link
      to="/$locale/blog/$slug"
      params={{ locale, slug: post.slug }}
      className="group flex flex-col py-7"
    >
      {/* Category + Date */}
      <div className="flex items-center justify-between mb-3">
        {post.category ? (
          <span className="text-[13px]/[1.4] text-mist-500">{post.category}</span>
        ) : <span />}
        {post.publishedAt && (
          <time className="text-[13px]/[1.4] text-mist-400" dateTime={post.publishedAt}>
            {formatShortDate(post.publishedAt, locale)}
          </time>
        )}
      </div>

      {/* Title */}
      <h2 className="text-[16px]/[1.35] font-semibold tracking-[-0.015em] text-mist-950 group-hover:text-mist-600 transition-colors md:text-[18px]/[1.3]">
        {post.title}
      </h2>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="mt-2.5 text-[14px]/[1.6] text-mist-500 line-clamp-3">
          {post.excerpt}
        </p>
      )}

      {/* Author */}
      {post.authorName && (
        <div className="flex items-center gap-2 mt-auto pt-4">
          {post.authorAvatar ? (
            <img
              src={post.authorAvatar}
              alt=""
              width={20}
              height={20}
              className="size-5 rounded-full object-cover [image-orientation:from-image]"
            />
          ) : (
            <div className="size-5 rounded-full bg-mist-200 flex items-center justify-center text-[9px] font-semibold text-mist-600">
              {post.authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-[13px]/[1.4] text-mist-500">{post.authorName}</span>
        </div>
      )}
    </Link>
  );
}
