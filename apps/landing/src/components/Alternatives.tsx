import { Link, useParams } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { SpriteIcon } from "@/components/SpriteIcon";
import { CompetitorMark, type CompetitorKey } from "@/components/icons/CompetitorMarks";

const alternatives = [
  { key: "crowdin", name: "Crowdin", href: "/$locale/compare/crowdin/" },
  { key: "lokalise", name: "Lokalise", href: "/$locale/compare/lokalise/" },
  { key: "phrase", name: "Phrase", href: "/$locale/compare/phrase/" },
  { key: "transifex", name: "Transifex", href: "/$locale/compare/transifex/" },
];

/* Six claims, not three: this list carries the section's whole argument, and
   three lines left the column visually short next to four competitor cells.
   Keys only — the copy lives on the CDN (no inline fallbacks). */
const benefits = [
  "benefit1",
  "benefit2",
  "benefit3",
  "benefit4",
  "benefit5",
  "benefit6",
] as const;

export default function Alternatives() {
  const t = useT("alternatives");
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";

  return (
    <section id="alternatives">
      <div className="section">
        <div className="mb-12 max-w-3xl">
          <div className="eyebrow">
            {t("vsLabel")}
          </div>
          <h2 className="section-h2">
            {t("title")}
          </h2>
          <p className="section-p mt-3">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          {/* Left: no card, no border — the numbered claims are separated by the
              same hairline the rest of the page uses. Numerals are 11px meta ink
              (mist-400), not filled circles, so they read as an index and not as
              three heavy bullets competing with the copy. */}
          <div className="flex flex-col">
            <p className="text-[11px] font-medium text-mist-400">
              {t("benefitsLabel")}
            </p>
            <ul className="mt-5 border-t border-black/[0.07]">
              {benefits.map((benefit, index) => (
                <li
                  key={benefit}
                  className="flex items-baseline gap-4 border-b border-black/[0.07] py-4"
                >
                  <span className="w-3 shrink-0 text-[11px] tabular-nums text-mist-400">
                    {index + 1}
                  </span>
                  <span className="text-[15px] leading-6 tracking-[-0.015em] text-mist-700">
                    {t(benefit)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Router is configured `trailingSlash: "always"` (src/router.tsx),
                so the generated `to` union carries the trailing slash. */}
            <Link
              to="/$locale/i18n/best-tms/"
              params={{ locale: currentLocale }}
              className="btn btn-dark btn-lg mt-8 w-fit"
            >
              {t("viewFullComparison")}
              <SpriteIcon name="arrow-right" className="size-4" />
            </Link>
          </div>

          {/* Right: four bare columns, gap only — no container, no per-item cell.
              This was a hairline grid inside a rounded container until
              rule/listed-items-are-not-cards: a competitor list is a list of
              links, and the page is already a bordered frame, so the container
              was a second box and each cell a third. The mark plus ink weight
              carries the grouping now. The comparison MATRIX keeps its rules —
              there the lines are the structure, which is the rule's exception. */}
          <div>
            <p className="text-[11px] font-medium text-mist-400">
              {t("competitorsLabel")}
            </p>
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-10">
              {alternatives.map((alt) => (
                <Link
                  key={alt.key}
                  to={
                    alt.href as
                      | "/$locale/compare/crowdin/"
                      | "/$locale/compare/lokalise/"
                      | "/$locale/compare/phrase/"
                      | "/$locale/compare/transifex/"
                  }
                  params={{ locale: currentLocale }}
                  className="group flex items-start justify-between gap-3"
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <CompetitorMark competitor={alt.key as CompetitorKey} />
                    <span className="min-w-0">
                    <span className="block text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                      {alt.name}
                    </span>
                      <span className="mt-1.5 block text-[13px] leading-5 text-mist-600">
                        {t(`${alt.key}.description`)}
                      </span>
                    </span>
                  </span>
                  <SpriteIcon
                    name="chevron-right"
                    className="mt-0.5 size-3.5 shrink-0 text-mist-400 transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </div>

            {/* Naming a competitor without acknowledging what they do well reads
                as insecurity. This line is the section's posture: they are good
                tools, we are a different shape. It also sets up the comparison
                pages, which are written the same way. */}
            <p className="section-p mt-5 text-[13px]">{t("respectNote")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
