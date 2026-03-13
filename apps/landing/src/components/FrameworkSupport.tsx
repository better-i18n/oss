import { Link, useParams } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import {
  IconApple,
  IconChevronRight,
  IconConsole,
  IconGlobe,
  IconLayersThree,
  IconModelcontextprotocol,
  IconScanCode,
  IconServer1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import {
  ExpoIcon,
  FlutterIcon,
  NextjsIcon,
  RemixIcon,
  TanStackIcon,
  ViteIcon,
} from "@/components/icons/FrameworkIcons";
import type { ComponentType } from "react";

type FrameworkRoute =
  | "/$locale/i18n/nextjs"
  | "/$locale/i18n/tanstack-start"
  | "/$locale/i18n/vite"
  | "/$locale/i18n/remix-hydrogen"
  | "/$locale/i18n/expo"
  | "/$locale/i18n/ios"
  | "/$locale/i18n/flutter"
  | "/$locale/i18n/server"
  | "/$locale/integrations";

type ResourceRoute =
  | "/$locale/i18n/doctor"
  | "/$locale/i18n/cli-code-scanning"
  | "/$locale/i18n/best-tms";

const frameworks: Array<{
  href: FrameworkRoute;
  icon: ComponentType<{ className?: string }>;
  key: string;
  name: string;
}> = [
  {
    key: "nextjs",
    name: "Next.js",
    href: "/$locale/i18n/nextjs",
    icon: NextjsIcon,
  },
  {
    key: "tanstackStart",
    name: "TanStack Start",
    href: "/$locale/i18n/tanstack-start",
    icon: TanStackIcon,
  },
  {
    key: "vite",
    name: "Vite",
    href: "/$locale/i18n/vite",
    icon: ViteIcon,
  },
  {
    key: "remixHydrogen",
    name: "Remix & Hydrogen",
    href: "/$locale/i18n/remix-hydrogen",
    icon: RemixIcon,
  },
  {
    key: "expo",
    name: "Expo",
    href: "/$locale/i18n/expo",
    icon: ExpoIcon,
  },
  {
    key: "ios",
    name: "iOS (Swift)",
    href: "/$locale/i18n/ios",
    icon: IconApple,
  },
  {
    key: "flutter",
    name: "Flutter",
    href: "/$locale/i18n/flutter",
    icon: FlutterIcon,
  },
  {
    key: "server",
    name: "Server SDK",
    href: "/$locale/i18n/server",
    icon: IconServer1,
  },
  {
    key: "contentSdk",
    name: "Content SDK",
    href: "/$locale/integrations",
    icon: IconLayersThree,
  },
  {
    key: "mcp",
    name: "MCP",
    href: "/$locale/integrations",
    icon: IconModelcontextprotocol,
  },
];

const seoSurfaces: Array<{
  description: string;
  href: ResourceRoute;
  icon: ComponentType<{ className?: string }>;
  key: string;
  label: string;
  title: string;
}> = [
  {
    key: "doctor",
    label: "CLI",
    title: "i18n Doctor",
    description: "Reports for missing, unused, and inconsistent translation keys.",
    href: "/$locale/i18n/doctor",
    icon: IconConsole,
  },
  {
    key: "cliCodeScanning",
    label: "Docs",
    title: "CLI Code Scanning",
    description: "Scan repos and catch localization drift before it compounds.",
    href: "/$locale/i18n/cli-code-scanning",
    icon: IconScanCode,
  },
  {
    key: "bestTms",
    label: "SEO",
    title: "Best TMS",
    description: "Capture comparison traffic with sharper solution pages.",
    href: "/$locale/i18n/best-tms",
    icon: IconGlobe,
  },
];

export default function FrameworkSupport() {
  const t = useT("frameworkSupport");
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";

  return (
    <section id="frameworks" className="pt-16 pb-8 sm:pt-20 sm:pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center rounded-full border border-mist-200 bg-mist-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-mist-600">
            {t("eyebrow", { defaultValue: "Frameworks" })}
          </div>
          <h2 className="mt-4 font-display text-3xl/[1.06] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.02]">
            {t("title", {
              defaultValue: "Framework pages that rank, explain, and convert",
            })}
          </h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-mist-700">
            {t("subtitle", {
              defaultValue:
                "Turn framework support into a tighter SEO surface with pages developers can scan fast and trust immediately.",
            })}
          </p>
        </div>

        <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="overflow-hidden rounded-[1.75rem] border border-mist-200 bg-white shadow-[0_30px_90px_-60px_rgba(15,23,42,0.3)]">
            <div className="border-b border-mist-100 px-5 py-4">
              <h3 className="text-xl font-medium tracking-[-0.02em] text-mist-950">
                {t("listTitle", { defaultValue: "Frameworks" })}
              </h3>
            </div>

            <div className="grid sm:grid-cols-2">
              {frameworks.map((framework, index) => {
                const Icon = framework.icon;
                const isLast = index === frameworks.length - 1;
                const isLastRow = index >= frameworks.length - 2;

                return (
                  <Link
                    key={framework.key}
                    to={framework.href}
                    params={{ locale: currentLocale }}
                    className={[
                      "group flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-mist-50/70",
                      "sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-mist-100",
                      isLast ? "" : "border-b border-mist-100",
                      isLastRow ? "sm:border-b-0" : "sm:border-b sm:border-mist-100",
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-mist-100 bg-mist-50 text-mist-700">
                        <Icon className="size-[18px]" />
                      </div>
                      <span className="truncate text-lg font-medium tracking-[-0.02em] text-mist-700 transition-colors group-hover:text-mist-950 sm:text-[1.15rem]">
                        {t(`frameworks.${framework.key}.name`, {
                          defaultValue: framework.name,
                        })}
                      </span>
                    </div>
                    <IconChevronRight className="size-5 shrink-0 text-mist-400 transition-all group-hover:translate-x-0.5 group-hover:text-mist-700" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex h-full flex-col gap-3 sm:grid sm:grid-cols-3 lg:flex lg:flex-col">
            {seoSurfaces.map((surface) => {
              const Icon = surface.icon;

              return (
                <Link
                  key={surface.key}
                  to={surface.href}
                  params={{ locale: currentLocale }}
                  className="group flex flex-1 rounded-2xl border border-mist-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-mist-300 hover:shadow-md"
                >
                  <div className="flex w-full items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-mist-100 bg-mist-50 text-mist-700">
                        <Icon className="size-[18px]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-mist-500">
                          {t(`surfaces.${surface.key}.label`, {
                            defaultValue: surface.label,
                          })}
                        </p>
                        <p className="mt-1 text-sm font-medium text-mist-950 sm:text-[15px]">
                          {t(`surfaces.${surface.key}.title`, {
                            defaultValue: surface.title,
                          })}
                        </p>
                        <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-mist-600">
                          {t(`surfaces.${surface.key}.description`, {
                            defaultValue: surface.description,
                          })}
                        </p>
                      </div>
                    </div>
                    <IconChevronRight className="mt-1 size-5 shrink-0 text-mist-400 transition-all group-hover:translate-x-0.5 group-hover:text-mist-700" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
