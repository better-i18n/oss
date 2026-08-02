import { Link, useParams } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { useT } from "@/lib/i18n";
import type { ChangelogEntry, ChangelogListItem } from "@/lib/changelog";


const releaseTypeDefaults: Record<string, string> = {
  major: "Major",
  minor: "Minor",
  patch: "Patch",
  hotfix: "Hotfix",
};

interface ChangelogProps {
  releases: (ChangelogEntry | ChangelogListItem)[];
}

export default function Changelog({ releases }: ChangelogProps) {
  const { locale } = useParams({ strict: false });
  const t = useT("changelog");
  const lang = locale || "en";

  return (
    <section>
      <div className="section">
        <div className="mb-8">
          <div className="max-w-2xl">
            <h2 className="section-h2">
              {t("title")}
            </h2>
            <p className="section-p mt-3">
              {t("subtitle")}
            </p>
          </div>
          <Link
            to="/$locale/changelog/"
            params={{ locale: lang }}
            className="learn-more mt-5 w-fit"
          >
            {t("seeWhatsNew")}
            <SpriteIcon name="arrow-right" className="size-3.5" />
          </Link>
        </div>

        {releases.length > 0 && (
        <div>
          {/* Bare columns, gap only — same shape as Pricing and Related Posts.
              The bordered container plus per-cell hairlines drew a card grid
              inside `.section`, which already frames the band. */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {releases.map((entry) => {
            const releaseType = (entry.release_type ?? "").toLowerCase();
            const badgeText = releaseTypeDefaults[releaseType]
              ? t(`releaseType.${releaseType}`)
              : (entry.version ? `v${entry.version}` : releaseType);
            const dateStr = entry.publishedAt
              ? new Date(entry.publishedAt).toLocaleDateString(
                  lang === "tr" ? "tr-TR" : "en-US",
                  { year: "numeric", month: "short", day: "numeric" }
                )
              : "";

            return (
              <Link
                key={entry.slug}
                to="/$locale/changelog/$slug/"
                params={{ locale: lang, slug: entry.slug }}
                className="group flex h-full flex-col"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="rounded-sm border border-black/[0.07] bg-mist-50 px-2 py-0.5 text-[11px] font-medium text-mist-600"
                  >
                    {badgeText}
                  </span>
                  <time className="text-[11px] tabular-nums text-mist-400">{dateStr}</time>
                </div>
                <p className="text-[15px] leading-snug tracking-[-0.015em] text-mist-900 transition-colors group-hover:text-mist-600">
                  {entry.title}
                </p>
              </Link>
            );
          })}
          </div>
        </div>
        )}
        <div className="mt-6 hidden">
          <Link
            to="/$locale/changelog/"
            params={{ locale: lang }}
            className="inline-flex items-center gap-1 text-sm font-medium text-mist-700 hover:text-mist-950"
          >
            {t("seeWhatsNew")}
            <SpriteIcon name="arrow-right" className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
