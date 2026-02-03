import { createFileRoute, redirect } from "@tanstack/react-router";
import { i18nConfig } from "../i18n.config";

export const Route = createFileRoute("/features")({
  beforeLoad: ({ context }) => {
    throw redirect({
      to: "/$locale/features",
      params: {
        locale: context.locale || i18nConfig.defaultLocale,
      },
    });
  },
});
