/** BCP 47 locale tag: 2–8 alpha, optional subtags separated by hyphens. */
const LOCALE_RE = /^[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{1,8})*$/;

/**
 * Read the persisted locale from a browser cookie.
 *
 * Designed for non-React contexts where `useLocale()` isn't available —
 * auth clients, analytics, third-party SDK config, module-level singletons.
 *
 * Pairs with `@better-i18n/use-intl`'s `persistLocale` prop:
 * the provider writes the cookie, this function reads it back.
 *
 * Returns `null` on the server, when the cookie is missing, or when the
 * value doesn't look like a valid BCP 47 locale tag.
 *
 * @param cookieName - Cookie name to read (must match the `persistLocale` value)
 * @returns The locale string (e.g. `"tr"`, `"pt-BR"`) or `null`
 *
 * @example
 * ```ts
 * // auth-client.ts (module-level, no React)
 * import { getPersistedLocale } from "@better-i18n/core";
 *
 * export const authClient = createAuthClient({
 *   fetchOptions: {
 *     headers: {
 *       get "Accept-Language"() {
 *         return getPersistedLocale("preferred-locale") ?? "en";
 *       },
 *     },
 *   },
 * });
 * ```
 *
 * @example
 * ```ts
 * // analytics.ts
 * import { getPersistedLocale } from "@better-i18n/core";
 *
 * analytics.identify({ locale: getPersistedLocale("preferred-locale") });
 * ```
 */
export function getPersistedLocale(cookieName: string): string | null {
  if (typeof document === "undefined") return null;
  const safeName = cookieName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${safeName}=([^;]*)`),
  );
  const value = match?.[1]?.trim() ?? null;
  if (!value || !LOCALE_RE.test(value)) return null;
  return value;
}
