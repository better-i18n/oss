import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { betterI18n } from "@better-i18n/server/hono";
import type { Translator } from "@better-i18n/server";
import { i18n } from "./i18n.js";
import { healthRoute } from "./routes/health.js";
import { usersRoute } from "./routes/users.js";
import { languagesRoute } from "./routes/languages.js";

const app = new OpenAPIHono<{
  Variables: { locale: string; t: Translator };
}>();

// Detect locale + inject `locale` and `t` into every request context
app.use("*", betterI18n(i18n));

// Routes
app.route("/", healthRoute);
app.route("/", usersRoute);
app.route("/", languagesRoute);

// OpenAPI spec
app.doc("/doc", {
  openapi: "3.1.0",
  info: { title: "better-i18n Example API", version: "1.0.0" },
});

// Scalar API reference UI
app.get(
  "/scalar",
  apiReference({ url: "/doc", pageTitle: "better-i18n Example API" }),
);

console.log("🌍 better-i18n example API running on http://localhost:3002");
console.log("   Scalar UI: http://localhost:3002/scalar");

export default { port: 3002, fetch: app.fetch };
