/**
 * Cloudflare Pages middleware: runs in front of every static file in `out/`.
 *
 * `_headers` cannot match on hostname, so the pages.dev duplicate has to be
 * handled here. `wrangler pages deploy out` (run from apps/docs) bundles this
 * `functions/` directory automatically. Rules live in `src/lib/seo-host.ts`.
 */
import { decideForHost } from "../src/lib/seo-host";

type Context = {
  request: Request;
  next: () => Promise<Response>;
};

export async function onRequest(context: Context): Promise<Response> {
  const decision = decideForHost(new URL(context.request.url));

  if (decision.action === "redirect") {
    return new Response(null, {
      status: 301,
      headers: { Location: decision.location, "X-Robots-Tag": "noindex" },
    });
  }

  const response = await context.next();
  if (decision.action === "pass") return response;

  // Static asset responses have immutable headers; copy before mutating.
  const copy = new Response(response.body, response);
  copy.headers.set("X-Robots-Tag", "noindex");
  return copy;
}
