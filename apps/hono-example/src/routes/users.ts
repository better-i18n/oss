import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import type { Translator } from "@better-i18n/server";

// Minimal in-memory user store for demo purposes
const USERS: Record<string, { name: string }> = {
  "1": { name: "Alice" },
  "2": { name: "Bob" },
  "3": { name: "Charlie" },
};

const UserResponseSchema = z.object({
  id: z.string().openapi({ example: "1" }),
  greeting: z.string().openapi({ example: "Welcome, Alice!" }),
  locale: z.string().openapi({ example: "en" }),
});

const NotFoundSchema = z.object({
  error: z.string().openapi({ example: "User not found" }),
});

const getUserRoute = createRoute({
  method: "get",
  path: "/users/{id}",
  summary: "Get user by ID",
  description: "Returns a localized greeting for the user. Uses Accept-Language to detect locale.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "1" }) }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: UserResponseSchema } },
      description: "User found",
    },
    404: {
      content: { "application/json": { schema: NotFoundSchema } },
      description: "User not found",
    },
  },
});

export const usersRoute = new OpenAPIHono<{
  Variables: { locale: string; t: Translator };
}>().openapi(getUserRoute, (c) => {
  const { id } = c.req.valid("param");
  const t = c.get("t");
  const locale = c.get("locale");

  const user = USERS[id];
  if (!user) {
    return c.json({ error: t("users.notFound") }, 404);
  }

  return c.json({
    id,
    greeting: t("users.greeting", { name: user.name }),
    locale,
  });
});
