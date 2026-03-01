/**
 * Translation hook with defaultValue support.
 *
 * use-intl v4's `t()` treats the second argument as ICU interpolation values,
 * NOT as options. This wrapper adds proper `defaultValue` fallback support.
 *
 * Supports two calling conventions:
 *   t("key", { defaultValue: "fallback" })   — object style (used by most pages)
 *   t("key", "fallback")                      — shorthand style
 *   t("key")                                  — no fallback (uses getMessageFallback)
 */
import { useTranslations } from "@better-i18n/use-intl";

type TranslateOptions = {
  defaultValue: string;
};

type TranslateFn = {
  (key: string, options: TranslateOptions): string;
  (key: string, fallback: string): string;
  (key: string): string;
  has: (key: string) => boolean;
};

export function useT(namespace: string): TranslateFn {
  const t = useTranslations(namespace);

  const translate = ((
    key: string,
    optionsOrFallback?: TranslateOptions | string,
  ) => {
    if (typeof optionsOrFallback === "string") {
      return t.has(key) ? t(key) : optionsOrFallback;
    }
    if (optionsOrFallback?.defaultValue !== undefined) {
      return t.has(key) ? t(key) : optionsOrFallback.defaultValue;
    }
    return t(key);
  }) as TranslateFn;

  translate.has = (key: string) => t.has(key);

  return translate;
}
