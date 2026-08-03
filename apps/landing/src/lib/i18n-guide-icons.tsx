import type { ReactNode } from "react";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import {
  AngularIcon,
  ExpoIcon,
  FlutterIcon,
  NextjsIcon,
  NuxtIcon,
  ReactIcon,
  RemixIcon,
  SvelteIcon,
  TanStackIcon,
  ViteIcon,
  VueIcon,
} from "@/components/icons/FrameworkIcons";

/**
 * i18n-guide-icons — ONE slug → icon map for every surface that lists the
 * `/i18n/*` guides.
 *
 * Two surfaces list the same guides: the header's Integrations mega menu and the
 * `/i18n` hub grid. They had drifted — the menu showed real framework marks, the
 * hub showed none — and the failure mode of "fix it in both places" is that they
 * drift again on the next guide. So the mapping lives here and both call
 * `guideIcon(slug)`.
 *
 * Philosophy is inherited from `feature-icons.ts`: the icon is a **scanning aid,
 * never information**. Every card still carries its translated name and
 * description, and no card's meaning depends on the glyph.
 *
 * Where a real brand mark exists it is used. Where one does not, the group's
 * default glyph is used rather than inventing per-slug precision the sprite
 * cannot honestly express — a category-level glyph reads as "this is a framework
 * guide", which is true, while a guessed-at unique glyph reads as a claim.
 *
 * The sprite has no Apple, no terminal and no document glyph (see
 * `SpriteIcon.tsx` for the full set), so `ios` and `server` fall back to the
 * closest honest stand-ins and are called out below.
 */

export type GuideGroup =
  | "frameworks"
  | "topics"
  | "localizationGuides"
  | "seoGuides";

/** Real brand marks. A slug here always wins over its group default. */
const BRAND_MARKS: Record<string, (p: { className?: string }) => ReactNode> = {
  react: ReactIcon,
  nextjs: NextjsIcon,
  "tanstack-start": TanStackIcon,
  vite: ViteIcon,
  "remix-hydrogen": RemixIcon,
  vue: VueIcon,
  nuxt: NuxtIcon,
  angular: AngularIcon,
  svelte: SvelteIcon,
  expo: ExpoIcon,
  flutter: FlutterIcon,
  // Not a framework page, but it IS the React ecosystem — the mark is accurate.
  "react-intl": ReactIcon,
  // Same reasoning: React Native is React. Expo has its own mark and its own
  // guide, so this slug must not borrow it — Expo is one way to build RN, not
  // the same thing. Without an entry here this slug was the single gap in a
  // list that is otherwise all brand marks (the complete-guide framework grid).
  "react-native-localization": ReactIcon,
};

/**
 * Per-slug sprite overrides, for guides whose subject is specific enough that
 * the group default would undersell it.
 */
const SLUG_SPRITES: Record<string, SpriteIconName> = {
  // Frameworks without a brand mark in the sprite set:
  ios: "code-brackets", // no Apple glyph — generic SDK mark
  server: "api-connection", // the Hono / Node server guide

  // Topics:
  "best-tms": "chart",
  "best-library": "code-brackets",
  "for-developers": "code",
  "translation-management-system": "settings-gear",
  "localization-management": "settings-gear",
  "localization-vs-internationalization": "book",
  "software-localization": "rocket",
  "software-localization-services": "group",

  // Localization guides:
  "content-localization": "book",
  "content-localization-services": "group",
  "localization-software": "settings-gear",
  "localization-platforms": "settings-gear",
  "localization-tools": "settings-gear",
  "translation-solutions": "sparkles-soft",

  // SEO guides:
  "technical-multilingual-seo": "settings-gear",
  "technical-international-seo": "settings-gear",
  "ecommerce-global-seo": "chart",
  "global-market-seo": "chart",
  "international-seo-consulting": "group",
};

/** Category-level fallback. Honest at the group level, no invented precision. */
const GROUP_SPRITES: Record<GuideGroup, SpriteIconName> = {
  frameworks: "code-brackets",
  topics: "code-brackets",
  localizationGuides: "globe",
  seoGuides: "magnifying-glass",
};

/**
 * Icon for one guide slug.
 *
 * @param slug  the `/i18n/{slug}` segment, e.g. "react", "multilingual-seo"
 * @param group the hub group the slug is listed under; supplies the fallback.
 *              Omit it (as the header does, where every entry is a framework)
 *              to get the brand mark or a slug override only.
 */
export function guideIcon(
  slug: string,
  group?: GuideGroup,
  className = "size-4",
): ReactNode {
  const Mark = BRAND_MARKS[slug];
  if (Mark) return <Mark className={className} />;

  const sprite = SLUG_SPRITES[slug] ?? (group ? GROUP_SPRITES[group] : undefined);
  if (!sprite) return null;

  return <SpriteIcon name={sprite} className={className} />;
}

/**
 * GuideMark — the guide's mark on the standard neutral tile.
 *
 * `rule/name-a-thing-with-its-mark` wants a framework named anywhere to carry its
 * real mark, at ONE size on a neutral ground, exactly like `<CompetitorMark>`
 * does for vendors. `guideIcon` returns a bare glyph, so every caller was
 * inventing its own wrapper — which is how "one size, neutral ground" drifts
 * into five sizes and two grounds. The tile lives here instead.
 *
 * Deliberately no `size` prop: the rule says a mark is not resized per surface.
 * If a surface cannot fit 22px, the surface is wrong, not the mark.
 *
 * Renders nothing when the slug resolves to no icon, so a caller can drop it in
 * front of a name without checking first.
 */
export function GuideMark({ slug, group }: { slug: string; group?: GuideGroup }) {
  const icon = guideIcon(slug, group, "size-3.5");
  if (!icon) return null;

  return (
    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
      {icon}
    </span>
  );
}
