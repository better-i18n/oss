import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { createServerFn } from "@tanstack/react-start";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead } from "@/lib/page-seo";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "@/i18n.config";
import { useT } from "@/lib/i18n";
import { getMarketingPages, type MarketingPageListItem } from "@/lib/content";

const loadFeaturePages = createServerFn({ method: "GET" })
  .inputValidator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    return getMarketingPages(data.locale, "feature");
  });

export const Route = createFileRoute("/$locale/features/")({
  loader: async ({ params, context }) => {
    const [allMessages, featurePages] = await Promise.all([
      getMessages({ project: i18nConfig.project, locale: context.locale }),
      loadFeaturePages({ data: { locale: params.locale } }),
    ]);
    // Only serialize meta + breadcrumbs for head() — components use root loader's provider
    const { filterMessages } = await import("@/lib/page-namespaces");
    const messages = filterMessages(allMessages, ["meta", "breadcrumbs"]);
    return {
      messages,
      locale: context.locale,
      featurePages,
    };
  },
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "features",
      pathname: "/features",
      pageType: "default",
    });
  },
  component: FeaturesPage,
});

function FeaturesPage() {
  const t = useT("featuresPage");
  const { locale } = Route.useParams();
  const { featurePages } = Route.useLoaderData();
  const overviewCards = [
    {
      icon: "zap",
      title: t("overview.ai.title", "Translate with product context"),
      description: t(
        "overview.ai.description",
        "AI suggestions stay aligned with your glossary, UI context, and brand voice instead of producing literal output.",
      ),
    },
    {
      icon: "settings-gear",
      title: t("overview.workflow.title", "Keep shipping inside your workflow"),
      description: t(
        "overview.workflow.description",
        "Strings sync through Git, review stays close to code, and releases move through the tooling your team already trusts.",
      ),
    },
    {
      icon: "globe",
      title: t("overview.delivery.title", "Go live globally without friction"),
      description: t(
        "overview.delivery.description",
        "Edge delivery, OTA updates, and quality checks help teams launch faster across every market they support.",
      ),
    },
  ];

  const coreCapabilities = [
    {
      icon: "zap",
      step: "01",
      badge: t("core.ai.badge", "AI Translation Engine"),
      title: t("core.ai.title", "Translations that understand your product"),
      description: t(
        "core.ai.description",
        "Our AI engine goes beyond literal word-for-word translation. It reads your glossary, learns your brand voice, and considers the full context of each string, including where it appears in your UI.",
      ),
      supportingPoints: [
        t(
          "core.ai.support.brand",
          "Protect product terminology and tone across every locale.",
        ),
        t(
          "core.ai.support.review",
          "Give reviewers context before anything reaches production.",
        ),
        t(
          "core.ai.support.scale",
          "Process large translation batches without losing editorial control.",
        ),
      ],
      items: [
        {
          title: t("core.ai.glossary.title", "Brand Glossary"),
          description: t(
            "core.ai.glossary.description",
            "Define product-specific terms once and enforce them across every translation.",
          ),
        },
        {
          title: t("core.ai.review.title", "Review Workflow"),
          description: t(
            "core.ai.review.description",
            "Approve, edit, or flag AI-generated translations before they go live.",
          ),
        },
        {
          title: t("core.ai.context.title", "Contextual Awareness"),
          description: t(
            "core.ai.context.description",
            "AI sees where each string appears in your app for accurate translations.",
          ),
        },
        {
          title: t("core.ai.batch.title", "Batch Processing"),
          description: t(
            "core.ai.batch.description",
            "Translate entire projects across all target languages in one operation.",
          ),
        },
      ],
    },
    {
      icon: "settings-gear",
      step: "02",
      badge: t("core.workflow.badge", "Developer Workflow"),
      title: t("core.workflow.title", "Git-native from day one"),
      description: t(
        "core.workflow.description",
        "Better i18n fits your existing development workflow instead of replacing it. Translations sync through pull requests, deploy through your CI/CD pipeline, and deliver through our global CDN.",
      ),
      supportingPoints: [
        t(
          "core.workflow.support.git",
          "Keep localization changes visible in the same review flow as product changes.",
        ),
        t(
          "core.workflow.support.release",
          "Deploy translation updates without inventing a second operating model.",
        ),
        t(
          "core.workflow.support.team",
          "Give developers, reviewers, and product teams one shared release rhythm.",
        ),
      ],
      items: [
        {
          title: t("core.workflow.git.title", "Git Sync"),
          description: t(
            "core.workflow.git.description",
            "Automatic PRs with translated content, synced to your repository.",
          ),
        },
        {
          title: t("core.workflow.cdn.title", "CDN Delivery"),
          description: t(
            "core.workflow.cdn.description",
            "Translations served from 300+ edge locations for sub-50ms load times.",
          ),
        },
        {
          title: t("core.workflow.cli.title", "CLI & SDK"),
          description: t(
            "core.workflow.cli.description",
            "Type-safe SDKs for React, Vue, Angular, and more with full autocomplete.",
          ),
        },
        {
          title: t("core.workflow.ota.title", "OTA Updates"),
          description: t(
            "core.workflow.ota.description",
            "Push translation updates without redeploying your application.",
          ),
        },
      ],
    },
    {
      icon: "globe",
      step: "03",
      badge: t("core.discovery.badge", "Content Discovery"),
      title: t(
        "core.discovery.title",
        "Automatically finds what needs translating",
      ),
      description: t(
        "core.discovery.description",
        "Our AST-based crawler scans your codebase to find every translatable string, then crawls your website to build a contextual glossary. No more manually tagging strings or maintaining lists of keys.",
      ),
      supportingPoints: [
        t(
          "core.discovery.support.coverage",
          "Spot missing keys and untranslated surfaces before users do.",
        ),
        t(
          "core.discovery.support.context",
          "Turn your product itself into context for better translation quality.",
        ),
        t(
          "core.discovery.support.cleanup",
          "Remove stale or unused keys before they accumulate technical debt.",
        ),
      ],
      items: [
        {
          title: t("core.discovery.ast.title", "AST Key Detection"),
          description: t(
            "core.discovery.ast.description",
            "Parses your source code to find every i18n key automatically.",
          ),
        },
        {
          title: t("core.discovery.crawler.title", "Website Crawler"),
          description: t(
            "core.discovery.crawler.description",
            "Analyzes your live site to build terminology and context maps.",
          ),
        },
        {
          title: t("core.discovery.unused.title", "Unused Key Detection"),
          description: t(
            "core.discovery.unused.description",
            "Find and clean up translation keys no longer referenced in code.",
          ),
        },
        {
          title: t("core.discovery.coverage.title", "Coverage Reports"),
          description: t(
            "core.discovery.coverage.description",
            "See exactly which strings are translated, missing, or outdated.",
          ),
        },
      ],
    },
  ];

  return (
    <MarketingLayout showCTA={true}>
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-mist-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-mist-600">
              {t("hero.badge", "Feature Overview")}
            </span>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1] lg:text-6xl/[1.1]">
              <span className="mt-6 block">
                {t("hero.title", "Everything you need to")}
              </span>
              <span className="block text-mist-600">
                {t("hero.titleHighlight", "ship globally")}
              </span>
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t(
                "hero.subtitle",
                "AI-powered translations, git-native workflows, and instant CDN delivery. A complete localization platform built for modern development teams.",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-mist-600">
              {t("core.badge", "Platform pillars")}
            </span>
            <h2 className="mt-6 font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
              {t("core.title", "Core platform capabilities")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-mist-700">
              {t(
                "core.subtitle",
                "Explore the core layers of Better i18n, from context-aware translation to developer workflows and automated content discovery.",
              )}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {overviewCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-mist-200 bg-white p-6 transition-colors hover:border-mist-300"
              >
                <div className="flex size-11 items-center justify-center rounded-xl border border-mist-100 bg-white text-mist-700 shadow-sm">
                  <SpriteIcon name={card.icon} className="size-5" />
                </div>
                <h3 className="mt-5 text-base font-medium text-mist-950">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm/6 text-mist-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capability Sections */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="space-y-6">
            {coreCapabilities.map((capability, index) => (
              <article
                key={capability.title}
                className="rounded-[2rem] border border-mist-200 bg-white p-6 sm:p-8 lg:p-10"
              >
                <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                    <div className="flex size-12 items-center justify-center rounded-xl border border-mist-100 bg-mist-50 text-mist-700 shadow-sm">
                      <SpriteIcon name={capability.icon} className="size-5" />
                    </div>
                    <div className="mt-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-mist-500">
                      <span>{capability.step}</span>
                      <span className="h-px w-6 bg-mist-200" />
                      <span>{capability.badge}</span>
                    </div>
                    <h3 className="mt-4 font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950">
                      {capability.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-base/7 text-mist-700">
                      {capability.description}
                    </p>

                    <ul className="mt-8 space-y-4">
                      {capability.supportingPoints.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-sm/6 text-mist-700"
                        >
                          <SpriteIcon name="checkmark" className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className={
                      index % 2 === 1
                        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:order-1"
                        : "grid grid-cols-1 gap-4 sm:grid-cols-2"
                    }
                  >
                    {capability.items.map((item) => (
                      <FeatureItem
                        key={item.title}
                        title={item.title}
                        description={item.description}
                      />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-mist-600">
              {t("additionalFeatures.badge", "Operational depth")}
            </span>
            <h2 className="mt-4 font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("additionalFeatures.title", "And so much more")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-mist-700">
              {t(
                "additionalFeatures.description",
                "These supporting capabilities help teams keep translation quality high as they add more products, markets, and collaborators.",
              )}
            </p>
          </div>
          <ul
            role="list"
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <li>
              <FeatureItem
                title={t("additionalFeatures.glossary.title", "Glossary Management")}
                description={t(
                  "additionalFeatures.glossary.description",
                  "Maintain consistent terminology across all languages with a centralized glossary.",
                )}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.memory.title", "Translation Memory")}
                description={t(
                  "additionalFeatures.memory.description",
                  "Reuse previous translations to save time and maintain consistency.",
                )}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.collaboration.title", "Team Collaboration")}
                description={t(
                  "additionalFeatures.collaboration.description",
                  "Review, comment, and approve translations with your team in real-time.",
                )}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.versionControl.title", "Version Control")}
                description={t(
                  "additionalFeatures.versionControl.description",
                  "Full history of every translation change with rollback support.",
                )}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.qa.title", "Quality Assurance")}
                description={t(
                  "additionalFeatures.qa.description",
                  "Automated checks for placeholders, formatting, and translation completeness.",
                )}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.analytics.title", "Analytics & Insights")}
                description={t(
                  "additionalFeatures.analytics.description",
                  "Track translation progress, coverage, and team performance across projects.",
                )}
              />
            </li>
          </ul>
        </div>
      </section>

      {/* CMS Feature Pages */}
      {featurePages.length > 0 && (
        <FeaturePagesGrid featurePages={featurePages} locale={locale} />
      )}

      {/* Related Pages */}
      <RelatedPages currentPage="features" locale={locale} variant="content" />
    </MarketingLayout>
  );
}

function FeaturePagesGrid({
  featurePages,
  locale,
}: {
  featurePages: MarketingPageListItem[];
  locale: string;
}) {
  const t = useT("featuresPage");

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-mist-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-mist-600">
              {t("deepDive.badge", "Feature Library")}
            </div>
            <h2 className="mt-4 font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
              {t("deepDive.title", "Deep dive into each feature")}
            </h2>
            <p className="mt-4 max-w-xl text-lg text-mist-700">
              {t(
                "deepDive.description",
                "Learn how each capability works in detail with examples, use cases, and technical documentation.",
              )}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-mist-200 bg-white p-4">
              <div className="font-display text-2xl/[1] font-medium text-mist-950">
                {featurePages.length}
              </div>
              <p className="mt-1 text-xs text-mist-600">
                {t("deepDive.stats.guides", "feature guides")}
              </p>
            </div>
            <div className="rounded-xl border border-mist-200 bg-white p-4">
              <h3 className="text-sm font-medium text-mist-950">
                {t("deepDive.statExamples.title", "Examples included")}
              </h3>
              <p className="mt-1 text-xs/5 text-mist-600">
                {t(
                  "deepDive.statExamples.description",
                  "Each guide explains where the feature fits and how teams use it in practice.",
                )}
              </p>
            </div>
            <div className="rounded-xl border border-mist-200 bg-white p-4">
              <h3 className="text-sm font-medium text-mist-950">
                {t("deepDive.statDocs.title", "Built for evaluation")}
              </h3>
              <p className="mt-1 text-xs/5 text-mist-600">
                {t(
                  "deepDive.statDocs.description",
                  "Use these pages to understand workflow, implementation detail, and real product value.",
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {featurePages.map((feature, index) => (
            <Link
              key={feature.slug}
              to="/$locale/features/$slug"
              params={{ locale, slug: feature.slug }}
              className="group flex min-h-[190px] flex-col justify-between rounded-2xl border border-mist-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-mist-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-mist-500">
                  <span className="rounded-full border border-mist-200 bg-mist-50 px-2.5 py-1">
                    {formatFeatureIndex(index + 1)}
                  </span>
                  <span>{t("deepDive.cardLabel", "Feature guide")}</span>
                </div>
                <div className="rounded-full border border-mist-200 bg-mist-50 p-2 text-mist-400 transition-colors group-hover:text-mist-700">
                  <SpriteIcon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>

              <div className="mt-6 max-w-xl">
                <h3 className="text-lg/[1.3] font-medium text-mist-950">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm/6 text-mist-600 line-clamp-2">
                  {feature.heroSubtitle ||
                    feature.excerpt ||
                    t(
                      "deepDive.cardFallback",
                      "See the use cases, workflow, and implementation details for this capability.",
                    )}
                </p>
              </div>

              <div className="mt-6 text-sm font-medium text-mist-700">
                {t("deepDive.readCta", "Read feature guide")}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)]">
      <div className="flex items-start gap-3">
        <span className="mt-1.5 size-2 rounded-full bg-mist-400" />
        <div>
          <h3 className="text-base/[1.35] font-medium text-mist-950">{title}</h3>
          <p className="mt-2 text-sm/6 text-mist-700">{description}</p>
        </div>
      </div>
    </div>
  );
}

function formatFeatureIndex(index: number) {
  return String(index).padStart(2, "0");
}
