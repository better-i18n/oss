import type { MiddlewareHandler } from "hono";
import type { ServerI18n, Translator } from "./types.js";

/**
 * Hono middleware that injects `locale` and `t` into the context variables.
 *
 * Hono uses Web Standards natively (`c.req.raw.headers` is a `Headers` object),
 * so no adapter layer is needed — unlike Express/Fastify.
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { betterI18n } from "@better-i18n/server/hono";
 * import { i18n } from "./i18n"; // createServerI18n singleton
 *
 * const app = new Hono<{
 *   Variables: {
 *     locale: string;
 *     t: Translator;
 *   }
 * }>();
 *
 * app.use("*", betterI18n(i18n));
 *
 * app.get("/users/:id", (c) => {
 *   const t = c.get("t");
 *   return c.json({ error: t("errors.notFound") }, 404);
 * });
 * ```
 */
export function betterI18n(i18n: ServerI18n): MiddlewareHandler {
  return async (c, next) => {
    // Hono is Web Standards — c.req.raw.headers is already a Headers object
    const locale = await i18n.detectLocaleFromHeaders(c.req.raw.headers);
    const t = await i18n.getTranslator(locale);

    c.set("locale", locale);
    c.set("t", t);

    await next();
  };
}

export type { Translator };
