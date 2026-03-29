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

export type IntegrationCategory =
  | "featured"
  | "frameworks"
  | "developerTools"
  | "delivery"
  | "aiAutomation";

export type IntegrationStatus = "available" | "builtIn" | "popular" | "guide";

export type IntegrationItem = {
  slug: string;
  name: string;
  category: IntegrationCategory;
  copyKey: string;
  status: IntegrationStatus;
  logoDomain?: string;
  markLabel?: string;
  guideHref?: string;
  icon:
    | { type: "sprite"; name: import("@/components/SpriteIcon").SpriteIconName }
    | { type: "component"; component: ComponentType<{ className?: string }> };
};

export function getIntegrationsCatalog(locale: string): IntegrationItem[] {
  return [
    {
      slug: "github",
      name: "GitHub",
      category: "featured",
      copyKey: "cards.github",
      status: "builtIn",
      logoDomain: "github.com",
      icon: { type: "sprite", name: "github" },
    },
    {
      slug: "mcp-server",
      name: "MCP Server",
      category: "featured",
      copyKey: "cards.mcpServer",
      status: "builtIn",
      markLabel: "MCP",
      icon: { type: "component", component: IconRobot },
    },
    {
      slug: "global-cdn",
      name: "Global CDN",
      category: "delivery",
      copyKey: "cards.globalCdn",
      status: "popular",
      markLabel: "CDN",
      icon: { type: "sprite", name: "globe" },
    },
    {
      slug: "cli",
      name: "CLI",
      category: "developerTools",
      copyKey: "cards.cli",
      status: "builtIn",
      markLabel: "CLI",
      icon: { type: "sprite", name: "script" },
    },
    {
      slug: "api",
      name: "REST API",
      category: "developerTools",
      copyKey: "cards.api",
      status: "available",
      markLabel: "API",
      icon: { type: "sprite", name: "api-connection" },
    },
    {
      slug: "nextjs",
      name: "Next.js",
      category: "frameworks",
      copyKey: "cards.nextjs",
      status: "guide",
      logoDomain: "nextjs.org",
      guideHref: `/${locale}/i18n/nextjs`,
      icon: { type: "component", component: NextjsIcon },
    },
    {
      slug: "react",
      name: "React",
      category: "frameworks",
      copyKey: "cards.react",
      status: "guide",
      logoDomain: "react.dev",
      guideHref: `/${locale}/i18n/react`,
      icon: { type: "component", component: ReactIcon },
    },
    {
      slug: "expo",
      name: "Expo",
      category: "frameworks",
      copyKey: "cards.expo",
      status: "guide",
      logoDomain: "expo.dev",
      guideHref: `/${locale}/i18n/expo`,
      icon: { type: "component", component: ExpoIcon },
    },
    {
      slug: "vue",
      name: "Vue",
      category: "frameworks",
      copyKey: "cards.vue",
      status: "guide",
      logoDomain: "vuejs.org",
      guideHref: `/${locale}/i18n/vue`,
      icon: { type: "component", component: VueIcon },
    },
    {
      slug: "svelte",
      name: "Svelte",
      category: "frameworks",
      copyKey: "cards.svelte",
      status: "guide",
      logoDomain: "svelte.dev",
      guideHref: `/${locale}/i18n/svelte`,
      icon: { type: "component", component: SvelteIcon },
    },
    {
      slug: "nuxt",
      name: "Nuxt",
      category: "frameworks",
      copyKey: "cards.nuxt",
      status: "guide",
      logoDomain: "nuxt.com",
      guideHref: `/${locale}/i18n/nuxt`,
      icon: { type: "component", component: NuxtIcon },
    },
    {
      slug: "remix",
      name: "Remix",
      category: "frameworks",
      copyKey: "cards.remix",
      status: "guide",
      logoDomain: "remix.run",
      guideHref: `/${locale}/i18n/remix-hydrogen`,
      icon: { type: "component", component: RemixIcon },
    },
    {
      slug: "vite",
      name: "Vite",
      category: "frameworks",
      copyKey: "cards.vite",
      status: "guide",
      logoDomain: "vite.dev",
      guideHref: `/${locale}/i18n/vite`,
      icon: { type: "component", component: ViteIcon },
    },
    {
      slug: "tanstack-start",
      name: "TanStack Start",
      category: "frameworks",
      copyKey: "cards.tanstackStart",
      status: "guide",
      logoDomain: "tanstack.com",
      guideHref: `/${locale}/i18n/tanstack-start`,
      icon: { type: "component", component: TanStackIcon },
    },
    {
      slug: "angular",
      name: "Angular",
      category: "frameworks",
      copyKey: "cards.angular",
      status: "guide",
      logoDomain: "angular.dev",
      guideHref: `/${locale}/i18n/angular`,
      icon: { type: "component", component: AngularIcon },
    },
    {
      slug: "astro",
      name: "Astro",
      category: "frameworks",
      copyKey: "cards.astro",
      status: "guide",
      logoDomain: "astro.build",
      icon: { type: "component", component: AstroIcon },
    },
    {
      slug: "workflow-api",
      name: "Automation API",
      category: "aiAutomation",
      copyKey: "cards.workflowApi",
      status: "available",
      markLabel: "AUTO",
      icon: { type: "sprite", name: "zap" },
    },
    {
      slug: "ai-translation",
      name: "AI Translation Workflows",
      category: "aiAutomation",
      copyKey: "cards.aiTranslation",
      status: "builtIn",
      markLabel: "AI",
      icon: { type: "sprite", name: "sparkles-soft" },
    },
    {
      slug: "translation-cdn",
      name: "Translation CDN",
      category: "delivery",
      copyKey: "cards.translationCdn",
      status: "guide",
      guideHref: `/${locale}/i18n/translation-cdn`,
      markLabel: "CDN",
      icon: { type: "sprite", name: "globe" },
    },
    {
      slug: "code-scanning",
      name: "Code Scanning",
      category: "developerTools",
      copyKey: "cards.codeScanning",
      status: "guide",
      guideHref: `/${locale}/i18n/cli-code-scanning`,
      markLabel: "SCAN",
      icon: { type: "sprite", name: "code-brackets" },
    },
  ];
}

export function getIntegrationBySlug(locale: string, slug: string) {
  return getIntegrationsCatalog(locale).find((item) => item.slug === slug);
}
