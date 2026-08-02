import { useEffect } from "react";

/**
 * Reports browser-side failures to /api/client-error.
 *
 * The gap this closes: nothing on this site observed the client. An intermittent
 * error — the `{"status":500,"unhandled":true,"message":"HTTPError"}` kind — was
 * only ever seen by whoever happened to be looking, with no URL and no stack, so
 * it could not be attributed or fixed. Now each occurrence writes one greppable
 * line that `wrangler tail` shows.
 *
 * Constraints, because an error reporter is itself a way to break a page:
 *  - **Throttled**: at most 3 reports per page view. A render loop that throws
 *    every frame must not turn into a request loop.
 *  - **Deduped**: the same message is reported once.
 *  - **Silent**: `sendBeacon` where available, and every failure is swallowed —
 *    the reporter can never surface anything to the visitor or throw itself.
 *  - **Filtered**: opaque cross-origin script errors ("Script error." with no
 *    detail) are browser noise from extensions, not our bugs.
 *  - **No PII**: message, stack, current URL. No inputs, no cookies, no ids.
 */

const MAX_REPORTS_PER_PAGE = 3;
const ENDPOINT = "/api/client-error";

export function ClientErrorReporter() {
  useEffect(() => {
    let sent = 0;
    const seen = new Set<string>();

    const report = (kind: string, message: string, source?: string, stack?: string) => {
      if (sent >= MAX_REPORTS_PER_PAGE) return;
      // "Script error." with no source is what a cross-origin extension throw
      // looks like; there is nothing actionable in it.
      if (!message || (message === "Script error." && !source)) return;
      const key = `${kind}:${message}`;
      if (seen.has(key)) return;
      seen.add(key);
      sent += 1;

      const body = JSON.stringify({
        kind,
        message: message.slice(0, 300),
        source: source?.slice(0, 300),
        stack: stack?.slice(0, 1_200),
        url: window.location.href.slice(0, 300),
      });

      try {
        if (navigator.sendBeacon) {
          // Survives the page being torn down, which is exactly when errors fire.
          navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
          return;
        }
        void fetch(ENDPOINT, {
          method: "POST",
          body,
          headers: { "content-type": "application/json" },
          keepalive: true,
        }).catch(() => {});
      } catch {
        /* Reporting must never become the error. */
      }
    };

    const onError = (event: ErrorEvent) => {
      report(
        "error",
        event.message,
        event.filename ? `${event.filename}:${event.lineno}:${event.colno}` : undefined,
        event.error instanceof Error ? event.error.stack : undefined,
      );
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? `${reason.name}: ${reason.message}`
          : typeof reason === "string"
            ? reason
            : (() => {
                // A rejected fetch wrapper often rejects with a plain object —
                // `{status, unhandled, message}` is exactly that shape, and
                // stringifying it is the only way to keep the detail.
                try {
                  return JSON.stringify(reason)?.slice(0, 300) ?? "unknown rejection";
                } catch {
                  return "unknown rejection";
                }
              })();
      report(
        "unhandledrejection",
        message,
        undefined,
        reason instanceof Error ? reason.stack : undefined,
      );
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
