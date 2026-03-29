/**
 * Integrations catalog — icon resolution layer.
 *
 * Integration data is stored in Better i18n Content CMS (model: "integrations").
 * This file maps CMS `icon_type`/`icon_name` strings to actual React components
 * and sprite icon names for use in the UI.
 *
 * Fetching:
 *   - getIntegrations(locale)  → all integrations (from content.ts)
 *   - getIntegration(locale, slug) → single integration (from content.ts)
 */

import type { ComponentType } from "react";
import { IconRobot } from "@central-icons-react/round-outlined-radius-2-stroke-2";
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
  IconRobot,
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
