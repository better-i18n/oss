import { createFileRoute, redirect } from "@tanstack/react-router";
import { detectLocale } from "@better-i18n/use-intl/server";
import { i18nConfig } from "../i18n.config";
import { fetchLocales } from "../lib/locales";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const locales = await fetchLocales();
    const locale = detectLocale({
      availableLocales: locales,
      defaultLocale: i18nConfig.defaultLocale,
    });

    throw redirect({
      to: "/$locale",
      params: { locale },
      statusCode: 301,
    });
  },
});
