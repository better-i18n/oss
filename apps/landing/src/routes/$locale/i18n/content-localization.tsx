import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { SeeAlso } from "@/components/SeeAlso";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { ClosingCta, Divider } from "@/components/ui/page";
import { IconAiTranslate } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/content-localization")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "contentLocalization",
      pathname: "/i18n/content-localization",
      pageType: "educational",
      structuredDataOptions: {
        title: "Content Localization Guide",
        description:
          "Complete guide to content localization: what it means, how the localization process works, best practices for adapting content to different cultures, and measuring ROI.",
      },
    });
  },
  component: ContentLocalizationPage,
});

const challenges = [
  { icon: "group", titleKey: "i18n.contentLocalization.challenges.contentVolume.title", descKey: "i18n.contentLocalization.challenges.contentVolume.description" },
  { icon: "rocket", titleKey: "i18n.contentLocalization.challenges.culturalNuance.title", descKey: "i18n.contentLocalization.challenges.culturalNuance.description" },
  { icon: IconAiTranslate, titleKey: "i18n.contentLocalization.challenges.consistency.title", descKey: "i18n.contentLocalization.challenges.consistency.description" },
  { icon: "globe", titleKey: "i18n.contentLocalization.challenges.scalability.title", descKey: "i18n.contentLocalization.challenges.scalability.description" },
];

function ContentLocalizationPage() {
  const t = useT("marketing");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    { key: "i18n.contentLocalization.benefits.list.deeperEngagement" },
    { key: "i18n.contentLocalization.benefits.list.higherConversion" },
    { key: "i18n.contentLocalization.benefits.list.brandTrust" },
    { key: "i18n.contentLocalization.benefits.list.seoVisibility" },
    { key: "i18n.contentLocalization.benefits.list.reducedBounce" },
    { key: "i18n.contentLocalization.benefits.list.globalRevenue" },
  ];

  const processSteps = [
    { number: "1", titleKey: "i18n.contentLocalization.process.step1.title", descKey: "i18n.contentLocalization.process.step1.description" },
    { number: "2", titleKey: "i18n.contentLocalization.process.step2.title", descKey: "i18n.contentLocalization.process.step2.description" },
    { number: "3", titleKey: "i18n.contentLocalization.process.step3.title", descKey: "i18n.contentLocalization.process.step3.description" },
    { number: "4", titleKey: "i18n.contentLocalization.process.step4.title", descKey: "i18n.contentLocalization.process.step4.description" },
    { number: "5", titleKey: "i18n.contentLocalization.process.step5.title", descKey: "i18n.contentLocalization.process.step5.description" },
  ];

  const relatedPages = [
    { name: "Localization Software", href: "/$locale/i18n/localization-software", description: t("i18n.contentLocalization.related.localizationSoftware") },
    { name: "Cultural Adaptation", href: "/$locale/i18n/cultural-adaptation", description: t("i18n.contentLocalization.related.culturalAdaptation") },
    { name: "What is Localization?", href: "/$locale/what-is-localization", description: t("i18n.contentLocalization.related.whatIsLocalization") },
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("i18n.contentLocalization.related.websiteLocalization") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <section>
        <div className="section">
          <div className="max-w-3xl">
            <div className="eyebrow mb-5 flex items-center gap-2">
              <SpriteIcon name="group" className="size-4" />
              <span>{t("i18n.contentLocalization.badge")}</span>
            </div>
            <h1 className="section-h2">
              {t("i18n.contentLocalization.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.contentLocalization.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="section-h2 mb-6">
                {t("i18n.contentLocalization.definition.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.contentLocalization.definition.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.contentLocalization.definition.paragraph2")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.contentLocalization.definition.paragraph3")}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("i18n.contentLocalization.translationVsLocalization.title")}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.contentLocalization.translationVsLocalization.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.contentLocalization.translationVsLocalization.paragraph2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.contentLocalization.challenges.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.contentLocalization.challenges.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {challenges.map((challenge) => (
              <div key={challenge.titleKey}>
                <div className="mb-3 flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  {typeof challenge.icon === "string" ? <SpriteIcon name={challenge.icon as SpriteIconName} className="size-5" /> : <challenge.icon className="size-5" />}
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(challenge.titleKey)}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(challenge.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="section-h2 mb-6">
                {t("i18n.contentLocalization.benefits.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.contentLocalization.benefits.subtitle")}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {benefits.map((item) => (
                  <li key={item.key} className="flex items-start gap-3">
                    <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                    <span className="text-mist-700">{t(item.key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.contentLocalization.process.title")}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("i18n.contentLocalization.process.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {processSteps.map((step) => (
              <div key={step.number} className="text-center p-6">
                <div className="mb-3 block text-[11px] font-medium tabular-nums text-mist-400">
                  {step.number}
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(step.titleKey)}
                </h3>
                <p className="text-sm text-mist-600">
                  {t(step.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.contentLocalization.quality.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.contentLocalization.quality.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <SpriteIcon name="rocket" className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("i18n.contentLocalization.quality.engagement.title")}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("i18n.contentLocalization.quality.engagement.description")}
              </p>
            </div>
            <div>
              <SpriteIcon name="sparkles-soft" className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("i18n.contentLocalization.quality.conversion.title")}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("i18n.contentLocalization.quality.conversion.description")}
              </p>
            </div>
            <div>
              <SpriteIcon name="rocket" className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("i18n.contentLocalization.quality.roi.title")}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("i18n.contentLocalization.quality.roi.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-h2 mb-6">
              {t("i18n.contentLocalization.solution.title")}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("i18n.contentLocalization.solution.content")}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.contentLocalization.solution.feature1.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.contentLocalization.solution.feature1.description")}
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.contentLocalization.solution.feature2.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.contentLocalization.solution.feature2.description")}
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.contentLocalization.solution.feature3.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.contentLocalization.solution.feature3.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <SeeAlso currentSlug="content-localization" locale={locale} />
      <section className="border-t border-mist-200">
        <div className="section">
          <h2 className="text-lg font-medium text-mist-950 mb-6">{tCommon("whatIs.relatedTopics")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedPages.map((page) => (
              <Link
                key={page.href}
                to={page.href}
                params={{ locale }}
                className="group flex items-start justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-medium text-mist-950">{page.name}</h3>
                  <p className="text-xs text-mist-500 mt-1">{page.description}</p>
                </div>
                <SpriteIcon name="arrow-right" className="size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* The ask closes the page. Was a `bg-mist-950` band with `rounded-xl
          mx-6` — a floating dark card on a white document, carrying its own
          container and its own button scale. <ClosingCta /> is the one closing
          shape in the grammar. */}
      <ClosingCta
        title={t("i18n.contentLocalization.cta.title")}
        subtitle={t("i18n.contentLocalization.cta.subtitle")}
        primary={{ label: t("i18n.contentLocalization.cta.primary"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("i18n.contentLocalization.cta.secondary"), href: "https://docs.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}
