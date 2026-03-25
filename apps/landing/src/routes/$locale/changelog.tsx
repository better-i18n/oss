import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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
import { withTimeout } from "@/lib/fetch-utils";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "@/i18n.config";

export const Route = createFileRoute("/$locale/changelog")({
  loader: async ({ context, params }) => {
    const locale = params.locale as "en" | "tr";
    // Wrap with 4s timeout so the page renders even if the content API is slow.
    // Client-side useQuery will retry on navigation.
    const { filterMessages } = await import("@/lib/page-namespaces");
    const [allMessages, releases] = await Promise.all([
      getMessages({ project: i18nConfig.project, locale: context.locale }),
      withTimeout(getChangelogs(locale), 4000, []),
    ]);
    const messages = filterMessages(allMessages, ["meta", "breadcrumbs"]);

    return {
      messages,
      locale: context.locale,
      releases,
    };
  },
  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const pathname = "/changelog";
    const meta = getLocalizedMeta(loaderData?.messages || {}, "changelog", {
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

const categoryColors: Record<string, string> = {
  feature:
    "border border-sky-200 bg-sky-50 text-sky-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
  improvement:
    "border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
  fix: "border border-amber-200 bg-amber-50 text-amber-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
  security:
    "border border-rose-200 bg-rose-50 text-rose-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
};

const categoryLabels: Record<Locale, Record<string, string>> = {
  en: {
    feature: "New Feature",
    improvement: "Improvement",
    fix: "Bug Fix",
    security: "Security",
  },
  tr: {
    feature: "Yeni Ozellik",
    improvement: "Iyilestirme",
    fix: "Hata Duzeltme",
    security: "Guvenlik",
  },
};

const statusLabels: Record<Locale, Record<StatusTone, string>> = {
  en: {
    new: "NEW",
    updated: "UPDATED",
    improved: "IMPROVED",
    fixed: "FIXED",
    security: "SECURITY",
  },
  tr: {
    new: "YENI",
    updated: "GUNCEL",
    improved: "IYILESTI",
    fixed: "DUZELTILDI",
    security: "GUVENLIK",
  },
};

const statusClasses: Record<StatusTone, string> = {
  new: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  updated: "border border-slate-200 bg-slate-100 text-slate-700",
  improved: "border border-blue-200 bg-blue-50 text-blue-700",
  fixed: "border border-amber-200 bg-amber-50 text-amber-700",
  security: "border border-rose-200 bg-rose-50 text-rose-700",
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

function renderInline(text: string) {
  return text
    .split(/(\*\*.+?\*\*)/g)
    .filter(Boolean)
    .map((segment, index) => {
      if (segment.startsWith("**") && segment.endsWith("**")) {
        return (
          <strong key={`${segment}-${index}`} className="font-semibold text-mist-950">
            {segment.slice(2, -2)}
          </strong>
        );
      }

      return <span key={`${segment}-${index}`}>{segment}</span>;
    });
}

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
      /^(new|added|feature|updated|update|improvement|improved|fix|fixed|bugfix|security):\s*/i
    );

    if (prefixMatch) {
      badge = statusAliases[prefixMatch[1].toLowerCase()];
      text = text.slice(prefixMatch[0].length).trim();
    }
  }

  const emphasizedLabelMatch = text.match(/^\*\*(.+?)\*\*:\s*(.+)$/);
  if (emphasizedLabelMatch) {
    return {
      badge,
      label: emphasizedLabelMatch[1].trim(),
      description: emphasizedLabelMatch[2].trim(),
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

  return {
    badge,
    label: null,
    description: text,
  };
}

/** Map section heading text to a default badge for items underneath */
const headingBadgeMap: Record<string, StatusTone> = {
  "new features": "new",
  "what's new": "new",
  "new": "new",
  "features": "new",
  "improvements": "improved",
  "improved": "improved",
  "updates": "updated",
  "updated": "updated",
  "changes": "updated",
  "bug fixes": "fixed",
  "bug fixes & improvements": "fixed",
  "fixes": "fixed",
  "fixed": "fixed",
  "security": "security",
  // Turkish headings
  "yeni özellikler": "new",
  "yenilikler": "new",
  "yeni": "new",
  "iyileştirmeler": "improved",
  "güncellemeler": "updated",
  "hata düzeltmeleri": "fixed",
  "düzeltmeler": "fixed",
  // German
  "neue funktionen": "new",
  "neuigkeiten": "new",
  "verbesserungen": "improved",
  "fehlerbehebungen": "fixed",
  "bugfixes": "fixed",
  // Spanish
  "nuevas funciones": "new",
  "novedades": "new",
  "mejoras": "improved",
  "correcciones de errores": "fixed",
  // French
  "nouvelles fonctionnalités": "new",
  "nouveautés": "new",
  "améliorations": "improved",
  "corrections de bugs": "fixed",
  // Portuguese
  "novas funcionalidades": "new",
  "novidades": "new",
  "melhorias": "improved",
  "correções de erros": "fixed",
  // Russian
  "новые функции": "new",
  "новое": "new",
  "улучшения": "improved",
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

function parseSections(body: string | null): ParsedSection[] {
  if (!body) return [];

  const sections: ParsedSection[] = [];
  const lines = body.split("\n");

  let currentSection: ParsedSection | null = null;
  let listBuffer: ParsedListItem[] = [];
  let sectionDefaultBadge: StatusTone | null = null;

  function ensureSection() {
    if (!currentSection) {
      currentSection = {
        title: "",
        items: [],
        paragraphs: [],
      };
    }
  }

  function flushList() {
    if (!currentSection || listBuffer.length === 0) return;
    // Apply section default badge to items that don't have their own
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

    if (/^#\s+/.test(line)) {
      continue;
    }

    if (/^##\s+/.test(line)) {
      pushSection();
      const headingText = line.replace(/^##\s+/, "").trim();
      sectionDefaultBadge = headingBadgeMap[headingText.toLowerCase()] ?? null;
      currentSection = {
        title: headingText,
        items: [],
        paragraphs: [],
      };
      continue;
    }

    if (/^###\s+/.test(line)) {
      flushList();
      ensureSection();
      const section = currentSection;
      if (section) {
        section.paragraphs.push(line.replace(/^###\s+/, "").trim());
      }
      continue;
    }

    if (/^-+\s+/.test(line)) {
      ensureSection();
      listBuffer.push(parseListItem(line));
      continue;
    }

    ensureSection();
    flushList();
    const section = currentSection;
    if (section) {
      section.paragraphs.push(line);
    }
  }

  pushSection();
  return sections;
}

function formatReleaseDate(date: string | null | undefined, locale: Locale) {
  if (!date) return null;

  return new Date(date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ChangelogPage() {
  const t = useTranslations("changelogPage");
  const loaderData = Route.useLoaderData();
  const { locale } = Route.useParams();
  const typedLocale = (locale === "tr" ? "tr" : "en") as Locale;

  // Hybrid approach:
  // - SSR: loader provides initial data (no API call visible to client)
  // - Client navigation: useQuery calls API endpoint
  const { data: releases = loaderData.releases } = useQuery({
    queryKey: ["changelogs", locale],
    queryFn: async () => {
      const response = await fetch(`/api/changelog?locale=${locale}`);
      if (!response.ok) throw new Error("Failed to fetch changelogs");
      const json = (await response.json()) as { releases: ChangelogEntry[] };
      return json.releases;
    },
    initialData: loaderData.releases,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="bg-mist-100">
      <Header className="bg-mist-100/90 backdrop-blur-sm" />
      <main className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_transparent_36%),linear-gradient(180deg,_rgba(247,248,248,0.88),_rgba(238,240,241,0.96)_24%,_rgba(223,228,230,0.88)_100%)]" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(109,125,133,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(109,125,133,0.07)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute inset-x-0 top-24 mx-auto h-72 max-w-5xl rounded-full bg-white/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-mist-300 bg-white/75 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-mist-600 uppercase shadow-[0_10px_30px_-18px_rgba(24,28,30,0.55)] backdrop-blur-sm">
              {typedLocale === "tr" ? "Urun Guncellemeleri" : "Product Updates"}
            </span>
            <h1 className="mt-6 font-display text-4xl font-medium tracking-tight text-balance text-mist-950 sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-pretty text-mist-600">
              {t("subtitle")}
            </p>
          </div>

          <div className="mt-14 flex flex-col gap-8">
            {releases?.map((entry: ChangelogEntry, index: number) => {
              const sections = parseSections(entry.body);
              const isLatest = index === 0;
              const releaseDate = formatReleaseDate(entry.publishedAt, typedLocale);

              return (
                <article
                  key={entry.slug}
                  id={entry.slug}
                  className="relative overflow-hidden rounded-[28px] border border-mist-300/80 bg-[linear-gradient(180deg,rgba(247,248,248,0.88),rgba(238,240,241,0.82))] px-6 py-6 shadow-[0_24px_60px_-42px_rgba(24,28,30,0.35)] backdrop-blur-[2px] sm:px-8 sm:py-8"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

                  <div className="flex flex-wrap items-center gap-3 text-sm text-mist-500">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-mist-200 bg-mist-50 text-xs font-semibold uppercase text-mist-700">
                      v
                    </span>
                    {entry.version ? (
                      <span className="font-mono text-xs text-mist-500">v{entry.version}</span>
                    ) : null}
                    {releaseDate ? <time>{releaseDate}</time> : null}
                    {isLatest ? (
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                        {typedLocale === "tr" ? "Son Surum" : "Latest"}
                      </span>
                    ) : null}
                    {entry.category ? (
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${categoryColors[entry.category] || categoryColors.feature}`}
                      >
                        {categoryLabels[typedLocale][entry.category] || entry.category}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 max-w-3xl">
                    <h2 className="font-display text-3xl font-medium tracking-tight text-mist-950 sm:text-[2rem]">
                      {entry.title}
                    </h2>
                    {entry.summary ? (
                      <p className="mt-3 text-lg leading-8 text-mist-600">
                        {entry.summary}
                      </p>
                    ) : null}
                  </div>

                  {sections.length > 0 ? (
                    <div className="mt-8 space-y-7">
                      {sections.map((section, sectionIndex) => (
                        <section
                          key={`${entry.slug}-${section.title || "section"}-${sectionIndex}`}
                          className="border-l-2 border-mist-300/80 pl-5 sm:pl-6"
                        >
                          {section.title ? (
                            <h3 className="text-2xl font-semibold tracking-tight text-mist-950">
                              {section.title}
                            </h3>
                          ) : null}

                          {section.paragraphs.length > 0 ? (
                            <div className={section.title ? "mt-3 space-y-2.5" : "space-y-2.5"}>
                              {section.paragraphs.map((paragraph, paragraphIndex) => (
                                <p
                                  key={`${entry.slug}-paragraph-${sectionIndex}-${paragraphIndex}`}
                                  className="text-[15px] leading-7 text-mist-600"
                                >
                                  {renderInline(paragraph)}
                                </p>
                              ))}
                            </div>
                          ) : null}

                          {section.items.length > 0 ? (
                            <ul className={section.title || section.paragraphs.length > 0 ? "mt-4 space-y-3.5" : "space-y-3.5"}>
                              {section.items.map((item, itemIndex) => (
                                <li
                                  key={`${entry.slug}-item-${sectionIndex}-${itemIndex}`}
                                  className="flex gap-3 text-mist-700"
                                >
                                  <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-mist-400" />
                                  <div className="min-w-0 flex-1 leading-8">
                                    <div className="inline-flex flex-wrap items-center gap-2">
                                      {item.badge ? (
                                        <span
                                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${statusClasses[item.badge]}`}
                                        >
                                          {statusLabels[typedLocale][item.badge]}
                                        </span>
                                      ) : null}
                                      {item.label ? (
                                        <span className="text-lg font-semibold text-mist-950">
                                          {renderInline(item.label)}
                                        </span>
                                      ) : null}
                                      <span className="text-base text-mist-600">
                                        {item.label ? ": " : ""}
                                        {renderInline(item.description)}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </section>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}

            {(!releases || releases.length === 0) && (
              <div className="rounded-[28px] border border-mist-200 bg-white px-8 py-12 text-center text-mist-500 shadow-[0_24px_80px_-40px_rgba(24,28,30,0.42)]">
                {typedLocale === "tr"
                  ? "Henuz changelog girdisi yok."
                  : "No changelog entries yet."}
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
