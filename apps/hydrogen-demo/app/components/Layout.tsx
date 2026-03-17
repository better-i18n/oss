import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { LocaleLink } from "./LocaleLink";
import type { LanguageOption } from "@better-i18n/remix";

interface LayoutProps {
  locale: string;
  languages: LanguageOption[];
  githubStars: number;
  totalQuantity: number;
  children: React.ReactNode;
}

export function Layout({
  locale,
  languages,
  githubStars,
  totalQuantity,
  children,
}: LayoutProps) {
  const { t: tc } = useTranslation("common");
  const { t: tn } = useTranslation("nav");
  const { t: tf } = useTranslation("footer");
  const storeName = tc("store_name");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50">
        <div className="page-frame pt-4 sm:pt-5">
          <div className="flex items-center justify-between gap-4 rounded-full border border-black/7 bg-white/76 px-4 py-3 shadow-md backdrop-blur-xl sm:px-5">
            <LocaleLink
              to="/"
              locale={locale}
              className="flex min-w-0 items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-black/8 bg-white shadow-sm">
                <img
                  src="https://better-i18n.com/cdn-cgi/image/width=64,height=64,fit=contain/brand/logo.svg"
                  alt="Better i18n"
                  className="h-8 w-8 object-contain dark:invert"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold tracking-[-0.03em] text-slate-950">
                  {storeName}
                </span>
                <span className="block truncate text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-slate-500">
                  {tc("storefront_subtitle")}
                </span>
              </span>
            </LocaleLink>

            <nav className="hidden items-center gap-7 md:flex">
              <LocaleLink
                to="/#featured"
                locale={locale}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
              >
                {tn("featured")}
              </LocaleLink>
              <LocaleLink
                to="/#collections"
                locale={locale}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
              >
                {tn("collections")}
              </LocaleLink>
              <a
                href="https://github.com/better-i18n/oss"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
              >
                {tn("github_star")}
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 transition-colors group-hover:bg-slate-200 group-hover:text-slate-950">
                  {githubStars >= 1000
                    ? `${(githubStars / 1000).toFixed(1)}k`
                    : String(githubStars)}
                </span>
                <svg
                  className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <LocaleLink
                to="/cart"
                locale={locale}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white transition-colors hover:bg-slate-50"
              >
                <svg
                  className="h-5 w-5 text-slate-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {totalQuantity > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-[0.65rem] font-semibold text-white">
                    {totalQuantity}
                  </span>
                )}
              </LocaleLink>

              <div className="hidden sm:block">
                <LocaleSwitcher locale={locale} languages={languages} />
              </div>

              <button
                type="button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white transition-colors hover:bg-slate-50 md:hidden"
                aria-label="Toggle menu"
              >
                {mobileNavOpen ? (
                  <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {mobileNavOpen && (
            <div className="mt-2 rounded-2xl border border-black/7 bg-white p-4 shadow-md md:hidden">
              <nav className="flex flex-col gap-3">
                <LocaleLink
                  to="/#featured"
                  locale={locale}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {tn("featured")}
                </LocaleLink>
                <LocaleLink
                  to="/#collections"
                  locale={locale}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {tn("collections")}
                </LocaleLink>
                <a
                  href="https://github.com/better-i18n/oss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {tn("github_star")}
                </a>
              </nav>
              <div className="mt-3 border-t border-black/6 pt-3">
                <LocaleSwitcher locale={locale} languages={languages} />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="relative flex-1 pb-24 pt-8 sm:pt-10">{children}</main>

      <footer className="relative mt-auto border-t border-black/6">
        <div className="page-frame py-12 sm:py-16">
          <div className="grid gap-10 px-2 sm:px-0 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                {tf("built_for_docs")}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">
                {tf("tagline")}
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
                {tc("hero_subtitle")}
              </p>
            </div>

            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                {tf("explore")}
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-700">
                <LocaleLink
                  to="/"
                  locale={locale}
                  className="transition-colors hover:text-slate-950"
                >
                  {tf("home")}
                </LocaleLink>
                <LocaleLink
                  to="/collections/all"
                  locale={locale}
                  className="transition-colors hover:text-slate-950"
                >
                  {tf("catalog")}
                </LocaleLink>
                <LocaleLink
                  to="/#collections"
                  locale={locale}
                  className="transition-colors hover:text-slate-950"
                >
                  {tf("featured_collections_link")}
                </LocaleLink>
              </div>
            </div>

            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                {tf("stack")}
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-700">
                <a
                  href="https://better-i18n.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-slate-950"
                >
                  Better i18n
                </a>
                <a
                  href="https://hydrogen.shopify.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-slate-950"
                >
                  Shopify Hydrogen
                </a>
                <span className="text-slate-500">
                  {tf("built_with")}
                </span>
              </div>
            </div>
          </div>

          <div className="soft-divider mt-10 flex flex-col gap-3 px-2 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-0">
            <p>
              &copy; {new Date().getFullYear()} {storeName}.{" "}
              {tf("all_rights_reserved")}
            </p>
            <p>{tf("meta_tagline")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
