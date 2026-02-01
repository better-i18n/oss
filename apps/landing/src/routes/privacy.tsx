import { createFileRoute, redirect } from "@tanstack/react-router";
import { i18nConfig } from "../i18n.config";

export const Route = createFileRoute("/privacy")({
  beforeLoad: ({ context }) => {
    throw redirect({
      to: "/$locale/privacy",
      params: {
        locale: context.locale || i18nConfig.defaultLocale,
      },
    });
  },
});
