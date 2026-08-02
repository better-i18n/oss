import { Link } from "@tanstack/react-router";
import type { BlogPostListItem } from "@/lib/content";

interface BlogCardProps {
  post: BlogPostListItem;
  locale: string;
}

/* One Intl formatter per locale, built once. Constructing a formatter inside
   render costs ~0.1ms per card — negligible alone, but this grid renders 24 of
   them per page and the object is immutable, so there is no reason to rebuild. */
const dateFormatters = new Map<string, Intl.DateTimeFormat>();

function formatShortDate(dateStr: string, locale: string): string {
  let fmt = dateFormatters.get(locale);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
    dateFormatters.set(locale, fmt);
  }
  return fmt.format(new Date(dateStr));
}

/**
 * One cell of the blog grid.
 *
 * The cell draws its own top + left hairline; the parent grid shifts itself
 * -1px up/left so the first row's and first column's rules slide under the
 * container border and get clipped. That keeps the pattern breakpoint-
 * independent — no nth-child arithmetic to break when the column count changes.
 *
 * No cover art of any kind: no image, no placeholder panel, no tint. The card is
 * category → title → excerpt → byline. `banner_image` still exists on the CMS
 * model and is still read by the article page and OG meta; the listing simply
 * does not use it. There is consequently no `priority` prop — it existed only to
 * set `loading="eager"` on the first cover.
 */
export default function BlogCard({ post, locale }: BlogCardProps) {
  return (
    <Link
      to="/$locale/blog/$slug/"
      params={{ locale, slug: post.slug }}
      className="group flex flex-col border-t border-l border-black/[0.05] transition-colors hover:bg-black/[0.02]"
    >
      <div className="flex flex-1 flex-col px-5 py-5">
        {post.category && (
          <p className="text-[11px] font-medium text-mist-400">{post.category}</p>
        )}

        <h2 className="mt-2 text-[15px] font-medium leading-[1.35] tracking-[-0.015em] text-mist-900">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="mt-1.5 line-clamp-2 flex-1 text-[13px] leading-5 text-mist-600">
            {post.excerpt}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2">
          {post.authorAvatar ? (
            <img
              src={post.authorAvatar}
              alt=""
              width={20}
              height={20}
              loading="lazy"
              className="size-5 shrink-0 rounded-full border border-black/[0.06] object-cover [image-orientation:from-image]"
            />
          ) : null}
          {post.authorName && (
            <span className="truncate text-[12px] text-mist-500">{post.authorName}</span>
          )}
          {post.publishedAt && (
            <time className="ml-auto shrink-0 text-[12px] tabular-nums text-mist-400" dateTime={post.publishedAt}>
              {formatShortDate(post.publishedAt, locale)}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
}
