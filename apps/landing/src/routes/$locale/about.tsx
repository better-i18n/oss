import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import { CompetitorLandscape } from "@/components/CompetitorLandscape";
import PlatformMetrics from "@/components/PlatformMetrics";
import {
  PageHero,
  Section,
  SectionHeader,
  Divider,
  BentoList,
  BentoRow,
  FeatureRow,
  FeatureColumn,
  PageTestimonial,
  ClosingCta,
} from "@/components/ui/page";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { testimonialAvatar } from "@/lib/testimonials";

/**
 * `/about` is a positioning page, not a company page.
 *
 * It used to be a mission statement, a three-paragraph "born from frustration"
 * story and a six-card values grid. None of that answered the question the
 * page actually ranks for: what is this company, and why does it exist next to
 * Crowdin, Lokalise, Phrase and Transifex.
 *
 * Every claim about a competitor on this page comes from the `alternatives`
 * namespace, which is where our comparison pages already publish them, with
 * their entry prices read off each vendor's own pricing page on 2 August 2026.
 * No competitor claim is authored here. See `CompetitorLandscape`.
 */

/** Our own pricing policy, in the order the argument needs. */
const PRICING_RULES = ["freeTier", "openSource", "seats", "words"] as const;

/** The three layers the infrastructure argument rests on. */
const LAYERS = ["cdn", "sdk", "agents"] as const;

export const Route = createFileRoute("/$locale/about")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "about",
      pathname: "/about",
      pageType: "educational",
      structuredDataOptions: {
        title: "About Better I18N",
        description:
          "Why Better I18N exists, how it differs from Crowdin, Lokalise, Phrase and Transifex on pricing and delivery, and where the platform is going.",
      },
    });
  },
  component: AboutPage,
});

function AboutPage() {
  const t = useT("aboutPage");
  const tAlt = useT("alternatives");
  const tCta = useT("cta");
  const tQuote = useT("testimonials");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={false}>
      <PageHero
        titleId="about-hero-title"
        title={t("positioning.hero.title")}
        subtitle={t("positioning.hero.subtitle")}
        primary={{ label: t("positioning.hero.ctaPrimary"), href: `/${locale}/features/` }}
        secondary={{ label: t("positioning.hero.ctaSecondary"), href: `/${locale}/compare/` }}
      />

      <Divider />

      {/* 1. Why we started. The existing story paragraphs are indexed copy and
             survive the rewrite; what changed is that they now sit under a
             claim instead of standing in for one. */}
      <Section labelledBy="origin-title">
        <SectionHeader
          id="origin-title"
          eyebrow={t("positioning.origin.eyebrow")}
          title={t("positioning.origin.title")}
          subtitle={t("positioning.origin.lede")}
          titleMaxWidth="24ch"
        />
        <div className="mt-8 flex max-w-[68ch] flex-col gap-4 text-[15px] leading-relaxed text-mist-700">
          <p>{t("story.paragraph1")}</p>
          <p>{t("story.paragraph2")}</p>
          <p>{t("story.paragraph3")}</p>
        </div>
      </Section>

      <Divider />

      {/* 2. The category. Same evidence the home page shows, same keys. */}
      <Section labelledBy="category-title">
        <SectionHeader
          id="category-title"
          eyebrow={t("positioning.category.eyebrow")}
          title={t("positioning.category.title")}
          subtitle={t("positioning.category.lede")}
          titleMaxWidth="24ch"
        />
        <div className="mt-10">
          <CompetitorLandscape showLabel={false} />
        </div>
      </Section>

      <Divider />

      {/* 3. Pricing policy. The numbers being argued against are the entry
             prices in the section above, so this one carries no figures of its
             own: our price lives on /pricing and nowhere else. */}
      <Section labelledBy="pricing-title">
        <SectionHeader
          id="pricing-title"
          eyebrow={t("positioning.pricing.eyebrow")}
          title={t("positioning.pricing.title")}
          subtitle={t("positioning.pricing.lede")}
          titleMaxWidth="24ch"
        />
        <div className="mt-8 max-w-[68ch]">
          <BentoList>
            {PRICING_RULES.map((rule) => (
              <BentoRow key={rule}>{t(`positioning.pricing.rules.${rule}`)}</BentoRow>
            ))}
          </BentoList>
          <Link to="/$locale/pricing/" params={{ locale }} className="btn btn-outline btn-lg mt-8 w-fit">
            {t("positioning.pricing.cta")}
          </Link>
        </div>
      </Section>

      <Divider />

      {/* 4. Where this goes. The claim is structural, not a slogan: if
             localization is infrastructure, it has to be reachable the way
             infrastructure is reachable. */}
      <Section labelledBy="future-title">
        <SectionHeader
          id="future-title"
          eyebrow={t("positioning.future.eyebrow")}
          title={t("positioning.future.title")}
          subtitle={t("positioning.future.lede")}
          titleMaxWidth="26ch"
        />
        <div className="mt-10">
          <FeatureRow>
            {LAYERS.map((layer) => (
              <FeatureColumn
                key={layer}
                title={t(`positioning.future.layers.${layer}.title`)}
                description={t(`positioning.future.layers.${layer}.body`)}
              />
            ))}
          </FeatureRow>
        </div>
        <p className="mt-10 max-w-[62ch] text-[17px] leading-relaxed tracking-[-0.015em] text-mist-900">
          {t("positioning.future.close")}
        </p>
      </Section>

      <Divider />

      {/* The claim above is ours; this is someone else saying it happened.
          Quote 2 of four, chosen because it is the only one that names the
          mechanism this section argues for: "we push translations and they're
          live instantly, no deploys, no cache invalidation". The other three
          are about AI coverage and language count, which is a different
          argument. Copy and caption come from the published `testimonials`
          namespace, the face from `testimonialAvatar` — no quote is authored
          here (see src/lib/testimonials.ts). */}
      <PageTestimonial
        quote={tQuote("2.quote")}
        name={tQuote("2.name")}
        role={tQuote("2.title")}
        avatar={testimonialAvatar(2)}
        patternId="dots-about"
      />

      <Divider />

      {/* 5. What exists today, so the argument above is measured against a
             shipped platform rather than a roadmap. */}
      <Section labelledBy="metrics-title">
        <SectionHeader
          id="metrics-title"
          eyebrow={t("positioning.metrics.eyebrow")}
          title={t("platformMetrics.title")}
          subtitle={tAlt("benefit6")}
        />
        <div className="mt-10">
          <PlatformMetrics />
        </div>
      </Section>

      <Divider />

      <ClosingCta
        title={t("positioning.cta.title")}
        subtitle={t("positioning.cta.subtitle")}
        primary={{ label: t("positioning.cta.primary"), href: "https://app.better-i18n.com/signup" }}
        secondary={{ label: t("positioning.cta.secondary"), href: "https://docs.better-i18n.com" }}
        customers={{ label: tCta("trustedBy") }}
      />

      <RelatedPages currentPage="about" locale={locale} variant="mixed" />
    </MarketingLayout>
  );
}
