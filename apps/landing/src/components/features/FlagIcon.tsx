/**
 * FlagIcon — small inline country flag image used inside the feature
 * cards. Same pattern that the AI drawer demo (`DemoAIDrawerStandalone`)
 * uses, sourced from flagcdn.com.
 *
 * `countryCode` should be the ISO 3166-1 alpha-2 country code, NOT the
 * BCP-47 language code. For locales whose language tag differs from the
 * country code (e.g. `ja` → `jp`, `en` → `gb`/`us`), the caller is
 * responsible for the mapping.
 */

import { cn } from "@better-i18n/ui/lib/utils";

type FlagIconProps = {
  countryCode: string;
  className?: string;
};

export function FlagIcon({ countryCode, className }: FlagIconProps) {
  return (
    <img
      src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
      alt=""
      aria-hidden
      className={cn(
        "w-4 h-3 rounded-[2px] object-cover shrink-0",
        className,
      )}
      loading="lazy"
    />
  );
}
