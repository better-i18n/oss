import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, useMemo } from "react";
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
import {
  trackChangelogView,
  trackChangelogEntryExpand,
} from "@/lib/analytics-events";
import { useEngagedTime } from "@/hooks/use-engaged-time";
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
    // Three independent fetches — the namespace helper import used to sit on
    // its own serial await in front of this batch.
    const [{ filterMessages }, allMessages, releases] = await Promise.all([
      import("@/lib/page-namespaces"),
      getMessages({ project: i18nConfig.project, locale: context.locale }),
      /* `null` on timeout, not `[]`.
       *
       * `[]` is a claim — "this project has shipped nothing" — and it was being
       * made every time the fetch was merely slow. Downstream, React Query took
       * that `[]` as `initialData` with a five-minute `staleTime` and
       * `refetchOnMount: false`, so it treated the empty list as fresh and
       * never asked again: the page stayed blank for every visitor. `null`
       * means "we do not know", which is the truth, and is what lets the client
       * fetch on mount instead of trusting a fabricated answer.
       *
       * 4s was also too tight for what `getChangelogs` does — it pulls the list
       * and then the FULL body of every entry (up to 100) before returning, so
       * on a list page it was racing a request it could not win. */
      withTimeout(getChangelogs(locale), 9000, null),
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
  // Lazy init: `new Set()` as a direct argument is constructed on EVERY render
  // and thrown away; the ref only keeps the first one.
  const observedEntries = useRef<Set<string> | null>(null);
  observedEntries.current ??= new Set<string>();


  // Analytics: page view + engaged time
  useEffect(() => {
    trackChangelogView({ locale: locale || "en" });
  }, [locale]);
  useEngagedTime("changelog");

  /*
   * `initialData` only when the server actually returned a list.
   *
   * It used to be `initialData: loaderData?.releases` where the loader
   * substituted `[]` whenever its fetch was slow. React Query cannot tell a
   * real empty list from a placeholder one, so with `staleTime: 5 * 60 * 1000`
   * and `refetchOnMount: false` it filed the empty array as fresh data and
   * never issued the request that would have corrected it. The loader now
   * reports `null` for "unknown", and `undefined` here means React Query has no
   * seed and fetches on mount — which is the recovery this query was written to
   * provide and was silently prevented from doing.
   */
  const seeded = loaderData?.releases ?? undefined;
  const { data: releases } = useQuery({
    queryKey: ["changelogs", locale],
    queryFn: async () => {
      const response = await fetch(`/api/changelog?locale=${locale}`);
      if (!response.ok) throw new Error("Failed to fetch changelogs");
      const json = (await response.json()) as { releases: ChangelogEntry[] };
      return json.releases;
    },
    initialData: seeded,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: seeded === undefined,
    refetchOnWindowFocus: false,
  });

  // One index instead of a linear .find() per expand event. `releases` is now
  // genuinely `undefined` while the client fetch is in flight, so the map is
  // built from `?? []` — the empty map is correct there, unlike an empty list
  // rendered as "nothing shipped".
  const releasesBySlug = useMemo(
    () => new Map((releases ?? []).map((r: ChangelogEntry) => [r.slug, r])),
    [releases],
  );

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

  // Analytics: track changelog entry visibility via IntersectionObserver
  useEffect(() => {
    if (!releases?.length) return;
    const seen = new Set<string>();
    observedEntries.current = seen;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const slug = entry.target.id;
          if (!slug || seen.has(slug)) continue;
          seen.add(slug);

          const release = releasesBySlug.get(slug);
          trackChangelogEntryExpand({
            slug,
            version: release?.version ?? undefined,
          });
        }
      },
      { threshold: 0.3 },
    );

    // Observe all changelog article elements
    const articles = document.querySelectorAll("article[id]");
    for (const el of articles) observer.observe(el);

    return () => observer.disconnect();
  }, [releases, releasesBySlug]);

  return (
    <div>
      <Header />
      <main className="section">
      <div className="max-w-[68ch]">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="section-h2 tracking-tight">
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
                className={`relative scroll-mt-24 border-t border-black/[0.06] py-10 transition-colors duration-700 first:border-t-0 first:pt-0 ${ highlightedSlug === entry.slug ? "-mx-4 border-l-2 border-l-mist-900 bg-black/[0.02] px-4" : "" }`}
              >
                {/* Separator */}
                {index > 0 && (
                  <div className="absolute inset-x-0 top-0">
                    <div className="border-t border-black/[0.06]" />
                  </div>
                )}

                {/* Version + Date */}
                <div className="mb-5 flex items-center gap-3">
                  {entry.version ? (
                    <span className="inline-flex items-center rounded-sm border border-black/[0.07] bg-mist-50 px-2 py-0.5 font-mono text-[11px] text-mist-600">
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
                <h2 className="mb-5 text-balance text-[22px] font-medium leading-snug tracking-[-0.02em] text-mist-900">
                  <Link
                    to="/$locale/changelog/$slug/"
                    params={{ locale, slug: entry.slug }}
                    className="hover:text-mist-900 transition-colors"
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
                          <h3 className="mt-8 scroll-m-28 text-xl font-medium tracking-tight text-mist-950">
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

          {/* Only when we KNOW the list is empty. `undefined` means the client
              fetch is still in flight, and telling a visitor "no entries" while
              we are still asking is the same lie the loader used to tell. */}
          {releases?.length === 0 && (
            <div className="py-12 text-center text-mist-400">
              {t("noEntries")}
            </div>
          )}
        </div>
      </div>
    </main>
      <RelatedPages currentPage="changelog" locale={locale} variant="resources" />
      <Footer />
    </div>
  );
}
