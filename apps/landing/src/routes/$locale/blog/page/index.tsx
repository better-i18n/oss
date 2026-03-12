import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Route guard: /{locale}/blog/page/ (no page number) → 301 redirect to /{locale}/blog/
 * Without this, the bare /blog/page/ URL would fall through to $slug.tsx
 * and try to look up slug="page", returning a 404.
 */
export const Route = createFileRoute("/$locale/blog/page/")({
  loader: ({ params }) => {
    throw redirect({
      to: "/$locale/blog",
      params: { locale: params.locale },
      statusCode: 301,
    });
  },
});
