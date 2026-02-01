import { createBetterI18nMiddleware } from "@better-i18n/use-intl/middleware";
import { i18nConfig } from "../i18n.config";

export const i18nMiddleware = createBetterI18nMiddleware({
  project: i18nConfig.project,
  defaultLocale: i18nConfig.defaultLocale,
});
