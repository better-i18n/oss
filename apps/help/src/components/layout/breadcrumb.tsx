import { Link } from "@tanstack/react-router";
import { IconChevronRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { useT } from "@/lib/i18n";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  locale?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale: string;
}

export function Breadcrumb({ items, locale }: BreadcrumbProps) {
  const t = useT("common");

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-mist-500">
      <Link
        to="/$locale/"
        params={{ locale }}
        className="hover:text-mist-950 transition-colors"
      >
        {t("breadcrumb.helpCenter")}
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <IconChevronRight className="size-3.5 text-mist-300" />
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-mist-950 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-mist-950 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
