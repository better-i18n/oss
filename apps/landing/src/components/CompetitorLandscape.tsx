import { Link, useParams } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { SpriteIcon } from "@/components/SpriteIcon";
import { CompetitorMark, type CompetitorKey } from "@/components/icons/CompetitorMarks";

/**
 * The four named alternatives, with what each is good at, where we differ, and
 * their own published entry price.
 *
 * This block lives here rather than inside `Alternatives` because two pages
 * make the same argument from the same evidence: the home page's alternatives
 * band, and the positioning section on `/about`. Copying the markup would have
 * meant two places to fix when a vendor changes their pricing — and the whole
 * point of this block is that its numbers are checkable.
 *
 * Every string is a published key in the `alternatives` namespace. Nothing here
 * is authored at the call site, so neither page can quietly invent a claim
 * about a competitor.
 */

const ALTERNATIVES = [
  { key: "crowdin", name: "Crowdin", href: "/$locale/compare/crowdin/" },
  { key: "lokalise", name: "Lokalise", href: "/$locale/compare/lokalise/" },
  { key: "phrase", name: "Phrase", href: "/$locale/compare/phrase/" },
  { key: "transifex", name: "Transifex", href: "/$locale/compare/transifex/" },
] as const;

/**
 * Vendors whose entry price was read off their own pricing page and confirmed —
 * checked 2 August 2026 in a browser, because all four pages render their
 * numbers with JavaScript and a plain fetch returns none.
 *
 * Phrase is absent on purpose: their pricing page showed no figure at all, so
 * there is nothing to cite. A number we cannot see on the vendor's own page is
 * not one to print next to their name — a missing line is a gap, an invented
 * one is a liability.
 */
const VERIFIED_ENTRY_PRICE = new Set<string>(["crowdin", "lokalise", "transifex"]);

export function CompetitorLandscape({ showLabel = true }: { showLabel?: boolean }) {
  const t = useT("alternatives");
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";

  return (
    <div>
      {showLabel && (
        <p className="text-[11px] font-medium text-mist-400">{t("competitorsLabel")}</p>
      )}
      {/* Four bare columns, gap only — no container, no per-item cell
          (rule/listed-items-are-not-cards). The mark plus ink weight carries
          the grouping. */}
      <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-10 ${showLabel ? "mt-5" : ""}`}>
        {ALTERNATIVES.map((alt) => (
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
                {/* One hard number per card, and not a new claim: this is the
                    entry price our own comparison page for that vendor already
                    publishes, read off their public pricing page. */}
                {VERIFIED_ENTRY_PRICE.has(alt.key) && (
                  <span className="mt-1.5 block text-[12px] tabular-nums text-mist-400">
                    {t(`${alt.key}.entryPrice`)}
                  </span>
                )}
              </span>
            </span>
            <SpriteIcon
              name="chevron-right"
              className="mt-0.5 size-3.5 shrink-0 text-mist-400 transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </Link>
        ))}
      </div>

      {/* Where the numbers come from. A price without a source is a claim; with
          one it is a citation. */}
      <p className="mt-4 text-[12px] leading-5 text-mist-400">{t("entryPriceNote")}</p>

      {/* Naming a competitor without acknowledging what they do well reads as
          insecurity. This line is the posture the comparison pages are written
          in: they are good tools, we are a different shape. */}
      <p className="section-p mt-5 text-[13px]">{t("respectNote")}</p>
    </div>
  );
}
