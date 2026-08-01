import { Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import BlogContent from "@/components/blog/BlogContent";
import { IconArrowLeft } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { SpriteIcon } from "@/components/SpriteIcon";
import type { MarketingPage, MarketingPageListItem } from "@/lib/content";
import { getPersonaLabel } from "@/lib/cms-persona-helpers";
import { personaRoute } from "@/lib/persona-routes";
import { PROSE_CLASS } from "@/components/ProseBody";
import { Divider, PageHero, Section, SectionHeader } from "@/components/ui/page";
import { useT } from "@/lib/i18n";

/**
 * The template behind every CMS persona page (`/for-saas`, `/for-agencies`, …).
 *
 * What changed and why:
 *   - The hero was a hand-rolled `<section><div className="section"><div
 *     className="max-w-3xl">` with a `rounded-full` badge and pill buttons; it is
 *     now `<PageHero>`, so the persona pages open exactly like the pillar pages
 *     (rule/one-container, rule/pillar-page-shape).
 *   - The related-personas band sat on `bg-mist-50` with `rounded-xl border
 *     border-mist-200 hover:shadow-md` cards and a 16px gap. Tinted band and card
 *     shadows both go (rule/white-page-hairline-separation); the cards become one
 *     hairline index (rule/interior-hairlines-only) and the band is introduced by
 *     `<SectionHeader>` after a `<Divider />` instead of by a colour change.
 *   - The body prose chain is the shared one (rule/one-prose-scale) instead of a
 *     fourth local copy.
 *   - Sibling links went through `to={`/$locale/${slug}`}` — an untypeable
 *     template literal that also shipped 404s for the seven personas whose routes
 *     are archived. They now resolve through `personaRoute()`, and a persona with
 *     no page is skipped instead of linked.
 *   - All six `defaultValue` fallbacks are gone; every key exists in the
 *     `persona` namespace on the CDN.
 *
 * Content, headings, structured data and URLs are untouched
 * (rule/seo-content-is-load-bearing) — this is a shell and typography change.
 */

interface CmsPersonaPageProps {
  page: MarketingPage;
  locale: string;
  relatedPersonas: MarketingPageListItem[];
}

export function CmsPersonaPage({
  page,
  locale,
  relatedPersonas,
}: CmsPersonaPageProps) {
  const t = useT("persona");
  /* Only personas that still have a route can be linked. */
  const linkable = relatedPersonas.filter((p) => personaRoute(p.slug));

  return (
    <MarketingLayout showCTA={true}>
      <PageHero
        pillar="ai"
        pillarLabel={getPersonaLabel(page.slug)}
        titleId="persona-hero-title"
        title={page.title}
        subtitle={page.heroSubtitle ?? ""}
        primary={{ label: t("hero.cta"), href: "https://dash.better-i18n.com" }}
        secondary={{
          label: t("hero.bookDemo"),
          href: "https://cal.com/better-i18n/30min?overlayCalendar=true",
        }}
      />

      {page.bodyHtml && (
        <>
          <Divider />
          <Section>
            {/* Markdown is one flow, so it gets one Section; the h2 rhythm inside
                comes from the shared prose scale. */}
            <article className="min-w-0">
              <BlogContent html={page.bodyHtml} locale={locale} className={PROSE_CLASS} />
            </article>
          </Section>
        </>
      )}

      {linkable.length > 0 && (
        <>
          <Divider />
          <Section>
            <SectionHeader
              eyebrow={getPersonaLabel(page.slug)}
              title={t("builtForEveryTeam")}
              subtitle={t("builtForEveryTeamDesc")}
            />
            <div className="mt-8 overflow-hidden">
              <div className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {linkable.map((persona) => (
                  <Link
                    key={persona.slug}
                    to={personaRoute(persona.slug)!}
                    params={{ locale }}
                    className="group flex items-start justify-between gap-3 border-t border-l border-black/[0.05] px-5 py-4 transition-colors hover:bg-black/[0.02]"
                  >
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium text-mist-900">
                        {persona.title}
                      </span>
                      {persona.heroSubtitle && (
                        <span className="mt-1 block line-clamp-2 text-[12px] leading-relaxed text-mist-500">
                          {persona.heroSubtitle}
                        </span>
                      )}
                    </span>
                    <SpriteIcon
                      name="arrow-right"
                      className="mt-0.5 size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </Section>
        </>
      )}
    </MarketingLayout>
  );
}

export function CmsPersonaNotFound({
  locale,
}: {
  locale: string;
  slug?: string;
}) {
  const t = useT("persona");

  return (
    <MarketingLayout showCTA={false}>
      <Section>
        <h1 className="section-h2">{t("notFound.title")}</h1>
        <p className="section-p mt-3">{t("notFound.description")}</p>
        <Link
          to="/$locale/"
          params={{ locale }}
          className="btn btn-dark btn-lg mt-8 w-fit"
        >
          <IconArrowLeft className="size-4" />
          {t("notFound.goHome")}
        </Link>
      </Section>
    </MarketingLayout>
  );
}
