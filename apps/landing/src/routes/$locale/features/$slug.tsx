import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getMarketingPage, getMarketingPages } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RelatedPages } from "@/components/RelatedPages";
import BlogContent from "@/components/blog/BlogContent";
import { IconArrowLeft } from "@central-icons-react/round-outlined-radius-2-stroke-2";
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

const loadFeaturePage = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }) => {
    return getMarketingPage(data.slug, data.locale);
  });

const loadRelatedFeatures = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }) => {
    const pages = await getMarketingPages(data.locale, "feature");
    return pages.filter((p) => p.slug !== data.slug).slice(0, 6);
  });

export const Route = createFileRoute("/$locale/features/$slug")({
  loader: async ({ params }) => {
    const page = await loadFeaturePage({
      data: { slug: params.slug, locale: params.locale },
    });
    if (!page) {
      throw notFound();
    }
    const relatedFeatures = await loadRelatedFeatures({
      data: { slug: params.slug, locale: params.locale },
    });
    return { page, locale: params.locale, relatedFeatures };
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page;
    const locale = loaderData?.locale || "en";
    const pathname = `/features/${page?.slug || ""}`;
    const canonicalUrl = `${SITE_URL}/${locale}${pathname}`;

    const dynamicOgImage = buildOgImageUrl("og", {
      title: page?.title || "Feature",
    });

    const excerpt = page?.excerpt || page?.heroSubtitle || "";

    const educationalScripts = getEducationalPageStructuredData({
      title: page?.title || "Feature",
      description: excerpt,
      url: canonicalUrl,
    });

    const breadcrumbScripts = formatStructuredData(
      getBreadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/${locale}` },
        { name: "Features", url: `${SITE_URL}/${locale}/features` },
        { name: page?.title || "Feature", url: canonicalUrl },
      ]),
    );

    return {
      meta: [
        { title: `${page?.title || "Feature"} - Better i18n` },
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
      scripts: [...educationalScripts, ...breadcrumbScripts],
    };
  },
  component: FeaturePageComponent,
  notFoundComponent: FeatureNotFound,
});

function FeaturePageComponent() {
  const { page, locale, relatedFeatures } = Route.useLoaderData();

  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main className="py-16">
        <article className="mx-auto max-w-4xl px-6 lg:px-10">
          {/* Back link */}
          <Link
            to="/$locale/features"
            params={{ locale }}
            className="inline-flex items-center gap-2 text-sm font-medium text-mist-700 hover:text-mist-950 transition-colors mb-8"
          >
            <IconArrowLeft className="w-4 h-4" />
            All Features
          </Link>

          {/* Hero */}
          <header className="mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mist-500 mb-4">
              Feature
            </span>
            <h1 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1] lg:text-5xl/[1.1]">
              {page.title}
            </h1>
            {page.heroSubtitle && (
              <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
                {page.heroSubtitle}
              </p>
            )}
          </header>

          {/* Content */}
          {page.bodyHtml && (
            <div className="min-w-0">
              <BlogContent
                html={page.bodyHtml}
                className="prose prose-lg max-w-none
                  prose-headings:font-display prose-headings:font-medium prose-headings:tracking-[-0.02em] prose-headings:text-mist-950
                  prose-p:text-mist-700 prose-p:leading-relaxed
                  prose-a:text-mist-950 prose-a:underline-offset-4 prose-a:decoration-mist-300 hover:prose-a:decoration-mist-500
                  prose-strong:text-mist-900 prose-strong:font-semibold
                  prose-code:text-mist-900 prose-code:bg-mist-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                  prose-blockquote:border-l-mist-300 prose-blockquote:text-mist-600 prose-blockquote:not-italic
                  prose-img:rounded-xl
                  prose-li:text-mist-700
                  prose-hr:border-mist-100"
              />
            </div>
          )}
        </article>

        {/* Related Features */}
        {relatedFeatures.length > 0 && (
          <div className="mx-auto max-w-7xl px-6 lg:px-10 mt-16">
            <h2 className="font-display text-2xl font-medium text-mist-950 mb-8">
              Explore more features
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedFeatures.map((feature) => (
                <Link
                  key={feature.slug}
                  to="/$locale/features/$slug"
                  params={{ locale, slug: feature.slug }}
                  className="group p-6 rounded-xl bg-mist-50 border border-mist-100 hover:border-mist-200 transition-colors"
                >
                  <h3 className="text-base font-medium text-mist-950 group-hover:text-mist-700 transition-colors">
                    {feature.title}
                  </h3>
                  {feature.heroSubtitle && (
                    <p className="mt-2 text-sm text-mist-600 leading-relaxed line-clamp-2">
                      {feature.heroSubtitle}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <RelatedPages currentPage="features" locale={locale} variant="for" />
      <Footer />
    </div>
  );
}

function FeatureNotFound() {
  const { locale } = Route.useParams();

  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            Feature not found
          </h1>
          <p className="mt-4 text-lg text-mist-600">
            The feature page you're looking for doesn't exist.
          </p>
          <Link
            to="/$locale/features"
            params={{ locale }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            All Features
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
