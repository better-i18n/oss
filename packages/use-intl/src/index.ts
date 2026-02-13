// Provider
export { BetterI18nProvider } from "./provider.js";
export type { BetterI18nProviderProps } from "./provider.js";

// Context & Hooks
export { useBetterI18n } from "./context.js";
export {
  useLanguages,
  useLocale,
  // Re-exported from use-intl
  useTranslations,
  useFormatter,
  useMessages,
  useNow,
  useTimeZone,
} from "./hooks.js";

// Router Integration (TanStack Router)
export { useLocaleRouter } from "./hooks/useLocaleRouter.js";
export type { UseLocaleRouterReturn } from "./hooks/useLocaleRouter.js";

// Components
export { LanguageSwitcher } from "./components.js";
export type { LanguageSwitcherProps } from "./components.js";

// Types
export type {
  Messages,
  BetterI18nProviderConfig,
  BetterI18nContextValue,
} from "./types.js";

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
