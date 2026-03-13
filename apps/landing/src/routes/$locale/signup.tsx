import { createFileRoute, redirect } from "@tanstack/react-router";

// /signup ve /{locale}/signup → https://dash.better-i18n.com (301)
// Eski external linkler, CMS içindeki /signup referansları ve email
// kampanyalarından gelen trafiği dashboard'a yönlendirir.
export const Route = createFileRoute("/$locale/signup")({
  beforeLoad: () => {
    throw redirect({
      href: "https://dash.better-i18n.com",
      statusCode: 301,
    });
  },
});
