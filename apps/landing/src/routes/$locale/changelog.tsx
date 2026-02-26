import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useTranslations } from "@better-i18n/use-intl";
import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
} from "@/lib/meta";
import { getChangelogs, type ChangelogEntry } from "@/lib/changelog";
import { getDefaultStructuredData } from "@/lib/structured-data";

export const Route = createFileRoute("/$locale/changelog")({
  loader: async ({ context, params }) => {
    const locale = params.locale as "en" | "tr";
    const releases = await getChangelogs(locale);

    return {
      messages: context.messages,
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
      scripts: getDefaultStructuredData(),
    };
  },
  component: ChangelogPage,
});

const categoryColors: Record<string, string> = {
  feature: "bg-blue-50 text-blue-700",
  improvement: "bg-green-50 text-green-700",
  fix: "bg-orange-50 text-orange-700",
  security: "bg-red-50 text-red-700",
};

const categoryLabels: Record<string, Record<string, string>> = {
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

// Apply inline formatting (bold) to a text segment
function applyInline(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
}

// Line-by-line markdown to HTML conversion
// Content comes from our own CMS (controlled source), so innerHTML is safe here.
function renderContent(content: string): string {
  const lines = content.split('\n');
  const output: string[] = [];
  const listItems: string[] = [];

  function flushList() {
    if (listItems.length > 0) {
      output.push('<ul class="list-disc list-inside space-y-1.5 my-3 text-sm">');
      output.push(...listItems);
      output.push('</ul>');
      listItems.length = 0;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip h1 — title is already shown in the card header
    if (/^# /.test(trimmed)) {
      flushList();
      continue;
    }

    // ## → <h3>
    if (/^## (.+)$/.test(trimmed)) {
      flushList();
      const text = trimmed.slice(3);
      output.push(`<h3 class="text-lg font-semibold text-gray-900 mt-8 mb-3">${applyInline(text)}</h3>`);
      continue;
    }

    // ### → <h4>
    if (/^### (.+)$/.test(trimmed)) {
      flushList();
      const text = trimmed.slice(4);
      output.push(`<h4 class="text-base font-semibold text-gray-900 mt-6 mb-2">${applyInline(text)}</h4>`);
      continue;
    }

    // - item → buffered <li>
    if (/^- (.+)$/.test(trimmed)) {
      const text = trimmed.slice(2);
      listItems.push(`<li class="text-gray-600">${applyInline(text)}</li>`);
      continue;
    }

    // Non-empty plain text → <p>
    if (trimmed) {
      flushList();
      output.push(`<p class="text-gray-600 text-sm my-2">${applyInline(trimmed)}</p>`);
      continue;
    }

    // Empty line — flush any open list
    flushList();
  }

  flushList();
  return output.join('\n');
}

function ChangelogPage() {
  const t = useTranslations("changelogPage");
  const loaderData = Route.useLoaderData();
  const { locale } = Route.useParams();

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
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false, // Don't refetch on mount if we have initialData
    refetchOnWindowFocus: false,
  });

  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="flex flex-col gap-16">
            <div className="text-center">
              <h1 className="font-display text-4xl font-medium tracking-tight text-balance text-gray-900 sm:text-5xl">
                {t("title")}
              </h1>
              <p className="mt-4 text-lg text-pretty text-gray-600">
                {t("subtitle")}
              </p>
            </div>

            <div className="flex flex-col gap-12">
              {releases?.map((entry: ChangelogEntry) => (
                <article
                  key={entry.slug}
                  id={entry.slug}
                  className="pt-10 border-t border-gray-200 first:pt-0 first:border-0"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {entry.category && (
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[entry.category] || categoryColors.feature}`}
                      >
                        {categoryLabels[locale]?.[entry.category] ||
                          entry.category}
                      </span>
                    )}
                    {entry.publishedAt && (
                      <time className="text-sm text-gray-500">
                        {new Date(entry.publishedAt).toLocaleDateString(
                          locale === "tr" ? "tr-TR" : "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </time>
                    )}
                    {entry.version && (
                      <span className="text-xs font-mono text-gray-400">
                        v{entry.version}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="font-display text-2xl font-medium text-gray-900 mb-3">
                    {entry.title}
                  </h2>

                  {/* Summary */}
                  {entry.summary ? (
                    <p className="text-base text-gray-600 mb-4">{entry.summary}</p>
                  ) : null}

                  {/* Full Content — content is from our own CMS (controlled source) */}
                  {entry.body && (
                    <div
                      className="prose prose-sm prose-gray max-w-none"
                      dangerouslySetInnerHTML={{ __html: renderContent(entry.body) }}
                    />
                  )}
                </article>
              ))}

              {(!releases || releases.length === 0) && (
                <div className="text-center py-12 text-gray-500">
                  {locale === "tr"
                    ? "Henuz changelog yok."
                    : "No changelog entries yet."}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
