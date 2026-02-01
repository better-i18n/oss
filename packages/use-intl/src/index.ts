// Provider
export { BetterI18nProvider } from "./provider";
export type { BetterI18nProviderProps } from "./provider";

// Context & Hooks
export { useBetterI18n } from "./context";
export {
  useLanguages,
  useLocale,
  // Re-exported from use-intl
  useTranslations,
  useFormatter,
  useMessages,
  useNow,
  useTimeZone,
} from "./hooks";

// Router Integration (TanStack Router)
export { useLocaleRouter } from "./hooks/useLocaleRouter";
export type { UseLocaleRouterReturn } from "./hooks/useLocaleRouter";

// Components
export { LanguageSwitcher } from "./components";
export type { LanguageSwitcherProps } from "./components";

// Types
export type {
  Messages,
  BetterI18nProviderConfig,
  BetterI18nContextValue,
} from "./types";

// Re-export locale utilities from core (convenience)
export {
  extractLocale,
  getLocaleFromPath,
  hasLocalePrefix,
  removeLocalePrefix,
  addLocalePrefix,
  replaceLocaleInPath,
  createLocalePath,
  type LocaleConfig,
} from "@better-i18n/core";

// Re-export commonly used use-intl components
export { IntlProvider } from "use-intl";
