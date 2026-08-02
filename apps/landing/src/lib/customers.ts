/**
 * The customers we can name, in one place.
 *
 * Two surfaces need this list — the hero trust band and the closing CTA — and a
 * third (case studies, #195) is coming. Duplicating it meant the CTA row drifted
 * to five hardcoded `<a><img></a>` blocks while the band had thirteen entries
 * with proper marks.
 *
 * `wordmark` is used alone; `mark` is paired with the name set in our own type,
 * because half of these brands publish only a square glyph. Several publish a
 * white-on-dark logo only, so their SVG fills are bound to `currentColor` in
 * public/logos/customers/ — see rule/name-a-thing-with-its-mark.
 */

export type Customer = {
  readonly name: string;
  readonly href: string;
  /** Wordmark asset — rendered on its own. */
  readonly wordmark?: string;
  /** Square mark — rendered next to `name`. */
  readonly mark?: string;
  readonly width?: number;
  /** Optical height override, px (default 20) for wordmarks that read heavy. */
  readonly height?: number;
  /** Mark size override, px (default 20) for full-bleed artwork. */
  readonly markSize?: number;
  /** White-on-dark artwork: invert to get a dark glyph on transparent. */
  readonly invert?: boolean;
};

export const CUSTOMERS: ReadonlyArray<Customer> = [
  { name: "Carna", href: "http://carna.ai/", wordmark: "/carna.webp" },
  { name: "Nomad", href: "https://hellonomad.app/", mark: "/logos/customers/nomadwork.svg" },
  { name: "Hellospace", href: "https://hellospace.world/", wordmark: "/hellospace.webp" },
  { name: "Cloudflare", href: "https://www.cloudflare.com/", wordmark: "/cloudflare.webp" },
  { name: "Masraff", href: "https://masraff.ai", mark: "/logos/customers/masraff.svg" },
  { name: "Helpway", href: "https://helpway.ai/", mark: "/logos/customers/helpway.svg" },
  { name: "Riuve", href: "https://riuve.com/", mark: "/logos/customers/riuve.png", invert: true },
  { name: "Safa", href: "https://getsafa.com/", mark: "/logos/customers/safa.svg" },
  { name: "Modus", href: "https://modus.builders/", wordmark: "/logos/customers/modus.svg", width: 88, height: 17 },
  { name: "Rivo", href: "https://hellorivo.com/", mark: "/logos/customers/rivo.png", invert: true, markSize: 19 },
  { name: "Flof", href: "https://flof.ai/en/", mark: "/logos/customers/flof.svg" },
  { name: "BoostYourApp", href: "https://boostyour.app/", mark: "/logos/customers/boostyour.svg" },
  { name: "Z5K", href: "https://z5k.run/", mark: "/logos/customers/z5k.svg", markSize: 19 },
];

/** The subset used where space is tight (closing CTA): the most recognisable first. */
export const CTA_CUSTOMERS: ReadonlyArray<Customer> = [
  CUSTOMERS[3]!, // Cloudflare
  CUSTOMERS[0]!, // Carna
  CUSTOMERS[2]!, // Hellospace
  CUSTOMERS[5]!, // Helpway
  CUSTOMERS[4]!, // Masraff
  CUSTOMERS[8]!, // Modus
];
