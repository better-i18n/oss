import { Link } from "@tanstack/react-router";
import type { GhostPost } from "@/lib/ghost";
import { formatPostDate, getDisplayTags } from "@/lib/ghost";
import { useTranslations } from "@better-i18n/use-intl";

interface BlogCardProps {
  post: GhostPost;
  locale: string;
}

// Map tag slugs to badge colors (matching Changelog style)
function getTagColor(slug: string): string {
  const colors: Record<string, string> = {
    news: "bg-emerald-500/10 text-emerald-700",
    feature: "bg-violet-500/10 text-violet-700",
    tutorial: "bg-blue-500/10 text-blue-700",
    update: "bg-amber-500/10 text-amber-700",
    announcement: "bg-rose-500/10 text-rose-700",
    guide: "bg-cyan-500/10 text-cyan-700",
  };
  return colors[slug] || "bg-mist-500/10 text-mist-700";
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  const t = useTranslations("blog");
  const displayTags = getDisplayTags(post.tags);
  const primaryTag = displayTags[0];

  return (
    <Link
      to="/$locale/blog/$slug"
      params={{ locale, slug: post.slug }}
      className="group flex flex-col rounded-xl bg-mist-950/[0.025] p-5 hover:bg-mist-950/[0.05] transition-colors"
    >
      {/* Feature Image */}
      {post.feature_image && (
        <div className="relative overflow-hidden rounded-lg mb-4 -mx-1 -mt-1">
          <img
            src={post.feature_image}
            alt={post.feature_image_alt || post.title}
            className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      {/* Meta: Tag + Date */}
      <div className="flex items-center gap-3 text-mist-500 mb-3">
        {primaryTag && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${getTagColor(primaryTag.slug)}`}
          >
            {primaryTag.name}
          </span>
        )}
        <time className="text-sm" dateTime={post.published_at}>
          {formatPostDate(post.published_at, locale)}
        </time>
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
      {(post.primary_author || post.reading_time > 0) && (
        <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-mist-500">
          {post.primary_author?.profile_image && (
            <img
              src={post.primary_author.profile_image}
              alt={post.primary_author.name}
              className="h-5 w-5 rounded-full object-cover"
            />
          )}
          {post.primary_author && (
            <span className="font-medium text-mist-700">
              {post.primary_author.name}
            </span>
          )}
          {post.primary_author && post.reading_time > 0 && (
            <span className="text-mist-300">·</span>
          )}
          {post.reading_time > 0 && (
            <span>
              {t("readingTime", {
                defaultValue: "{{minutes}} min read",
                minutes: post.reading_time,
              })}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
