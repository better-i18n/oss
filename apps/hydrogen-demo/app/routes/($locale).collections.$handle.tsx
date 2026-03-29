import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "~/components/LocaleLink";
import { formatMoney } from "~/lib/format";
import { deriveShopifyLocale } from "~/lib/i18n";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.collection?.title ?? "Collection" }];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const locale = (params.locale as string | undefined) ?? "en";
  const shopifyI18n = deriveShopifyLocale(locale, locale === "en");
  const { handle } = params;

  if (!handle)
    throw new Response("Collection handle required", { status: 400 });

  const { collection } = await storefront.query(COLLECTION_QUERY, {
    variables: { handle, count: 24, language: shopifyI18n.language, country: shopifyI18n.country },
  });

  if (!collection) throw new Response("Collection not found", { status: 404 });

  return { collection, locale };
}

export default function CollectionPage() {
  const { collection, locale } = useLoaderData<typeof loader>();
  const { t: tco } = useTranslation("collection");
  const { t: tp } = useTranslation("products");

  const products: ProductNode[] = collection.products.nodes;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white">
        <div className="page-frame flex items-center gap-2 py-3 text-[12px] text-stone-400">
          <LocaleLink to="/" locale={locale} className="hover:text-stone-700">
            {tco("home", { ns: "common" })}
          </LocaleLink>
          <span>/</span>
          <span className="text-stone-700">{collection.title}</span>
        </div>
      </div>

      {/* Collection header */}
      <div className="border-b border-stone-200 bg-white">
        <div className="page-frame grid grid-cols-1 divide-y divide-stone-200 py-0 lg:grid-cols-[1fr_auto] lg:divide-x lg:divide-y-0">
          <div className="py-10 lg:pr-12">
            <div className="flex items-center gap-2">
              <span className="source-pill border-emerald-100 bg-emerald-50 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Shopify Collection
              </span>
              <span className="source-pill border-blue-100 bg-blue-50 text-blue-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Better i18n
              </span>
            </div>
            <h1 className="mt-4 text-[2.5rem] font-semibold leading-tight tracking-tight text-stone-900 sm:text-[3.5rem]">
              {collection.title}
            </h1>
            {collection.description ? (
              <p className="mt-3 max-w-xl text-[14px] leading-6 text-stone-500">
                {collection.description}
              </p>
            ) : (
              <p className="mt-3 max-w-xl text-[14px] leading-6 text-stone-400">
                {tco("default_description")}
              </p>
            )}
          </div>

          <div className="flex flex-col justify-center gap-1 py-10 lg:pl-12">
            <p className="label">{tco("products_label")}</p>
            <p className="text-[2rem] font-semibold tracking-tight text-stone-900">
              {products.length}
            </p>
            <p className="text-[12px] text-stone-400">{tco("collection_spotlight")}</p>
          </div>
        </div>
      </div>

      {/* Product grid */}
      {products.length > 0 ? (
        <div className="page-frame">
          <div className="grid grid-cols-2 divide-x divide-y divide-stone-200 border-b border-x border-stone-200 lg:grid-cols-4">
            {products.map((product) => (
              <LocaleLink
                key={product.id}
                to={`/products/${product.handle}`}
                locale={locale}
                className="group block bg-white transition-colors hover:bg-stone-50"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                  {product.featuredImage ? (
                    <img
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText ?? product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] text-stone-400">
                      {product.title}
                    </div>
                  )}
                  <div className="absolute left-3 top-3">
                    <span className="source-pill border-stone-200 bg-white/90 text-stone-500 backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {tp("localized_badge")}
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2 px-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-stone-900">
                      {product.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-stone-400">
                      {tp("from")}{" "}
                      <span className="font-medium text-stone-700">
                        {formatMoney(
                          product.priceRange.minVariantPrice.amount,
                          product.priceRange.minVariantPrice.currencyCode,
                          locale,
                        )}
                      </span>
                    </p>
                  </div>
                  <svg
                    className="h-4 w-4 shrink-0 text-stone-300 transition-colors group-hover:text-stone-600"
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
                </div>
              </LocaleLink>
            ))}
          </div>
        </div>
      ) : (
        <div className="page-frame py-20 text-center">
          <p className="text-[15px] font-medium text-stone-900">
            {tco("no_products_title")}
          </p>
          <p className="mt-2 text-[13px] text-stone-400">
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
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
}

const COLLECTION_QUERY = `#graphql
  query Collection($handle: String!, $count: Int!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image { url altText }
      products(first: $count) {
        nodes {
          id
          title
          handle
          featuredImage { url altText }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
        }
      }
    }
  }
` as const;
