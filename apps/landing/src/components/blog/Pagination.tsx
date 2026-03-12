import { Link } from "@tanstack/react-router";

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
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-12 flex items-center justify-center gap-1"
    >
      {/* Previous */}
      {hasPrev ? (
        <Link
          to={getPageUrl(locale, currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-mist-700 hover:bg-mist-50 transition-colors"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Previous</span>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-mist-300 cursor-not-allowed">
          <span aria-hidden="true">&larr;</span>
          <span>Previous</span>
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum, idx) =>
          pageNum === -1 ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 py-2 text-sm text-mist-400"
              aria-hidden="true"
            >
              &hellip;
            </span>
          ) : pageNum === currentPage ? (
            <span
              key={pageNum}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-mist-950 text-sm font-medium text-white"
              aria-current="page"
            >
              {pageNum}
            </span>
          ) : (
            <Link
              key={pageNum}
              to={getPageUrl(locale, pageNum)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium text-mist-700 hover:bg-mist-50 transition-colors"
            >
              {pageNum}
            </Link>
          ),
        )}
      </div>

      {/* Next */}
      {hasNext ? (
        <Link
          to={getPageUrl(locale, currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-mist-700 hover:bg-mist-50 transition-colors"
        >
          <span>Next</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-mist-300 cursor-not-allowed">
          <span>Next</span>
          <span aria-hidden="true">&rarr;</span>
        </span>
      )}
    </nav>
  );
}
