import type { i18n } from "i18next";
import { BetterI18nBackend } from "./backend";
import { getDeviceLocale } from "./locale";
import type { TranslationStorage } from "./types";

/**
 * Options for the `initBetterI18n` convenience helper
 */
export interface InitBetterI18nOptions {
  /** Project identifier in "org/project" format */
  project: string;

  /** i18next instance to configure */
  i18n: i18n;

  /** Default/fallback locale @default "en" */
  defaultLocale?: string;

  /** Cache TTL in ms @default 86400000 (24h) */
  cacheExpiration?: number;

  /** Custom storage adapter */
  storage?: TranslationStorage;

  /** Auto-detect device locale via expo-localization @default false */
  useDeviceLocale?: boolean;

  /** Enable debug logging @default false */
  debug?: boolean;
}

/**
 * One-liner setup helper that configures i18next with the BetterI18nBackend.
 *
 * @example
 * ```ts
 * import i18n from 'i18next';
 * import { initReactI18next } from 'react-i18next';
 * import { initBetterI18n } from '@better-i18n/expo';
 *
 * await initBetterI18n({
 *   project: 'acme/my-app',
 *   i18n: i18n.use(initReactI18next),
 *   useDeviceLocale: true,
 * });
 * ```
 */
export const initBetterI18n = async (
  options: InitBetterI18nOptions
): Promise<void> => {
  const {
    project,
    i18n: i18nInstance,
    defaultLocale = "en",
    cacheExpiration,
    storage,
    useDeviceLocale = false,
    debug = false,
  } = options;

  const lng = useDeviceLocale
    ? getDeviceLocale({ fallback: defaultLocale })
    : defaultLocale;

  await i18nInstance.use(BetterI18nBackend).init({
    backend: {
      project,
      defaultLocale,
      cacheExpiration,
      storage,
      debug,
    },
    lng,
    fallbackLng: defaultLocale,
    interpolation: { escapeValue: false },
  });
};
