import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { RelatedPages } from "@/components/RelatedPages";
import { useTranslations } from "@better-i18n/use-intl";
import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
} from "@/lib/meta";
import { getChangelogs, type ChangelogEntry } from "@/lib/changelog";
import { getDefaultStructuredData } from "@/lib/structured-data";
import { withTimeout } from "@/lib/fetch-utils";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "@/i18n.config";
import {
  parseSections,
  formatReleaseDate,
  renderInline,
  StatusBadge,
  type Locale,
} from "@/lib/changelog-parser";

export const Route = createFileRoute("/$locale/changelog/")({
  loader: async ({ context, params }) => {
    const locale = params.locale as "en" | "tr";
    const { filterMessages } = await import("@/lib/page-namespaces");
    const [allMessages, releases] = await Promise.all([
      getMessages({ project: i18nConfig.project, locale: context.locale }),
      withTimeout(getChangelogs(locale), 4000, []),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages = filterMessages(allMessages as any, ["meta", "breadcrumbs"]);

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: messages as any,
      locale: context.locale,
      releases,
    };
  },
  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const pathname = "/changelog";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta = getLocalizedMeta((loaderData?.messages || {}) as any, "changelog", {
      locale,
      pathname,
    });
    return {
      meta: formatMetaTags(meta, { locale }),
      links: [
        ...getAlternateLinks(pathname),
        getCanonicalLink(locale, pathname),
      ],
      scripts: getDefaultStructuredData(locale),
    };
  },
  component: ChangelogPage,
});

// ─── Page Component ──────────────────────────────────────────────────

function ChangelogPage() {
  const t = useTranslations("changelogPage");
  const loaderData = Route.useLoaderData();
  const { locale } = Route.useParams();
  const typedLocale = (locale === "tr" ? "tr" : "en") as Locale;

  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const hasScrolled = useRef(false);

  const { data: releases = loaderData?.releases ?? [] } = useQuery({
    queryKey: ["changelogs", locale],
    queryFn: async () => {
      const response = await fetch(`/api/changelog?locale=${locale}`);
      if (!response.ok) throw new Error("Failed to fetch changelogs");
      const json = (await response.json()) as { releases: ChangelogEntry[] };
      return json.releases;
    },
    initialData: loaderData?.releases,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Scroll to hash target and highlight it
  useEffect(() => {
    if (hasScrolled.current || !releases?.length) return;

    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    // Small delay to ensure DOM is rendered
    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setHighlightedSlug(hash);
        hasScrolled.current = true;

        // Remove highlight after animation
        setTimeout(() => setHighlightedSlug(null), 2500);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [releases]);


  return (
    <div>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32 lg:px-8">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="font-display text-4xl font-medium tracking-tight text-balance text-mist-950 sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-mist-500">
            {t("subtitle")}
          </p>
        </div>

        {/* Timeline */}
        <div className="flex flex-col">
          {releases?.map((entry: ChangelogEntry, index: number) => {
            const sections = parseSections(entry.body);
            const releaseDate = formatReleaseDate(
              entry.release_date || entry.publishedAt,
              typedLocale,
            );

            return (
              <article
                key={entry.slug}
                id={entry.slug}
                className={`relative py-12 first:pt-0 scroll-mt-24 transition-colors duration-700 ${
                  highlightedSlug === entry.slug
                    ? "-mx-4 rounded-2xl bg-mist-50/80 px-4 ring-1 ring-mist-200"
                    : ""
                }`}
              >
                {/* Separator */}
                {index > 0 && (
                  <div className="absolute inset-x-0 top-0">
                    <div className="border-t border-dashed border-mist-200" />
                  </div>
                )}

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

                {/* Title — links to individual changelog page */}
                <h2 className="mb-6 text-balance text-3xl font-medium leading-snug text-mist-950">
                  <Link
                    to="/$locale/changelog/$slug/"
                    params={{ locale, slug: entry.slug }}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {entry.title}
                  </Link>
                </h2>

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
                      <div
                        key={`${entry.slug}-section-${sectionIndex}`}
                      >
                        {/* Section Heading */}
                        {section.title ? (
                          <h3 className="mt-8 scroll-m-28 text-xl font-semibold tracking-tight text-mist-950">
                            {section.title}
                          </h3>
                        ) : null}

                        {/* Paragraphs (from ### headings) */}
                        {section.paragraphs.length > 0 ? (
                          <div className={section.title ? "mt-3 space-y-2" : "space-y-2"}>
                            {section.paragraphs.map((paragraph, pIdx) => (
                              <p
                                key={`${entry.slug}-p-${sectionIndex}-${pIdx}`}
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
                                key={`${entry.slug}-item-${sectionIndex}-${itemIndex}`}
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
              </article>
            );
          })}

          {(!releases || releases.length === 0) && (
            <div className="py-20 text-center text-mist-400">
              {t("noEntries", { defaultValue: "No changelog entries yet." })}
            </div>
          )}
        </div>
      </main>
      <RelatedPages currentPage="changelog" locale={locale} variant="resources" />
      <Footer />
    </div>
  );
}
