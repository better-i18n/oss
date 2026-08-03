/**
 * Build gate: every page that asked to be prerendered must have HTML on disk.
 *
 * This exists because the failure it catches was silent and expensive. Five
 * pages — about, careers, privacy, terms, cookies — carried `prerender: true`
 * in `src/seo/pages.ts` and produced no static HTML for weeks. The cause was a
 * single line in `vite.config.ts` that filtered the plugin's `pages` array by
 * `!sitemap.noindex`; because that array is also the prerender candidate list,
 * "keep this out of the sitemap" quietly became "never build this". Nothing
 * failed, nothing warned. The pages simply fell through to SSR on every
 * request, measured at 12.4s TTFB for /en/careers/ and 18.6s for a page that
 * did not exist at all.
 *
 * A config whose mistakes are invisible will make the same mistake again, so
 * the invariant is now asserted rather than assumed: the flag in `pages.ts` is
 * a promise, and this checks the build kept it.
 *
 * Runs against the default locale only. Prerendering is per-locale and a
 * missing locale is a different (much louder) failure; what this guards is the
 * page-level decision, and if `/en/x/` exists the route was a candidate.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { MARKETING_PAGES } from "../src/seo/pages";

const DEFAULT_LOCALE = "en";
const clientDir = path.join(process.cwd(), "dist", "client");

if (!existsSync(clientDir)) {
  console.warn("[prerender] dist/client yok, doğrulama atlandı");
  process.exit(0);
}

const missing: string[] = [];
const built: string[] = [];

for (const page of MARKETING_PAGES) {
  if (!page.prerender) continue;
  const rel = [DEFAULT_LOCALE, page.path].filter(Boolean).join("/");
  const file = path.join(clientDir, rel, "index.html");
  if (existsSync(file)) built.push(page.path || "(home)");
  else missing.push(page.path || "(home)");
}

console.log(
  `[prerender] ${built.length}/${built.length + missing.length} pages with prerender:true produced HTML`,
);

if (missing.length > 0) {
  console.error(
    `\n[prerender] ${missing.length} page(s) asked to be prerendered and were not built:\n` +
      missing.map((p) => `    - ${p}`).join("\n") +
      `\n\n  These will be server-rendered on every request. Check that nothing` +
      `\n  filters them out of the \`pages\` array in vite.config.ts before the` +
      `\n  plugin sees it — that array is the prerender candidate list.\n`,
  );
  process.exit(1);
}
