/**
 * Translation hook with defaultValue support.
 * Adapted from landing app's useT hook.
 */
import { useTranslations } from "@better-i18n/use-intl";
import type { ReactNode } from "react";

type RichTranslationValues = Parameters<ReturnType<typeof useTranslations>["rich"]>[1];

type TranslateFn = {
  (key: string, options: Record<string, unknown>): string;
  (key: string, fallback: string): string;
  (key: string): string;
  has: (key: string) => boolean;
  rich: (key: string, values?: RichTranslationValues) => ReactNode;
};

export function useT(namespace: string): TranslateFn {
  const t = useTranslations(namespace);

  const translate = ((
    key: string,
    optionsOrFallback?: Record<string, unknown> | string,
  ) => {
    if (typeof optionsOrFallback === "string") {
      return t.has(key) ? t(key) : optionsOrFallback;
    }
    if (optionsOrFallback && typeof optionsOrFallback === "object") {
      const { defaultValue, ...icuValues } = optionsOrFallback;
      if (!t.has(key) && typeof defaultValue === "string") {
        return defaultValue;
      }
      return Object.keys(icuValues).length > 0
        ? t(key, icuValues as Record<string, string>)
        : t(key);
    }
    return t(key);
  }) as TranslateFn;

  translate.has = (key: string) => t.has(key);
  translate.rich = (key: string, values?: RichTranslationValues) =>
    t.rich(key, values);

  return translate;
}
