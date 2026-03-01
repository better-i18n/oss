import { Link, useParams } from "@tanstack/react-router";
import { IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { useTranslations } from "@better-i18n/use-intl";
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
  const t = useTranslations("changelog");
  const lang = locale || "en";

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 mb-8 sm:text-4xl/[1.1]">
          {t("title", { defaultValue: "What's New" })}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                className="group flex flex-col rounded-xl bg-mist-950/[0.025] p-5 hover:bg-mist-950/[0.05] transition-colors"
              >
                <div className="flex items-center gap-3 text-mist-500 mb-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${badgeColor}`}
                  >
                    {badgeText}
                  </span>
                  <time className="text-sm">{dateStr}</time>
                </div>
                <p className="text-base/7 text-mist-950 group-hover:text-mist-700">
                  {entry.title}
                </p>
              </Link>
            );
          })}
        </div>
        <div className="mt-6">
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
