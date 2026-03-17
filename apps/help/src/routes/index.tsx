import { createFileRoute, redirect } from "@tanstack/react-router";
import { i18nConfig } from "../i18n.config";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    const locale = context.locale || i18nConfig.defaultLocale;
    throw redirect({
      to: "/$locale/",
      params: { locale },
      statusCode: 301,
    });
  },
});
