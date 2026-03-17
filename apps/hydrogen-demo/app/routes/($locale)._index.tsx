import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "~/components/LocaleLink";
import {
  CollectionCard,
  InfoPanel,
  ProductCard,
  SectionHeading,
} from "~/components/Storefront";
import { msg } from "@better-i18n/remix";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = msg(data?.messages?.common, "meta_title", "Better Store | Localized Hydrogen Demo");
  const description = msg(
    data?.messages?.common,
    "meta_description",
    "Localized storefronts that feel native in every market. Powered by Better I18N and Shopify Hydrogen.",
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
  const { locale, collections, products } =
    useLoaderData<typeof loader>();
  const { t: tc } = useTranslation("common");
  const { t: th } = useTranslation("home");
  const { t: tp } = useTranslation("products");
  const { t: tco } = useTranslation("collection");

  return (
    <div className="space-y-20 sm:space-y-24">
      <section className="page-frame">
        <div className="glass-panel overflow-hidden px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="inline-flex rounded-full border border-black/7 bg-slate-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-slate-600">
            Better i18n x Shopify Hydrogen
          </div>

          <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-[-0.065em] text-slate-950 sm:text-6xl lg:text-7xl">
            {th("hero_start")} {th("hero_native")} {th("hero_end")}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            {tc("hero_subtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LocaleLink
              to="/#featured"
              locale={locale}
              className="button-primary"
            >
              {th("explore_featured")}
            </LocaleLink>
          </div>
        </div>
      </section>

      {products.length > 0 ? (
        <section id="featured" className="page-frame">
          <SectionHeading
            eyebrow={th("featured_eyebrow")}
            title={tc("featured_products")}
            description={th("featured_products_desc")}
            action={
              <LocaleLink
                to="/collections/all"
                locale={locale}
                className="button-secondary"
              >
                {tc("view_all")}
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
                  from: tp("from"),
                  localized_badge: tp("localized_badge"),
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section id="collections" className="page-frame">
        <SectionHeading
          eyebrow={th("collections_eyebrow")}
          title={tc("featured_collections")}
          description={th("collections_desc")}
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {collections[0] ? (
            <CollectionCard
              locale={locale}
              collection={collections[0]}
              className="min-h-[26rem]"
              messages={{ badge: tco("badge") }}
            />
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            {collections.slice(1).map((collection: CollectionNode) => (
              <CollectionCard
                key={collection.id}
                locale={locale}
                collection={collection}
                className="min-h-[12.5rem]"
                messages={{ badge: tco("badge") }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="page-frame">
        <div className="grid gap-5 lg:grid-cols-3">
          <InfoPanel
            value={th("feature_merchandising_value")}
            title={th("feature_merchandising_title")}
            description={th("feature_merchandising_desc")}
          />
          <InfoPanel
            value={th("feature_localization_value")}
            title={th("feature_localization_title")}
            description={th("feature_localization_desc")}
          />
          <InfoPanel
            value={th("feature_adoption_value")}
            title={th("feature_adoption_title")}
            description={th("feature_adoption_desc")}
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
