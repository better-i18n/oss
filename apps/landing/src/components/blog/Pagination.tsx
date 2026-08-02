import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly locale: string;
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

/**
 * A link to one blog page.
 *
 * Page 1 and page N are two DIFFERENT routes, so this branches on the number
 * instead of interpolating a path. Passing a built string to `to` type-errors
 * against the router's generated `to` union (and silently produces dead links
 * when the route tree changes), which is why there is no `getPageUrl` here.
 */
function PageLink({
  locale,
  page,
  className,
  children,
  ariaLabel,
}: {
  locale: string;
  page: number;
  className: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  if (page === 1) {
    return (
      <Link to="/$locale/blog/" params={{ locale }} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <Link
      to="/$locale/blog/page/$page/"
      params={{ locale, page: String(page) }}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}

const CELL = "flex h-9 items-center justify-center border-l border-black/[0.05] px-3.5 text-[13px] transition-colors first:border-l-0";

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
    // aria-label stays literal: "Blog pagination" is on the sanctioned
    // ignoreStrings list in i18n.config.ts, alongside the other structural
    // landmark names ("Main navigation", "Site footer", "Table of contents").
    <nav aria-label="Blog pagination" className="mt-8 flex justify-center">
      {/* One clipped hairline strip — cells divide themselves with a left rule,
          same grammar as the card grid. No shadow, no pill. */}
      <div className="flex overflow-hidden rounded-xl border border-black/[0.07] bg-white">
        {hasPrev ? (
          <PageLink
            locale={locale}
            page={currentPage - 1}
            className={`${CELL} text-mist-700 hover:bg-black/[0.02]`}
          >
            {t("pagination.previous")}
          </PageLink>
        ) : (
          <span className={`${CELL} text-mist-300`}>{t("pagination.previous")}</span>
        )}

        {pageNumbers.map((pageNum, idx) =>
          pageNum === -1 ? (
            <span
              key={`ellipsis-${idx === 0 ? "lead" : "tail"}`}
              className={`${CELL} hidden text-mist-400 select-none sm:flex`}
              aria-hidden="true"
            >
              &hellip;
            </span>
          ) : pageNum === currentPage ? (
            <span
              key={pageNum}
              className={`${CELL} bg-black/[0.03] font-medium text-mist-900 tabular-nums`}
              aria-current="page"
            >
              {pageNum}
            </span>
          ) : (
            <PageLink
              key={pageNum}
              locale={locale}
              page={pageNum}
              className={`${CELL} hidden tabular-nums text-mist-500 hover:bg-black/[0.02] hover:text-mist-900 sm:flex`}
            >
              {pageNum}
            </PageLink>
          ),
        )}

        {hasNext ? (
          <PageLink
            locale={locale}
            page={currentPage + 1}
            className={`${CELL} text-mist-700 hover:bg-black/[0.02]`}
          >
            {t("pagination.next")}
          </PageLink>
        ) : (
          <span className={`${CELL} text-mist-300`}>{t("pagination.next")}</span>
        )}
      </div>
    </nav>
  );
}
