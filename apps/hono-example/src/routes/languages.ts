import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import type { Translator } from "@better-i18n/server";
import { i18n } from "../i18n.js";

const LanguageSchema = z.object({
  code: z.string().openapi({ example: "tr" }),
  name: z.string().openapi({ example: "Turkish" }),
});

const LanguagesResponseSchema = z.object({
  languages: z.array(LanguageSchema),
});

const route = createRoute({
  method: "get",
  path: "/i18n/languages",
  summary: "List available languages",
  description: "Returns all active languages fetched from the CDN manifest.",
  responses: {
    200: {
      content: { "application/json": { schema: LanguagesResponseSchema } },
      description: "Available languages",
    },
  },
});

export const languagesRoute = new OpenAPIHono<{
  Variables: { locale: string; t: Translator };
}>().openapi(route, async (c) => {
  const languages = await i18n.getLanguages();
  return c.json({
    languages: languages.map((l) => ({ code: l.code, name: l.name })),
  });
});
