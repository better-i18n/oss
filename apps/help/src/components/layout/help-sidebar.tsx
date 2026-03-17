import { Link, useRouterState } from "@tanstack/react-router";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { useT } from "@/lib/i18n";
import type { HelpCollection } from "@/lib/content";

interface HelpSidebarProps {
  locale: string;
  collections: HelpCollection[];
}

export function HelpSidebar({ locale, collections }: HelpSidebarProps) {
  const t = useT("common");
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  if (collections.length === 0) return null;

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-20 space-y-1">
        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-mist-400">
          {t("sidebar.collectionsHeading")}
        </p>
        {collections.map((collection) => {
          const href = `/${locale}/${collection.slug}/`;
          const isActive = currentPath.startsWith(href);

          return (
            <Link
              key={collection.slug}
              to="/$locale/$collection"
              params={{ locale, collection: collection.slug }}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-mist-100 font-medium text-mist-950"
                  : "text-mist-600 hover:bg-mist-50 hover:text-mist-900"
              }`}
            >
              <DynamicIcon
                name={collection.icon}
                className="size-4 shrink-0"
              />
              <span className="truncate">{collection.title}</span>
              {collection.articleCount > 0 && (
                <span className="ml-auto text-xs text-mist-400">
                  {collection.articleCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
