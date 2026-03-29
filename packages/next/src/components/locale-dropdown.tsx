"use client";

import {
  LocaleDropdownBase,
  type LocaleDropdownBaseProps,
  type LocaleDropdownRenderContext,
  type LocaleDropdownTriggerContext,
} from "@better-i18n/core/react";
import { useSetLocale, useManifestLanguages } from "../client.js";
import type { I18nConfig } from "../types.js";

export type { LocaleDropdownRenderContext, LocaleDropdownTriggerContext };

export interface LocaleDropdownProps
  extends Omit<LocaleDropdownBaseProps, "locale" | "languages" | "onLocaleChange" | "isLoading"> {
  /** Better i18n config object (from `createI18n()`). */
  config: I18nConfig;
  /** Current locale — pass from `getLocale()` in your Server Component or layout. */
  locale: string;
  /**
   * Pre-fetched language list. When provided, skips the client-side manifest fetch.
   * Recommended: pass from `getLanguages()` in your Server Component for zero loading flash.
   */
  languages?: LocaleDropdownBaseProps["languages"];
}

/**
 * Styled locale dropdown for Next.js with cookie-based locale switching.
 *
 * Uses `useSetLocale()` for locale changes (sets cookie + calls `router.refresh()`)
 * and `useManifestLanguages()` for the language list (with optional server pre-fetch).
 *
 * @example
 * ```tsx
 * // app/layout.tsx (Server Component)
 * import { getLocale, getLanguages } from "@better-i18n/next/server";
 * import { LocaleDropdown } from "@better-i18n/next/client";
 * import { i18n } from "@/i18n";
 *
 * export default async function Layout({ children }) {
 *   const locale = await getLocale();
 *   const languages = await getLanguages(i18n);
 *   return (
 *     <html>
 *       <body>
 *         <LocaleDropdown config={i18n} locale={locale} languages={languages} />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function LocaleDropdown({
  config,
  locale,
  languages: languagesProp,
  ...props
}: LocaleDropdownProps) {
  const setLocale = useSetLocale(config);
  const { languages: fetchedLanguages, isLoading } = useManifestLanguages(config);

  const languages = languagesProp ?? fetchedLanguages;
  const isReady = languagesProp ? true : !isLoading && languages.length > 0;

  return (
    <LocaleDropdownBase
      locale={locale}
      languages={languages}
      onLocaleChange={setLocale}
      isLoading={!isReady}
      {...props}
    />
  );
}
