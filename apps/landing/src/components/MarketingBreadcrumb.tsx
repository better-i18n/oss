import { Link, useParams } from "@tanstack/react-router";

export interface BreadcrumbItem {
  readonly label: string;
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

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-sm text-mist-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const href = item.href
            ? item.href.startsWith("/") ? `/${locale}${item.href}` : item.href
            : undefined;

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
