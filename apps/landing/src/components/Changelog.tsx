import { Link, useParams } from "@tanstack/react-router";
import { IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { useT } from "@/lib/i18n";
import type { ChangelogEntry, ChangelogListItem } from "@/lib/changelog";

const categoryColors: Record<string, string> = {
  feature: "bg-blue-500/10 text-blue-700",
  improvement: "bg-emerald-500/10 text-emerald-700",
  fix: "bg-amber-500/10 text-amber-700",
  security: "bg-red-500/10 text-red-700",
};

const categoryLabels: Record<string, Record<string, string>> = {
  en: {
    feature: "New Feature",
    improvement: "Improvement",
    fix: "Bug Fix",
    security: "Security",
  },
  tr: {
    feature: "Yeni Özellik",
    improvement: "İyileştirme",
    fix: "Hata Düzeltme",
    security: "Güvenlik",
  },
};

interface ChangelogProps {
  releases: (ChangelogEntry | ChangelogListItem)[];
}

export default function Changelog({ releases }: ChangelogProps) {
  const { locale } = useParams({ strict: false });
  const t = useT("changelog");
  const lang = locale || "en";

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04]">
              {t("title", { defaultValue: "What's New" })}
            </h2>
            <p className="mt-4 text-lg text-mist-600">
              {t("subtitle", {
                defaultValue: "Recent product updates, shipping velocity, and the platform changes teams notice first.",
              })}
            </p>
          </div>
          <Link
            to="/$locale/changelog"
            params={{ locale: lang }}
            className="hidden items-center gap-2 rounded-full border border-mist-200 bg-white px-4 py-2.5 text-sm font-medium text-mist-700 transition-colors hover:text-mist-950 sm:inline-flex"
          >
            {t("seeWhatsNew", { defaultValue: "See what's new" })}
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {releases.map((entry) => {
            const category = entry.category ?? "";
            const badgeColor =
              categoryColors[category] ?? "bg-mist-500/10 text-mist-700";
            const badgeText =
              categoryLabels[lang]?.[category] ??
              (entry.version
                ? `v${entry.version}`
                : category);
            const dateStr = entry.publishedAt
              ? new Date(entry.publishedAt).toLocaleDateString(
                  lang === "tr" ? "tr-TR" : "en-US",
                  { year: "numeric", month: "short", day: "numeric" }
                )
              : "";

            return (
              <Link
                key={entry.slug}
                to="/$locale/changelog"
                params={{ locale: lang }}
                className="group flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3 text-mist-700 mb-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${badgeColor}`}
                  >
                    {badgeText}
                  </span>
                  <time className="text-sm">{dateStr}</time>
                </div>
                <p className="text-base/7 text-mist-950 transition-colors group-hover:text-mist-700">
                  {entry.title}
                </p>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 sm:hidden">
          <Link
            to="/$locale/changelog"
            params={{ locale: lang }}
            className="inline-flex items-center gap-1 text-sm font-medium text-mist-700 hover:text-mist-950"
          >
            {t("seeWhatsNew", { defaultValue: "See what's new" })}
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
