import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { IconChevronRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import type { HelpArticleListItem } from "@/lib/content";

interface RelatedArticlesProps {
  articles: HelpArticleListItem[];
  locale: string;
}

export function RelatedArticles({ articles, locale }: RelatedArticlesProps) {
  const t = useT("article");

  if (articles.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-mist-950">
        {t("relatedArticles")}
      </h3>
      <ul className="mt-3 space-y-1">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              to="/$locale/$collection/$article"
              params={{
                locale,
                collection: article.collectionSlug || "general",
                article: article.slug,
              }}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-mist-600 transition-colors hover:bg-mist-50 hover:text-mist-950"
            >
              <span className="flex-1">{article.title}</span>
              <IconChevronRight className="size-3.5 shrink-0 text-mist-300" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
