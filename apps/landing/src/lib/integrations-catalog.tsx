/**
 * Integrations catalog — icon resolution layer.
 *
 * Integration data is stored in Better I18N Content CMS (model: "integrations").
 * This file maps CMS `icon_type`/`icon_name` strings to actual React components
 * and sprite icon names for use in the UI.
 *
 * Fetching:
 *   - getIntegrations(locale)  → all integrations (from content.ts)
 *   - getIntegration(locale, slug) → single integration (from content.ts)
 */

import type { ComponentType } from "react";
import {
  IconModelcontextprotocol,
  IconConsoleSimple,
  IconCloudySparkle,
  IconAiTranslate,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import {
  NextjsIcon,
  TanStackIcon,
  ViteIcon,
  RemixIcon,
  ExpoIcon,
  ReactIcon,
  VueIcon,
  AngularIcon,
  SvelteIcon,
  NuxtIcon,
  AstroIcon,
} from "@/components/icons/FrameworkIcons";
import type { SpriteIconName } from "@/components/SpriteIcon";
import type {
  IntegrationCmsItem,
  IntegrationCategory,
  IntegrationStatus,
} from "@/lib/content";

// Re-export CMS types for route files
export type { IntegrationCmsItem, IntegrationCategory, IntegrationStatus };

// ─── Resolved IntegrationItem with icon ─────────────────────────────

export type IntegrationItem = IntegrationCmsItem & {
  icon:
    | { type: "sprite"; name: SpriteIconName }
    | { type: "component"; component: ComponentType<{ className?: string }> };
};

// ─── Icon component map (icon_name → React component) ────────────────

const COMPONENT_ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  // Framework icons
  NextjsIcon,
  TanStackIcon,
  ViteIcon,
  RemixIcon,
  ExpoIcon,
  ReactIcon,
  VueIcon,
  AngularIcon,
  SvelteIcon,
  NuxtIcon,
  AstroIcon,
  // Central icons (developer tools + AI)
  IconModelcontextprotocol,
  IconConsoleSimple,
  IconCloudySparkle,
  IconAiTranslate,
};

// ─── Icon resolution ─────────────────────────────────────────────────

export function resolveIcon(
  iconType: string,
  iconName: string,
): IntegrationItem["icon"] {
  if (iconType === "component") {
    const component = COMPONENT_ICON_MAP[iconName];
    if (component) return { type: "component", component };
  }
  // sprite (or component fallback)
  return { type: "sprite", name: (iconName as SpriteIconName) || "code" };
}

/** Attach a resolved icon to a CMS item. */
export function toIntegrationItem(cms: IntegrationCmsItem): IntegrationItem {
  return { ...cms, icon: resolveIcon(cms.iconType, cms.iconName) };
}

/* ── Meta labels ─────────────────────────────────────────────────────
   Two CMS fields land in the same line: `status` (rendered through
   `status.<value>`) and `badge_label` (free text). On four entries —
   mcp-server, github, cli, ai-translation — both resolve to "Built-in", so the
   page printed the same word twice ("Featured Built-in Built-in").

   Clearing those four in the CMS would fix today and not tomorrow: the next
   built-in integration fills the same field again and the duplicate comes back
   silently. So the rule lives in code, in one function, used by both the
   directory and the detail page — the two places that render this pair. */

/**
 * The labels for an integration's meta line, with the badge dropped when it
 * says the same thing as the status. Comparison is case- and space-insensitive
 * because the CMS value is hand-typed.
 */
export function integrationMetaLabels(
  item: Pick<IntegrationCmsItem, "category" | "status" | "badgeLabel">,
  t: (key: string) => string,
): { category: string; badge: string | null; status: string } {
  const status = t(`status.${item.status}`);
  const normalise = (value: string) => value.trim().toLowerCase().replace(/[\s-]+/g, "");
  const badge =
    item.badgeLabel && normalise(item.badgeLabel) !== normalise(status)
      ? item.badgeLabel
      : null;

  return { category: t(`categories.${item.category}`), badge, status };
}
