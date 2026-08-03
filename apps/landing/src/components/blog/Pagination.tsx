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
  /* Measured on `/en/blog/page/2/`, the nav announced THREE current pages:
     `<span>2</span>` from this component, plus `Previous` and `1` — both of
     which point at `/en/blog/`, and TanStack marks a link active on a PREFIX
     match by default, so the list root counts as active on every page of the
     list. `exact: true` scopes that to the real current page; `activeProps: {}`
     then leaves the marking entirely to us. One nav, one current page. */
  const common = {
    className,
    "aria-label": ariaLabel,
    activeOptions: { exact: true },
    activeProps: {},
  } as const;
  if (page === 1) {
    return (
      <Link to="/$locale/blog/" params={{ locale }} {...common}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/$locale/blog/page/$page/" params={{ locale, page: String(page) }} {...common}>
      {children}
    </Link>
  );
}

/**
 * Page numbers are text, not cells.
 *
 * The previous version drew a clipped hairline strip and gave every page its own
 * bordered cell with a tinted `bg-black/[0.03]` on the current one. That is a
 * `.map()` producing boxes (rule/listed-items-are-not-cards) and a fill carrying
 * state that the ink could carry instead. Now: one hairline above the row, bare
 * numbers, and the current page marked by WEIGHT and DARKNESS — mist-900 at 500
 * against mist-400 at 400 — not by a background (rule/neutral-ink-accent-is-
 * identity-only reserves fill and hue for identity, link and focus).
 */
const NUM = "tabular-nums text-[13px] transition-colors";
const STEP = "text-[13px] transition-colors";

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
    <nav
      aria-label="Blog pagination"
      className="mt-10 flex items-center justify-between gap-4 border-t border-black/[0.07] pt-5"
    >
      {/* Disabled steps are <span>, never <a>: a link that goes nowhere is a
          keyboard trap in miniature — it takes a tab stop, announces as a link
          and does nothing. */}
      {hasPrev ? (
        <PageLink
          locale={locale}
          page={currentPage - 1}
          className={`${STEP} text-mist-700 hover:text-mist-950`}
        >
          {t("pagination.previous")}
        </PageLink>
      ) : (
        <span className={`${STEP} text-mist-300`}>{t("pagination.previous")}</span>
      )}

      <div className="flex items-center gap-3.5">
        {pageNumbers.map((pageNum, idx) =>
          pageNum === -1 ? (
            <span
              key={`ellipsis-${idx === 0 ? "lead" : "tail"}`}
              className={`${NUM} hidden text-mist-300 select-none sm:inline`}
              aria-hidden="true"
            >
              &hellip;
            </span>
          ) : pageNum === currentPage ? (
            <span
              key={pageNum}
              className={`${NUM} font-medium text-mist-900`}
              aria-current="page"
            >
              {pageNum}
            </span>
          ) : (
            <PageLink
              key={pageNum}
              locale={locale}
              page={pageNum}
              className={`${NUM} hidden text-mist-400 hover:text-mist-900 sm:inline`}
            >
              {pageNum}
            </PageLink>
          ),
        )}
      </div>

      {hasNext ? (
        <PageLink
          locale={locale}
          page={currentPage + 1}
          className={`${STEP} text-mist-700 hover:text-mist-950`}
        >
          {t("pagination.next")}
        </PageLink>
      ) : (
        <span className={`${STEP} text-mist-300`}>{t("pagination.next")}</span>
      )}
    </nav>
  );
}
