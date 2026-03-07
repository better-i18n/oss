import type { ReactNode } from "react";
import { LocaleLink } from "./LocaleLink";
import { formatMoney } from "~/lib/format";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

interface ProductCardProps {
  locale: string;
  product: {
    id: string;
    title: string;
    handle: string;
    featuredImage: { url: string; altText: string | null } | null;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
  };
  messages?: { from?: string; localized_badge?: string };
  className?: string;
}

export function ProductCard({
  locale,
  product,
  messages: cardMessages,
  className,
}: ProductCardProps) {
  const price = product.priceRange.minVariantPrice;

  return (
    <LocaleLink
      to={`/products/${product.handle}`}
      locale={locale}
      className={cx(
        "group flex h-full flex-col rounded-[28px] border border-black/6 bg-white/88 p-3 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-black/12 hover:shadow-[0_28px_90px_-42px_rgba(15,23,42,0.34)]",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,#f4f1eb_0%,#ece7dd_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_42%)]" />
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            className="relative h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="relative flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
            {product.title}
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/88 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-600 backdrop-blur">
          {cardMessages?.localized_badge ?? "Localized"}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between px-1 pb-1 pt-4">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
            {product.title}
          </h3>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-black/6 pt-4">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
              {cardMessages?.from ?? "From"}
            </p>
            <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">
              {formatMoney(price.amount, price.currencyCode, locale)}
            </p>
          </div>

          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-slate-950 text-white transition-transform duration-300 group-hover:translate-x-0.5">
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-6-6 6 6-6 6"
              />
            </svg>
          </span>
        </div>
      </div>
    </LocaleLink>
  );
}

interface CollectionCardProps {
  locale: string;
  collection: {
    id: string;
    title: string;
    handle: string;
    image: { url: string; altText: string | null } | null;
  };
  messages?: { badge?: string };
  className?: string;
}

export function CollectionCard({
  locale,
  collection,
  messages: cardMessages,
  className,
}: CollectionCardProps) {
  return (
    <LocaleLink
      to={`/collections/${collection.handle}`}
      locale={locale}
      className={cx(
        "group relative overflow-hidden rounded-[30px] border border-black/6 bg-slate-950 p-6 text-white shadow-[0_28px_90px_-48px_rgba(15,23,42,0.8)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_96px_-40px_rgba(15,23,42,0.88)]",
        className,
      )}
    >
      <div className="absolute inset-0 opacity-70">
        {collection.image ? (
          <img
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] group-hover:opacity-90"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.26),transparent_45%),linear-gradient(160deg,#0f172a_0%,#1e293b_65%,#334155_100%)]" />
        )}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0.72)_100%)]" />

      <div className="relative flex min-h-[18rem] flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/78 backdrop-blur">
            {cardMessages?.badge ?? "Collection"}
          </span>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/16 bg-white/8 backdrop-blur">
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17 17 7m0 0H8m9 0v9"
              />
            </svg>
          </span>
        </div>

        <div>
          <h3 className="max-w-xs text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[2rem]">
            {collection.title}
          </h3>
        </div>
      </div>
    </LocaleLink>
  );
}

interface InfoPanelProps {
  title: string;
  description: string;
  value?: string;
}

export function InfoPanel({ title, description, value }: InfoPanelProps) {
  return (
    <div className="rounded-[24px] border border-black/6 bg-white/82 p-5 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.4)] backdrop-blur">
      {value ? (
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-slate-500">
          {value}
        </p>
      ) : null}
      <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
