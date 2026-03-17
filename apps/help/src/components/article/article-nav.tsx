import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { IconArrowLeft, IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import type { HelpArticleListItem } from "@/lib/content";

interface ArticleNavProps {
  prev: HelpArticleListItem | null;
  next: HelpArticleListItem | null;
  locale: string;
}

export function ArticleNav({ prev, next, locale }: ArticleNavProps) {
  const t = useT("article");

  if (!prev && !next) return null;

  return (
    <div className="flex items-stretch gap-4">
      {prev ? (
        <Link
          to="/$locale/$collection/$article"
          params={{
            locale,
            collection: prev.collectionSlug || "general",
            article: prev.slug,
          }}
          className="flex flex-1 items-center gap-3 rounded-xl border border-mist-200 bg-[var(--color-card)] p-4 transition-colors hover:bg-mist-50"
        >
          <IconArrowLeft className="size-4 shrink-0 text-mist-400" />
          <div className="min-w-0">
            <p className="text-xs text-mist-500">{t("prev")}</p>
            <p className="mt-0.5 truncate text-sm font-medium text-mist-950">{prev.title}</p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          to="/$locale/$collection/$article"
          params={{
            locale,
            collection: next.collectionSlug || "general",
            article: next.slug,
          }}
          className="flex flex-1 items-center justify-end gap-3 rounded-xl border border-mist-200 bg-[var(--color-card)] p-4 text-right transition-colors hover:bg-mist-50"
        >
          <div className="min-w-0">
            <p className="text-xs text-mist-500">{t("next")}</p>
            <p className="mt-0.5 truncate text-sm font-medium text-mist-950">{next.title}</p>
          </div>
          <IconArrowRight className="size-4 shrink-0 text-mist-400" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
