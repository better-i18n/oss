import { createFileRoute } from "@tanstack/react-router";
import { testimonialAvatar } from "@/lib/testimonials";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, getEducationalPageStructuredData, formatStructuredData, createPageLoader } from "@/lib/page-seo";
import { getHowToSchema } from "@/lib/structured-data";
import { useTranslations } from "@better-i18n/use-intl";
import { RelatedPages } from "@/components/RelatedPages";
import {
  Divider,
  FeatureGrid,
  PageHero,
  PageTestimonial,
  Section,
  SectionHeader,
} from "@/components/ui/page";
import { FlowHero, FlowCard, FlowMono, FlowText } from "@/components/visuals/FlowHero";
import { LocaleFlag } from "@/components/ui/locale-flag";

export const Route = createFileRoute("/$locale/what-is")({
  // `testimonials` travels with the page because <PageTestimonial /> renders a
  // quote from it — without it the quote resolves to the humanized key ("Quote").
  // `marketing.flowHero` is a SIBLING of `marketing.whatIsPage`, so the subtree
  // filter drops it unless it is named — the hero's card copy lives there and is
  // shared with the other pages that mount <FlowHero />.
  loader: createPageLoader([
    "marketing.whatIsPage",
    "marketing.flowHero",
    "testimonials",
  ]),
  head: ({ loaderData }) => {
    const messages = loaderData?.messages || {};
    const locale = loaderData?.locale || "en";

    const howItWorksNs = (messages as Record<string, unknown>)?.marketing as
      | Record<string, unknown>
      | undefined;
    const whatIsPageNs = howItWorksNs?.whatIsPage as Record<string, unknown> | undefined;
    const howItWorks = whatIsPageNs?.howItWorks as Record<string, Record<string, string>> | undefined;

    const stepKeys = ["step1", "step2", "step3", "step4"];
    // One pass: flatMap filters and maps together, so a missing step is dropped
    // without walking the list twice.
    const howToSteps = howItWorks
      ? stepKeys.flatMap((key) => {
          const step = howItWorks[key];
          if (!step?.title || !step?.description) return [];
          return [{ name: step.title, text: step.description }];
        })
      : [];

    const seoNs = whatIsPageNs?.seo as Record<string, any> | undefined;
    const structuredTitle = seoNs?.structuredDataTitle || "What is i18n? Internationalization & Localization Guide";
    const structuredDescription = seoNs?.structuredDataDescription || "Learn the difference between internationalization (i18n) and localization (l10n). Covers key concepts, a comparison table, and how to get started.";

    const educationalScripts = getEducationalPageStructuredData({
      title: structuredTitle,
      description: structuredDescription,
      url: `https://better-i18n.com/${locale}/what-is`,
      locale,
    });

    const howToScript = howToSteps.length > 0
      ? formatStructuredData(getHowToSchema({
          name: "How to Internationalize Your Application with Better I18N",
          description: "Step-by-step guide to setting up internationalization using Better I18N.",
          steps: howToSteps,
          totalTime: "PT15M",
          inLanguage: locale,
        }))
      : [];

    return getPageHead({
      messages,
      locale,
      pageKey: "whatIs",
      pathname: "/what-is",
      customStructuredData: [...educationalScripts, ...howToScript],
    });
  },
  component: WhatIsPage,
});

const COMPARISON_ROW_KEYS = [
  "fullName",
  "scope",
  "timing",
  "focus",
  "who",
  "example",
] as const;

/**
 * Every icon on this page is a sprite name — one family, one stroke treatment.
 *
 * Four of these six used to be @central-icons-react components imported straight
 * into the route while the other two were sprite strings, so the cell had to ask
 * `typeof icon === "string"` and the grid put two different stroke renderings in
 * one row. The four missing glyphs now live in `SvgSprite.tsx` like the rest, so
 * the branch and the second import are gone.
 */
const COVERS_ITEMS: ReadonlyArray<{ icon: SpriteIconName; key: string }> = [
  { icon: "images", key: "ui" },
  { icon: "calendar", key: "dateTime" },
  { icon: "code-brackets", key: "encoding" },
  { icon: "settings-gear", key: "numbers" },
  { icon: "files", key: "content" },
  { icon: "translate", key: "plurals" },
];

/** The two definitions, side by side. `formula` is notation, not copy. */
const DEFINITIONS = [
  { id: "i18nDef", formula: "i18n = i + (18 letters) + n" },
  { id: "l10nDef", formula: "l10n = l + (10 letters) + n" },
] as const;

/**
 * Use cases carry the same tile as `COVERS_ITEMS` above.
 *
 * They were the only icon-less group on a page whose other two groups (scope
 * cells, platform benefits) both lead with one, so the section read as unfinished
 * rather than as a deliberate plain list. The glyphs stay category-level and
 * honest — a cloud for SaaS, devices for mobile, a bag for commerce — which is
 * all the sprite can claim; the translated title and description still carry the
 * meaning (`feature-icons.ts`: the icon is a scanning aid, never information).
 */
const USE_CASES: ReadonlyArray<{ icon: SpriteIconName; key: string }> = [
  { icon: "cloud", key: "saas" },
  { icon: "devices", key: "mobile" },
  { icon: "bag", key: "ecommerce" },
];

/** Static — nothing here depends on render state, so it is built once. */
const BENEFITS = [
  {
    icon: "rocket",
    titleKey: "benefits.speed.title",
    descKey: "benefits.speed.description",
  },
  {
    icon: "sparkles-soft",
    titleKey: "benefits.ai.title",
    descKey: "benefits.ai.description",
  },
  {
    icon: "github",
    titleKey: "benefits.git.title",
    descKey: "benefits.git.description",
  },
] as const;

function WhatIsPage() {
  const t = useTranslations("marketing.whatIsPage");
  const { locale } = Route.useParams();
  const currentLocale = locale || "en";

  return (
    <MarketingLayout showCTA={true}>
      <PageHero
        titleId="what-is-hero-title"
        title={
          <>
            {t("hero.title")}
            <span className="block text-mist-600">{t("hero.titleHighlight")}</span>
          </>
        }
        subtitle={t("hero.subtitle")}
        visual={<I18nFlowHero />}
      />

      <Divider />

      {/* Definitions — i18n and l10n were two near-identical sections that
          alternated white / mist-50 to fake a boundary. One section, both
          definitions side by side, separated by the frame's own hairline.
          Every paragraph and both etymologies are kept. */}
      <Section labelledBy="what-is-definitions">
        <SectionHeader
          id="what-is-definitions"
          eyebrow={t("hero.badge")}
          title={t("definitionsTitle")}
          subtitle={t("definitionsSubtitle")}
        />
        {/* Two prose columns, not two cards. Boxing a definition puts a third
            frame inside the section's own (rule/listed-items-are-not-cards);
            the gap does the separating. */}
        <div className="mt-8 grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-2">
          {DEFINITIONS.map((def) => (
            <div key={def.id}>
              <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                {t(`${def.id}.title`)}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-mist-600">
                {t(`${def.id}.paragraph1`)}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
                {t(`${def.id}.paragraph2`)}
              </p>
              <p className="eyebrow mt-6">{t(`${def.id}.etymologyTitle`)}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
                {t(`${def.id}.etymology`)}
              </p>
              {/* The abbreviation itself, on the sanctioned inline-code surface.
                  A code chip is notation, not a card. */}
              <p className="mt-4 w-fit rounded-md border border-black/[0.07] bg-mist-50 px-2.5 py-1.5 font-mono text-[12px] text-mist-900">
                {def.formula}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Comparison — zebra striping replaced by a single hairline per row.
          Striping was the table's version of the background alternation. */}
      <Section labelledBy="what-is-comparison">
        <SectionHeader
          id="what-is-comparison"
          eyebrow={t("eyebrow.comparison")}
          title={t("comparison.title")}
          subtitle={t("comparison.subtitle")}
        />
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-black/[0.07]">
                <th className="w-1/5 px-5 py-3 text-[11px] font-medium text-mist-400">
                  {t("comparison.header.aspect")}
                </th>
                <th className="w-2/5 px-5 py-3 text-[11px] font-medium text-mist-600">
                  {t("comparison.header.i18n")}
                </th>
                <th className="w-2/5 px-5 py-3 text-[11px] font-medium text-mist-600">
                  {t("comparison.header.l10n")}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROW_KEYS.map((rowKey) => (
                <tr key={rowKey} className="border-b border-black/[0.05] last:border-b-0">
                  <td className="px-5 py-3.5 text-[13px] font-medium text-mist-900">
                    {t(`comparison.rows.${rowKey}.label`)}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] leading-relaxed text-mist-600">
                    {t(`comparison.rows.${rowKey}.i18n`)}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] leading-relaxed text-mist-600">
                    {t(`comparison.rows.${rowKey}.l10n`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Divider />

      {/* Scope — six hairline cells, no tinted icon tiles inside white cards. */}
      <Section labelledBy="what-is-covers">
        <SectionHeader
          id="what-is-covers"
          eyebrow={t("eyebrow.scope")}
          title={t("covers.title")}
          subtitle={t("covers.subtitle")}
        />
        {/* No frame around the grid: the hairlines already separate the cells,
            and a border around them put two containers around one thing
            (rule/one-container). Dropping it also moves the first cell's text
            onto the section's left edge, which `-ml-px` never did. */}
        <div className="mt-8">
          <FeatureGrid cols="sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {COVERS_ITEMS.map((item) => (
              <div key={item.key} className="feat-cell flex flex-col">
                <span className="flex size-7 items-center justify-center rounded-md border border-black/[0.06] text-mist-600">
                  <SpriteIcon name={item.icon} className="size-3.5" />
                </span>
                <h3 className="mt-3 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {t(`covers.${item.key}.title`)}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">
                  {t(`covers.${item.key}.description`)}
                </p>
              </div>
            ))}
          </FeatureGrid>
        </div>
      </Section>

      <Divider />

      {/* The platform — prose left, benefits right. The benefit rows were
          `bg-mist-50` cards holding `bg-mist-100` icon tiles: two tints inside
          a tinted section. Now bare rows split by hairlines. */}
      <Section labelledBy="what-is-platform">
        <SectionHeader
          id="what-is-platform"
          eyebrow={t("eyebrow.platform")}
          title={t("about.title")}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <p className="text-[14px] leading-relaxed text-mist-600">{t("about.paragraph1")}</p>
            <p className="text-[14px] leading-relaxed text-mist-600">{t("about.paragraph2")}</p>
            <p className="text-[14px] leading-relaxed text-mist-600">{t("about.paragraph3")}</p>
          </div>
          <div className="flex flex-col">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.titleKey}
                className="flex items-start gap-4 border-t border-black/[0.05] py-5 first:border-t-0 first:pt-0"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-black/[0.06] text-mist-600">
                  <SpriteIcon name={benefit.icon as SpriteIconName} className="size-3.5" />
                </span>
                <div>
                  <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                    {t(benefit.titleKey)}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-mist-600">
                    {t(benefit.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      {/* Use cases — bare columns, not cards. Three short prose pairs. */}
      <Section labelledBy="what-is-use-cases">
        <SectionHeader
          id="what-is-use-cases"
          eyebrow={t("eyebrow.useCases")}
          title={t("useCases.title")}
          subtitle={t("useCases.subtitle")}
        />
        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-3">
          {USE_CASES.map(({ icon, key }) => (
            <div key={key}>
              <span className="flex size-7 items-center justify-center rounded-md border border-black/[0.06] text-mist-600">
                <SpriteIcon name={icon} className="size-3.5" />
              </span>
              <h3 className="mt-3 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                {t(`useCases.${key}.title`)}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">
                {t(`useCases.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      <WhatIsTestimonial />

      {/* Related Pages */}
      <RelatedPages currentPage="what-is" locale={currentLocale} variant="mixed" />
    </MarketingLayout>
  );
}

/**
 * The one quote on this page. `PageTestimonial` already exists in the page
 * grammar and was unused — quote 3 is the one that speaks to the concept this
 * page teaches (translation coverage and product context), rather than to a
 * feature the reader has not met yet.
 */
/**
 * The what-is hero diagram: one source string, three things the platform does
 * to it, and four locales it lands in. Content only — the geometry, the pulse
 * and the reduced-motion handling belong to <FlowHero />.
 */
function I18nFlowHero() {
  const t = useTranslations("marketing");
  const published = t("flowHero.published.eyebrow");

  const localeCard = (locale: string) => (
    <FlowCard eyebrow={published} corner={<LocaleFlag locale={locale} size={14} />}>
      <FlowMono>{`${locale}.json`}</FlowMono>
      <div style={{ marginTop: 4 }}>
        <FlowText muted>{t("flowHero.published.body")}</FlowText>
      </div>
    </FlowCard>
  );

  return (
    <FlowHero
      pillar="sync"
      title={t("flowHero.title")}
      center={{
        mark: (
          <img src="/brand/logo.svg" alt="" width={26} height={26} style={{ width: 26, height: 26 }} />
        ),
        label: "Better I18N",
        sublabel: t("flowHero.centerSublabel"),
      }}
      cards={[
        <FlowCard
          key="source"
          eyebrow={t("flowHero.source.eyebrow")}
          corner={<LocaleFlag locale="en" size={14} />}
        >
          <FlowMono>auth.login.title</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("flowHero.source.file")}</FlowText>
          </div>
        </FlowCard>,
        <FlowCard key="glossary" eyebrow={t("flowHero.glossary.eyebrow")}>
          <FlowText>{t("flowHero.glossary.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="ai" eyebrow={t("flowHero.ai.eyebrow")}>
          <FlowText>{t("flowHero.ai.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="git" eyebrow={t("flowHero.git.eyebrow")}>
          <FlowMono>chore/i18n-sync</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("flowHero.git.body")}</FlowText>
          </div>
        </FlowCard>,
        <div key="de">{localeCard("de")}</div>,
        <div key="fr">{localeCard("fr")}</div>,
        <div key="ja">{localeCard("ja")}</div>,
        <div key="tr">{localeCard("tr")}</div>,
      ]}
    />
  );
}

function WhatIsTestimonial() {
  const tq = useTranslations("testimonials");
  return (
    <PageTestimonial
      quote={tq("3.quote")}
      name={tq("3.name")}
      role={tq("3.title")}
      avatar={testimonialAvatar(3)}
      patternId="dots-what-is"
    />
  );
}
