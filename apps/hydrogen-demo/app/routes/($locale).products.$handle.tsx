import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen";
import { LocaleLink } from "~/components/LocaleLink";
import { InfoPanel } from "~/components/Storefront";
import { formatMoney } from "~/lib/format";
import { msg } from "~/lib/messages";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.product?.title ?? "Product" }];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { storefront, locale, messages } = context;
  const { handle } = params;

  if (!handle) {
    throw new Response("Product handle required", { status: 400 });
  }

  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle },
  });

  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  return { product, locale, messages };
}

export default function ProductPage() {
  const { product, locale, messages } = useLoaderData<typeof loader>();
  const productMessages = messages.products;

  const variants: VariantNode[] = product.variants.nodes;
  const options: OptionNode[] = product.options || [];
  const images: ImageNode[] = product.images?.nodes || [];

  // Initialize selected options from first variant
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const first = variants[0];
    if (!first) return {};
    const opts: Record<string, string> = {};
    for (const opt of first.selectedOptions) {
      opts[opt.name] = opt.value;
    }
    return opts;
  });

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Find matching variant
  const selectedVariant =
    variants.find((v) =>
      v.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value,
      ),
    ) || variants[0];

  const isAvailable = selectedVariant?.availableForSale ?? false;
  const price = selectedVariant?.price;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const hasDiscount =
    compareAtPrice && parseFloat(compareAtPrice.amount) > 0 &&
    parseFloat(compareAtPrice.amount) > parseFloat(price?.amount || "0");

  // Use variant image if available, otherwise use gallery
  const displayImages =
    images.length > 0
      ? images
      : product.featuredImage
        ? [product.featuredImage]
        : [];
  const activeImage = displayImages[activeImageIndex] || null;

  function handleOptionChange(optionName: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  }

  useEffect(() => {
    if (!selectedVariant?.image) return;

    const nextIndex = displayImages.findIndex(
      (image) => image.url === selectedVariant.image?.url,
    );

    if (nextIndex >= 0) {
      setActiveImageIndex(nextIndex);
    }
  }, [displayImages, selectedVariant]);

  return (
    <div className="page-frame">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="glass-panel overflow-hidden p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[0.16fr_0.84fr]">
            {displayImages.length > 1 ? (
              <div className="order-2 flex gap-3 overflow-x-auto pb-2 lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0">
                {displayImages.map((img, i) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-[20px] border transition duration-200 ${
                      i === activeImageIndex
                        ? "border-slate-950 shadow-[0_16px_40px_-26px_rgba(15,23,42,0.8)]"
                        : "border-black/6 hover:border-black/14"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.altText || `${product.title} ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/4.6] overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#f4f1eb_0%,#ebe5da_100%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_34%)]" />
                {activeImage ? (
                  <img
                    src={activeImage.url}
                    alt={activeImage.altText || product.title}
                    className="relative h-full w-full object-cover"
                  />
                ) : (
                  <div className="relative flex h-full items-center justify-center text-slate-400">
                    No image
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="glass-panel p-6 sm:p-7">
            <LocaleLink
              to="/collections/all"
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
              Back to catalog
            </LocaleLink>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-black/7 bg-white/70 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-600">
                Product detail
              </span>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${
                  isAvailable
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                    : "border border-rose-500/16 bg-rose-500/10 text-rose-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isAvailable ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                {isAvailable
                  ? msg(productMessages, "in_stock", "In Stock")
                  : msg(productMessages, "sold_out", "Sold Out")}
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl">
              {product.title}
            </h1>

            {price ? (
              <div className="mt-6 flex flex-wrap items-end gap-3">
                <p
                  className={`text-3xl font-semibold tracking-[-0.04em] ${
                    hasDiscount ? "text-rose-600" : "text-slate-950"
                  }`}
                >
                  {formatMoney(price.amount, price.currencyCode, locale)}
                </p>
                {hasDiscount && compareAtPrice ? (
                  <del className="pb-1 text-base text-slate-400">
                    {formatMoney(
                      compareAtPrice.amount,
                      compareAtPrice.currencyCode,
                      locale,
                    )}
                  </del>
                ) : null}
              </div>
            ) : null}

            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              {product.description ||
                "A polished product detail page designed to show how localized labels, options, and merchandising can live inside a premium storefront shell."}
            </p>

            {options.length > 0
              ? options.map((option) => {
                  if (
                    option.name === "Title" &&
                    option.optionValues.length === 1 &&
                    option.optionValues[0].name === "Default Title"
                  ) {
                    return null;
                  }

                  return (
                    <div key={option.id} className="mt-8">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold text-slate-900">
                          {msg(productMessages, "select_option", "Select")}{" "}
                          {option.name}
                        </h2>
                        <span className="text-sm text-slate-500">
                          {selectedOptions[option.name] || "Choose one"}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
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
                                handleOptionChange(option.name, val.name)
                              }
                              disabled={!isOptionAvailable}
                              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition duration-200 ${
                                isSelected
                                  ? "border-slate-950 bg-slate-950 text-white"
                                  : isOptionAvailable
                                    ? "border-black/8 bg-white/70 text-slate-700 hover:border-black/14 hover:bg-white"
                                    : "cursor-not-allowed border-black/6 bg-slate-100 text-slate-300 line-through"
                              }`}
                            >
                              {val.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                disabled={!isAvailable}
                className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition duration-200 ${
                  isAvailable
                    ? "bg-slate-950 hover:bg-slate-800"
                    : "cursor-not-allowed bg-slate-300"
                }`}
              >
                {isAvailable
                  ? msg(productMessages, "add_to_cart", "Add to Cart")
                  : msg(productMessages, "sold_out", "Sold Out")}
              </button>
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/8 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:border-black/14 hover:bg-white"
              >
                Save for later
              </button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <InfoPanel
              value="Locale-ready"
              title="Translated controls"
              description="Variant labels, stock states, and description headings all map cleanly to message keys."
            />
            <InfoPanel
              value="Hydrogen"
              title="GraphQL-first data"
              description="The page stays lean while still covering core commerce needs: images, options, price, and availability."
            />
            <InfoPanel
              value="Docs example"
              title="Simple to extend"
              description="This shell can later absorb richer i18n UI components without redesigning the page."
            />
          </div>
        </section>
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
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 5) {
        nodes {
          url
          altText
          width
          height
        }
      }
      options {
        id
        name
        optionValues {
          name
        }
      }
      variants(first: 50) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
` as const;
