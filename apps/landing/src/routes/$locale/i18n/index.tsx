import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { GuideMark, type GuideGroup } from "@/lib/i18n-guide-icons";
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
 * i18n: everything user-facing on this page is a key under
 * `marketing.i18n.index.*` — hero, the four section titles and eyebrows, and the
 * name + description of all 41 links. The 82 item keys were created for this
 * page; before that the labels only rendered through `defaultValue`, which is
 * forbidden here (the CDN source_text is the only source of truth). The arrays
 * below therefore carry a slug and a key stem, never a string.
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

/**
 * A hub link: `slug` is the route segment, `key` is the stem under
 * `i18n.index.<group>.<key>` that holds `.name` and `.description`. The two
 * differ where the slug is long (`localization-vs-internationalization` →
 * `l10nVsI18n`), so they cannot be derived from each other.
 */
type HubLink = { slug: string; key: string };

const frameworks: HubLink[] = [
  { slug: "react", key: "react" },
  { slug: "nextjs", key: "nextjs" },
  { slug: "tanstack-start", key: "tanstackStart" },
  { slug: "vite", key: "vite" },
  { slug: "remix-hydrogen", key: "remixHydrogen" },
  { slug: "vue", key: "vue" },
  { slug: "nuxt", key: "nuxt" },
  { slug: "angular", key: "angular" },
  { slug: "svelte", key: "svelte" },
  { slug: "expo", key: "expo" },
  { slug: "ios", key: "ios" },
  { slug: "flutter", key: "flutter" },
  { slug: "server", key: "server" },
];

const topics: HubLink[] = [
  { slug: "best-tms", key: "bestTms" },
  { slug: "best-library", key: "bestLibrary" },
  { slug: "for-developers", key: "forDevelopers" },
  { slug: "translation-management-system", key: "translationManagement" },
  { slug: "software-localization", key: "softwareLocalization" },
  { slug: "website-localization", key: "websiteLocalization" },
  { slug: "software-localization-services", key: "softwareLocalizationServices" },
  { slug: "localization-management", key: "localizationManagement" },
  { slug: "localization-vs-internationalization", key: "l10nVsI18n" },
  { slug: "react-intl", key: "reactIntl" },
];

const localizationGuides: HubLink[] = [
  { slug: "content-localization", key: "contentLocalization" },
  { slug: "content-localization-services", key: "contentLocalizationServices" },
  { slug: "cultural-adaptation", key: "culturalAdaptation" },
  { slug: "website-translation", key: "websiteTranslation" },
  { slug: "translation-solutions", key: "translationSolutions" },
  { slug: "localization-software", key: "localizationSoftware" },
  { slug: "localization-platforms", key: "localizationPlatforms" },
  { slug: "localization-tools", key: "localizationTools" },
];

const seoGuides: HubLink[] = [
  { slug: "multilingual-seo", key: "multilingualSeo" },
  { slug: "international-seo", key: "internationalSeo" },
  { slug: "international-seo-consulting", key: "internationalSeoConsulting" },
  { slug: "technical-multilingual-seo", key: "technicalMultilingualSeo" },
  { slug: "technical-international-seo", key: "technicalInternationalSeo" },
  { slug: "multilingual-website-seo", key: "multilingualWebsiteSeo" },
  { slug: "global-market-seo", key: "globalMarketSeo" },
  { slug: "seo-international-audiences", key: "seoInternationalAudiences" },
  { slug: "local-seo-international", key: "localSeoInternational" },
  { slug: "ecommerce-global-seo", key: "ecommerceGlobalSeo" },
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
          eyebrow={t("i18n.index.frameworks.eyebrow")}
          title={t("i18n.index.frameworks.title")}
        />
        <HubGrid items={frameworks} group="frameworks" locale={locale} columns={3} />
      </Section>

      <Divider />

      <Section labelledBy="i18n-hub-topics">
        <SectionHeader
          id="i18n-hub-topics"
          eyebrow={t("i18n.index.topics.eyebrow")}
          title={t("i18n.index.topics.title")}
        />
        <HubGrid items={topics} group="topics" locale={locale} columns={3} />
      </Section>

      <Divider />

      <Section labelledBy="i18n-hub-localization">
        <SectionHeader
          id="i18n-hub-localization"
          eyebrow={t("i18n.index.localizationGuides.eyebrow")}
          title={t("i18n.index.localizationGuides.title")}
        />
        <HubGrid items={localizationGuides} group="localizationGuides" locale={locale} columns={4} />
      </Section>

      <Divider />

      <Section labelledBy="i18n-hub-seo">
        <SectionHeader
          id="i18n-hub-seo"
          eyebrow={t("i18n.index.seoGuides.eyebrow")}
          title={t("i18n.index.seoGuides.title")}
        />
        <HubGrid items={seoGuides} group="seoGuides" locale={locale} columns={4} />
      </Section>
    </MarketingLayout>
  );
}

/**
 * One index of links — bare columns split by gap, no cell borders.
 *
 * rule/listed-items-are-not-cards: this is a link list, not a matrix of equal
 * units, so the items get no box of their own. The page already draws a frame
 * (FrameLines + the `.section` rules) and `<Section>` already supplies the
 * padding; a border per link put a third box inside the second one and left the
 * eye reading rules instead of names — with 41 links the borders were the loudest
 * thing on the page.
 *
 * rule/name-a-thing-with-its-mark: the frameworks group carries each framework's
 * own logo, on the same 18px neutral tile the vendor marks use.
 */
function HubGrid({
  items,
  group,
  locale,
  columns,
}: {
  items: HubLink[];
  /** Key group under `i18n.index.*` that holds this set of link labels. */
  group: GuideGroup;
  locale: string;
  columns: 3 | 4;
}) {
  const t = useT("marketing");
  const gridCols =
    columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`mt-8 grid gap-x-10 gap-y-7 ${gridCols}`}>
      {items.map((item) => (
        <Link
          key={item.slug}
          // Every guide is its own file route, so the target cannot be
          // expressed as one literal. Cast to a sibling route id (same
          // `$locale` param shape) the way `RelatedPages` does, rather than
          // leaving a template literal that the router's link types reject.
          to={`/$locale/i18n/${item.slug}/` as "/$locale/i18n/"}
          params={{ locale }}
          className="group flex items-start justify-between gap-3"
        >
            <span className="flex min-w-0 items-start gap-3">
              {/* <GuideMark /> rather than a local tile: rule/name-a-thing-with-
                  its-mark wants ONE tile at one size everywhere a framework is
                  named, and this grid inventing its own was how that drifts. */}
              <span className="mt-0.5">
                <GuideMark slug={item.slug} group={group} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-medium text-mist-900">
                  {t(`i18n.index.${group}.${item.key}.name`)}
                </span>
                <span className="mt-1 block text-[12px] leading-relaxed text-mist-500">
                  {t(`i18n.index.${group}.${item.key}.description`)}
                </span>
              </span>
            </span>
            <SpriteIcon
              name="arrow-right"
              className="mt-0.5 size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600"
            />
        </Link>
      ))}
    </div>
  );
}
