import { Link } from "@tanstack/react-router";
import type { BlogPostListItem } from "@/lib/content";
import { formatPostDate, getTagColor } from "@/lib/content";

interface BlogCardProps {
  post: BlogPostListItem;
  locale: string;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  return (
    <Link
      to="/$locale/blog/$slug"
      params={{ locale, slug: post.slug }}
      className="group flex flex-col rounded-xl bg-mist-950/[0.025] p-5 hover:bg-mist-950/[0.05] transition-colors"
    >
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

      {/* Author + Reading Time */}
      {(post.authorName || !!post.readTime) && (
        <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-mist-500">
          {post.authorName && (
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
          )}
          {post.authorName && (
            <span className="font-medium text-mist-700">{post.authorName}</span>
          )}
          {post.authorName && post.readTime && (
            <span className="text-mist-300">·</span>
          )}
          {post.readTime && <span>{post.readTime}</span>}
        </div>
      )}
    </Link>
  );
}
