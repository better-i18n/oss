import type { ReactNode } from "react";
import { Link, useParams } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";

/**
 * The two status pages — 500 (a route threw) and 404 (nothing here) — built from
 * one shell so they cannot drift apart.
 *
 * Why this file matters beyond looks: with no `defaultErrorComponent`, a throwing
 * route renders TanStack's built-in CatchBoundary ("Something went wrong! / Show
 * Error") inside an ordinary **HTTP 200** document with no robots directive. A
 * crawler cannot tell that apart from content, so it indexes it — which is exactly
 * what happened to better-i18n.com in Google's results. Both pages here emit
 * `noindex, nofollow`; React 19 hoists a `<meta>` rendered in a component into
 * `<head>`, so the directive lands in the SSR/SSG HTML itself.
 *
 * Design follows the page grammar rather than inventing an "error look": one
 * `.section` container, eyebrow → heading → lede, the status numeral as quiet
 * display type (it labels the page without shouting), and a hairline list of real
 * destinations. The rows are separated by a single rule between them — a divider,
 * not a box around each item (rule/listed-items-are-not-cards).
 */

type Destination = {
  readonly label: string;
  readonly hint: string;
  readonly to?: "/$locale/" | "/$locale/features/" | "/$locale/changelog/" | "/$locale/blog/" | "/$locale/i18n/";
  readonly href?: string;
};

const DESTINATIONS: ReadonlyArray<Destination> = [
  { label: "Home", hint: "Product overview and pricing", to: "/$locale/" },
  { label: "Features", hint: "AI translation, Git sync, CDN delivery", to: "/$locale/features/" },
  { label: "i18n guides", hint: "Framework-by-framework setup", to: "/$locale/i18n/" },
  { label: "Changelog", hint: "What shipped recently", to: "/$locale/changelog/" },
  { label: "Documentation", hint: "SDK reference and API", href: "https://docs.better-i18n.com/" },
];

function StatusPage({
  status,
  eyebrow,
  title,
  lede,
  actions,
  detail,
}: {
  status: string;
  eyebrow: string;
  title: string;
  lede: string;
  actions?: ReactNode;
  detail?: string | null;
}) {
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";

  return (
    <>
      {/* Hoisted into <head> by React 19. This is the load-bearing line: a status
          page served at 200 with no directive is indexable. */}
      <meta name="robots" content="noindex, nofollow" />
      <title>{`${title} — Better I18N`}</title>

      <div className="section" style={{ paddingTop: 72, paddingBottom: 88 }}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-20">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <p
              aria-hidden
              className="mt-1 font-display font-medium tracking-[-0.03em] text-mist-200 tabular-nums"
              style={{ fontSize: "clamp(56px, 9vw, 96px)", lineHeight: 1 }}
            >
              {status}
            </p>
            <h1 className="section-h2 mt-2">{title}</h1>
            <p className="section-p mt-3 max-w-[48ch]">{lede}</p>

            {actions ? <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div> : null}

            {detail ? (
              <pre className="mt-8 max-w-full overflow-x-auto rounded-xl border border-black/[0.07] bg-mist-50 px-4 py-3 font-mono text-[12px] leading-[1.7] text-mist-700">
                {detail}
              </pre>
            ) : null}
          </div>

          {/* Where to go instead. Rows share one hairline between them; no row
              carries its own border or fill. */}
          <div>
            <p className="text-[11px] font-medium text-mist-400">Go somewhere useful</p>
            <ul className="mt-4">
              {DESTINATIONS.map((destination) => {
                const inner = (
                  <span className="flex items-start justify-between gap-4">
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium tracking-[-0.015em] text-mist-900">
                        {destination.label}
                      </span>
                      <span className="mt-0.5 block text-[12px] leading-5 text-mist-500">
                        {destination.hint}
                      </span>
                    </span>
                    <SpriteIcon
                      name="arrow-right"
                      className="mt-1 size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover/row:translate-x-0.5 group-hover/row:text-mist-600"
                    />
                  </span>
                );
                const rowClass =
                  "group/row block border-b border-black/[0.07] py-3.5 first:border-t first:border-black/[0.07]";
                return (
                  <li key={destination.label}>
                    {destination.to ? (
                      <Link to={destination.to} params={{ locale: currentLocale }} className={rowClass}>
                        {inner}
                      </Link>
                    ) : (
                      <a
                        href={destination.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={rowClass}
                      >
                        {inner}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

/** 500 — a route threw. Wired as `defaultErrorComponent` in src/router.tsx. */
export function ErrorPage({ error, reset }: ErrorComponentProps) {
  const { locale } = useParams({ strict: false });
  const message = error instanceof Error ? error.message : String(error ?? "");

  return (
    <StatusPage
      status="500"
      eyebrow="Error"
      title="This page failed to load."
      lede="Usually a request that timed out on our side, not something you did. Reloading is the fastest fix — if it keeps happening, tell us and we will look at it."
      // The error text is development-only: in production it is noise to the
      // visitor and a small information leak (paths, upstream URLs) to everyone.
      detail={import.meta.env.DEV && message ? message : null}
      actions={
        <>
          <button type="button" onClick={reset} className="btn btn-dark btn-lg">
            Try again
            <SpriteIcon name="arrow-right" className="size-4" />
          </button>
          <Link to="/$locale/" params={{ locale: locale || "en" }} className="learn-more">
            Back to home
          </Link>
          <a href="mailto:tech@better-i18n.com" className="learn-more">
            Report it
          </a>
        </>
      }
    />
  );
}

/** 404 — the route matched nothing. Wired as `notFoundComponent` in __root.tsx. */
export function NotFoundPage({
  title,
  lede,
  backHome,
}: {
  title: string;
  lede: string;
  backHome: string;
}) {
  const { locale } = useParams({ strict: false });

  return (
    <StatusPage
      status="404"
      eyebrow="Not found"
      title={title}
      lede={lede}
      actions={
        <Link to="/$locale/" params={{ locale: locale || "en" }} className="btn btn-dark btn-lg">
          {backHome}
          <SpriteIcon name="arrow-right" className="size-4" />
        </Link>
      }
    />
  );
}
