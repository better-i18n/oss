"use client";
import { useRemixI18n } from "./provider.js";

export {
  useTranslations,
  useFormatter,
  useMessages,
  useNow,
  useTimeZone,
} from "use-intl";

export function useLocale() {
  return useRemixI18n().locale;
}

export function useLanguages() {
  return useRemixI18n().languages;
}
