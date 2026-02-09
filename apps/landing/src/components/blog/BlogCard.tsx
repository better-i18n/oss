import { Link } from "@tanstack/react-router";
import type { BlogPostListItem } from "@/lib/content";
import { formatPostDate, getTagColor } from "@/lib/content";
import { useTranslations } from "@better-i18n/use-intl";

interface BlogCardProps {
  post: BlogPostListItem;
  locale: string;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  const t = useTranslations("blog");
  const primaryTag = post.tags[0];

  return (
    <Link
      to="/$locale/blog/$slug"
      params={{ locale, slug: post.slug }}
      className="group flex flex-col rounded-xl bg-mist-950/[0.025] p-5 hover:bg-mist-950/[0.05] transition-colors"
    >
      {/* Feature Image */}
      {post.featuredImage && (
        <div className="relative overflow-hidden rounded-lg mb-4 -mx-1 -mt-1">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      {/* Meta: Tag + Date */}
      <div className="flex items-center gap-3 text-mist-500 mb-3">
        {primaryTag && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${getTagColor(primaryTag)}`}
          >
            {primaryTag}
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

      {/* Excerpt */}
      {post.excerpt && (
        <p className="mt-2 text-sm text-mist-600 line-clamp-2">
          {post.excerpt}
        </p>
      )}

      {/* Author + Reading Time */}
      {(post.author || post.readingTime > 0) && (
        <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-mist-500">
          {post.author?.image && (
            <img
              src={post.author.image}
              alt={post.author.name}
              className="h-5 w-5 rounded-full object-cover"
            />
          )}
          {post.author && (
            <span className="font-medium text-mist-700">
              {post.author.name}
            </span>
          )}
          {post.author && post.readingTime > 0 && (
            <span className="text-mist-300">·</span>
          )}
          {post.readingTime > 0 && (
            <span>
              {t("readingTime", {
                defaultValue: "{{minutes}} min read",
                minutes: post.readingTime,
              })}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
