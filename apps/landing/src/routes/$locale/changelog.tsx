import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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

export const Route = createFileRoute("/$locale/changelog")({
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

// ─── Types ───────────────────────────────────────────────────────────

type Locale = "en" | "tr";
type StatusTone = "new" | "updated" | "improved" | "fixed" | "security";

interface ParsedListItem {
  badge: StatusTone | null;
  label: string | null;
  description: string;
}

interface ParsedSection {
  title: string;
  items: ParsedListItem[];
  paragraphs: string[];
}

// ─── Badge Config ────────────────────────────────────────────────────

const statusDefaults: Record<StatusTone, string> = {
  new: "NEW",
  updated: "UPDATED",
  improved: "IMPROVED",
  fixed: "FIXED",
  security: "SECURITY",
};

const statusClasses: Record<StatusTone, string> = {
  new: "border-emerald-300/50 bg-emerald-50 text-emerald-700",
  updated: "border-sky-300/50 bg-sky-50 text-sky-700",
  improved: "border-blue-300/50 bg-blue-50 text-blue-700",
  fixed: "border-amber-300/50 bg-amber-50 text-amber-700",
  security: "border-rose-300/50 bg-rose-50 text-rose-700",
};

const statusAliases: Record<string, StatusTone> = {
  new: "new",
  added: "new",
  feature: "new",
  updated: "updated",
  update: "updated",
  improvement: "improved",
  improved: "improved",
  fix: "fixed",
  fixed: "fixed",
  bugfix: "fixed",
  security: "security",
};

// ─── Heading → Default Badge Map ────────────────────────────────────

const headingBadgeMap: Record<string, StatusTone> = {
  "new features": "new",
  "what's new": "new",
  new: "new",
  features: "new",
  improvements: "improved",
  improved: "improved",
  updates: "updated",
  updated: "updated",
  changes: "updated",
  "bug fixes": "fixed",
  "bug fixes & improvements": "fixed",
  fixes: "fixed",
  fixed: "fixed",
  security: "security",
  // Turkish
  "yeni özellikler": "new",
  yenilikler: "new",
  yeni: "new",
  "iyileştirmeler": "improved",
  güncellemeler: "updated",
  "hata düzeltmeleri": "fixed",
  düzeltmeler: "fixed",
  // German
  "neue funktionen": "new",
  neuigkeiten: "new",
  verbesserungen: "improved",
  fehlerbehebungen: "fixed",
  bugfixes: "fixed",
  // Spanish
  "nuevas funciones": "new",
  novedades: "new",
  mejoras: "improved",
  "correcciones de errores": "fixed",
  // French
  "nouvelles fonctionnalités": "new",
  "nouveautés": "new",
  "améliorations": "improved",
  "corrections de bugs": "fixed",
  // Portuguese
  "novas funcionalidades": "new",
  novidades: "new",
  melhorias: "improved",
  "correções de erros": "fixed",
  // Russian
  "новые функции": "new",
  новое: "new",
  улучшения: "improved",
  "исправления ошибок": "fixed",
  // Chinese
  "新功能": "new",
  "改进": "improved",
  "错误修复": "fixed",
  // Japanese
  "新機能": "new",
  "改善点": "improved",
  "バグ修正": "fixed",
  // Korean
  "새로운 기능": "new",
  "개선 사항": "improved",
  "버그 수정": "fixed",
};

// ─── Inline Renderer ─────────────────────────────────────────────────

function renderInline(text: string) {
  return text
    .split(/(\*\*.+?\*\*)/g)
    .filter(Boolean)
    .map((segment, index) => {
      if (segment.startsWith("**") && segment.endsWith("**")) {
        return (
          <strong key={`${segment}-${index}`} className="font-medium text-mist-950">
            {segment.slice(2, -2)}
          </strong>
        );
      }
      return <span key={`${segment}-${index}`}>{segment}</span>;
    });
}

// ─── List Item Parser ────────────────────────────────────────────────

function parseListItem(line: string): ParsedListItem {
  let text = line.trim().replace(/^-+\s*/, "");
  let badge: StatusTone | null = null;

  const bracketMatch = text.match(/^\[([a-z-]+)\]\s*/i);
  if (bracketMatch) {
    const normalized = statusAliases[bracketMatch[1].toLowerCase()];
    if (normalized) {
      badge = normalized;
      text = text.slice(bracketMatch[0].length).trim();
    }
  } else {
    const prefixMatch = text.match(
      /^(new|added|feature|updated|update|improvement|improved|fix|fixed|bugfix|security):\s*/i,
    );
    if (prefixMatch) {
      badge = statusAliases[prefixMatch[1].toLowerCase()];
      text = text.slice(prefixMatch[0].length).trim();
    }
  }

  // Pattern 1: **label**: description (colon outside bold)
  const emphOutside = text.match(/^\*\*(.+?)\*\*:\s*(.+)$/);
  if (emphOutside) {
    return {
      badge,
      label: emphOutside[1].trim(),
      description: emphOutside[2].trim(),
    };
  }

  // Pattern 2: **label:** description (colon inside bold — common markdown style)
  const emphInside = text.match(/^\*\*(.+?):\*\*\s*(.+)$/);
  if (emphInside) {
    return {
      badge,
      label: emphInside[1].trim(),
      description: emphInside[2].trim(),
    };
  }

  const plainLabelMatch = text.match(/^([^:]{2,80}):\s*(.+)$/);
  if (plainLabelMatch) {
    return {
      badge,
      label: plainLabelMatch[1].trim(),
      description: plainLabelMatch[2].trim(),
    };
  }

  return { badge, label: null, description: text };
}

// ─── Section Parser ──────────────────────────────────────────────────

function parseSections(body: string | null): ParsedSection[] {
  if (!body) return [];

  const sections: ParsedSection[] = [];
  const lines = body.split("\n");

  let currentSection: ParsedSection | null = null;
  let listBuffer: ParsedListItem[] = [];
  let sectionDefaultBadge: StatusTone | null = null;

  function ensureSection() {
    if (!currentSection) {
      currentSection = { title: "", items: [], paragraphs: [] };
    }
  }

  function flushList() {
    if (!currentSection || listBuffer.length === 0) return;
    for (const item of listBuffer) {
      if (!item.badge && sectionDefaultBadge) {
        item.badge = sectionDefaultBadge;
      }
    }
    currentSection.items.push(...listBuffer);
    listBuffer = [];
  }

  function pushSection() {
    if (!currentSection) return;
    flushList();
    if (
      currentSection.title ||
      currentSection.items.length > 0 ||
      currentSection.paragraphs.length > 0
    ) {
      sections.push(currentSection);
    }
    currentSection = null;
    sectionDefaultBadge = null;
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      continue;
    }

    if (/^#\s+/.test(line)) continue;

    if (/^##\s+/.test(line)) {
      pushSection();
      const headingText = line.replace(/^##\s+/, "").trim();
      sectionDefaultBadge = headingBadgeMap[headingText.toLowerCase()] ?? null;
      currentSection = { title: headingText, items: [], paragraphs: [] };
      continue;
    }

    if (/^###\s+/.test(line)) {
      flushList();
      ensureSection();
      currentSection?.paragraphs.push(line.replace(/^###\s+/, "").trim());
      continue;
    }

    if (/^-+\s+/.test(line)) {
      ensureSection();
      listBuffer.push(parseListItem(line));
      continue;
    }

    ensureSection();
    flushList();
    currentSection?.paragraphs.push(line);
  }

  pushSection();
  return sections;
}

// ─── Date Formatter ──────────────────────────────────────────────────

function formatReleaseDate(date: string | null | undefined, locale: Locale) {
  if (!date) return null;
  return new Date(date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Badge Component ─────────────────────────────────────────────────

function StatusBadge({
  tone,
  t,
}: {
  tone: StatusTone;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <span
      className={`mr-1.5 mb-[3px] inline-flex h-4 items-center rounded border px-1 align-middle font-mono text-[9px] font-medium uppercase ${statusClasses[tone]}`}
    >
      {t(`badge.${tone}`, { defaultValue: statusDefaults[tone] })}
    </span>
  );
}

// ─── Page Component ──────────────────────────────────────────────────

function ChangelogPage() {
  const t = useTranslations("changelogPage");
  const loaderData = Route.useLoaderData();
  const { locale } = Route.useParams();
  const typedLocale = (locale === "tr" ? "tr" : "en") as Locale;

  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const hasScrolled = useRef(false);
  const observedEntries = useRef(new Set<string>());

  // Analytics: page view + engaged time
  useEffect(() => {
    trackChangelogView({ locale: locale || "en" });
  }, [locale]);
  useEngagedTime("changelog");

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

  // Analytics: track changelog entry visibility via IntersectionObserver
  useEffect(() => {
    if (!releases?.length) return;
    observedEntries.current = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const slug = entry.target.id;
          if (!slug || observedEntries.current.has(slug)) continue;
          observedEntries.current.add(slug);

          const release = releases.find((r: ChangelogEntry) => r.slug === slug);
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

                {/* Title */}
                <h2 className="mb-6 text-balance text-3xl font-medium leading-snug text-mist-950">
                  {entry.title}
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
