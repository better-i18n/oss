/**
 * Typed `to` values for the /i18n/* guide pages.
 *
 * Several components build guide links from a slug that comes from data (CMS
 * siblings, a framework list): `to={`/$locale/i18n/${slug}`}`. TanStack Router
 * types `to` as a union of real routes, so a template literal never type-checks —
 * and worse, a slug with no matching route ships a dead link that only shows up
 * as a 404 in production. This map is the single place where a slug becomes a
 * route, so an unknown slug degrades to the guides hub instead of 404ing.
 *
 * Keep in sync with the files in src/routes/$locale/i18n/.
 */

export const I18N_GUIDE_ROUTES = {
  android: "/$locale/i18n/android/",
  angular: "/$locale/i18n/angular/",
  "best-library": "/$locale/i18n/best-library/",
  "best-tms": "/$locale/i18n/best-tms/",
  "cli-code-scanning": "/$locale/i18n/cli-code-scanning/",
  "complete-guide": "/$locale/i18n/complete-guide/",
  "content-localization": "/$locale/i18n/content-localization/",
  "cultural-adaptation": "/$locale/i18n/cultural-adaptation/",
  django: "/$locale/i18n/django/",
  doctor: "/$locale/i18n/doctor/",
  expo: "/$locale/i18n/expo/",
  flutter: "/$locale/i18n/flutter/",
  "for-developers": "/$locale/i18n/for-developers/",
  "international-seo": "/$locale/i18n/international-seo/",
  ios: "/$locale/i18n/ios/",
  javascript: "/$locale/i18n/javascript/",
  "localization-software": "/$locale/i18n/localization-software/",
  "localization-vs-internationalization":
    "/$locale/i18n/localization-vs-internationalization/",
  "multilingual-seo": "/$locale/i18n/multilingual-seo/",
  nextjs: "/$locale/i18n/nextjs/",
  nuxt: "/$locale/i18n/nuxt/",
  react: "/$locale/i18n/react/",
  "react-native-localization": "/$locale/i18n/react-native-localization/",
  "remix-hydrogen": "/$locale/i18n/remix-hydrogen/",
  ruby: "/$locale/i18n/ruby/",
  server: "/$locale/i18n/server/",
  svelte: "/$locale/i18n/svelte/",
  "software-localization": "/$locale/i18n/software-localization/",
  "tanstack-start": "/$locale/i18n/tanstack-start/",
  "translation-management-system": "/$locale/i18n/translation-management-system/",
  "translation-solutions": "/$locale/i18n/translation-solutions/",
  vite: "/$locale/i18n/vite/",
  vue: "/$locale/i18n/vue/",
  "website-localization": "/$locale/i18n/website-localization/",
  "website-translation": "/$locale/i18n/website-translation/",
} as const;

export type I18nGuideSlug = keyof typeof I18N_GUIDE_ROUTES;
export type I18nGuideRoute =
  | (typeof I18N_GUIDE_ROUTES)[I18nGuideSlug]
  | "/$locale/i18n/";

/** Resolve a data-provided slug to a real route; unknown slugs go to the hub. */
export function i18nGuideRoute(slug: string): I18nGuideRoute {
  return I18N_GUIDE_ROUTES[slug as I18nGuideSlug] ?? "/$locale/i18n/";
}
