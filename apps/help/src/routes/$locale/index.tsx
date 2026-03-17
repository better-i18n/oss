import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HelpLayout } from "@/components/layout/help-layout";
import { SearchHero } from "@/components/home/search-hero";
import { CollectionGrid } from "@/components/home/collection-grid";
import { PopularArticles } from "@/components/home/popular-articles";
import { CommandPalette, type CommandSource, type CommandItem } from "@/components/ui/command-palette";
import { getCollectionsWithCounts, getFeaturedArticles, getArticles } from "@/lib/content";
import { formatMetaTags, getDefaultStructuredData } from "@/lib/seo";
import { getAlternateLinks, getCanonicalLink } from "@/lib/seo";
import type { HelpCollection, HelpArticleListItem } from "@/lib/content";
import { IconPageTextSearch } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { DynamicIcon } from "@/components/shared/dynamic-icon";

export const Route = createFileRoute("/$locale/")({
  loader: async ({ params }) => {
    const { locale } = params;
    const [collections, featuredArticles, allArticles] = await Promise.all([
      getCollectionsWithCounts(locale),
      getFeaturedArticles(locale),
      getArticles(locale),
    ]);
    return { collections, featuredArticles, allArticles, locale };
  },

  head: ({ params }) => {
    const { locale } = params;
    return {
      meta: formatMetaTags({
        title: "Help Center | Better i18n",
        description: "Find answers, guides, and resources for Better i18n. Learn how to manage translations, set up integrations, and get the most out of the platform.",
        locale,
      }),
      links: [
        getCanonicalLink(locale),
        ...getAlternateLinks(`/${locale}/`),
      ],
      scripts: getDefaultStructuredData(locale),
    };
  },

  component: HomePage,
});

// ─── Search sources from loader data ────────────────────────────────

function buildSources(
  collections: HelpCollection[],
  articles: HelpArticleListItem[],
  locale: string,
): CommandSource[] {
  return [
    {
      id: "articles",
      label: "Articles",
      fetch(query) {
        const q = query.trim().toLowerCase();
        const items: CommandItem[] = articles.map((a) => ({
          id: `article-${a.slug}`,
          label: a.title,
          subtitle: a.excerpt ?? undefined,
          groupId: "articles",
          icon: <IconPageTextSearch className="size-4" />,
          href: `/${locale}/${a.collectionSlug}/${a.slug}`,
          keywords: [a.collectionSlug ?? ""].filter(Boolean),
        }));
        if (!q) return items.slice(0, 8);
        return items.filter(
          (i) =>
            i.label.toLowerCase().includes(q) ||
            i.keywords?.some((k) => k.includes(q)),
        );
      },
    },
    {
      id: "collections",
      label: "Collections",
      fetch(query) {
        const q = query.trim().toLowerCase();
        const items: CommandItem[] = collections.map((c) => ({
          id: `col-${c.slug}`,
          label: c.title,
          subtitle: c.description ?? undefined,
          groupId: "collections",
          icon: <DynamicIcon name={c.icon} className="size-4" />,
          href: `/${locale}/${c.slug}`,
          keywords: [c.slug],
        }));
        if (!q) return items;
        return items.filter(
          (i) =>
            i.label.toLowerCase().includes(q) ||
            i.keywords?.some((k) => k.includes(q)),
        );
      },
    },
  ];
}

// ─── Page component ─────────────────────────────────────────────────

function HomePage() {
  const { collections, featuredArticles, allArticles, locale } = Route.useLoaderData();
  const [cmdOpen, setCmdOpen] = React.useState(false);

  const sources = React.useMemo(
    () => buildSources(collections, allArticles, locale),
    [collections, allArticles, locale],
  );

  // Global ⌘K shortcut
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <HelpLayout locale={locale}>
      <SearchHero onSearchClick={() => setCmdOpen(true)} />
      <CollectionGrid collections={collections} locale={locale} />
      <PopularArticles articles={featuredArticles} locale={locale} />
      <CommandPalette
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        sources={sources}
        showRecents
        showPinnedFirst
      />
    </HelpLayout>
  );
}
