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
  /**
   * `loading="lazy"` is the safe default — flag rows are almost always
   * inside below-the-fold demo/feature cards. Pass `"eager"` only when the
   * caller knows the flag renders inside the initial mobile viewport
   * (otherwise we trade CLS / LCP for nothing).
   */
  loading?: "lazy" | "eager";
};

export function FlagIcon({
  countryCode,
  className,
  loading = "lazy",
}: FlagIconProps) {
  return (
    <img
      src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
      alt=""
      aria-hidden
      // Intrinsic dimensions of the source asset (40×30). Tailwind classes
      // resize it visually; the HTML attrs let the browser reserve space
      // before CSS resolves, eliminating CLS while flag PNGs trickle in.
      // See BETTER-266 — the production audit flagged 48 flag images
      // rendering above the fold on /i18n/localization-software/ with no
      // explicit dimensions.
      width={40}
      height={30}
      decoding="async"
      className={cn(
        "w-4 h-3 rounded-[2px] object-cover shrink-0",
        className,
      )}
      loading={loading}
    />
  );
}
