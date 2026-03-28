import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";

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
    name: "Better i18n",
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
    pricing: "From $385/mo",
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
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <span>{t("i18n.bestTms.badge")}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("i18n.bestTms.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.bestTms.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Platforms Comparison */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="space-y-4">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className={`rounded-2xl border p-6 ${
                  platform.highlight
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-mist-200 bg-white"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-mist-950">
                        {platform.name}
                      </h3>
                      {platform.highlight && (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
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
                          <SpriteIcon name="checkmark" className="w-3 h-3 text-emerald-600" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-mist-950">
                      {platform.pricing}
                    </span>
                    {platform.name !== "Better i18n" && (
                      <Link
                        to={`/$locale/compare/${platform.name.toLowerCase().replace(" ", "-")}`}
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
        </div>
      </section>

      {/* What to look for */}
      <section className="py-16 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
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
              <div key={item.title} className="p-6 rounded-2xl border border-mist-100 bg-white">
                <h3 className="text-sm font-semibold text-mist-950 mb-2">{item.title}</h3>
                <p className="text-sm/6 text-mist-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-mist-200">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-10">
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
                answer: "A CAT (Computer-Assisted Translation) tool is a translator's workbench — it shows source and target side-by-side, suggests translations from memory (translation memory / TM), and enforces quality checks. A TMS manages the broader workflow: project management, file routing, vendor management, and integration with code repositories. Many modern platforms combine both: Better i18n, Lokalise, and Phrase include CAT-like translation editors alongside TMS workflow features.",
              },
              {
                question: "How much does a TMS cost?",
                answer: "Pricing varies enormously. Phrase starts at ~$385/month, Lokalise at ~$140/month, and Crowdin at ~$40/month for basic plans. Better i18n offers a free tier for getting started and paid plans based on project scale. Enterprise platforms like Smartling and XTM are priced on request and can cost thousands per month. The key is to evaluate total cost: platform fees plus the time saved by developers and translators.",
              },
              {
                question: "Can a TMS replace human translators?",
                answer: "Not entirely — but it dramatically reduces their workload. AI translation (including GPT-4 and specialized MT engines) produces good first drafts that human translators then review and correct. This post-editing workflow is typically 3-5x faster than translating from scratch. For high-stakes content (legal, medical, marketing copy), human review remains essential. For UI strings and error messages, AI translation with spot-checking is usually sufficient.",
              },
              {
                question: "What makes Better i18n different from Crowdin, Lokalise, and Phrase?",
                answer: "Better i18n is built for the modern development stack: CDN-first delivery means translations never ship in your JavaScript bundle, MCP support lets AI agents manage translations directly, and the Git-native workflow treats translations as first-class code artifacts. Crowdin and Lokalise are excellent products but were designed in the 2010s — Better i18n is designed for the 2020s, with AI agents, edge computing, and developer experience as first-class concerns. Plus, Better i18n starts free.",
              },
              {
                question: "How do I migrate from Crowdin or Lokalise to Better i18n?",
                answer: "Better i18n's CLI can import existing translation files in JSON, XLIFF, PO, and ARB formats. The migration steps are: export your translations from Crowdin/Lokalise, run `better-i18n import` to push them to your Better i18n project, configure your SDK to point to the Better i18n CDN, and remove the old TMS integration. Most teams complete the migration in under a day. Better i18n's support team can assist with complex migrations.",
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-mist-100 pb-8 last:border-0 last:pb-0">
                <h3 className="text-base font-medium text-mist-950 mb-3">{item.question}</h3>
                <p className="text-sm/6 text-mist-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Topics */}
      <section className="py-12 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-lg font-medium text-mist-950 mb-6">{t("whatIs.relatedTopics")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/$locale/i18n/best-library"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("i18n.relatedLinks.bestLibrary")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("i18n.relatedLinks.bestLibraryDesc")}</p>
              </div>
              <SpriteIcon name="arrow-right" className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/what-is-localization"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.l10n")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.l10nDesc")}</p>
              </div>
              <SpriteIcon name="arrow-right" className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/for-translators"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.forTranslators")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.forTranslatorsDesc")}</p>
              </div>
              <SpriteIcon name="arrow-right" className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/i18n"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.frameworks")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.frameworksDesc")}</p>
              </div>
              <SpriteIcon name="arrow-right" className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-mist-950 rounded-3xl mx-6 lg:mx-10 mb-16">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
            {t("i18n.bestTms.cta.title")}
          </h2>
          <p className="mt-4 text-lg text-mist-300">{t("i18n.bestTms.cta.subtitle")}</p>
          <div className="mt-8">
            <a
              href="https://dash.better-i18n.com"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("i18n.bestTms.cta.button")}
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
