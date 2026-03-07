import { createRemixI18n } from "@better-i18n/remix";

/**
 * Better i18n singleton — shared across all requests.
 * The underlying TtlCache avoids redundant CDN fetches.
 */
export const i18n = createRemixI18n({
  project: "better-i18n/hydrogen-demo",
  defaultLocale: "en",
  debug: false,
});
