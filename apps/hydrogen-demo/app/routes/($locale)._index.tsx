import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen";
import { LocaleLink } from "~/components/LocaleLink";
import {
  CollectionCard,
  InfoPanel,
  ProductCard,
  SectionHeading,
} from "~/components/Storefront";
import { msg } from "~/lib/messages";

export const meta: MetaFunction = () => {
  return [{ title: "Better Store | Localized Hydrogen Demo" }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront, locale, messages } = context;

  const [{ collections }, { products }] = await Promise.all([
    storefront.query(FEATURED_COLLECTIONS_QUERY, {
      variables: { count: 4 },
    }),
    storefront.query(FEATURED_PRODUCTS_QUERY, {
      variables: { count: 8 },
    }),
  ]);

  return {
    locale,
    messages,
    collections: collections.nodes,
    products: products.nodes,
  };
}

export default function Homepage() {
  const { locale, messages, collections, products } =
    useLoaderData<typeof loader>();
  const common = messages.common;
  const home = messages.home;
  const productMessages = messages.products;
  const collectionMessages = messages.collection;

  return (
    <div className="space-y-20 sm:space-y-24">
      <section className="page-frame">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="glass-panel relative overflow-hidden px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="absolute inset-y-0 right-0 hidden w-px bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.08),transparent)] lg:block" />
            <div className="inline-flex rounded-full border border-black/7 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-slate-600">
              Better i18n x Shopify Hydrogen
            </div>

            <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-[-0.065em] text-slate-950 sm:text-6xl lg:text-7xl">
              {msg(home, "hero_start")}
              <span className="font-serif italic text-slate-500"> {msg(home, "hero_native")} </span>
              {msg(home, "hero_end")}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {msg(common, "hero_subtitle")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LocaleLink
                to="/#featured"
                locale={locale}
                className="button-primary"
              >
                {msg(home, "explore_featured")}
              </LocaleLink>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <InfoPanel
                value={msg(home, "hero_panel_markets_value")}
                title={msg(home, "hero_panel_markets_title")}
                description={msg(home, "hero_panel_markets_desc")}
              />
              <InfoPanel
                value={msg(home, "hero_panel_cdn_value")}
                title={msg(home, "hero_panel_cdn_title")}
                description={msg(home, "hero_panel_cdn_desc")}
              />
              <InfoPanel
                value={msg(home, "hero_panel_docs_value")}
                title={msg(home, "hero_panel_docs_title")}
                description={msg(home, "hero_panel_docs_desc")}
              />
            </div>
          </div>

          <div className="glass-panel relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.12),transparent_32%)]" />
            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/55">
                    {msg(home, "preview_eyebrow")}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                    {msg(home, "preview_title")}
                  </h2>
                </div>
                <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
                  {msg(home, "preview_live_badge")}
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/55">{msg(home, "preview_current_label")}</p>
                      <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-white">
                        {msg(home, "preview_current_title")}
                      </p>
                    </div>
                    <div className="rounded-full border border-emerald-400/22 bg-emerald-400/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-emerald-200">
                      {msg(home, "preview_synced_badge")}
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      ["en", "us", msg(home, "preview_market_en_label"), "98%"],
                      ["tr", "tr", msg(home, "preview_market_tr_label"), "94%"],
                      ["de", "de", msg(home, "preview_market_de_label"), "91%"],
                    ].map(([market, flagCode, label, value]) => (
                      <div
                        key={market}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/10 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/8">
                            <img
                              src={`https://s3.better-i18n.com/flags/${flagCode}/w80.png`}
                              alt={market}
                              className="h-4 w-6 rounded-[4px] object-cover shadow-[0_2px_8px_-4px_rgba(0,0,0,0.5)]"
                            />
                          </span>
                          <span className="text-sm text-white/72">{label}</span>
                        </div>
                        <span className="text-sm font-medium text-white">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/55">
                      {msg(home, "preview_stack_heading")}
                    </p>
                    <ul className="mt-4 list-none space-y-3 text-sm text-white/72">
                      <li>{msg(home, "preview_stack_item_1")}</li>
                      <li>{msg(home, "preview_stack_item_2")}</li>
                      <li>{msg(home, "preview_stack_item_3")}</li>
                    </ul>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-5">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/55">
                      {msg(home, "preview_design_heading")}
                    </p>
                    <p className="mt-4 text-lg font-semibold tracking-[-0.04em] text-white">
                      {msg(home, "preview_design_title")}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/72">
                      {msg(home, "preview_design_desc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {products.length > 0 ? (
        <section id="featured" className="page-frame">
          <SectionHeading
            eyebrow={msg(home, "featured_eyebrow")}
            title={msg(common, "featured_products")}
            description={msg(home, "featured_products_desc")}
            action={
              <LocaleLink
                to="/collections/all"
                locale={locale}
                className="button-secondary"
              >
                {msg(common, "view_all")}
              </LocaleLink>
            }
          />

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product: ProductNode) => (
              <ProductCard
                key={product.id}
                locale={locale}
                product={product}
                messages={{
                  from: msg(productMessages, "from"),
                  localized_badge: msg(productMessages, "localized_badge"),
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section id="collections" className="page-frame">
        <SectionHeading
          eyebrow={msg(home, "collections_eyebrow")}
          title={msg(common, "featured_collections")}
          description={msg(home, "collections_desc")}
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {collections[0] ? (
            <CollectionCard
              locale={locale}
              collection={collections[0]}
              className="min-h-[26rem]"
              messages={{ badge: msg(collectionMessages, "badge") }}
            />
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            {collections.slice(1).map((collection: CollectionNode) => (
              <CollectionCard
                key={collection.id}
                locale={locale}
                collection={collection}
                className="min-h-[12.5rem]"
                messages={{ badge: msg(collectionMessages, "badge") }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="page-frame">
        <div className="grid gap-5 lg:grid-cols-3">
          <InfoPanel
            value={msg(home, "feature_merchandising_value")}
            title={msg(home, "feature_merchandising_title")}
            description={msg(home, "feature_merchandising_desc")}
          />
          <InfoPanel
            value={msg(home, "feature_localization_value")}
            title={msg(home, "feature_localization_title")}
            description={msg(home, "feature_localization_desc")}
          />
          <InfoPanel
            value={msg(home, "feature_adoption_value")}
            title={msg(home, "feature_adoption_title")}
            description={msg(home, "feature_adoption_desc")}
          />
        </div>
      </section>
    </div>
  );
}

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
}

interface CollectionNode {
  id: string;
  title: string;
  handle: string;
  image: { url: string; altText: string | null } | null;
}

const FEATURED_COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections($count: Int!) {
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
  query FeaturedProducts($count: Int!) {
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
