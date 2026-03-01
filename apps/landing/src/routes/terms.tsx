import { createFileRoute, redirect } from "@tanstack/react-router";
import { i18nConfig } from "../i18n.config";

export const Route = createFileRoute("/terms")({
  beforeLoad: ({ context }) => {
    throw redirect({
      to: "/$locale/terms",
      params: {
        locale: context.locale || i18nConfig.defaultLocale,
      },
      statusCode: 301,
    });
  },
});
