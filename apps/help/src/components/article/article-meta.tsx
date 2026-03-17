import { useT } from "@/lib/i18n";
import { Badge } from "@/components/shared/badge";
import { IconClock, IconCalendar1 } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { formatDate } from "@/lib/utils";
import type { HelpArticle } from "@/lib/content";

interface ArticleMetaProps {
  article: HelpArticle;
  locale: string;
}

export function ArticleMeta({ article, locale }: ArticleMetaProps) {
  const t = useT("article");

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-mist-500">
      {/* Reading time */}
      {article.readingTime && (
        <span className="inline-flex items-center gap-1.5">
          <IconClock className="size-3.5" />
          {article.readingTime} {t("minRead")}
        </span>
      )}

      {/* Last reviewed */}
      {article.lastReviewedAt && (
        <span className="inline-flex items-center gap-1.5">
          <IconCalendar1 className="size-3.5" />
          {t("updated")} {formatDate(article.lastReviewedAt, locale)}
        </span>
      )}

      {/* Difficulty badge */}
      {article.difficulty && (
        <Badge variant={article.difficulty}>
          {t(`difficulty.${article.difficulty}`)}
        </Badge>
      )}
    </div>
  );
}
