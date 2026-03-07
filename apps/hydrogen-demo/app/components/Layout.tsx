import { LocaleSwitcher } from "./LocaleSwitcher";
import { LocaleLink } from "./LocaleLink";
import { msg } from "~/lib/messages";
import type { LanguageOption, Messages } from "@better-i18n/remix";

interface LayoutProps {
  locale: string;
  messages: Messages;
  languages: LanguageOption[];
  children: React.ReactNode;
}

export function Layout({
  locale,
  messages,
  languages,
  children,
}: LayoutProps) {
  const common = messages.common;
  const footer = messages.footer;
  const storeName = msg(common, "store_name", "Better Store");

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.12),transparent_54%)]" />

      <header className="sticky top-0 z-50">
        <div className="page-frame pt-4 sm:pt-5">
          <div className="flex items-center justify-between gap-4 rounded-full border border-black/7 bg-white/76 px-4 py-3 shadow-[0_22px_60px_-44px_rgba(15,23,42,0.8)] backdrop-blur-xl sm:px-5">
            <LocaleLink
              to="/"
              locale={locale}
              className="flex min-w-0 items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-black/8 bg-white shadow-[0_12px_24px_-18px_rgba(15,23,42,0.4)]">
                <img
                  src="/logo.png"
                  alt="Better i18n"
                  className="h-8 w-8 object-contain"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold tracking-[-0.03em] text-slate-950">
                  {storeName}
                </span>
                <span className="block truncate text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-slate-500">
                  Hydrogen Storefront
                </span>
              </span>
            </LocaleLink>

            <nav className="hidden items-center gap-7 md:flex">
              <LocaleLink
                to="/#featured"
                locale={locale}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
              >
                Featured
              </LocaleLink>
              <LocaleLink
                to="/#collections"
                locale={locale}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
              >
                Collections
              </LocaleLink>
              <LocaleLink
                to="/collections/all"
                locale={locale}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
              >
                {msg(common, "shop_now", "Shop")}
              </LocaleLink>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <LocaleSwitcher locale={locale} languages={languages} />
              <LocaleLink
                to="/collections/all"
                locale={locale}
                className="hidden items-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:inline-flex"
              >
                Browse catalog
              </LocaleLink>
            </div>
          </div>
        </div>
      </header>

      <main className="relative flex-1 pb-24 pt-8 sm:pt-10">{children}</main>

      <footer className="relative mt-auto border-t border-black/6">
        <div className="page-frame py-12 sm:py-16">
          <div className="glass-panel overflow-hidden">
            <div className="grid gap-10 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Built for docs
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">
                  A premium Hydrogen example for localized commerce flows.
                </h3>
                <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
                  {msg(
                    common,
                    "hero_subtitle",
                    "Discover our curated collection of products",
                  )}
                </p>
              </div>

              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Explore
                </p>
                <div className="mt-4 flex flex-col gap-3 text-sm text-slate-700">
                  <LocaleLink
                    to="/"
                    locale={locale}
                    className="transition-colors hover:text-slate-950"
                  >
                    Home
                  </LocaleLink>
                  <LocaleLink
                    to="/collections/all"
                    locale={locale}
                    className="transition-colors hover:text-slate-950"
                  >
                    Catalog
                  </LocaleLink>
                  <LocaleLink
                    to="/#collections"
                    locale={locale}
                    className="transition-colors hover:text-slate-950"
                  >
                    Featured collections
                  </LocaleLink>
                </div>
              </div>

              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Stack
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
                    {msg(footer, "built_with", "Built with")} modern storefront
                    primitives
                  </span>
                </div>
              </div>
            </div>

            <div className="soft-divider flex flex-col gap-3 px-6 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p>
                &copy; {new Date().getFullYear()} {storeName}.{" "}
                {msg(footer, "all_rights_reserved", "All rights reserved.")}
              </p>
              <p>Path-based locales, clean merchandising, docs-ready UI.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
