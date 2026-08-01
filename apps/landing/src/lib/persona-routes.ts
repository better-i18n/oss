/**
 * Typed `to` values for the persona pages (`/for-*`).
 *
 * `CmsPersonaPage` links to sibling personas using a slug that comes from the
 * CMS: `to={`/$locale/${persona.slug}`}`. That never type-checks (TanStack types
 * `to` as a union of real routes) and, worse, the CMS still returns personas
 * whose route was archived — `for-marketers`, `for-designers`, `for-gaming` and
 * friends live in `src/_archived-routes/`, so those links shipped as 404s.
 *
 * This map is the single place a persona slug becomes a route. A slug with no
 * entry has no page, so the caller skips the card rather than rendering a dead
 * link (see `personaRoute`).
 *
 * Keep in sync with `src/routes/$locale/for-*.tsx`.
 */

export const PERSONA_ROUTES = {
  "for-agencies": "/$locale/for-agencies/",
  "for-developers": "/$locale/for-developers/",
  "for-ecommerce": "/$locale/for-ecommerce/",
  "for-enterprises": "/$locale/for-enterprises/",
  "for-product-teams": "/$locale/for-product-teams/",
  "for-saas": "/$locale/for-saas/",
  "for-startups": "/$locale/for-startups/",
  "for-translators": "/$locale/for-translators/",
} as const;

export type PersonaRoute = (typeof PERSONA_ROUTES)[keyof typeof PERSONA_ROUTES];

/** The route for a persona slug, or `undefined` when that persona has no page. */
export function personaRoute(slug: string): PersonaRoute | undefined {
  return PERSONA_ROUTES[slug as keyof typeof PERSONA_ROUTES];
}
