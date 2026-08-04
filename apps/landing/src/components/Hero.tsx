import { lazy, Suspense } from "react";
import { CUSTOMERS, type Customer } from "@/lib/customers";
import { useT } from "@/lib/i18n";
import { Link, useParams } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { Frame, Section } from "@/components/ui/page";

// The hero panel shows a static replica of the translation editor (see
// app-preview/AppPreview.tsx) instead of the interactive AI drawer: the drawer
// demonstrated one feature, the editor screen shows what the product IS.
// Still lazy-loaded so the hero text + CTA hydrate first and the LCP candidate
// (h1) doesn't wait on the panel's parse/execute. See BETTER-265.
const LazyAppPreview = lazy(() =>
  import("./app-preview").then((m) => ({ default: m.AppPreview })),
);

const PanelFallback = () => (
  <div aria-hidden="true" className="h-full w-full" />
);

/**
 * Hero — flat, centred, on white.
 *
 * The previous hero was a full-bleed gradient "wallpaper" with white text and
 * the product demo absolutely positioned off the right edge. That reads as a
 * different product from every section below it. This version follows the page
 * grammar: the headline sits in the frame, and the product appears *under* it
 * as a framed panel (rule/white-page-hairline-separation, DESIGN-DECISIONS.md).
 *
 * The email capture survives the restyle — it is a conversion mechanism, not
 * decoration — but it is now a hairline field on white instead of a glass pill.
 */
export default function Hero() {
  const t = useT("hero");
  const { locale } = useParams({ strict: false });

  return (
    <>
      <Section labelledBy="hero-title" style={{ paddingTop: 72, paddingBottom: 0 }}>
        <div className="flex flex-col items-start gap-4 sm:items-center">
          <Link
            to="/$locale/changelog/"
            params={{ locale: locale || "en" }}
            className="inline-flex items-center gap-x-2.5 rounded-sm border border-black/[0.06] bg-mist-50 px-2.5 py-1 text-xs text-mist-600 transition-colors hover:border-black/[0.1]"
          >
            <span>{t("badge")}</span>
            <span className="h-3 w-px bg-black/[0.08]" />
            <span className="inline-flex items-center gap-1 font-medium text-mist-900">
              {t("learnMore")}
              <SpriteIcon name="chevron-right" className="size-3.5" />
            </span>
          </Link>

          <h1
            id="hero-title"
            className="max-w-[20ch] font-medium leading-[1.08] tracking-[-0.03em] text-mist-950 sm:text-center"
            style={{ fontSize: "clamp(36px, 4.5vw, 52px)", textWrap: "balance" }}
          >
            {t("title")}
          </h1>

          <p
            className="max-w-[44ch] leading-relaxed text-mist-600 sm:text-center"
            style={{ fontSize: "var(--text-sub)" }}
          >
            {t("subtitle")}
          </p>

          {/* Email capture — hairline field, dark submit. Same job, quiet register. */}
          <div className="mt-2 flex w-full max-w-[400px] items-center rounded-[10px] border border-black/[0.12] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors focus-within:border-black/25">
            <input
              type="email"
              aria-label={t("inputPlaceholder")}
              placeholder={t("inputPlaceholder")}
              className="min-w-0 flex-1 bg-transparent py-2.5 pl-4 text-sm text-mist-950 placeholder:text-mist-400 focus:outline-none"
            />
            <button type="submit" className="btn btn-dark m-1 shrink-0">
              {t("cta")}
              <SpriteIcon name="arrow-right" className="size-4" />
            </button>
          </div>
        </div>
      </Section>

      {/* Product panel — the hero's proof, framed rather than floated off-edge.
          Geometry matches the reference implementation: 18px radius, a single
          hairline, and one deep soft shadow doing all the elevation work. */}
      <Frame style={{ paddingTop: 32, paddingBottom: 48 }}>
        <div className="overflow-hidden rounded-[18px] border border-black/[0.08] bg-white shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12)]">
          <div className="h-[620px] max-[900px]:h-[520px]">
            <Suspense fallback={<PanelFallback />}>
              <LazyAppPreview />
            </Suspense>
          </div>
        </div>
      </Frame>

      {/* Trust band — dot-grid ground, label on the left, two rows drifting in
          opposite directions. Full-bleed inside the frame, so `!p-0` and the
          band supplies its own padding (rule/one-container exception). */}
      <Frame style={{ paddingTop: 8, paddingBottom: 40 }}>
        <div className="logos-card">
          <svg className="logos-dots" width="100%" height="100%" aria-hidden="true">
            <defs>
              <pattern
                id="dots-trust"
                x="-1"
                y="-1"
                width="12"
                height="12"
                patternUnits="userSpaceOnUse"
              >
                <rect x="1" y="1" width="2" height="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect fill="url(#dots-trust)" width="100%" height="100%" />
          </svg>

          <div className="logos-content">
            <div className="logos-layout">
              <p className="logos-label">{t("trustedBy")}</p>

              <div className="logo-rows">
                {LOGO_ROWS.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`logo-grid ${rowIndex === 1 ? "logo-row--reverse" : ""}`}
                    // The first row carries the accessible name; the second is a
                    // continuation of the same list, not a new landmark.
                    aria-label={rowIndex === 0 ? "Trusted by leading companies" : undefined}
                    aria-hidden={rowIndex === 1 ? true : undefined}
                  >
                    {/* Two identical tracks make the loop seamless; each track
                        repeats the row so a short row still fills 1160px. */}
                    {[0, 1].map((trackIndex) => (
                      <div key={trackIndex} className="logo-track">
                        {[...row, ...row].map((logo, idx) => (
                          <TrustLogo key={`${logo.name}-${trackIndex}-${idx}`} logo={logo} />
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Frame>
    </>
  );
}

/**
 * One customer in the trust band.
 *
 * Two shapes, because customers publish two kinds of asset: a wordmark (use it
 * as-is) or a square mark only (pair it with the name set in our own type). A
 * bare glyph would leave half the wall unreadable, which is the opposite of what
 * a logo wall is for.
 */
function TrustLogo({ logo }: { logo: Customer }) {
  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex h-7 shrink-0 items-center justify-center grayscale transition-opacity hover:opacity-100 ${logo.wordmark ? "opacity-60" : "opacity-80"}`}
    >
      {logo.wordmark ? (
        <img
          src={logo.wordmark}
          alt={`${logo.name} — Better I18N customer`}
          width={logo.width ?? 112}
          height={logo.height ?? 20}
          loading="lazy"
          draggable={false}
          className="w-auto"
          style={{ height: logo.height ?? 20 }}
        />
      ) : (
        <span className="logo-lockup">
          {/* No mark at all → wordmark only. Never render an <img> with an
              undefined src, which is a request to the current URL. */}
          {logo.mark && (
            <img
              src={logo.mark}
              alt=""
              width={logo.markSize ?? 20}
              height={logo.markSize ?? 20}
              loading="lazy"
              draggable={false}
              className="logo-lockup-mark"
              style={{
                width: logo.markSize ?? 20,
                height: logo.markSize ?? 20,
                ...(logo.invert ? { filter: "invert(1)" } : null),
              }}
            />
          )}
          <span className="logo-lockup-name">{logo.name}</span>
        </span>
      )}
    </a>
  );
}

/* Two rows, not one marquee: a single row of fourteen means most of them are
   off-screen most of the time.

   The list itself comes from `lib/customers.ts` rather than being repeated here.
   It used to be repeated, which is the drift that file was created to end — its
   own docstring warned about exactly this ("Duplicating it meant the CTA row
   drifted... while the band had thirteen entries"), and the band was still the
   copy that had not migrated. Adding Aceware to the shared list changed the
   rotating wall and left this band alone, which is how the duplication surfaced.
   Rows are derived by halving, so the next customer lands in both surfaces from
   one edit. */
const HALF = Math.ceil(CUSTOMERS.length / 2);
const LOGO_ROWS: ReadonlyArray<ReadonlyArray<Customer>> = [
  CUSTOMERS.slice(0, HALF),
  CUSTOMERS.slice(HALF),
];
