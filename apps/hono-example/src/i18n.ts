import { createServerI18n } from "@better-i18n/server";

/**
 * Singleton i18n instance — created once at module scope so that
 * the underlying TtlCache is shared across all requests.
 */
export const i18n = createServerI18n({
  project: "better-i18n/example",
  defaultLocale: "en",
});
