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

  const starsLabel =
    githubStars >= 1000
      ? `${(githubStars / 1000).toFixed(1)}k`
      : String(githubStars);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* ── Top bar (demo badge) ────────────────────── */}
      <div className="border-b border-stone-200 bg-stone-900 px-4 py-2 text-center">
        <p className="text-[11px] font-medium tracking-wide text-stone-300">
          Live demo ·{" "}
          <a
            href="https://better-i18n.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline underline-offset-2 hover:no-underline"
          >
            Better i18n
          </a>{" "}
          ×{" "}
          <a
            href="https://hydrogen.shopify.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline underline-offset-2 hover:no-underline"
          >
            Shopify Hydrogen
          </a>
        </p>
      </div>

      {/* ── Main header ─────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
        <div className="page-frame flex h-14 items-center justify-between gap-6">
          {/* Logo */}
          <LocaleLink
            to="/"
            locale={locale}
            className="flex shrink-0 items-center gap-2.5"
          >
            <img
              src="https://better-i18n.com/brand/logo.svg"
              alt="Better i18n"
              className="h-6 w-6 object-contain"
            />
            <span className="text-[13px] font-semibold tracking-tight text-stone-900">
              {storeName}
            </span>
          </LocaleLink>

          {/* Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <LocaleLink
              to="/#featured"
              locale={locale}
              className="text-[13px] text-stone-500 transition-colors hover:text-stone-900"
            >
              {tn("featured")}
            </LocaleLink>
            <LocaleLink
              to="/#collections"
              locale={locale}
              className="text-[13px] text-stone-500 transition-colors hover:text-stone-900"
            >
              {tn("collections")}
            </LocaleLink>
            <LocaleLink
              to="/blog"
              locale={locale}
              className="text-[13px] text-stone-500 transition-colors hover:text-stone-900"
            >
              {tn("blog")}
            </LocaleLink>
            <a
              href="https://github.com/better-i18n/oss"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] text-stone-500 transition-colors hover:text-stone-900"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              {tn("github_star")}
              <span className="rounded border border-stone-200 bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-600">
                {starsLabel}
              </span>
            </a>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LocaleSwitcher locale={locale} languages={languages} />
            </div>

            <LocaleLink
              to="/cart"
              locale={locale}
              className="relative flex h-8 w-8 items-center justify-center border border-stone-200 bg-white transition-colors hover:bg-stone-50"
              aria-label="Cart"
            >
              <svg
                className="h-4 w-4 text-stone-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                />
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-stone-900 text-[9px] font-bold text-white">
                  {totalQuantity}
                </span>
              )}
            </LocaleLink>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="flex h-8 w-8 items-center justify-center border border-stone-200 bg-white transition-colors hover:bg-stone-50 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? (
                <svg
                  className="h-4 w-4 text-stone-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4 text-stone-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 9h16.5m-16.5 6.75h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileNavOpen && (
          <div className="border-t border-stone-200 bg-white md:hidden">
            <div className="page-frame flex flex-col divide-y divide-stone-100 py-1">
              <LocaleLink
                to="/#featured"
                locale={locale}
                className="py-3 text-[13px] text-stone-600"
                onClick={() => setMobileNavOpen(false)}
              >
                {tn("featured")}
              </LocaleLink>
              <LocaleLink
                to="/#collections"
                locale={locale}
                className="py-3 text-[13px] text-stone-600"
                onClick={() => setMobileNavOpen(false)}
              >
                {tn("collections")}
              </LocaleLink>
              <LocaleLink
                to="/blog"
                locale={locale}
                className="py-3 text-[13px] text-stone-600"
                onClick={() => setMobileNavOpen(false)}
              >
                {tn("blog")}
              </LocaleLink>
              <a
                href="https://github.com/better-i18n/oss"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 text-[13px] text-stone-600"
              >
                GitHub
              </a>
              <div className="py-3">
                <LocaleSwitcher locale={locale} languages={languages} />
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="border-t border-stone-200 bg-white">
        <div className="page-frame">
          <div className="grid grid-cols-1 divide-y divide-stone-200 border-x border-stone-200 sm:grid-cols-[1fr_auto] sm:divide-x sm:divide-y-0">
            {/* Left: brand */}
            <div className="px-6 py-10">
            <div className="flex items-center gap-2">
              <img
                src="https://better-i18n.com/brand/logo.svg"
                alt="Better i18n"
                className="h-5 w-5 object-contain"
              />
              <span className="text-[13px] font-semibold text-stone-900">
                {storeName}
              </span>
            </div>
            <p className="mt-3 max-w-xs text-[13px] leading-6 text-stone-500">
              {tf("tagline")}
            </p>
            <p className="mt-4 text-[11px] text-stone-400">
              © {new Date().getFullYear()} · {tf("meta_tagline")}
            </p>
          </div>

          {/* Right: links */}
          <div className="grid grid-cols-2 gap-8 px-6 py-10">
            <div>
              <p className="label mb-3">{tf("explore")}</p>
              <div className="flex flex-col gap-2.5 text-[13px] text-stone-500">
                <LocaleLink
                  to="/"
                  locale={locale}
                  className="hover:text-stone-900"
                >
                  {tf("home")}
                </LocaleLink>
                <LocaleLink
                  to="/collections/all"
                  locale={locale}
                  className="hover:text-stone-900"
                >
                  {tf("catalog")}
                </LocaleLink>
                <LocaleLink
                  to="/#collections"
                  locale={locale}
                  className="hover:text-stone-900"
                >
                  {tf("featured_collections_link")}
                </LocaleLink>
              </div>
            </div>
            <div>
              <p className="label mb-3">{tf("stack")}</p>
              <div className="flex flex-col gap-2.5 text-[13px] text-stone-500">
                <a
                  href="https://better-i18n.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-stone-900"
                >
                  <img src="https://better-i18n.com/brand/logo.svg" alt="" className="h-3.5 w-3.5" />
                  Better i18n
                </a>
                <a
                  href="https://hydrogen.shopify.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-stone-900"
                >
                  <svg className="h-3.5 w-3.5 text-[#96bf48]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" /></svg>
                  Shopify Hydrogen
                </a>
                <a
                  href="https://github.com/better-i18n/oss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-stone-900"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                  GitHub
                </a>
              </div>
            </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
