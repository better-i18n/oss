import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { LocaleLink } from "~/components/LocaleLink";
import { formatMoney } from "~/lib/format";
import { msg } from "@better-i18n/remix";
import { deriveShopifyLocale } from "~/lib/i18n";
import { i18n as remixI18n } from "~/i18n.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = msg(
    data?.messages?.common,
    "meta_title",
    "Better Store | Localized Hydrogen Demo",
  );
  const description = msg(
    data?.messages?.common,
    "meta_description",
    "Localized storefronts that feel native in every market. Powered by Better i18n and Shopify Hydrogen.",
  );
  const ogImage = `https://og.better-i18n.com/og/shopify?title=${encodeURIComponent(title)}`;
  return [
    { title },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: ogImage },
  ];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { storefront, languages } = context;
  const locale = (params.locale as string | undefined) ?? "en";
  const shopifyI18n = deriveShopifyLocale(locale, locale === "en");

  const [{ collections }, { products }, messages] = await Promise.all([
    storefront.query(FEATURED_COLLECTIONS_QUERY, {
      variables: { count: 4, language: shopifyI18n.language, country: shopifyI18n.country },
    }),
    storefront.query(FEATURED_PRODUCTS_QUERY, {
      variables: { count: 8, language: shopifyI18n.language, country: shopifyI18n.country },
    }),
    remixI18n.getMessages(locale),
  ]);

  return {
    locale,
    messages,
    languages,
    collections: collections.nodes,
    products: products.nodes,
  };
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
}

interface CollectionNode {
  id: string;
  title: string;
  handle: string;
  image: { url: string; altText: string | null } | null;
}

// ─── Locale cycling widget ───────────────────────────────────────────────────

const LOCALE_ROWS = [
  { flag: "🇺🇸", code: "en", native: "English", phrase: "Shop the collection" },
  { flag: "🇹🇷", code: "tr", native: "Türkçe", phrase: "Koleksiyona göz at" },
  { flag: "🇫🇷", code: "fr", native: "Français", phrase: "Voir la collection" },
  { flag: "🇩🇪", code: "de", native: "Deutsch", phrase: "Kollektion ansehen" },
  { flag: "🇪🇸", code: "es", native: "Español", phrase: "Ver la colección" },
  { flag: "🇯🇵", code: "ja", native: "日本語", phrase: "コレクションを見る" },
  { flag: "🇸🇦", code: "ar", native: "العربية", phrase: "تصفح المجموعة" },
];

function LocaleTable({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="divide-y divide-stone-100">
      {LOCALE_ROWS.map((row, i) => (
        <div
          key={row.code}
          className={`flex items-center gap-3 px-4 py-2.5 transition-colors duration-300 ${
            i === activeIndex ? "bg-stone-900 text-white" : "text-stone-500"
          }`}
        >
          <span className="w-5 text-base leading-none">{row.flag}</span>
          <span
            className={`w-8 font-mono text-[10px] font-semibold uppercase tracking-widest ${
              i === activeIndex ? "text-stone-400" : "text-stone-300"
            }`}
          >
            {row.code}
          </span>
          <span
            className={`flex-1 text-[13px] ${i === activeIndex ? "text-white" : "text-stone-600"}`}
          >
            {row.phrase}
          </span>
          {i === activeIndex && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Hero section ─────────────────────────────────────────────────────────

function HeroSection({
  locale,
  heroProduct,
}: {
  locale: string;
  heroProduct: ProductNode | undefined;
}) {
  const { t: th } = useTranslation("home");
  const { t: tc } = useTranslation("common");
  const [activeLocale, setActiveLocale] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActiveLocale((i) => (i + 1) % LOCALE_ROWS.length),
      1800,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="border-b border-stone-200">
      <div className="page-frame">
        {/* Single bordered container — outer border wraps both hero and stats */}
        <div className="border border-stone-200">
        <div className="grid grid-cols-1 divide-y divide-stone-200 lg:grid-cols-[1fr_400px] lg:divide-x lg:divide-y-0">
          {/* Left: headline + copy + CTA */}
          <div className="py-14 pr-0 lg:py-20 lg:pr-12">
            <p className="label">
              {th("hero_start")} — {th("hero_end")}
            </p>

            <h1 className="display mt-5">
              {th("hero_native")}
              <br />
              <span className="text-stone-400">
                {LOCALE_ROWS[activeLocale]?.phrase ?? LOCALE_ROWS[0].phrase}
              </span>
            </h1>

            <p className="mt-6 max-w-md text-[15px] leading-7 text-stone-500">
              {tc("hero_subtitle")}
            </p>

            {/* Data sources */}
            <div className="mt-8 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="source-pill border-stone-200 bg-stone-50 text-stone-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Shopify Storefront API
                </span>
                <span className="text-[11px] text-stone-400">{th("source_shopify_desc")}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="source-pill border-blue-100 bg-blue-50 text-blue-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Better i18n CDN
                </span>
                <span className="text-[11px] text-stone-400">{th("source_cdn_desc")}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="source-pill border-violet-100 bg-violet-50 text-violet-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  Better i18n CMS
                </span>
                <span className="text-[11px] text-stone-400">{th("source_cms_desc")}</span>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <LocaleLink to="/#featured" locale={locale} className="btn-dark">
                {th("explore_featured")}
              </LocaleLink>
              <a
                href="https://github.com/better-i18n/oss"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center gap-2"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>

          {/* Right: locale table + product preview */}
          <div className="flex flex-col divide-y divide-stone-200 lg:pl-0">
            {/* Locale cycling table */}
            <div>
              <div className="flex items-center justify-between border-b border-stone-200 px-4 py-2.5">
                <p className="label">{th("live_translations_label", { count: LOCALE_ROWS.length })}</p>
                <span className="flex items-center gap-1.5 text-[11px] text-stone-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  {th("live_active")}
                </span>
              </div>
              <LocaleTable activeIndex={activeLocale} />
            </div>

            {/* Hero product preview */}
            {heroProduct ? (
              <LocaleLink
                to={`/products/${heroProduct.handle}`}
                locale={locale}
                className="group flex items-center gap-4 p-4 transition-colors hover:bg-stone-50"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden bg-stone-100">
                  {heroProduct.featuredImage ? (
                    <img
                      src={heroProduct.featuredImage.url}
                      alt={heroProduct.featuredImage.altText || heroProduct.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="label">{th("featured_product_label")}</p>
                  <p className="mt-1 truncate text-[13px] font-medium text-stone-900">
                    {heroProduct.title}
                  </p>
                  <p className="text-[13px] text-stone-400">
                    {formatMoney(
                      heroProduct.priceRange.minVariantPrice.amount,
                      heroProduct.priceRange.minVariantPrice.currencyCode,
                      locale,
                    )}
                  </p>
                </div>
                <svg
                  className="h-4 w-4 shrink-0 text-stone-300 transition-transform group-hover:translate-x-0.5 group-hover:text-stone-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </LocaleLink>
            ) : null}
          </div>
        </div>

        {/* Stats strip — inside the outer border container */}
        <div className="grid grid-cols-2 divide-x divide-y divide-stone-200 border-t border-stone-200 sm:grid-cols-4 sm:divide-y-0">
          {[
            { n: "50+", label: th("stats_languages") },
            { n: "CDN-first", label: th("stats_cdn") },
            { n: "5-min", label: th("stats_cache") },
            { n: "AI-powered", label: th("stats_ai") },
          ].map((s) => (
            <div key={s.n} className="px-4 py-5 sm:px-6">
              <p className="text-lg font-semibold tracking-tight text-stone-900 sm:text-xl">
                {s.n}
              </p>
              <p className="mt-0.5 text-[11px] text-stone-400">{s.label}</p>
            </div>
          ))}
        </div>
        </div> {/* end outer border container */}
      </div>
    </section>
  );
}

// ─── Products grid ────────────────────────────────────────────────────────

function ProductsGrid({
  products,
  locale,
  fromLabel,
  localizedBadge,
}: {
  products: ProductNode[];
  locale: string;
  fromLabel: string;
  localizedBadge: string;
}) {
  const { t: th } = useTranslation("home");
  const { t: tc } = useTranslation("common");

  return (
    <section id="featured" className="border-b border-stone-200">
      <div className="page-frame">
        <div className="border-x border-stone-200">
          {/* Section header */}
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <p className="label">{th("featured_eyebrow")}</p>
              <span className="source-pill border-emerald-100 bg-emerald-50 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Shopify
              </span>
            </div>
            <LocaleLink
              to="/collections/all"
              locale={locale}
              className="text-[12px] text-stone-400 hover:text-stone-900"
            >
              {tc("view_all")} →
            </LocaleLink>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 divide-x divide-y divide-stone-200 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCell
                key={product.id}
                product={product}
                locale={locale}
                fromLabel={fromLabel}
                localizedBadge={localizedBadge}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCell({
  product,
  locale,
  fromLabel,
  localizedBadge,
}: {
  product: ProductNode;
  locale: string;
  fromLabel: string;
  localizedBadge: string;
}) {
  const price = product.priceRange.minVariantPrice;

  return (
    <LocaleLink
      to={`/products/${product.handle}`}
      locale={locale}
      className="group block bg-white transition-colors hover:bg-stone-50"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[11px] text-stone-400">
            {product.title}
          </div>
        )}
        {/* Localized badge */}
        <div className="absolute left-3 top-3">
          <span className="source-pill border-stone-200 bg-white/90 text-stone-500 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            {localizedBadge}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-end justify-between gap-2 px-3 py-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-stone-900">
            {product.title}
          </p>
          <p className="mt-0.5 text-[12px] text-stone-400">
            {fromLabel}{" "}
            <span className="font-medium text-stone-700">
              {formatMoney(price.amount, price.currencyCode, locale)}
            </span>
          </p>
        </div>
        <span className="shrink-0 text-stone-300 transition-colors group-hover:text-stone-600">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </span>
      </div>
    </LocaleLink>
  );
}

// ─── Collections grid ──────────────────────────────────────────────────────

function CollectionsGrid({
  collections,
  locale,
  badgeLabel,
}: {
  collections: CollectionNode[];
  locale: string;
  badgeLabel: string;
}) {
  const { t: th } = useTranslation("home");

  return (
    <section id="collections" className="border-b border-stone-200">
      <div className="page-frame">
        <div className="border-x border-stone-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <p className="label">{th("collections_eyebrow")}</p>
              <span className="source-pill border-emerald-100 bg-emerald-50 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Shopify
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 divide-y divide-stone-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {collections.map((col) => (
            <LocaleLink
              key={col.id}
              to={`/collections/${col.handle}`}
              locale={locale}
              className="group relative aspect-[3/4] overflow-hidden bg-stone-900 sm:aspect-auto sm:min-h-[22rem]"
            >
              {/* Background image */}
              {col.image ? (
                <img
                  src={col.image.url}
                  alt={col.image.altText || col.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-70"
                />
              ) : (
                <div className="absolute inset-0 bg-stone-800" />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                <span className="source-pill self-start border-white/20 bg-white/10 text-white/80 backdrop-blur-sm">
                  {badgeLabel}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    {col.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-white/50">
                    {th("view_collection")}
                  </p>
                </div>
              </div>
            </LocaleLink>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Architecture section ──────────────────────────────────────────────────

function ArchSection() {
  const { t: th } = useTranslation("home");

  const panels = [
    {
      source: "Shopify Storefront API",
      color: "text-emerald-600",
      dot: "bg-emerald-500",
      border: "border-emerald-100",
      title: th("feature_merchandising_title"),
      body: th("feature_merchandising_desc"),
    },
    {
      source: "Better i18n CDN",
      color: "text-blue-600",
      dot: "bg-blue-500",
      border: "border-blue-100",
      title: th("feature_localization_title"),
      body: th("feature_localization_desc"),
    },
    {
      source: "Better i18n CMS",
      color: "text-violet-600",
      dot: "bg-violet-500",
      border: "border-violet-100",
      title: th("feature_adoption_title"),
      body: th("feature_adoption_desc"),
    },
  ];

  return (
    <section className="border-b border-stone-200">
      <div className="page-frame">
        <div className="border-x border-stone-200">
          <div className="border-b border-stone-200 px-6 py-4">
            <p className="label">{th("arch_eyebrow")}</p>
          </div>
          <div className="grid grid-cols-1 divide-y divide-stone-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {panels.map((p) => (
              <div key={p.source} className="px-6 py-8">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.25em] ${p.color}`}>
                    {p.source}
                  </p>
                </div>
                <h3 className="mt-4 text-[1.1rem] font-semibold leading-snug tracking-tight text-stone-900">
                  {p.title}
                </h3>
                <p className="mt-2 text-[13px] leading-6 text-stone-500">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function Homepage() {
  const { locale, collections, products } = useLoaderData<typeof loader>();
  const { t: tp } = useTranslation("products");
  const { t: tco } = useTranslation("collection");
  const { t: th } = useTranslation("home");

  return (
    <div>
      <HeroSection locale={locale} heroProduct={products[0] as ProductNode | undefined} />

      {products.length > 0 ? (
        <ProductsGrid
          products={products as ProductNode[]}
          locale={locale}
          fromLabel={tp("from")}
          localizedBadge={tp("localized_badge")}
        />
      ) : null}

      {collections.length > 0 ? (
        <CollectionsGrid
          collections={collections as CollectionNode[]}
          locale={locale}
          badgeLabel={tco("badge")}
        />
      ) : null}

      <ArchSection />

      {/* Bottom CTA */}
      <section>
        <div className="page-frame">
          <div className="grid grid-cols-1 divide-y divide-stone-200 border-x border-stone-200 lg:grid-cols-[1fr_auto] lg:divide-x lg:divide-y-0">
            <div className="px-6 py-12">
              <p className="label">{th("cta_eyebrow")}</p>
              <h2 className="mt-4 text-[2rem] font-semibold leading-tight tracking-tight text-stone-900 sm:text-[2.5rem]">
                {th("cta_title")}
              </h2>
              <p className="mt-3 max-w-sm text-[14px] leading-6 text-stone-500">
                {th("cta_desc")}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 px-6 py-12">
              <a
                href="https://better-i18n.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark whitespace-nowrap"
              >
                {th("cta_primary")}
              </a>
              <a
                href="https://docs.better-i18n.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline whitespace-nowrap"
              >
                {th("cta_secondary")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── GraphQL queries ────────────────────────────────────────────────────────

const FEATURED_COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections($count: Int!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    collections(first: $count, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        image {
          url
          altText
        }
      }
    }
  }
` as const;

const FEATURED_PRODUCTS_QUERY = `#graphql
  query FeaturedProducts($count: Int!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;
