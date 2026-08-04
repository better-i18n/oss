import { Link, useParams } from "@tanstack/react-router";

export interface BreadcrumbItem {
  readonly label: string;
  /**
   * The COMPLETE path, locale included — `/en/tools`, not `/tools`.
   *
   * This component used to prepend the locale itself, and nine of its ten
   * callers passed a path that already had one, so the trail rendered
   * `/en/en/tools/`. Clicking "Free Tools" on any tool page landed on a URL
   * that does not exist. Reported from /en/tools/.
   *
   * The convention follows the callers rather than the other way round: a
   * breadcrumb item names a destination, and a destination on this site is a
   * locale-prefixed path. Nothing here rewrites what it is given, so a wrong
   * href is now visibly wrong instead of silently doubled.
   */
  readonly href?: string;
}

interface MarketingBreadcrumbProps {
  readonly items: readonly BreadcrumbItem[];
}

/**
 * Visual breadcrumb navigation for marketing pages.
 * Last item (no href) represents the current page.
 */
export function MarketingBreadcrumb({ items }: MarketingBreadcrumbProps) {
  const { locale } = useParams({ strict: false });

  if (items.length === 0) return null;

  /* Dev-only, because the failure is invisible until someone clicks: an href
     whose first segment is not the current locale will not resolve. Warn rather
     than repair — repairing here is what hid the doubled locale for as long as
     it did. */
  if (import.meta.env.DEV && locale) {
    for (const item of items) {
      if (!item.href?.startsWith("/")) continue;
      if (item.href.split("/")[1] !== locale) {
        console.warn(
          `[breadcrumb] "${item.label}" points at ${item.href}, which does not start with /${locale}. ` +
            `Breadcrumb hrefs must be complete, locale-prefixed paths.`,
        );
      }
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-sm text-mist-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const href = item.href;

          return (
            <li key={index} {...(isLast ? { "aria-current": "page" as const } : {})}>
              {index > 0 && <span aria-hidden="true" className="mr-1.5">›</span>}
              {href && !isLast ? (
                <Link to={href} className="hover:text-mist-700 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-mist-600" : ""}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
