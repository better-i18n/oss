import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { getClusterSiblings } from "@/seo/topic-clusters";
import { SpriteIcon } from "@/components/SpriteIcon";
import { i18nGuideRoute } from "@/lib/i18n-guide-routes";
import { GuideMark } from "@/lib/i18n-guide-icons";
import { Section, SectionHeader } from "@/components/ui/page";

type SeeAlsoProps = {
  readonly currentSlug: string;
  readonly locale: string;
  readonly limit?: number;
};

/**
 * "Keep reading" strip: the other guides in this page's topic cluster.
 *
 * Rendered by every guide that belongs to a cluster, so its shell is the highest
 * leverage surface on the site — one file decides how ten-plus pages end.
 *
 * What changed and why:
 *   - It opened with a bare `font-display text-lg` h2. Now it opens
 *     eyebrow → section-h2 → lede via <SectionHeader> like every other section
 *     (rule/section-opens-with-header), and the container is <Section> instead of
 *     a hand-rolled `<section><div className="section">` (rule/one-container).
 *   - Each sibling was a `rounded-xl border border-mist-200 p-5` card with
 *     `hover:shadow-md`. A link with a title and one line of description is text,
 *     not a card: the cards are gone and the columns are separated by gap alone,
 *     the same shape Pricing and the related-posts strip use
 *     (rule/white-page-hairline-separation). Shadow-based hover is banned; hover
 *     is now ink weight plus a 2px chevron shift.
 *   - The two `defaultValue` fallbacks were dead code twice over: `useT`
 *     humanises a missing key and never reads defaultValue, and both
 *     `seeAlso.heading` / `seeAlso.open` have existed on the CDN all along.
 *
 * `titleFallback` / `descFallback` still come from `seo/topic-clusters` rather
 * than the CDN — that is cluster *data* shared with the sitemap and llms.txt
 * generators, not page copy, so it is deliberately left alone here.
 */
export function SeeAlso({ currentSlug, locale, limit = 5 }: SeeAlsoProps) {
  const t = useT("seeAlso");
  const siblings = getClusterSiblings(currentSlug, limit);

  if (siblings.length === 0) return null;

  return (
    <Section>
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("heading")}
        subtitle={t("subtitle")}
      />

      {/* Bare columns, gap only. A bordered grid would need a full last row to
          look deliberate, and the sibling count varies per cluster (2–5), so any
          container would leave a hole on most pages. */}
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-3 xl:grid-cols-5">
        {siblings.map((page) => (
          <Link
            key={page.slug}
            to={i18nGuideRoute(page.slug)}
            params={{ locale }}
            className="group flex flex-col"
          >
            {/* rule/name-a-thing-with-its-mark: a guide named here carries the
                same mark it carries in the header menu and the /i18n hub, at the
                same size on the same ground. GuideMark renders nothing for slugs
                with no icon, so a cluster of topic guides just has no marks
                rather than a row of placeholder tiles. */}
            <GuideMark slug={page.slug} />
            <h3 className="mt-3 text-[15px] font-medium leading-[1.35] tracking-[-0.015em] text-mist-900 transition-colors group-hover:text-mist-950">
              {page.titleFallback}
            </h3>
            <p className="mt-1.5 text-[13px] leading-[1.55] text-mist-600">
              {page.descFallback}
            </p>
            <span className="mt-3 flex items-center gap-1 text-[12px] font-medium text-mist-400 transition-colors group-hover:text-mist-700">
              {t("open")}
              <SpriteIcon
                name="chevron-right"
                className="size-3 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
