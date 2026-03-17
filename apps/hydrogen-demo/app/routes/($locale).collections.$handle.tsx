import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "~/components/LocaleLink";
import { ProductCard } from "~/components/Storefront";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.collection?.title ?? "Collection" }];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { storefront, locale, messages } = context;
  const { handle } = params;

  if (!handle) {
    throw new Response("Collection handle required", { status: 400 });
  }

  const { collection } = await storefront.query(COLLECTION_QUERY, {
    variables: { handle, count: 24 },
  });

  if (!collection) {
    throw new Response("Collection not found", { status: 404 });
  }

  return { collection, locale, messages };
}

export default function CollectionPage() {
  const { collection, locale } = useLoaderData<typeof loader>();
  const { t: tco } = useTranslation("collection");
  const { t: tp } = useTranslation("products");

  return (
    <div className="page-frame space-y-10 sm:space-y-12">
      <section className="glass-panel overflow-hidden px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <LocaleLink
          to="/"
          locale={locale}
          className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500 transition-colors hover:text-slate-900"
        >
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15 18-6-6 6-6"
            />
          </svg>
          {tco("back_to_storefront")}
        </LocaleLink>

        <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
          {tco("collection_spotlight")}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
          {collection.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          {collection.description || tco("default_description")}
        </p>
      </section>

      {collection.products.nodes.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {collection.products.nodes.map((product: ProductNode) => (
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
        </section>
      ) : (
        <div className="glass-panel px-6 py-10 text-center sm:px-8">
          <p className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
            {tco("no_products_title")}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {tco("no_products_desc")}
          </p>
        </div>
      )}
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

const COLLECTION_QUERY = `#graphql
  query Collection($handle: String!, $count: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: $count) {
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
  }
` as const;
