import { createFileRoute } from "@tanstack/react-router";

/**
 * POST /api/client-error — a sink for browser-side failures.
 *
 * Why this exists: the landing captured **nothing** on the client. No
 * `window.onerror`, no `unhandledrejection` handler, no error SDK. So an
 * intermittent failure — the kind that shows up as
 * `{"status":500,"unhandled":true,"message":"HTTPError"}` once in a while — left
 * no trace anywhere: not in the CF logs (the request succeeded), not in the SSR
 * HTML, not in any dashboard. It could only be reported by a human who happened
 * to see it, with no URL, no stack and no timestamp.
 *
 * This endpoint does one thing: write a structured line that `wrangler tail`
 * (production) or the dev terminal will show, so the next occurrence is
 * attributable. It stores nothing, so there is no retention question.
 *
 * Deliberately minimal on what it accepts: a small, fixed set of fields, hard
 * body cap, and no echo of the payload in the response. An open logging endpoint
 * is a log-spam vector, so the client side also throttles (see
 * ClientErrorReporter).
 */

const MAX_BODY_BYTES = 4_000;

type ClientErrorPayload = {
  readonly message?: unknown;
  readonly source?: unknown;
  readonly stack?: unknown;
  readonly url?: unknown;
  readonly kind?: unknown;
};

/** Trim to a string of at most `max` chars, or undefined when not a string. */
function str(value: unknown, max: number): string | undefined {
  return typeof value === "string" && value.length > 0 ? value.slice(0, max) : undefined;
}

export const Route = createFileRoute("/api/client-error")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Reject anything oversized before parsing — a body cap is cheaper than
        // a JSON parse, and this route is unauthenticated by design.
        const declared = Number(request.headers.get("content-length") ?? "0");
        if (declared > MAX_BODY_BYTES) {
          return new Response(null, { status: 413 });
        }

        let payload: ClientErrorPayload;
        try {
          const raw = await request.text();
          if (raw.length > MAX_BODY_BYTES) return new Response(null, { status: 413 });
          payload = JSON.parse(raw) as ClientErrorPayload;
        } catch {
          return new Response(null, { status: 400 });
        }

        const entry = {
          at: new Date().toISOString(),
          kind: str(payload.kind, 32) ?? "error",
          message: str(payload.message, 300) ?? "(no message)",
          url: str(payload.url, 300),
          source: str(payload.source, 300),
          stack: str(payload.stack, 1_200),
          ua: str(request.headers.get("user-agent"), 200),
          country: str(request.headers.get("cf-ipcountry"), 8),
        };

        // One line, one JSON object: greppable in `wrangler tail`.
        console.error(`[client-error] ${JSON.stringify(entry)}`);

        // 204: the reporter is fire-and-forget and must never retry or surface
        // anything to the visitor.
        return new Response(null, { status: 204 });
      },
    },
  },
});
