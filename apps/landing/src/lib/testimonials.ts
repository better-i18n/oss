/**
 * The people behind the quotes, in one place.
 *
 * The quotes themselves live in the `testimonials` namespace on the CDN, keyed
 * by position (`1.quote`, `1.name`, `1.title`) so they can be translated. What
 * cannot be translated — the person's photo and the link to their company —
 * stayed hardcoded inside `Testimonials.tsx`, which meant it existed only on the
 * home page. The four pillar pages that mount `<PageTestimonial />`
 * (`/content/`, `/what-is/`, `/analytics/`, `/i18n/react/`) all rendered the
 * quote with no face at all, because `avatar` is optional and every call site
 * had forgotten it.
 *
 * Same fix as `src/lib/customers.ts`: one list, indexed the way the CDN keys
 * are indexed, so a new surface picks up the photo by construction.
 *
 * The photos are real people who agreed to be quoted — never fill a missing one
 * with a generated face or a stock portrait. A quote with no photo is honest; a
 * quote with an invented one is not.
 */

export type TestimonialPerson = {
  /** Position in the `testimonials` namespace: `${index}.quote` and friends. */
  readonly index: 1 | 2 | 3 | 4;
  /** Self-hosted portrait — external hosts are blocked by our CSP. */
  readonly image: string;
  /** Their company, linked from the home-page caption. */
  readonly url: string;
  /** English name, for `alt` text and React keys — the CDN supplies the shown one. */
  readonly name: string;
};

export const TESTIMONIAL_PEOPLE: ReadonlyArray<TestimonialPerson> = [
  { index: 1, name: "Samet Selcuk", image: "/comments/samet.webp", url: "https://hellospace.world/" },
  { index: 2, name: "Tevfik Can Karanfil", image: "/comments/tcan.webp", url: "http://carna.ai/" },
  { index: 3, name: "Eray Gündoğmuş", image: "/comments/eray.webp", url: "https://aceware.io/" },
  { index: 4, name: "Arhun Hınçalan", image: "/comments/arhun.webp", url: "https://masraff.ai" },
];

/** The portrait for a quote position, or `undefined` if we have no photo of them. */
export function testimonialAvatar(index: number): string | undefined {
  return TESTIMONIAL_PEOPLE.find((p) => p.index === index)?.image;
}
