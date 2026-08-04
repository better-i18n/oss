import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import { CompetitorMark, type CompetitorKey } from "@/components/icons/CompetitorMarks";
import { ProductTile } from "@/components/ui/product-tile";
import {
  ClosingCta,
  Divider,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui/page";

/** Compare routes as literals. A template path (`/$locale/compare/${slug}`) is
    untypeable — the router's `to` union only holds concrete paths — so a typo in
    a slug used to compile fine and ship a dead link. */
const COMPARE_ROUTES = {
  crowdin: "/$locale/compare/crowdin/",
  lokalise: "/$locale/compare/lokalise/",
  phrase: "/$locale/compare/phrase/",
  transifex: "/$locale/compare/transifex/",
  smartling: "/$locale/compare/smartling/",
  xtm: "/$locale/compare/xtm/",
} as const;


export const Route = createFileRoute("/$locale/i18n/best-tms")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "bestTms",
      pathname: "/i18n/best-tms",
    });
  },
  component: BestTmsPage,
});

const platforms = [
  {
    name: "Better I18N",
    highlight: true,
    features: ["MCP Support", "AST Key Discovery", "Git-First", "Free Tier"],
    pricing: "From $0/mo",
    bestFor: "Developer teams wanting AI-native localization",
  },
  {
    name: "Crowdin",
    features: ["Large ecosystem", "Open source friendly", "Many integrations"],
    pricing: "From $40/mo",
    bestFor: "Open source projects with community translators",
  },
  {
    name: "Lokalise",
    features: ["Figma plugin", "Screenshots", "Enterprise features"],
    pricing: "From $140/mo",
    bestFor: "Design-heavy teams needing visual context",
  },
  {
    name: "Phrase",
    features: ["Enterprise scale", "TMS + CAT", "Compliance"],
    pricing: "From $1,245/mo",
    bestFor: "Large enterprises with complex workflows",
  },
  {
    name: "Transifex",
    features: ["Live translation", "Established platform", "API-first"],
    pricing: "From $150/mo",
    bestFor: "Teams needing real-time translation updates",
  },
];

function BestTmsPage() {
  const t = useTranslations("marketing");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      {/* Was a hand-rolled hero — its own bordered pill badge, `section-h2`
          doing an h1's work (so the page opened a type size smaller than every
          other page), and no <Divider /> before the next section. That missing
          divider is why the frame's corner ticks did not line up between the
          hero and "The shortlist": there was no boundary drawn there at all,
          while every later section had one. <PageHero> is the one opening
          shape. */}
      <PageHero
        pillar="sync"
        pillarLabel={t("i18n.bestTms.badge")}
        title={t("i18n.bestTms.hero.title")}
        subtitle={t("i18n.bestTms.hero.subtitle")}
      />
      <Divider />

      {/* Platforms Comparison */}
      <Section>
          {/* The vendor list used to start straight at h3, so the outline went
              h1 → h3 with no h2 in between (audit: "heading jump"). A section
              opens with its header anyway (rule/section-opens-with-header), and
              that header supplies the missing level. */}
          <SectionHeader
            eyebrow={t("i18n.bestTms.platforms.eyebrow")}
            title={t("i18n.bestTms.platforms.title")}
            subtitle={t("i18n.bestTms.platforms.subtitle")}
          />
          <div className="mt-8">
            {platforms.map((platform) => (
              /* A row, not a card (rule/listed-items-are-not-cards): one top
                 hairline separates neighbours and the recommended platform is
                 marked by its badge, not by a tinted box. */
              <div
                key={platform.name}
                className="border-t border-black/[0.05] py-5 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5">
                      {platform.highlight ? (
                        <ProductTile product="i18n" size="sm" />
                      ) : (
                        <CompetitorMark
                          competitor={platform.name.toLowerCase().replace(/\s+/g, "") as CompetitorKey}
                          size={28}
                        />
                      )}
                      <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                        {platform.name}
                      </h3>
                      {platform.highlight && (
                        <span className="inline-flex items-center rounded-sm border border-black/[0.07] bg-white px-2 py-0.5 text-[11px] font-medium text-mist-600">
                          {t("i18n.bestTms.recommended")}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-mist-600">{platform.bestFor}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {platform.features.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center gap-1 text-xs text-mist-600"
                        >
                          <SpriteIcon name="checkmark" className="size-3 shrink-0 text-mist-900" aria-hidden="true" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-mist-950">
                      {platform.pricing}
                    </span>
                    {platform.name !== "Better I18N" && (
                      <Link
                        to={COMPARE_ROUTES[platform.name.toLowerCase().replace(" ", "-") as keyof typeof COMPARE_ROUTES]}
                        params={{ locale }}
                        className="inline-flex items-center gap-1 text-sm text-mist-600 hover:text-mist-950"
                      >
                        {t("i18n.bestTms.compare")}
                        <SpriteIcon name="arrow-right" className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
      </Section>

      {/* What to look for */}
      <Divider />
      <Section>
          <h2 className="section-h2 mb-8">
            What to look for in a TMS in 2026
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Developer workflow",
                description: "CLI for key scanning and sync, GitHub Actions integration, and type-safe SDKs. A TMS that integrates with code review prevents translation debt from accumulating.",
              },
              {
                title: "AI translation quality",
                description: "Context-aware AI (not just Google Translate) that understands your product terminology, maintains brand voice, and supports terminology glossaries. Look for human review workflows, not fully automated publishing.",
              },
              {
                title: "CDN delivery",
                description: "Translations served from the edge — not bundled in your JavaScript. Fast cold-start and instant OTA updates are only possible with CDN-first delivery. Important for mobile apps and SPAs.",
              },
              {
                title: "Pricing transparency",
                description: "Beware platforms that charge per word, per language, or per seat in ways that make costs unpredictable at scale. Prefer platforms with flat-rate pricing or generous free tiers for getting started.",
              },
              {
                title: "MCP and AI agent support",
                description: "In 2026, AI agents write code and manage content. A TMS with MCP (Model Context Protocol) support lets AI agents translate keys, review content, and publish changes directly — reducing manual overhead significantly.",
              },
              {
                title: "Migration cost",
                description: "Switching TMS is painful. Check if the platform supports import from your current format (JSON, XLIFF, PO files), has a clear migration guide, and doesn't lock you in with proprietary formats.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-sm font-medium text-mist-950 mb-2">{item.title}</h3>
                <p className="text-sm/6 text-mist-600">{item.description}</p>
              </div>
            ))}
          </div>
        </Section>

      {/* FAQ */}
      <Divider />
      <Section>
          <h2 className="section-h2 mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {[
              {
                question: "What is a Translation Management System (TMS)?",
                answer: "A Translation Management System (TMS) is a platform that centralizes and automates the process of translating software, websites, and digital content. A TMS stores all your translation keys, manages the workflow between developers and translators, integrates AI translation, and delivers the final translations to your app. Modern TMS platforms also integrate with Git, CDNs, and CI/CD pipelines — making localization a continuous process rather than a manual export-import cycle.",
              },
              {
                question: "What is the difference between a TMS and a CAT tool?",
                answer: "A CAT (Computer-Assisted Translation) tool is a translator's workbench — it shows source and target side-by-side, suggests translations from memory (translation memory / TM), and enforces quality checks. A TMS manages the broader workflow: project management, file routing, vendor management, and integration with code repositories. Many modern platforms combine both: Better I18N, Lokalise, and Phrase include CAT-like translation editors alongside TMS workflow features.",
              },
              {
                question: "How much does a TMS cost?",
                answer: "Pricing varies enormously. Phrase starts at ~$1,245/month, Lokalise at ~$140/month, and Crowdin at ~$40/month for basic plans. Better I18N offers a free tier for getting started and paid plans based on project scale. Enterprise platforms like Smartling and XTM are priced on request and can cost thousands per month. The key is to evaluate total cost: platform fees plus the time saved by developers and translators.",
              },
              {
                question: "Can a TMS replace human translators?",
                answer: "Not entirely — but it dramatically reduces their workload. AI translation (including GPT-4 and specialized MT engines) produces good first drafts that human translators then review and correct. This post-editing workflow is typically 3-5x faster than translating from scratch. For high-stakes content (legal, medical, marketing copy), human review remains essential. For UI strings and error messages, AI translation with spot-checking is usually sufficient.",
              },
              {
                question: "What makes Better I18N different from Crowdin, Lokalise, and Phrase?",
                answer: "Better I18N is built for the modern development stack: CDN-first delivery means translations never ship in your JavaScript bundle, MCP support lets AI agents manage translations directly, and the Git-native workflow treats translations as first-class code artifacts. Crowdin and Lokalise are excellent products but were designed in the 2010s — Better I18N is designed for the 2020s, with AI agents, edge computing, and developer experience as first-class concerns. Plus, Better I18N starts free.",
              },
              {
                question: "How do I migrate from Crowdin or Lokalise to Better I18N?",
                answer: "Better I18N's CLI can import existing translation files in JSON, XLIFF, PO, and ARB formats. The migration steps are: export your translations from Crowdin/Lokalise, run `better-i18n import` to push them to your Better I18N project, configure your SDK to point to the Better I18N CDN, and remove the old TMS integration. Most teams complete the migration in under a day. Better I18N's support team can assist with complex migrations.",
              },
            ].map((item) => (
              /* The question text is the stable identity here; the array index
                 is not (react-doctor: no-array-index-as-key). */
              <div
                key={item.question}
                className="border-b border-mist-100 pb-8 last:border-0 last:pb-0"
              >
                <h3 className="text-base font-medium text-mist-950 mb-3">{item.question}</h3>
                <p className="text-sm/6 text-mist-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </Section>

      {/* Related Topics */}
      <Divider />
      <Section>
          <SectionHeader
            eyebrow={t("i18n.relatedLinks.eyebrow")}
            title={t("whatIs.relatedTopics")}
            subtitle={t("i18n.relatedLinks.subtitle")}
          />
          {/* Four bare columns (rule/listed-items-are-not-cards). These were
              hairline cells in a rounded container one revision ago; a list of
              four links is text, and the frame plus .section padding already
              separate it from everything else. */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4">
            <Link
              to="/$locale/i18n/best-library/"
              params={{ locale }}
              className="group flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="text-[13px] font-medium text-mist-700 transition-colors group-hover:text-mist-950">{t("i18n.relatedLinks.bestLibrary")}</h3>
                <p className="mt-1 text-[12px] leading-[1.45] text-mist-500">{t("i18n.relatedLinks.bestLibraryDesc")}</p>
              </div>
              <SpriteIcon
                name="chevron-right"
                className="size-3.5 shrink-0 text-mist-300 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/$locale/what-is-localization/"
              params={{ locale }}
              className="group flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="text-[13px] font-medium text-mist-700 transition-colors group-hover:text-mist-950">{t("whatIs.links.l10n")}</h3>
                <p className="mt-1 text-[12px] leading-[1.45] text-mist-500">{t("whatIs.links.l10nDesc")}</p>
              </div>
              <SpriteIcon
                name="chevron-right"
                className="size-3.5 shrink-0 text-mist-300 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/$locale/for-translators/"
              params={{ locale }}
              className="group flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="text-[13px] font-medium text-mist-700 transition-colors group-hover:text-mist-950">{t("whatIs.links.forTranslators")}</h3>
                <p className="mt-1 text-[12px] leading-[1.45] text-mist-500">{t("whatIs.links.forTranslatorsDesc")}</p>
              </div>
              <SpriteIcon
                name="chevron-right"
                className="size-3.5 shrink-0 text-mist-300 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/$locale/i18n/"
              params={{ locale }}
              className="group flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="text-[13px] font-medium text-mist-700 transition-colors group-hover:text-mist-950">{t("whatIs.links.frameworks")}</h3>
                <p className="mt-1 text-[12px] leading-[1.45] text-mist-500">{t("whatIs.links.frameworksDesc")}</p>
              </div>
              <SpriteIcon
                name="chevron-right"
                className="size-3.5 shrink-0 text-mist-300 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Section>

      {/* CTA */}
      <Divider />

      {/* The ask closes the page. Was a floating dark band with its own
          container; <ClosingCta /> is the grammar's one closing shape. This
          page offers a single action, so no secondary. */}
      <ClosingCta
        title={t("i18n.bestTms.cta.title")}
        subtitle={t("i18n.bestTms.cta.subtitle")}
        primary={{ label: t("i18n.bestTms.cta.button"), href: "https://dash.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}
