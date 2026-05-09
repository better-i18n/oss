import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly locale: string;
}

/**
 * Build the URL for a given blog page number.
 * Page 1 → /{locale}/blog/
 * Page N → /{locale}/blog/page/{N}/
 */
function getPageUrl(locale: string, page: number): string {
  if (page === 1) return `/${locale}/blog/`;
  return `/${locale}/blog/page/${page}/`;
}

/**
 * Compute which page numbers to display with ellipsis.
 *
 * For 7+ pages, shows: first, last, current +/- 1, with ellipsis gaps.
 * Example: totalPages=9, currentPage=5 → [1, -1, 4, 5, 6, -1, 9]
 * (-1 represents ellipsis)
 */
function getPageNumbers(
  currentPage: number,
  totalPages: number,
): readonly number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  pages.add(currentPage);
  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  const result: number[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) {
      result.push(-1); // ellipsis marker
    }
    result.push(sorted[i]!);
  }

  return result;
}

export default function Pagination({
  currentPage,
  totalPages,
  locale,
}: PaginationProps) {
  const t = useT("blog");

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-12 flex items-center justify-center"
    >
      <div className="inline-flex items-center divide-x divide-mist-200 rounded-lg border border-mist-200 bg-white text-sm">
        {/* Previous */}
        {hasPrev ? (
          <Link
            to={getPageUrl(locale, currentPage - 1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-mist-700 hover:bg-mist-50 transition-colors rounded-l-lg"
          >
            <span aria-hidden="true" className="text-xs">&larr;</span>
            <span className="hidden sm:inline">{t("pagination.previous", { defaultValue: "Previous" })}</span>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 text-mist-300 cursor-not-allowed rounded-l-lg">
            <span aria-hidden="true" className="text-xs">&larr;</span>
            <span className="hidden sm:inline">{t("pagination.previous", { defaultValue: "Previous" })}</span>
          </span>
        )}

        {/* Page numbers */}
        {pageNumbers.map((pageNum, idx) =>
          pageNum === -1 ? (
            <span
              key={`ellipsis-${idx}`}
              className="hidden sm:inline-flex items-center justify-center w-10 py-2 text-mist-400 select-none"
              aria-hidden="true"
            >
              &hellip;
            </span>
          ) : pageNum === currentPage ? (
            <span
              key={pageNum}
              className="inline-flex items-center justify-center w-10 py-2 font-medium text-mist-950 bg-mist-50"
              aria-current="page"
            >
              {pageNum}
            </span>
          ) : (
            <Link
              key={pageNum}
              to={getPageUrl(locale, pageNum)}
              className="hidden sm:inline-flex items-center justify-center w-10 py-2 text-mist-500 hover:bg-mist-50 hover:text-mist-950 transition-colors"
            >
              {pageNum}
            </Link>
          ),
        )}

        {/* Next */}
        {hasNext ? (
          <Link
            to={getPageUrl(locale, currentPage + 1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-mist-700 hover:bg-mist-50 transition-colors rounded-r-lg"
          >
            <span className="hidden sm:inline">{t("pagination.next", { defaultValue: "Next" })}</span>
            <span aria-hidden="true" className="text-xs">&rarr;</span>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 text-mist-300 cursor-not-allowed rounded-r-lg">
            <span className="hidden sm:inline">{t("pagination.next", { defaultValue: "Next" })}</span>
            <span aria-hidden="true" className="text-xs">&rarr;</span>
          </span>
        )}
      </div>
    </nav>
  );
}
