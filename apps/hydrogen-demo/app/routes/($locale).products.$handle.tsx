import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen";
import { CartForm } from "@shopify/hydrogen";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "~/components/LocaleLink";
import { formatMoney } from "~/lib/format";
import { deriveShopifyLocale } from "~/lib/i18n";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.product?.title ?? "Product" }];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const locale = (params.locale as string | undefined) ?? "en";
  const shopifyI18n = deriveShopifyLocale(locale, locale === "en");
  const { handle } = params;

  if (!handle) throw new Response("Product handle required", { status: 400 });

  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      language: shopifyI18n.language,
      country: shopifyI18n.country,
    },
  });

  if (!product) throw new Response("Product not found", { status: 404 });

  return { product, locale };
}

export default function ProductPage() {
  const { product, locale } = useLoaderData<typeof loader>();
  const { t: tp } = useTranslation("products");

  const variants: VariantNode[] = product.variants.nodes;
  const options: OptionNode[] = product.options || [];
  const images: ImageNode[] = product.images?.nodes || [];

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const first = variants[0];
    if (!first) return {};
    const opts: Record<string, string> = {};
    for (const opt of first.selectedOptions) opts[opt.name] = opt.value;
    return opts;
  });

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedVariant =
    variants.find((v) =>
      v.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value,
      ),
    ) ?? variants[0];

  const isAvailable = selectedVariant?.availableForSale ?? false;
  const price = selectedVariant?.price;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price?.amount ?? "0");

  const displayImages =
    images.length > 0
      ? images
      : product.featuredImage
        ? [product.featuredImage]
        : [];
  const activeImage = displayImages[activeImageIndex] ?? null;

  useEffect(() => {
    if (!selectedVariant?.image) return;
    const idx = displayImages.findIndex(
      (img) => img.url === selectedVariant.image?.url,
    );
    if (idx >= 0) setActiveImageIndex(idx);
  }, [displayImages, selectedVariant]);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white">
        <div className="page-frame flex items-center gap-2 py-3 text-[12px] text-stone-400">
          <LocaleLink to="/" locale={locale} className="hover:text-stone-700">
            {tp("home", { ns: "common" })}
          </LocaleLink>
          <span>/</span>
          <LocaleLink
            to="/collections/all"
            locale={locale}
            className="hover:text-stone-700"
          >
            {tp("back_to_catalog")}
          </LocaleLink>
          <span>/</span>
          <span className="text-stone-700">{product.title}</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="page-frame">
        <div className="grid grid-cols-1 divide-y divide-stone-200 border-x border-b border-stone-200 lg:grid-cols-[1fr_420px] lg:divide-x lg:divide-y-0">
          {/* Left: images */}
          <div className="flex flex-col divide-y divide-stone-200">
            {/* Main image */}
            <div className="relative bg-stone-50">
              {activeImage ? (
                <img
                  src={activeImage.url}
                  alt={activeImage.altText ?? product.title}
                  className="mx-auto block aspect-square w-full max-w-2xl object-contain p-8 lg:p-16"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center text-stone-300">
                  <svg
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z"
                    />
                  </svg>
                </div>
              )}
              <div className="absolute left-4 top-4">
                <span className="source-pill border-emerald-100 bg-white/90 text-emerald-700 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Shopify
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex divide-x divide-stone-200 overflow-x-auto">
                {displayImages.map((img, i) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative aspect-square w-20 shrink-0 bg-stone-50 transition-colors hover:bg-stone-100 ${
                      i === activeImageIndex
                        ? "outline outline-2 -outline-offset-2 outline-stone-900"
                        : ""
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.altText ?? `${product.title} ${i + 1}`}
                      className="h-full w-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: info panel */}
          <div className="flex flex-col divide-y divide-stone-200 bg-white">
            {/* Title + price */}
            <div className="p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="source-pill border-stone-200 bg-stone-50 text-stone-500">
                  {tp("product_detail_badge")}
                </span>
                <span
                  className={`source-pill ${
                    isAvailable
                      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border-rose-100 bg-rose-50 text-rose-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-rose-500"}`}
                  />
                  {isAvailable ? tp("in_stock") : tp("sold_out")}
                </span>
              </div>

              <h1 className="mt-4 text-[1.75rem] font-semibold leading-tight tracking-tight text-stone-900 sm:text-[2.25rem]">
                {product.title}
              </h1>

              {price ? (
                <div className="mt-3 flex items-baseline gap-3">
                  <span
                    className={`text-2xl font-semibold tracking-tight ${hasDiscount ? "text-rose-600" : "text-stone-900"}`}
                  >
                    {formatMoney(price.amount, price.currencyCode, locale)}
                  </span>
                  {hasDiscount && compareAtPrice ? (
                    <del className="text-sm text-stone-400">
                      {formatMoney(
                        compareAtPrice.amount,
                        compareAtPrice.currencyCode,
                        locale,
                      )}
                    </del>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Description */}
            {product.description ? (
              <div className="p-6 lg:p-8">
                <p className="label mb-3">{tp("description")}</p>
                <p className="text-[14px] leading-6 text-stone-600">
                  {product.description}
                </p>
              </div>
            ) : null}

            {/* Options */}
            {options.length > 0 ? (
              <div className="p-6 lg:p-8">
                {options.map((option) => {
                  if (
                    option.name === "Title" &&
                    option.optionValues.length === 1 &&
                    option.optionValues[0]?.name === "Default Title"
                  )
                    return null;

                  return (
                    <div key={option.id} className="mb-6 last:mb-0">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <p className="label">{option.name}</p>
                        <span className="text-[12px] text-stone-500">
                          {selectedOptions[option.name] ?? tp("choose_one")}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {option.optionValues.map((val) => {
                          const isSelected =
                            selectedOptions[option.name] === val.name;
                          const isOptionAvailable = variants.some(
                            (v) =>
                              v.availableForSale &&
                              v.selectedOptions.some(
                                (so) =>
                                  so.name === option.name &&
                                  so.value === val.name,
                              ),
                          );
                          return (
                            <button
                              key={val.name}
                              type="button"
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [option.name]: val.name,
                                }))
                              }
                              disabled={!isOptionAvailable}
                              className={`border px-4 py-2 text-[13px] font-medium transition-colors ${
                                isSelected
                                  ? "border-stone-900 bg-stone-900 text-white"
                                  : isOptionAvailable
                                    ? "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                                    : "cursor-not-allowed border-stone-100 bg-stone-50 text-stone-300 line-through"
                              }`}
                            >
                              {val.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Add to cart — pinned to bottom */}
            <div className="mt-auto p-6 lg:p-8">
              <CartForm
                route={locale === "en" ? "/cart" : `/${locale}/cart`}
                action={CartForm.ACTIONS.LinesAdd}
                inputs={{
                  lines: [
                    {
                      merchandiseId: selectedVariant?.id ?? "",
                      quantity: 1,
                    },
                  ],
                }}
              >
                {(fetcher) => (
                  <button
                    type="submit"
                    disabled={!isAvailable || fetcher.state !== "idle"}
                    className={`w-full border py-3.5 text-[13px] font-semibold tracking-wide transition-colors ${
                      isAvailable
                        ? "border-stone-900 bg-stone-900 text-white hover:bg-stone-700"
                        : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
                    }`}
                  >
                    {fetcher.state !== "idle"
                      ? tp("adding")
                      : isAvailable
                        ? tp("add_to_cart")
                        : tp("sold_out")}
                  </button>
                )}
              </CartForm>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="source-pill border-emerald-100 bg-emerald-50 text-[10px] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Product via Shopify
                </span>
                <span className="source-pill border-blue-100 bg-blue-50 text-[10px] text-blue-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Text via Better i18n
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ImageNode {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

interface OptionNode {
  id: string;
  name: string;
  optionValues: { name: string }[];
}

interface VariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: { name: string; value: string }[];
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
  image: ImageNode | null;
}

const PRODUCT_QUERY = `#graphql
  query Product($handle: String!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      id
      title
      handle
      description
      featuredImage { url altText width height }
      images(first: 8) {
        nodes { url altText width height }
      }
      options {
        id
        name
        optionValues { name }
      }
      variants(first: 50) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText width height }
        }
      }
    }
  }
` as const;
