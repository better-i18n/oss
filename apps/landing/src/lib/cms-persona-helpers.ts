import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";
import { getMarketingPage, getMarketingPages } from "@/lib/content";
import type { MarketingPage, MarketingPageListItem } from "@/lib/content";
import {
  SITE_URL,
  getAlternateLinks,
  getCanonicalLink,
  buildOgImageUrl,
} from "@/lib/meta";
import {
  getEducationalPageStructuredData,
  getBreadcrumbSchema,
  formatStructuredData,
} from "@/lib/page-seo";

// ─── Server Functions ────────────────────────────────────────────────

export const loadPersonaPage = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }) => {
    return getMarketingPage(data.slug, data.locale);
  });

export const loadRelatedPersonas = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }) => {
    const pages = await getMarketingPages(data.locale, "persona");
    return pages.filter((p) => p.slug !== data.slug).slice(0, 6);
  });

// ─── Loader ──────────────────────────────────────────────────────────

export async function personaLoader(
  slug: string,
  locale: string,
): Promise<{
  page: MarketingPage;
  locale: string;
  relatedPersonas: MarketingPageListItem[];
}> {
  const page = await loadPersonaPage({ data: { slug, locale } });
  if (!page) {
    throw notFound();
  }
  const relatedPersonas = await loadRelatedPersonas({
    data: { slug, locale },
  });
  return { page, locale, relatedPersonas };
}

// ─── Head ────────────────────────────────────────────────────────────

const PERSONA_LABELS: Record<string, string> = {
  "for-marketers": "For Marketers",
  "for-agencies": "For Agencies",
  "for-enterprises": "For Enterprises",
  "for-startups": "For Startups",
  "for-engineering-leaders": "For Engineering Leaders",
  "for-content-teams": "For Content Teams",
  "for-ecommerce": "For E-Commerce",
  "for-saas": "For SaaS",
  "for-mobile-teams": "For Mobile Teams",
  "for-designers": "For Designers",
  "for-freelancers": "For Freelancers",
  "for-open-source": "For Open Source",
  "for-gaming": "For Gaming",
  "for-education": "For Education",
  "for-healthcare": "For Healthcare",
};

export function getPersonaLabel(slug: string): string {
  return PERSONA_LABELS[slug] ?? slug.replace("for-", "For ").replace(/-/g, " ");
}

export function personaHead(loaderData: {
  page?: MarketingPage;
  locale?: string;
}) {
  const page = loaderData?.page;
  const locale = loaderData?.locale || "en";
  const slug = page?.slug || "";
  const pathname = `/${slug}`;
  const canonicalUrl = `${SITE_URL}/${locale}${pathname}`;
  const label = getPersonaLabel(slug);

  const dynamicOgImage = buildOgImageUrl("og/feature", {
    title: page?.title || label,
  });

  const excerpt = page?.excerpt || page?.heroSubtitle || "";

  const educationalScripts = getEducationalPageStructuredData({
    title: page?.title || label,
    description: excerpt,
    url: canonicalUrl,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: page?.title || label, url: canonicalUrl },
  ]);

  return {
    meta: [
      { title: `${page?.title || label} - Better i18n` },
      { name: "description", content: excerpt },
      { property: "og:title", content: page?.title || "" },
      { property: "og:description", content: excerpt },
      { property: "og:image", content: dynamicOgImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl },
      { property: "og:site_name", content: "Better i18n" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@betteri18n" },
      { name: "twitter:title", content: page?.title || "" },
      { name: "twitter:description", content: excerpt },
      { name: "twitter:image", content: dynamicOgImage },
      { name: "robots", content: "index, follow" },
      ...(page?.targetKeywords
        ? [{ name: "keywords", content: page.targetKeywords }]
        : []),
    ],
    links: [
      ...getAlternateLinks(pathname),
      getCanonicalLink(locale, pathname),
    ],
    scripts: formatStructuredData([
      ...educationalScripts,
      breadcrumbSchema,
    ]),
  };
}
