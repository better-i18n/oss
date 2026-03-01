/**
 * Translation hook with defaultValue support.
 *
 * use-intl v4's `t()` treats the second argument as ICU interpolation values,
 * NOT as options. This wrapper adds proper `defaultValue` fallback support.
 *
 * Supports calling conventions:
 *   t("key", { defaultValue: "fallback" })          — object style
 *   t("key", { code: "x", defaultValue: "fallback"}) — ICU values + fallback
 *   t("key", "fallback")                             — shorthand style
 *   t("key")                                         — no fallback
 */
import { useTranslations } from "@better-i18n/use-intl";
import type { ReactNode } from "react";

type RichTagsFunction = (chunks: ReactNode) => ReactNode;
type RichTranslationValues = Record<string, string | number | Date | RichTagsFunction>;

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
