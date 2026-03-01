/**
 * Translation hook with defaultValue support.
 *
 * use-intl v4's `t()` treats the second argument as ICU interpolation values,
 * NOT as options. This wrapper adds proper `defaultValue` fallback support
 * so `t("key", { defaultValue: "..." })` works as expected.
 */
import { useTranslations } from "@better-i18n/use-intl";

type TranslateOptions = {
  defaultValue: string;
};

type TranslateFn = {
  (key: string, options: TranslateOptions): string;
  (key: string): string;
  has: (key: string) => boolean;
};

export function useT(namespace: string): TranslateFn {
  const t = useTranslations(namespace);

  const translate = ((key: string, options?: TranslateOptions) => {
    if (options?.defaultValue !== undefined) {
      return t.has(key) ? t(key) : options.defaultValue;
    }
    return t(key);
  }) as TranslateFn;

  translate.has = (key: string) => t.has(key);

  return translate;
}
