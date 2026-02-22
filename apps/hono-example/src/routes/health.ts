import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import type { Translator } from "@better-i18n/server";

const HealthResponseSchema = z.object({
  status: z.literal("ok"),
  locale: z.string().openapi({ example: "tr" }),
  timestamp: z.string().openapi({ example: "2026-02-22T12:00:00.000Z" }),
});

const route = createRoute({
  method: "get",
  path: "/health",
  summary: "Health check",
  description: "Returns server status and the detected locale from Accept-Language header.",
  responses: {
    200: {
      content: { "application/json": { schema: HealthResponseSchema } },
      description: "Server is healthy",
    },
  },
});

export const healthRoute = new OpenAPIHono<{
  Variables: { locale: string; t: Translator };
}>().openapi(route, (c) => {
  const locale = c.get("locale");
  return c.json({ status: "ok" as const, locale, timestamp: new Date().toISOString() });
});
