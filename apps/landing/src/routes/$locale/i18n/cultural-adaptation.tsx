import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconGlobe,
  IconCheckmark1,
  IconArrowRight,
  IconAiTranslate,
  IconShieldCheck,
  IconRocket,
  IconSparklesSoft,
  IconGroup1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/cultural-adaptation")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "culturalAdaptation",
      pathname: "/i18n/cultural-adaptation",
      pageType: "educational",
      structuredDataOptions: {
        title: "Cultural Adaptation for Websites Guide",
        description:
          "Comprehensive guide to cultural adaptation: why it matters beyond translation, cultural dimensions, RTL support, date and currency formatting, regional payment methods, and compliance considerations.",
      },
    });
  },
  component: CulturalAdaptationPage,
});

const dimensions = [
  { icon: IconSparklesSoft, titleKey: "dimensions.colorsImagery.title", descKey: "dimensions.colorsImagery.description", defaultTitle: "Colors & Imagery", defaultDesc: "Color meanings vary across cultures — white symbolizes purity in the West but mourning in parts of Asia. Imagery must reflect local demographics, dress codes, and visual expectations to build trust." },
  { icon: IconAiTranslate, titleKey: "dimensions.toneFormality.title", descKey: "dimensions.toneFormality.description", defaultTitle: "Tone & Formality", defaultDesc: "Formality levels differ dramatically between markets. Japanese and Korean audiences expect formal, respectful language, while US and Australian users prefer casual, direct communication." },
  { icon: IconGlobe, titleKey: "dimensions.rtlSupport.title", descKey: "dimensions.rtlSupport.description", defaultTitle: "RTL Layout Support", defaultDesc: "Arabic, Hebrew, and Persian require right-to-left layouts. Full RTL support means mirroring navigation, reversing flex directions, flipping icons, and adjusting text alignment throughout the UI." },
  { icon: IconRocket, titleKey: "dimensions.humorIdioms.title", descKey: "dimensions.humorIdioms.description", defaultTitle: "Humor & Idioms", defaultDesc: "Humor rarely translates directly between cultures. Idioms, wordplay, and cultural references must be adapted or replaced with locally resonant alternatives to avoid confusion or offense." },
];

function CulturalAdaptationPage() {
  const t = useT("marketing.i18n.culturalAdaptation");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    { key: "benefits.list.nativeExperience", defaultValue: "Deliver an experience that feels native to users in every target market" },
    { key: "benefits.list.higherTrust", defaultValue: "Build higher trust through culturally appropriate visuals, tone, and formatting" },
    { key: "benefits.list.lowerBounce", defaultValue: "Reduce bounce rates by eliminating cultural friction that drives users away" },
    { key: "benefits.list.betterConversion", defaultValue: "Improve conversion rates with locally adapted calls to action and payment flows" },
    { key: "benefits.list.regulatoryCompliance", defaultValue: "Ensure regulatory compliance with region-specific privacy laws and disclosure requirements" },
    { key: "benefits.list.globalBrandEquity", defaultValue: "Strengthen global brand equity while maintaining local market relevance" },
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description", defaultTitle: "Cultural Research", defaultDesc: "Study your target market's cultural norms, communication styles, color associations, and user experience expectations through local market research and user testing." },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description", defaultTitle: "Content & Design Audit", defaultDesc: "Review all existing content, imagery, icons, and UI patterns for cultural compatibility. Identify elements that need adaptation versus those that transfer well across cultures." },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description", defaultTitle: "Adaptation Implementation", defaultDesc: "Adapt visuals, tone, formatting, payment methods, and legal compliance for each market. Implement RTL support, locale-specific date and number formatting, and culturally appropriate imagery." },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description", defaultTitle: "Local Validation & Testing", defaultDesc: "Test adapted content with native users in each target market. Validate cultural appropriateness, usability, and conversion performance through local focus groups and A/B testing." },
  ];

  const relatedPages = [
    { name: "Content Localization", href: "/$locale/i18n/content-localization", description: t("related.contentLocalization", { defaultValue: "In-depth guide to adapting content for different markets" }) },
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("related.websiteLocalization", { defaultValue: "Localizing your entire web application for global audiences" }) },
    { name: "What is Localization?", href: "/$locale/what-is-localization", description: t("related.whatIsLocalization", { defaultValue: "Localization fundamentals and core definitions" }) },
    { name: "International SEO", href: "/$locale/i18n/seo-international-audiences", description: t("related.seoInternational", { defaultValue: "SEO strategies for reaching international audiences" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconGlobe className="size-4" />
              <span>{t("badge", { defaultValue: "Cultural Adaptation" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Cultural Adaptation: Building Websites That Feel Local in Every Language" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "The world speaks different languages — over 7,000 of them. But reaching audiences across all those languages requires more than translation. Cultural adaptation reshapes your website's visuals, tone, formatting, and functionality so that users in every locale experience something that feels built for them. This comprehensive guide covers every dimension of cultural adaptation for the web." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Is Cultural Adaptation for Websites?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Cultural adaptation is the process of modifying a website's content, design, and behavior to align with the cultural norms, expectations, and preferences of a specific target market. It is the layer of localization that sits above literal translation — addressing the human dimension of global communication across different languages and cultures." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "While translation answers the question 'What does this say in another language?', cultural adaptation answers 'How does this make someone feel, and does that feeling match what we intend?' A color that signals trustworthiness in North America may signal mourning in parts of Asia. A direct, informal tone beloved in the US may feel disrespectful in Japan or South Korea." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "The world in all languages includes vastly different communication styles, social hierarchies, payment preferences, and legal frameworks. Effective cultural adaptation accounts for all of them — from high-level brand messaging to the placement of a checkout button." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("beyondTranslation.title", { defaultValue: "Why Cultural Adaptation Goes Beyond Translation" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("beyondTranslation.paragraph1", { defaultValue: "Research consistently shows that consumers are far more likely to purchase from websites that speak their language — but only 30% of the world's population uses English as even a secondary language. However, providing content in different languages is just the entry ticket." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("beyondTranslation.paragraph2", { defaultValue: "Brands that invest in genuine cultural adaptation — adapting imagery, social proof, payment flows, and customer support channels to local norms — see conversion rates in new markets approach or match their home market within 12 months." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("dimensions.title", { defaultValue: "Key Cultural Dimensions for Web Adaptation" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("dimensions.subtitle", { defaultValue: "These four dimensions define how users experience your website across different cultures and different languages." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dimensions.map((dimension) => (
              <div key={dimension.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <dimension.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(dimension.titleKey, { defaultValue: dimension.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(dimension.descKey, { defaultValue: "" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("technical.title", { defaultValue: "Technical Dimensions of Cultural Adaptation" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("technical.subtitle", { defaultValue: "Successful cultural adaptation for websites requires engineering decisions that go hand-in-hand with content decisions." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
              <IconAiTranslate className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("technical.dateTime.title", { defaultValue: "Date, Time & Number Formatting" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("technical.dateTime.description", { defaultValue: "The US writes 03/04/2025 for March 4th; Germany writes 04.03.2025 for the same date. Japan uses 2025年3月4日. Number formatting varies too — 1,000.50 in English becomes 1.000,50 in German. ICU message format and Intl.DateTimeFormat handle these variations programmatically." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
              <IconGlobe className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("technical.currency.title", { defaultValue: "Currency & Payment Methods" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("technical.currency.description", { defaultValue: "Displaying prices in local currency reduces cart abandonment by up to 12%. But currency alone is not enough — preferred payment methods vary dramatically. Brazil relies on Boleto, the Netherlands on iDEAL, China on Alipay and WeChat Pay. Cultural adaptation means offering the payment method your users trust." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
              <IconGroup1 className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("technical.rtl.title", { defaultValue: "RTL Language Support" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("technical.rtl.description", { defaultValue: "Arabic, Hebrew, Persian, and Urdu are read right-to-left. RTL support means mirroring layouts, reversing flex directions, flipping icons, and adjusting text alignment — not just setting dir='rtl'. Proper RTL implementation is one of the most technically demanding aspects of cultural adaptation." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
              <IconShieldCheck className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("technical.legal.title", { defaultValue: "Legal & Compliance Considerations" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("technical.legal.description", { defaultValue: "Privacy laws differ by region: GDPR in Europe, PIPL in China, LGPD in Brazil, CCPA in California. Cookie consent flows, data residency requirements, and mandatory disclosures must be adapted per market. Non-compliance can result in fines that dwarf localization costs." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
              <IconRocket className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("technical.seo.title", { defaultValue: "Locale-Specific SEO" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("technical.seo.description", { defaultValue: "Search behavior differs by market. Japanese users search with different intent signals than US users. South Korea's dominant search engine is Naver, not Google. Cultural adaptation for SEO means researching local keyword patterns, adjusting meta content, and implementing hreflang attributes correctly." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
              <IconSparklesSoft className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("technical.imagery.title", { defaultValue: "Imagery & Visual Culture" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("technical.imagery.description", { defaultValue: "Stock photography of diverse, locally representative people outperforms generic imagery by 35% in localized markets. Icons must also be reviewed — a thumbs-up is positive in most cultures but offensive in Iran and parts of West Africa. Visual cultural adaptation prevents inadvertent offense." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("benefits.title", { defaultValue: "Benefits of Thorough Cultural Adaptation" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "When your website feels genuinely local to each audience, the results compound across every growth metric." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {benefits.map((benefitKey) => (
                  <li key={benefitKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(benefitKey, { defaultValue: benefitKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("process.title", { defaultValue: "A Practical Cultural Adaptation Process" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "Use this four-phase workflow to systematically adapt your website for each new market." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div key={step.number} className="text-center p-6">
                <div className="size-10 rounded-full bg-mist-950 text-white flex items-center justify-center text-sm font-medium mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(step.titleKey, { defaultValue: step.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-600">
                  {t(step.descKey, { defaultValue: "" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
              {t("solution.title", { defaultValue: "How Better i18n Supports Cultural Adaptation" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n is built for teams that take cultural adaptation seriously. Our platform handles the technical infrastructure — locale routing, ICU message formatting, RTL layout support, and plural rules for over 200 languages — so your team can focus on the content and cultural strategy that turns visitors into customers across every market." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "ICU Message Format" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Handle plural rules, gender agreement, and date/number formatting correctly across all locales with ICU-compliant message syntax." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "RTL-Ready SDK" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "Locale detection automatically signals RTL requirements to your UI, making Arabic and Hebrew support straightforward." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Glossary Management" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Maintain brand terminology and culturally sensitive terms in a centralized glossary that guides every AI translation." })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-lg font-medium text-mist-950 mb-6">{tCommon("whatIs.relatedTopics", { defaultValue: "Related Topics" })}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedPages.map((page) => (
              <Link
                key={page.href}
                to={page.href}
                params={{ locale }}
                className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="text-sm font-medium text-mist-950">{page.name}</h3>
                  <p className="text-xs text-mist-500 mt-1">{page.description}</p>
                </div>
                <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-mist-950 rounded-3xl mx-6 lg:mx-10 mb-16">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
            {t("cta.title", { defaultValue: "Build Websites That Feel Local Everywhere" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Better i18n gives your team the infrastructure to adapt your product culturally for every market — from different languages to different payment flows." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start cultural adaptation for your website with Better i18n for free"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              aria-label="Read the Better i18n documentation"
              className="rounded-full border border-mist-600 px-6 py-3 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
            >
              {t("cta.secondary", { defaultValue: "Read the Docs" })}
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
