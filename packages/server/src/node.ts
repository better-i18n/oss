import type { IncomingHttpHeaders } from "node:http";
import type { ServerI18n, Translator } from "./types.js";

/**
 * Convert Node.js `IncomingHttpHeaders` (from `http.IncomingMessage`) to a
 * Web Standards `Headers` object.
 *
 * This mirrors the pattern used by better-auth's `fromNodeHeaders()` utility,
 * enabling the framework-agnostic `ServerI18n` API to work in Express, Fastify,
 * Koa, and any other Node.js HTTP server.
 *
 * @example
 * ```ts
 * import { fromNodeHeaders } from "@better-i18n/server/node";
 *
 * // Fastify / Koa — manual usage
 * const headers = fromNodeHeaders(req.headers);
 * const locale = await i18n.detectLocaleFromHeaders(headers);
 * ```
 */
export function fromNodeHeaders(nodeHeaders: IncomingHttpHeaders): Headers {
  const headers = new Headers();

  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (value === undefined) continue;
    headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  return headers;
}

/**
 * Express/Connect-compatible middleware that injects `req.locale` and `req.t`
 * into every request.
 *
 * @example
 * ```ts
 * import express from "express";
 * import { betterI18nMiddleware } from "@better-i18n/server/node";
 * import { i18n } from "./i18n"; // createServerI18n singleton
 *
 * const app = express();
 * app.use(betterI18nMiddleware(i18n));
 *
 * app.get("/users/:id", (req, res) => {
 *   res.json({ error: req.t("errors.notFound") });
 * });
 * ```
 *
 * TypeScript augmentation (add to a .d.ts file in your project):
 * ```ts
 * import { Translator } from "@better-i18n/server";
 * declare global {
 *   namespace Express {
 *     interface Request {
 *       locale: string;
 *       t: Translator;
 *     }
 *   }
 * }
 * ```
 */
export function betterI18nMiddleware(i18n: ServerI18n) {
  return async (req: any, _res: any, next: () => void) => {
    const headers = fromNodeHeaders(req.headers as IncomingHttpHeaders);
    const locale = await i18n.detectLocaleFromHeaders(headers);
    const t = await i18n.getTranslator(locale);

    req.locale = locale;
    req.t = t;

    next();
  };
}

export type { Translator };
