import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen";
import { LocaleLink } from "~/components/LocaleLink";
import { InfoPanel, ProductCard } from "~/components/Storefront";
import { msg } from "~/lib/messages";

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
  const { collection, locale, messages } = useLoaderData<typeof loader>();
  const collectionMessages = messages.collection;
  const productMessages = messages.products;

  return (
    <div className="page-frame space-y-10 sm:space-y-12">
      <section className="glass-panel overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
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
              {msg(collectionMessages, "back_to_storefront")}
            </LocaleLink>

            <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
              {msg(collectionMessages, "collection_spotlight")}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
              {collection.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {collection.description ||
                "A curated product edit with a cleaner layout, stronger hierarchy, and room for localized merchandising to breathe."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <InfoPanel
                value={`${collection.products.nodes.length} items`}
                title="Merchandising set"
                description="A compact grid tuned for docs, demos, and real store browsing."
              />
              <InfoPanel
                value="Editorial"
                title="Refined hierarchy"
                description="Hero framing up top, product density below, and minimal visual clutter."
              />
              <InfoPanel
                value="Localized"
                title="Market-specific surfaces"
                description="Use these layouts for translated promos, regional drops, and seasonal edits."
              />
            </div>
          </div>

          <div className="relative min-h-[22rem] overflow-hidden bg-slate-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.2),rgba(15,23,42,0.7))]" />
            {collection.image ? (
              <img
                src={collection.image.url}
                alt={collection.image.altText || collection.title}
                className="h-full w-full object-cover opacity-85"
              />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 backdrop-blur">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/55">
                  Why this layout works
                </p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.04em] text-white">
                  It reads like a product page, not a theme screenshot.
                </p>
                <p className="mt-2 text-sm leading-7 text-white/72">
                  The collection hero sets context first, then hands off to a
                  clean grid with consistent card weight and spacing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {collection.products.nodes.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {collection.products.nodes.map((product: ProductNode) => (
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
        </section>
      ) : (
        <div className="glass-panel px-6 py-10 text-center sm:px-8">
          <p className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
            No products found in this collection.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Add products to the collection in Shopify and this page will update
            automatically.
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
