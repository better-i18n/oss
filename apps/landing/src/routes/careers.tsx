import { createFileRoute, redirect } from "@tanstack/react-router";
import { i18nConfig } from "../i18n.config";

export const Route = createFileRoute("/careers")({
  beforeLoad: ({ context }) => {
    throw redirect({
      to: "/$locale/careers",
      params: {
        locale: context.locale || i18nConfig.defaultLocale,
      },
    });
  },
});
