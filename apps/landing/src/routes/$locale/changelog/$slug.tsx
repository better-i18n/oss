import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useTranslations } from "@better-i18n/use-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RelatedPages } from "@/components/RelatedPages";
import {
  SITE_URL,
  getAlternateLinks,
  getCanonicalLink,
  getCanonicalUrl,
  formatMetaTags,
  truncateTitle,
  OG_SERVICE_URL,
} from "@/lib/meta";
import {
  getChangelogBySlug,
  getChangelogsMeta,
  type ChangelogEntry,
  type ChangelogListItem,
} from "@/lib/changelog";
import {
  getChangelogEntrySchema,
  getOrganizationSchema,
  getBreadcrumbSchema,
  formatStructuredData,
} from "@/lib/structured-data";
import {
  parseSections,
  formatReleaseDate,
  renderInline,
  StatusBadge,
  type Locale,
} from "@/lib/changelog-parser";
import { withTimeout } from "@/lib/fetch-utils";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "@/i18n.config";

// ─── Types ───────────────────────────────────────────────────────────

interface AdjacentEntry {
  slug: string;
  title: string;
}

// ─── Route ───────────────────────────────────────────────────────────

export const Route = createFileRoute("/$locale/changelog/$slug")({
  loader: async ({ params, context }) => {
    const locale = params.locale as "en" | "tr";
    const slug = params.slug;

    const { filterMessages } = await import("@/lib/page-namespaces");
    const [allMessages, entry, metaEntries] = await Promise.all([
      getMessages({ project: i18nConfig.project, locale: context.locale }),
      withTimeout(getChangelogBySlug(locale, slug), 4000, null),
      withTimeout(getChangelogsMeta(locale), 4000, []),
    ]);

    if (!entry) {
      throw notFound();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages = filterMessages(allMessages as any, ["meta", "breadcrumbs"]);

    // Find adjacent entries for prev/next navigation
    const currentIndex = metaEntries.findIndex((e: ChangelogListItem) => e.slug === slug);
    const prevEntry: AdjacentEntry | null =
      currentIndex > 0
        ? { slug: metaEntries[currentIndex - 1].slug, title: metaEntries[currentIndex - 1].title }
        : null;
    const nextEntry: AdjacentEntry | null =
      currentIndex >= 0 && currentIndex < metaEntries.length - 1
        ? { slug: metaEntries[currentIndex + 1].slug, title: metaEntries[currentIndex + 1].title }
        : null;

    return {
      entry,
      locale: context.locale,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: messages as any,
      prevEntry,
      nextEntry,
    };
  },

  head: ({ loaderData }) => {
    const entry = loaderData?.entry as ChangelogEntry | undefined;
    const locale = loaderData?.locale || "en";
    const slug = entry?.slug || "";
    const pathname = `/changelog/${slug}`;

    const title = truncateTitle(
      `${entry?.title || "Release"} — Better i18n Changelog`,
    );
    const description =
      entry?.summary ||
      (entry?.body ? entry.body.slice(0, 160).replace(/\n/g, " ") : "");

    const canonicalUrl = getCanonicalUrl(locale, pathname);

    // OG image — uses changelog template if available, falls back to default
    const ogParams = new URLSearchParams();
    if (entry?.title) ogParams.set("title", entry.title);
    if (entry?.version) ogParams.set("version", entry.version);
    if (entry?.release_date) {
      ogParams.set(
        "date",
        new Date(entry.release_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
    }
    if (entry?.release_type) ogParams.set("releaseType", entry.release_type);
    const ogImage = `${OG_SERVICE_URL}/og/changelog?${ogParams.toString()}`;

    const meta = {
      title,
      description,
      ogTitle: entry?.title || "Release",
      ogDescription: description,
      ogImage,
      ogType: "article" as const,
      canonicalUrl,
    };

    const metaTags = formatMetaTags(meta, {
      locale,
      ogType: "article",
      publishedTime: entry?.release_date || entry?.publishedAt || undefined,
    });

    // Structured data
    const changelogSchema = getChangelogEntrySchema({
      title: entry?.title || "Release",
      description,
      url: canonicalUrl,
      version: entry?.version || undefined,
      datePublished: entry?.release_date || entry?.publishedAt || undefined,
      locale,
    });

    const breadcrumbSchema = getBreadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/${locale}/` },
      { name: "Changelog", url: `${SITE_URL}/${locale}/changelog/` },
      { name: entry?.title || "Release", url: canonicalUrl },
    ]);

    return {
      meta: metaTags,
      links: [
        ...getAlternateLinks(pathname),
        getCanonicalLink(locale, pathname),
      ],
      scripts: formatStructuredData([
        getOrganizationSchema(),
        breadcrumbSchema,
        changelogSchema,
      ]),
    };
  },

  component: ChangelogEntryPage,
  notFoundComponent: ChangelogEntryNotFound,
});

// ─── Page Component ──────────────────────────────────────────────────

function ChangelogEntryPage() {
  const t = useTranslations("changelogPage");
  const { entry, locale, prevEntry, nextEntry } = Route.useLoaderData();
  const typedLocale = (locale === "tr" ? "tr" : "en") as Locale;

  const sections = parseSections(entry.body);
  const releaseDate = formatReleaseDate(
    entry.release_date || entry.publishedAt,
    typedLocale,
  );

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-mist-400">
          <Link
            to="/$locale/"
            params={{ locale }}
            className="hover:text-mist-600 transition-colors"
          >
            Home
          </Link>
          <span>&gt;</span>
          <Link
            to="/$locale/changelog/"
            params={{ locale }}
            className="hover:text-mist-600 transition-colors"
          >
            Changelog
          </Link>
          <span>&gt;</span>
          <span className="text-mist-600 truncate max-w-[200px]">
            {entry.title}
          </span>
        </nav>

        {/* Version + Date */}
        <div className="mb-5 flex items-center gap-3">
          {entry.version ? (
            <span className="inline-flex items-center border border-dashed border-mist-300 bg-mist-50 px-2.5 py-1 font-mono text-sm text-mist-700">
              {entry.version}
            </span>
          ) : null}
          {releaseDate ? (
            <time className="font-mono text-sm text-mist-400">
              {releaseDate}
            </time>
          ) : null}
        </div>

        {/* Title */}
        <h1 className="mb-6 text-balance text-4xl font-medium leading-snug text-mist-950 sm:text-5xl">
          {entry.title}
        </h1>

        {/* Summary */}
        {entry.summary ? (
          <p className="mb-8 text-base leading-relaxed text-mist-500">
            {entry.summary}
          </p>
        ) : null}

        {/* Sections */}
        {sections.length > 0 ? (
          <div className="space-y-0">
            {sections.map((section, sectionIndex) => (
              <div key={`section-${sectionIndex}`}>
                {/* Section Heading */}
                {section.title ? (
                  <h2 className="mt-8 scroll-m-28 text-xl font-semibold tracking-tight text-mist-950">
                    {section.title}
                  </h2>
                ) : null}

                {/* Paragraphs */}
                {section.paragraphs.length > 0 ? (
                  <div className={section.title ? "mt-3 space-y-2" : "space-y-2"}>
                    {section.paragraphs.map((paragraph, pIdx) => (
                      <p
                        key={`p-${sectionIndex}-${pIdx}`}
                        className="text-[15px] leading-7 text-mist-600"
                      >
                        {renderInline(paragraph)}
                      </p>
                    ))}
                  </div>
                ) : null}

                {/* List Items */}
                {section.items.length > 0 ? (
                  <ul className="my-5 ml-6 list-disc space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={`item-${sectionIndex}-${itemIndex}`}
                        className="text-mist-600/80 marker:text-mist-300"
                      >
                        <span className="text-mist-600">
                          {item.badge ? (
                            <StatusBadge tone={item.badge} t={t} />
                          ) : null}
                          {item.label ? (
                            <>
                              <strong className="font-medium text-mist-900">
                                {item.label}
                              </strong>
                              <span className="text-mist-600">
                                {": "}
                                {renderInline(item.description)}
                              </span>
                            </>
                          ) : (
                            <span className="text-mist-600">
                              {renderInline(item.description)}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {/* Prev/Next Navigation */}
        {(prevEntry || nextEntry) ? (
          <div className="mt-16 flex items-center justify-between border-t border-dashed border-mist-200 pt-8">
            {prevEntry ? (
              <Link
                to="/$locale/changelog/$slug/"
                params={{ locale, slug: prevEntry.slug }}
                className="group flex items-center gap-1.5 text-sm text-mist-500 hover:text-mist-700 transition-colors"
              >
                <span>&larr;</span>
                <span className="max-w-[200px] truncate">{prevEntry.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextEntry ? (
              <Link
                to="/$locale/changelog/$slug/"
                params={{ locale, slug: nextEntry.slug }}
                className="group flex items-center gap-1.5 text-sm text-mist-500 hover:text-mist-700 transition-colors"
              >
                <span className="max-w-[200px] truncate">{nextEntry.title}</span>
                <span>&rarr;</span>
              </Link>
            ) : null}
          </div>
        ) : null}

        {/* Back to all changes */}
        <div className="mt-8 text-center">
          <Link
            to="/$locale/changelog/"
            params={{ locale }}
            className="text-sm text-mist-500 hover:text-mist-700 transition-colors"
          >
            {t("seeAll", { defaultValue: "See all changelog entries" })} &rarr;
          </Link>
        </div>
      </main>

      <RelatedPages currentPage="changelog" locale={locale} variant="resources" />
      <Footer />
    </div>
  );
}

// ─── Not Found ───────────────────────────────────────────────────────

function ChangelogEntryNotFound() {
  const { locale } = Route.useParams();

  return (
    <div>
      <Header />
      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="font-display text-3xl font-medium tracking-tight text-mist-950 sm:text-4xl">
            Release not found
          </p>
          <p className="mt-4 text-lg text-mist-600">
            The changelog entry you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            to="/$locale/changelog/"
            params={{ locale }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
          >
            &larr; Back to Changelog
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
