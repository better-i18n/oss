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
              Localized storefronts that feel
              <span className="font-serif italic text-slate-500"> native </span>
              in every market.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {msg(
                common,
                "hero_subtitle",
                "Discover our curated collection of products",
              )} This example focuses on the storefront layer: premium
              merchandising, path-based locale switching, and docs-ready UI
              patterns your team can lift directly into a Hydrogen build.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LocaleLink
                to="/collections/all"
                locale={locale}
                className="button-primary"
              >
                {msg(common, "shop_now", "Shop Now")}
              </LocaleLink>
              <LocaleLink
                to="/#featured"
                locale={locale}
                className="button-secondary"
              >
                Explore featured drops
              </LocaleLink>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <InfoPanel
                value="05 markets"
                title="Path-based locales"
                description="Switch languages without breaking the storefront flow or product URLs."
              />
              <InfoPanel
                value="CDN-backed"
                title="Flexible message delivery"
                description="A clean shell for content that updates independently from your theme code."
              />
              <InfoPanel
                value="Docs-ready"
                title="Reference-quality UI"
                description="Minimal, polished commerce screens that feel like a modern product example."
              />
            </div>
          </div>

          <div className="glass-panel relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.12),transparent_32%)]" />
            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/55">
                    Storefront preview
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                    A cleaner way to present localized commerce.
                  </h2>
                </div>
                <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
                  Live example
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/55">Current experience</p>
                      <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-white">
                        Market-aware merchandising
                      </p>
                    </div>
                    <div className="rounded-full border border-emerald-400/22 bg-emerald-400/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-emerald-200">
                      synced
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      ["en", "US storefront copy", "98% coverage"],
                      ["tr", "Turkish promo blocks", "94% coverage"],
                      ["de", "Localized PDP labels", "91% coverage"],
                    ].map(([market, label, value]) => (
                      <div
                        key={market}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/10 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/8 text-xs font-semibold uppercase tracking-[0.22em] text-white/72">
                            {market}
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
                      Stack
                    </p>
                    <ul className="mt-4 list-none space-y-3 text-sm text-white/72">
                      <li>Hydrogen data loaders</li>
                      <li>Better i18n message layer</li>
                      <li>Reusable Tailwind primitives</li>
                    </ul>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-5">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/55">
                      Design notes
                    </p>
                    <p className="mt-4 text-lg font-semibold tracking-[-0.04em] text-white">
                      Editorial product framing with tight spacing and premium
                      contrast.
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/72">
                      The goal is not theme chrome. It is a credible example app
                      you can drop into docs without apologizing for the design.
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
            eyebrow="Featured products"
            title={msg(common, "featured_products", "Featured Products")}
            description="High-clarity product cards with less noise, sharper hierarchy, and a more premium merchandising rhythm."
            action={
              <LocaleLink
                to="/collections/all"
                locale={locale}
                className="button-secondary"
              >
                {msg(common, "view_all", "View All")}
              </LocaleLink>
            }
          />

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product: ProductNode) => (
              <ProductCard
                key={product.id}
                locale={locale}
                product={product}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section id="collections" className="page-frame">
        <SectionHeading
          eyebrow="Curated edits"
          title={msg(common, "featured_collections", "Featured Collections")}
          description="Collection blocks double as landing modules for seasonal drops, regional promotions, and curated campaigns."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {collections[0] ? (
            <CollectionCard
              locale={locale}
              collection={collections[0]}
              className="min-h-[26rem]"
            />
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            {collections.slice(1).map((collection: CollectionNode) => (
              <CollectionCard
                key={collection.id}
                locale={locale}
                collection={collection}
                className="min-h-[12.5rem]"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="page-frame">
        <div className="grid gap-5 lg:grid-cols-3">
          <InfoPanel
            value="Merchandising"
            title="Cleaner content density"
            description="Cards, buttons, and panels are stripped back so product imagery and copy have room to carry the page."
          />
          <InfoPanel
            value="Localization"
            title="Visible i18n touchpoints"
            description="Language switching, translated labels, and locale-driven routes are present without turning the UI into a demo toy."
          />
          <InfoPanel
            value="Adoption"
            title="Easy to document"
            description="This is opinionated enough to feel polished, but simple enough that teams can reuse the patterns without rewrites."
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
