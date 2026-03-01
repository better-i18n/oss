import { createFileRoute, redirect } from "@tanstack/react-router";
import { i18nConfig } from "../i18n.config";

export const Route = createFileRoute("/pricing")({
  beforeLoad: ({ context }) => {
    throw redirect({
      to: "/$locale/pricing",
      params: {
        locale: context.locale || i18nConfig.defaultLocale,
      },
      statusCode: 301,
    });
  },
});
