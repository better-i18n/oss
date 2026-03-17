import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { IconFileText, IconChevronRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import type { HelpArticleListItem } from "@/lib/content";

interface PopularArticlesProps {
  articles: HelpArticleListItem[];
  locale: string;
}

export function PopularArticles({ articles, locale }: PopularArticlesProps) {
  const t = useT("home");

  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 pb-12">
      <h2 className="text-lg font-semibold text-mist-950">
        {t("popularArticles")}
      </h2>
      <div className="mt-4 divide-y divide-mist-100 rounded-xl border border-mist-200 bg-[var(--color-card)]">
        {articles.map((article) => (
          <Link
            key={article.slug}
            to="/$locale/$collection/$article/"
            params={{
              locale,
              collection: article.collectionSlug || "general",
              article: article.slug,
            }}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-mist-50"
          >
            <IconFileText className="size-4 shrink-0 text-mist-400" />
            <span className="flex-1 text-sm text-mist-700">{article.title}</span>
            {article.readingTime && (
              <span className="text-xs text-mist-400 shrink-0">
                {article.readingTime} min
              </span>
            )}
            <IconChevronRight className="size-4 shrink-0 text-mist-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}
