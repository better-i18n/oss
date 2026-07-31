import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, formatStructuredData, createPageLoader } from "@/lib/page-seo";
import { getOrganizationSchema, getComparisonSchema } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/meta";
import { useT } from "@/lib/i18n";
import { Divider, PageHero, Section, SectionHeader } from "@/components/ui/page";

/**
 * i18n hub — the index for 40+ framework and topic guides. It is a hub, not a
 * pillar page, so it gets the page grammar (PageHero → Divider → Sections that
 * open with a SectionHeader) but no bespoke visuals: the content IS the link
 * set, and a diagram on top of it would compete with it.
 *
 * What changed and why:
 *   - It was five bare <section> blocks alternating white / bg-mist-50, each
 *     holding a grid of rounded-xl bordered cards with hover:shadow. Four
 *     stacked card grids read as four unrelated pages; with 41 cards the borders
 *     alone were the loudest thing on the screen.
 *   - Every grid is now one hairline table of rows (rule/interior-hairlines-only:
 *     interior rules, -1px shift, bare clip box), so 41 links read as one index.
 *
 * i18n: the four section titles and the hero come from existing
 * `marketing.i18n.index.*` keys. The per-item names and descriptions have NO
 * keys yet — they were previously rendered through `defaultValue`, which is
 * forbidden in this project. They now live in the HUB_COPY constants below,
 * exactly as `i18n/nextjs.tsx` does, so there is no fallback path in `t()` and
 * moving them to `i18n.index.*` keys is a single-object edit once those keys are
 * published. See DESIGN-DECISIONS.md → Coverage gaps.
 */

export const Route = createFileRoute("/$locale/i18n/")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    const frameworkListSchema = getComparisonSchema({
      title: "i18n Framework Guides",
      description: "Internationalization guides for popular JavaScript frameworks.",
      items: [
        { name: "React i18n", description: "Type-safe React internationalization with hooks", url: `${SITE_URL}/en/i18n/react` },
        { name: "Next.js i18n", description: "Server-side i18n for Next.js apps", url: `${SITE_URL}/en/i18n/nextjs` },
        { name: "TanStack Start i18n", description: "Full-stack localization for TanStack Start apps", url: `${SITE_URL}/en/i18n/tanstack-start` },
        { name: "Vite i18n", description: "Fast frontend internationalization for Vite projects", url: `${SITE_URL}/en/i18n/vite` },
        { name: "Remix & Hydrogen i18n", description: "Localized route-driven storefronts and server-rendered apps", url: `${SITE_URL}/en/i18n/remix-hydrogen` },
        { name: "Vue i18n", description: "Vue.js internationalization integration", url: `${SITE_URL}/en/i18n/vue` },
        { name: "Nuxt i18n", description: "Nuxt.js localization module", url: `${SITE_URL}/en/i18n/nuxt` },
        { name: "Angular i18n", description: "Angular internationalization support", url: `${SITE_URL}/en/i18n/angular` },
        { name: "Svelte i18n", description: "Svelte internationalization integration", url: `${SITE_URL}/en/i18n/svelte` },
        { name: "Expo i18n", description: "React Native and Expo localization workflows", url: `${SITE_URL}/en/i18n/expo` },
        { name: "iOS Localization", description: "SwiftUI and String Catalog localization for iOS apps", url: `${SITE_URL}/en/i18n/ios` },
        { name: "Flutter Localization", description: "ARB-based localization for Flutter apps", url: `${SITE_URL}/en/i18n/flutter` },
        { name: "Server-Side i18n", description: "Middleware-driven localization for APIs and edge runtimes", url: `${SITE_URL}/en/i18n/server` },
      ],
    });

    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18n",
      pathname: "/i18n",
      customStructuredData: formatStructuredData([getOrganizationSchema({ locale: loaderData?.locale }), frameworkListSchema]),
    });
  },
  component: I18nIndexPage,
});

/** Section eyebrows — awaiting `i18n.index.*.eyebrow` keys (see file header). */
const SECTION_EYEBROWS = {
  frameworks: "Frameworks",
  topics: "Resources",
  localization: "Localization",
  seo: "Search",
} as const;

type HubLink = { slug: string; name: string; description: string };

const frameworks: HubLink[] = [
  { slug: "react", name: "React i18n", description: "Type-safe React internationalization with hooks and context" },
  { slug: "nextjs", name: "Next.js i18n", description: "Server-side i18n for Next.js apps with App Router support" },
  { slug: "tanstack-start", name: "TanStack Start i18n", description: "Full-stack i18n for TanStack Start with SSR and route-aware localization" },
  { slug: "vite", name: "Vite i18n", description: "Fast frontend i18n for Vite projects with typed translation workflows" },
  { slug: "remix-hydrogen", name: "Remix & Hydrogen i18n", description: "Localized route-driven apps and storefront experiences" },
  { slug: "vue", name: "Vue i18n", description: "Vue.js internationalization with Composition API integration" },
  { slug: "nuxt", name: "Nuxt i18n", description: "Nuxt.js localization module with automatic routing" },
  { slug: "angular", name: "Angular i18n", description: "Angular internationalization with built-in i18n support" },
  { slug: "svelte", name: "Svelte i18n", description: "Lightweight Svelte internationalization integration" },
  { slug: "expo", name: "Expo i18n", description: "Offline-ready localization for Expo and React Native apps" },
  { slug: "ios", name: "iOS i18n", description: "String Catalog and SwiftUI localization for native iOS apps" },
  { slug: "flutter", name: "Flutter i18n", description: "ARB-based localization for Flutter mobile and web apps" },
  { slug: "server", name: "Server i18n", description: "Middleware-based internationalization for APIs and edge runtimes" },
];

const topics: HubLink[] = [
  { slug: "best-tms", name: "Best TMS", description: "Compare top translation management systems" },
  { slug: "best-library", name: "Best Library", description: "Find the best i18n library for your framework" },
  { slug: "for-developers", name: "For Developers", description: "Developer-focused internationalization guide" },
  { slug: "translation-management-system", name: "Translation Management", description: "Centralize your translation workflow with a TMS" },
  { slug: "software-localization", name: "Software Localization", description: "Adapt your software for global markets" },
  { slug: "website-localization", name: "Website Localization", description: "Localize your website for international users" },
  { slug: "software-localization-services", name: "Software Localization Services", description: "Compare platform and agency localization approaches" },
  { slug: "localization-management", name: "Localization Management", description: "Manage localization workflows at scale" },
  { slug: "localization-vs-internationalization", name: "Localization vs Internationalization", description: "Understand the difference between l10n and i18n" },
  { slug: "react-intl", name: "React Intl", description: "Internationalization with the react-intl library" },
];

const localizationGuides: HubLink[] = [
  { slug: "content-localization", name: "Content Localization", description: "Adapt your content for different cultures and markets" },
  { slug: "content-localization-services", name: "Content Localization Services", description: "Professional services for content localization at scale" },
  { slug: "cultural-adaptation", name: "Cultural Adaptation", description: "Go beyond translation with culturally aware content" },
  { slug: "website-translation", name: "Website Translation", description: "Translate your website content for global audiences" },
  { slug: "translation-solutions", name: "Translation Solutions", description: "Explore tools and services for translation workflows" },
  { slug: "localization-software", name: "Localization Software", description: "Platforms and tools that power multilingual products" },
  { slug: "localization-platforms", name: "Localization Platforms", description: "Compare cloud-based localization management platforms" },
  { slug: "localization-tools", name: "Localization Tools", description: "Developer-facing tools for managing translations" },
];

const seoGuides: HubLink[] = [
  { slug: "multilingual-seo", name: "Multilingual SEO", description: "Optimize your site to rank in every language" },
  { slug: "international-seo", name: "International SEO", description: "Strategy guide for ranking globally across markets" },
  { slug: "international-seo-consulting", name: "International SEO Consulting", description: "Expert guidance for global search strategies" },
  { slug: "technical-multilingual-seo", name: "Technical Multilingual SEO", description: "Hreflang, canonicals, and technical implementation" },
  { slug: "technical-international-seo", name: "Technical International SEO", description: "Deep-dive into international SEO infrastructure" },
  { slug: "multilingual-website-seo", name: "Multilingual Website SEO", description: "Practical guide to multilingual website optimization" },
  { slug: "global-market-seo", name: "Global Market SEO", description: "SEO strategies for entering global markets" },
  { slug: "seo-international-audiences", name: "SEO for International Audiences", description: "Target international audiences effectively" },
  { slug: "local-seo-international", name: "Local SEO International", description: "Local SEO strategies across multiple countries" },
  { slug: "ecommerce-global-seo", name: "E-commerce Global SEO", description: "SEO for international online stores" },
];

function I18nIndexPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={true}>
      <PageHero
        titleId="i18n-hub-hero-title"
        title={t("i18n.index.hero.title")}
        subtitle={t("i18n.index.hero.subtitle")}
      />

      <Divider />

      <Section labelledBy="i18n-hub-frameworks">
        <SectionHeader
          id="i18n-hub-frameworks"
          eyebrow={SECTION_EYEBROWS.frameworks}
          title={t("i18n.index.frameworks.title")}
        />
        <HubGrid items={frameworks} locale={locale} columns={3} />
      </Section>

      <Divider />

      <Section labelledBy="i18n-hub-topics">
        <SectionHeader
          id="i18n-hub-topics"
          eyebrow={SECTION_EYEBROWS.topics}
          title={t("i18n.index.topics.title")}
        />
        <HubGrid items={topics} locale={locale} columns={3} />
      </Section>

      <Divider />

      <Section labelledBy="i18n-hub-localization">
        <SectionHeader
          id="i18n-hub-localization"
          eyebrow={SECTION_EYEBROWS.localization}
          title={t("i18n.index.localizationGuides.title")}
        />
        <HubGrid items={localizationGuides} locale={locale} columns={4} />
      </Section>

      <Divider />

      <Section labelledBy="i18n-hub-seo">
        <SectionHeader
          id="i18n-hub-seo"
          eyebrow={SECTION_EYEBROWS.seo}
          title={t("i18n.index.seoGuides.title")}
        />
        <HubGrid items={seoGuides} locale={locale} columns={4} />
      </Section>
    </MarketingLayout>
  );
}

/**
 * One hairline index of links. Cells draw their own top + left rule and the grid
 * is shifted -1px, so the first row and column lose theirs at every breakpoint
 * without any nth-child arithmetic (rule/interior-hairlines-only).
 */
function HubGrid({
  items,
  locale,
  columns,
}: {
  items: HubLink[];
  locale: string;
  columns: 3 | 4;
}) {
  const gridCols =
    columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className="mt-8 overflow-hidden">
      <div className={`-mt-px -ml-px grid ${gridCols}`}>
        {items.map((item) => (
          <Link
            key={item.slug}
            // Every guide is its own file route, so the target cannot be
            // expressed as one literal. Cast to a sibling route id (same
            // `$locale` param shape) the way `RelatedPages` does, rather than
            // leaving a template literal that the router's link types reject.
            to={`/$locale/i18n/${item.slug}/` as "/$locale/i18n/"}
            params={{ locale }}
            className="group flex items-start justify-between gap-3 border-t border-l border-black/[0.05] px-5 py-4 transition-colors hover:bg-black/[0.02]"
          >
            <span className="min-w-0">
              <span className="block text-[13px] font-medium text-mist-900">
                {item.name}
              </span>
              <span className="mt-1 block text-[12px] leading-relaxed text-mist-500">
                {item.description}
              </span>
            </span>
            <SpriteIcon
              name="arrow-right"
              className="mt-0.5 size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
