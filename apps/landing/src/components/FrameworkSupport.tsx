import { Link, useParams } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import {
  IconApple,
  IconConsole,
  IconLayersThree,
  IconModelcontextprotocol,
  IconScanCode,
  IconServer1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { SpriteIcon } from "@/components/SpriteIcon";
import { GuideMark } from "@/lib/i18n-guide-icons";
import type { ComponentType } from "react";

type FrameworkRoute =
  | "/$locale/i18n/nextjs/"
  | "/$locale/i18n/tanstack-start/"
  | "/$locale/i18n/vite/"
  | "/$locale/i18n/remix-hydrogen/"
  | "/$locale/i18n/expo/"
  | "/$locale/i18n/ios/"
  | "/$locale/i18n/flutter/"
  | "/$locale/i18n/server/"
  | "/$locale/integrations/";

type ResourceRoute =
  | "/$locale/i18n/doctor/"
  | "/$locale/i18n/cli-code-scanning/"
  | "/$locale/i18n/best-tms/";

const frameworks: Array<{
  href: FrameworkRoute;
  key: string;
  name: string;
  /**
   * Only for rows that are NOT an `/i18n/{slug}` guide — the two SDK entries
   * point at `/integrations/`, so there is no guide slug to look a mark up by.
   * Everything else resolves through the shared guide-icon map instead of
   * declaring its own icon here (`rule/name-a-thing-with-its-mark`).
   */
  icon?: ComponentType<{ className?: string }>;
}> = [
  {
    key: "nextjs",
    name: "Next.js",
    href: "/$locale/i18n/nextjs/",
  },
  {
    key: "tanstackStart",
    name: "TanStack Start",
    href: "/$locale/i18n/tanstack-start/",
  },
  {
    key: "vite",
    name: "Vite",
    href: "/$locale/i18n/vite/",
  },
  {
    key: "remixHydrogen",
    name: "Remix & Hydrogen",
    href: "/$locale/i18n/remix-hydrogen/",
  },
  {
    key: "expo",
    name: "Expo",
    href: "/$locale/i18n/expo/",
  },
  {
    key: "ios",
    name: "iOS (Swift)",
    href: "/$locale/i18n/ios/",
    icon: IconApple,
  },
  {
    key: "flutter",
    name: "Flutter",
    href: "/$locale/i18n/flutter/",
  },
  {
    key: "server",
    name: "Server SDK",
    href: "/$locale/i18n/server/",
    icon: IconServer1,
  },
  {
    key: "contentSdk",
    name: "Content SDK",
    href: "/$locale/integrations/",
    icon: IconLayersThree,
  },
  {
    key: "mcp",
    name: "MCP",
    href: "/$locale/integrations/",
    icon: IconModelcontextprotocol,
  },
];

type SeoSurface = {
  description: string;
  href: ResourceRoute;
  key: string;
  label: string;
  title: string;
} & (
  | { icon: ComponentType<{ className?: string }>; spriteName?: never }
  | { spriteName: import("@/components/SpriteIcon").SpriteIconName; icon?: never }
);

const seoSurfaces: SeoSurface[] = [
  {
    key: "doctor",
    label: "CLI",
    title: "i18n Doctor",
    description: "Reports for missing, unused, and inconsistent translation keys.",
    href: "/$locale/i18n/doctor/",
    icon: IconConsole,
  },
  {
    key: "cliCodeScanning",
    label: "Docs",
    title: "CLI Code Scanning",
    description: "Scan repos and catch localization drift before it compounds.",
    href: "/$locale/i18n/cli-code-scanning/",
    icon: IconScanCode,
  },
  {
    key: "bestTms",
    label: "SEO",
    title: "Best TMS",
    description: "Capture comparison traffic with sharper solution pages.",
    href: "/$locale/i18n/best-tms/",
    spriteName: "globe",
  },
];

export default function FrameworkSupport() {
  const t = useT("frameworkSupport");
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";

  return (
    <section id="frameworks">
      <div className="section">
        <div className="max-w-2xl">
          <div className="eyebrow">
            {t("eyebrow")}
          </div>
          <h2 className="section-h2">
            {t("title")}
          </h2>
          <p className="section-p mt-3">
            {t("subtitle")}
          </p>
        </div>

        {/* Framework grid — a hairline table, not a floating card. Rows read as a
            list of supported targets; the SEO surfaces sit under it as three
            hairline-split columns (the .feat-row archetype). */}
        {/* Hairlines without nth-child arithmetic: every cell draws its own top +
            left rule, and the grid is shifted up/left by 1px so the first row's
            and first column's rules slide under the container border, where
            overflow-hidden clips them. Breakpoint-independent — no rule can go
            missing or double when the column count changes. 10 frameworks in 2
            columns also means 5 full rows, so there is no ragged last row. */}
        <div className="mt-8 overflow-hidden">
          <div className="grid grid-cols-1 gap-x-6 gap-y-0.5 sm:grid-cols-2">
            {frameworks.map((framework) => {
              // The slug is the route segment, which is also the key the shared
              // guide-icon map uses. Deriving it here means this list cannot
              // carry a different mark from the hub or the header.
              const guide = /^\/\$locale\/i18n\/([a-z0-9-]+)\/$/.exec(framework.href);
              const Fallback = framework.icon;

              return (
                <Link
                  key={framework.key}
                  to={framework.href}
                  params={{ locale: currentLocale }}
                  className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-black/[0.03]"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    {guide ? (
                      <GuideMark slug={guide[1]} group="frameworks" />
                    ) : Fallback ? (
                      // Same tile the shared GuideMark draws — one size, one
                      // ground, so an SDK row sits level with a framework row.
                      <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                        <Fallback className="size-3.5" />
                      </span>
                    ) : null}
                    <span className="truncate text-sm font-medium tracking-[-0.015em] text-mist-700 transition-colors group-hover:text-mist-950">
                      {t(`frameworks.${framework.key}.name`)}
                    </span>
                  </span>
                  <SpriteIcon
                    name="chevron-right"
                    className="size-4 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600"
                  />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="feat-row mt-2">
          {seoSurfaces.map((surface) => (
            <Link
              key={surface.key}
              to={surface.href}
              params={{ locale: currentLocale }}
              className="feat-item group"
            >
              <span className="flex items-center gap-2">
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  {surface.spriteName ? (
                    <SpriteIcon name={surface.spriteName} className="size-3" />
                  ) : (
                    <surface.icon className="size-3" />
                  )}
                </span>
                <span className="text-[11px] font-medium text-mist-400">
                  {t(`surfaces.${surface.key}.label`)}
                </span>
              </span>
              <span className="block">
                <span
                  className="block font-medium leading-[1.3] tracking-[-0.02em] text-mist-900"
                  style={{ fontSize: "var(--text-lead)" }}
                >
                  {t(`surfaces.${surface.key}.title`)}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-mist-600">
                  {t(`surfaces.${surface.key}.description`)}
                </span>
              </span>
              <span className="learn-more w-fit">
                {t("surfaces.cta")}
                <SpriteIcon name="arrow-right" className="size-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
