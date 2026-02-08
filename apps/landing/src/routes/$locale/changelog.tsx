import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
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

const loadChangelogs = createServerFn({ method: "GET" })
  .inputValidator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    return getChangelogs(data.locale === "tr" ? "tr" : "en");
  });

export const Route = createFileRoute("/$locale/changelog")({
  loader: async ({ context, params }) => {
    const releases = await loadChangelogs({
      data: { locale: params.locale },
    });

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

// Simple markdown to HTML conversion
function renderContent(content: string): string {
  return content
    // Headers
    .replace(/^### (.+)$/gm, '<h4 class="text-base font-semibold text-gray-900 mt-6 mb-2">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-8 mb-3">$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="text-gray-600">$1</li>')
    // Wrap consecutive li elements in ul
    .replace(
      /(<li[^>]*>.*?<\/li>\n?)+/g,
      '<ul class="list-disc list-inside space-y-1.5 my-3 text-sm">$&</ul>'
    )
    // Clean up empty lines
    .replace(/\n\n+/g, '\n');
}

function ChangelogPage() {
  const t = useTranslations("changelogPage");
  const { releases, locale } = Route.useLoaderData();

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
              {releases.map((release: ChangelogEntry) => (
                <article
                  key={release.slug}
                  id={release.slug}
                  className="pt-10 border-t border-gray-200 first:pt-0 first:border-0"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[release.category] || categoryColors.feature}`}
                    >
                      {categoryLabels[locale]?.[release.category] ||
                        release.category}
                    </span>
                    <time className="text-sm text-gray-500">
                      {new Date(release.date).toLocaleDateString(
                        locale === "tr" ? "tr-TR" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </time>
                    <span className="text-xs font-mono text-gray-400">
                      v{release.version}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-display text-2xl font-medium text-gray-900 mb-3">
                    {release.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-base text-gray-600 mb-4">
                    {release.summary}
                  </p>

                  {/* Full Content */}
                  <div
                    className="prose prose-sm prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderContent(release.content) }}
                  />

                  {/* Tags */}
                  {release.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-100">
                      {release.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}

              {releases.length === 0 && (
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
