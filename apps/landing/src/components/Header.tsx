import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";

import { cn } from "@better-i18n/ui/lib/utils";
import {
  IconAiTranslate,
  IconPeople,
  IconNewspaper,
  IconLiveActivity,
  IconGithub,
  IconModelcontextprotocol,
  IconCloudySparkle,
  IconConsoleSimple,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { NextjsIcon } from "@/components/icons/FrameworkIcons";
import { LifeBuoy } from "lucide-react";
import { SpriteIcon } from "@/components/SpriteIcon";
import { useT } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  MegaMenu,
  MegaMenuPanel,
  MegaMenuSection,
  MegaMenuCard,
  MegaMenuPill,
  MegaMenuFooter,
} from "./header/mega-menu";

const LazyMobileNav = lazy(() =>
  import("./MobileNav").then((m) => ({ default: m.MobileNav })),
);

// Featured integrations shown in the nav dropdown
const NAV_INTEGRATIONS: Array<{
  slug: string;
  name: string;
  defaultDescription: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    slug: "github",
    name: "GitHub",
    defaultDescription: "Review translation PRs in your Git workflow",
    Icon: IconGithub,
  },
  {
    slug: "mcp-server",
    name: "MCP Server",
    defaultDescription: "AI agents manage translations via Claude, Cursor",
    Icon: IconModelcontextprotocol,
  },
  {
    slug: "global-cdn",
    name: "Global CDN",
    defaultDescription: "Serve translations from 300+ edge locations",
    Icon: IconCloudySparkle,
  },
  {
    slug: "nextjs",
    name: "Next.js",
    defaultDescription: "App Router native with CDN-first delivery",
    Icon: NextjsIcon,
  },
  {
    slug: "cli",
    name: "CLI",
    defaultDescription: "Scan, sync, and automate from the terminal",
    Icon: IconConsoleSimple,
  },
  {
    slug: "ai-translation",
    name: "AI Translation",
    defaultDescription: "Generate drafts, review before shipping",
    Icon: IconAiTranslate,
  },
];

export default function Header({ className }: { className?: string }) {
  const { locale } = useParams({ strict: false });
  const t = useT("header");

  // Defer the status fetch until the main thread is idle. The status pill is
  // a non-critical secondary signal; running it during hydration competes with
  // the home page's 13-section hydration and shows up as INP cost. Idle is the
  // earliest moment we can fetch without harming LCP/INP. See BETTER-268.
  const [statusQueryEnabled, setStatusQueryEnabled] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ric =
      (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) {
      const handle = ric(() => setStatusQueryEnabled(true), { timeout: 3000 });
      return () => {
        const cic =
          (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
        cic?.(handle);
      };
    }
    const t = setTimeout(() => setStatusQueryEnabled(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const { data: statusData } = useQuery<{ status: string }>({
    queryKey: ["site-status"],
    queryFn: () => fetch("/api/status").then((r) => r.json()),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    enabled: statusQueryEnabled,
  });
  const isStatusOk = !statusData || statusData.status === "operational";

  return (
    <header className={cn("sticky top-0 z-10 bg-mist-100", className)}>
      <nav aria-label="Main navigation">
        <div className="mx-auto flex h-[5.25rem] max-w-7xl items-center gap-4 px-6 lg:px-10">
          <div className="flex flex-1 items-center">
            <Link
              to="/$locale/"
              params={{ locale: locale || "en" }}
              className="inline-flex items-center gap-2.5"
            >
              <img
                src="/brand/logo.svg"
                alt="Better I18N - Translation Management Platform"
                width={28}
                height={28}
                className="w-8 h-7 text-black dark:text-white"
              />
              <span className="font-display font-semibold text-[19px]">
                Better I18N
              </span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            {/* Product Mega Menu */}
            <MegaMenu label={t("forProduct", { defaultValue: "Product" })}>
              <MegaMenuPanel widthClass="w-[640px]">
                <MegaMenuSection
                  label={t("menu.whoItsFor", { defaultValue: "Who it's for" })}
                  noDivider
                  layoutClass="grid grid-cols-2 gap-1"
                >
                  <MegaMenuCard
                    to="/$locale/for-developers/"
                    params={{ locale: locale || "en" }}
                    icon={<SpriteIcon name="code-brackets" className="size-5" />}
                    title={t("segments.developers.title", {
                      defaultValue: "For Developers",
                    })}
                    description={t("segments.developers.shortDescription", {
                      defaultValue: "Type-safe SDKs, MCP & Git workflow",
                    })}
                  />
                  <MegaMenuCard
                    to="/$locale/for-translators/"
                    params={{ locale: locale || "en" }}
                    icon={<IconAiTranslate className="size-5" />}
                    title={t("segments.translators.title", {
                      defaultValue: "For Translators",
                    })}
                    description={t("segments.translators.shortDescription", {
                      defaultValue: "Context-rich CAT environment + AI",
                    })}
                  />
                  <MegaMenuCard
                    to="/$locale/for-product-teams/"
                    params={{ locale: locale || "en" }}
                    icon={<SpriteIcon name="rocket" className="size-5" />}
                    title={t("segments.productTeams.title", {
                      defaultValue: "For Product Teams",
                    })}
                    description={t("segments.productTeams.shortDescription", {
                      defaultValue: "Manage localization without the hassle",
                    })}
                  />
                  <MegaMenuCard
                    to="/$locale/for-enterprises/"
                    params={{ locale: locale || "en" }}
                    icon={<IconPeople className="size-5" />}
                    title={t("segments.enterprises.title", {
                      defaultValue: "For Enterprises",
                    })}
                    description={t("segments.enterprises.shortDescription", {
                      defaultValue: "Localization at enterprise scale",
                    })}
                  />
                </MegaMenuSection>

                <MegaMenuSection
                  label={t("menu.byIndustry", { defaultValue: "By industry" })}
                  layoutClass="grid grid-cols-3 gap-1"
                >
                  <MegaMenuPill
                    to="/$locale/for-startups/"
                    params={{ locale: locale || "en" }}
                    icon={<SpriteIcon name="zap" className="size-4" />}
                    label={t("menu.solutions.startups", {
                      defaultValue: "Startups",
                    })}
                  />
                  <MegaMenuPill
                    to="/$locale/for-saas/"
                    params={{ locale: locale || "en" }}
                    icon={<IconCloudySparkle className="size-4" />}
                    label={t("menu.solutions.saas", { defaultValue: "SaaS" })}
                  />
                  <MegaMenuPill
                    to="/$locale/for-ecommerce/"
                    params={{ locale: locale || "en" }}
                    icon={<SpriteIcon name="chart" className="size-4" />}
                    label={t("menu.solutions.ecommerce", {
                      defaultValue: "E-Commerce",
                    })}
                  />
                  <MegaMenuPill
                    to="/$locale/for-agencies/"
                    params={{ locale: locale || "en" }}
                    icon={<SpriteIcon name="group" className="size-4" />}
                    label={t("menu.solutions.agencies", {
                      defaultValue: "Agencies",
                    })}
                  />
                </MegaMenuSection>

                <MegaMenuFooter
                  primary={
                    <Link
                      to="/$locale/features/"
                      params={{ locale: locale || "en" }}
                      className="inline-flex items-center gap-1 hover:text-mist-700 transition-colors"
                    >
                      {t("features", { defaultValue: "All features" })}
                      <SpriteIcon name="arrow-right" className="size-3.5" />
                    </Link>
                  }
                  secondary={
                    <a
                      href="https://cal.com/better-i18n/30min?overlayCalendar=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-mist-950 transition-colors"
                    >
                      {t("menu.scheduleDemo", {
                        defaultValue: "Schedule a demo",
                      })}
                    </a>
                  }
                />
              </MegaMenuPanel>
            </MegaMenu>
            {/* Developers Mega Menu */}
            <div className="relative group">
              <button
                aria-haspopup="true"
                aria-expanded="false"
                className="inline-flex items-center gap-1 text-sm/7 font-medium text-mist-950 hover:text-mist-600"
              >
                {t("developers.title", { defaultValue: "Developers" })}
                <SpriteIcon
                  name="chevron-bottom"
                  className="w-4 h-4 text-mist-600 group-hover:text-mist-950 transition-transform group-hover:rotate-180"
                />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-mist-50 rounded-xl border border-mist-200 p-1.5 w-[520px] shadow-lg">
                  <div
                    className="bg-white rounded-lg border border-mist-200 p-2 shadow-sm"
                    role="menu"
                  >
                    <p className="px-2.5 py-1.5 text-xs font-medium text-mist-700 uppercase tracking-wider">
                      {t("developers.frameworkGuides", {
                        defaultValue: "Framework Guides",
                      })}
                    </p>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      <Link
                        to="/$locale/i18n/react/"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">
                          React
                        </span>
                        <SpriteIcon
                          name="arrow-right"
                          className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        />
                      </Link>
                      <Link
                        to="/$locale/i18n/nextjs/"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">
                          Next.js
                        </span>
                        <SpriteIcon
                          name="arrow-right"
                          className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        />
                      </Link>
                      <Link
                        to="/$locale/i18n/vue/"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">
                          Vue
                        </span>
                        <SpriteIcon
                          name="arrow-right"
                          className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        />
                      </Link>
                      <Link
                        to="/$locale/i18n/nuxt/"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">
                          Nuxt
                        </span>
                        <SpriteIcon
                          name="arrow-right"
                          className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        />
                      </Link>
                      <Link
                        to="/$locale/i18n/angular/"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">
                          Angular
                        </span>
                        <SpriteIcon
                          name="arrow-right"
                          className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        />
                      </Link>
                      <Link
                        to="/$locale/i18n/svelte/"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">
                          Svelte
                        </span>
                        <SpriteIcon
                          name="arrow-right"
                          className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        />
                      </Link>
                      <Link
                        to="/$locale/i18n/expo/"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">
                          Expo
                        </span>
                        <SpriteIcon
                          name="arrow-right"
                          className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        />
                      </Link>
                      <Link
                        to="/$locale/i18n/tanstack-start/"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">
                          TanStack Start
                        </span>
                        <SpriteIcon
                          name="arrow-right"
                          className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        />
                      </Link>
                      <Link
                        to="/$locale/i18n/server/"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">
                          Server / Hono
                        </span>
                        <SpriteIcon
                          name="arrow-right"
                          className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="px-3 py-2.5 flex items-center justify-between">
                    <p className="text-sm text-mist-700">
                      {t("developers.viewDocs", {
                        defaultValue: "View full documentation",
                      })}
                    </p>
                    <a
                      href="https://docs.better-i18n.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-mist-950 hover:underline"
                    >
                      {t("documentation", { defaultValue: "Documentation" })}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Integrations Mega Menu */}
            <div className="relative group">
              <button
                aria-haspopup="true"
                aria-expanded="false"
                className="inline-flex items-center gap-1 text-sm/7 font-medium text-mist-950 hover:text-mist-600"
              >
                {t("integrations.title", { defaultValue: "Integrations" })}
                <SpriteIcon
                  name="chevron-bottom"
                  className="w-4 h-4 text-mist-600 group-hover:text-mist-950 transition-transform group-hover:rotate-180"
                />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-mist-50 rounded-xl border border-mist-200 p-1.5 w-[480px] shadow-lg">
                  <div className="bg-white rounded-lg border border-mist-200 p-2 shadow-sm" role="menu">
                    <p className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-mist-500">
                      {t("integrations.featuredLabel", { defaultValue: "Featured" })}
                    </p>
                    <div className="grid grid-cols-2 gap-0.5 mt-0.5">
                      {NAV_INTEGRATIONS.map((item) => (
                        <Link
                          key={item.slug}
                          to="/$locale/integrations/$slug/"
                          params={{ locale: locale || "en", slug: item.slug }}
                          className="group/item flex items-start gap-3 px-2.5 py-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-mist-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)] mt-0.5">
                            <item.Icon className="size-4 text-mist-800" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-mist-950 leading-snug">{t(`integrations.featured.${item.slug}.name`, { defaultValue: item.name })}</span>
                            <span className="block text-xs text-mist-500 leading-relaxed mt-0.5">{t(`integrations.featured.${item.slug}.description`, { defaultValue: item.defaultDescription })}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="px-3 py-2.5 flex items-center justify-between">
                    <Link
                      to="/$locale/integrations/"
                      params={{ locale: locale || "en" }}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-mist-950 hover:text-mist-600"
                    >
                      {t("integrations.exploreAll", { defaultValue: "Explore all integrations" })}
                      <SpriteIcon name="arrow-right" className="size-3.5" />
                    </Link>
                    <span className="text-xs text-mist-500">{t("integrations.count", { defaultValue: "20 integrations" })}</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/$locale/pricing/"
              params={{ locale: locale || "en" }}
              className="text-sm/7 font-medium text-mist-950 hover:text-mist-600"
            >
              {t("pricing", { defaultValue: "Pricing" })}
            </Link>
            <div className="relative group">
              <button
                aria-haspopup="true"
                aria-expanded="false"
                className="inline-flex items-center gap-1 text-sm/7 font-medium text-mist-950 hover:text-mist-600"
              >
                {t("resources.title", { defaultValue: "Resources" })}
                <SpriteIcon
                  name="chevron-bottom"
                  className="w-4 h-4 text-mist-600 group-hover:text-mist-950 transition-transform group-hover:rotate-180"
                />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-mist-50 rounded-xl border border-mist-200 p-1.5 shadow-lg min-w-[480px]">
                  <div className="flex gap-2">
                    {/* Left column - Main links with icons and descriptions */}
                    <div
                      className="bg-white rounded-lg border border-mist-200 p-2 shadow-sm space-y-1 min-w-[260px]"
                      role="menu"
                    >
                      {/* About Us */}
                      <Link
                        to="/$locale/about/"
                        params={{ locale: locale || "en" }}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <div className="flex-shrink-0 size-12 rounded-lg bg-white border border-mist-200 shadow-sm flex items-center justify-center text-mist-700">
                          <IconPeople className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-sm font-medium text-mist-950">
                            {t("resources.about.title", {
                              defaultValue: "About Us",
                            })}
                          </div>
                          <div className="text-xs text-mist-700 leading-relaxed mt-0.5">
                            {t("resources.about.description", {
                              defaultValue: "The team behind Better I18N",
                            })}
                          </div>
                        </div>
                      </Link>

                      {/* Privacy Policy */}
                      <Link
                        to="/$locale/privacy/"
                        params={{ locale: locale || "en" }}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <div className="flex-shrink-0 size-12 rounded-lg bg-white border border-mist-200 shadow-sm flex items-center justify-center text-mist-700">
                          <SpriteIcon name="shield-check" className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-sm font-medium text-mist-950">
                            {t("resources.privacy.title", {
                              defaultValue: "Privacy Policy",
                            })}
                          </div>
                          <div className="text-xs text-mist-700 leading-relaxed mt-0.5">
                            {t("resources.privacy.description", {
                              defaultValue: "How we handle your data",
                            })}
                          </div>
                        </div>
                      </Link>

                      {/* Terms of Service */}
                      <Link
                        to="/$locale/terms/"
                        params={{ locale: locale || "en" }}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <div className="flex-shrink-0 size-12 rounded-lg bg-white border border-mist-200 shadow-sm flex items-center justify-center text-mist-700">
                          <SpriteIcon name="script" className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-sm font-medium text-mist-950">
                            {t("resources.terms.title", {
                              defaultValue: "Terms of Service",
                            })}
                          </div>
                          <div className="text-xs text-mist-700 leading-relaxed mt-0.5">
                            {t("resources.terms.description", {
                              defaultValue: "Our terms and conditions",
                            })}
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Right column - Simple links with small icons */}
                    <div className="p-3 space-y-1 min-w-[180px]" role="menu">
                      {/* Help Center */}
                      <a
                        href={`https://help.better-i18n.com/${locale || "en"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <LifeBuoy className="size-4 text-mist-600" />
                        <span className="text-sm font-medium text-mist-950">
                          {t("resources.helpCenter", {
                            defaultValue: "Help Center",
                          })}
                        </span>
                      </a>

                      {/* Documentation */}
                      <a
                        href="https://docs.better-i18n.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <SpriteIcon
                          name="book"
                          className="size-4 text-mist-600"
                        />
                        <span className="text-sm font-medium text-mist-950">
                          {t("documentation", {
                            defaultValue: "Documentation",
                          })}
                        </span>
                      </a>

                      {/* Changelog */}
                      <Link
                        to="/$locale/changelog/"
                        params={{ locale: locale || "en" }}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <SpriteIcon
                          name="sparkles-soft"
                          className="size-4 text-mist-600"
                        />
                        <span className="text-sm font-medium text-mist-950">
                          {t("changelog", { defaultValue: "Changelog" })}
                        </span>
                      </Link>

                      {/* Blog */}
                      <Link
                        to="/$locale/blog/"
                        params={{ locale: locale || "en" }}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <IconNewspaper className="size-4 text-mist-600" />
                        <span className="text-sm font-medium text-mist-950">
                          {t("blog", { defaultValue: "Blog" })}
                        </span>
                      </Link>

                      {/* API Reference */}
                      <a
                        href="https://docs.better-i18n.com/api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <SpriteIcon
                          name="api-connection"
                          className="size-4 text-mist-600"
                        />
                        <span className="text-sm font-medium text-mist-950">
                          {t("apiReference", { defaultValue: "API Reference" })}
                        </span>
                      </a>

                      {/* Status */}
                      <a
                        href="https://status.better-i18n.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <div className="relative">
                          <IconLiveActivity className="size-4 text-mist-600" />
                          {!isStatusOk && (
                            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-red-500 ring-1 ring-white" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-mist-950">
                          {t("status", { defaultValue: "Status" })}
                        </span>
                      </a>

                      {/* What is i18n? */}
                      <Link
                        to="/$locale/what-is/"
                        params={{ locale: locale || "en" }}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <SpriteIcon
                          name="globe"
                          className="size-4 text-mist-600"
                        />
                        <span className="text-sm font-medium text-mist-950">
                          {t("resources.whatIsI18n", {
                            defaultValue: "What is i18n?",
                          })}
                        </span>
                      </Link>

                      {/* Free Tools */}
                      <Link
                        to="/$locale/tools/"
                        params={{ locale: locale || "en" }}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <SpriteIcon
                          name="code-brackets"
                          className="size-4 text-mist-600"
                        />
                        <span className="text-sm font-medium text-mist-950">
                          {t("resources.freeTools", {
                            defaultValue: "Free Tools",
                          })}
                        </span>
                      </Link>
                      {/* Compare */}
                      <Link
                        to="/$locale/compare/"
                        params={{ locale: locale || "en" }}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <SpriteIcon
                          name="sparkles-soft"
                          className="size-4 text-mist-600"
                        />
                        <span className="text-sm font-medium text-mist-950">
                          {t("compare", { defaultValue: "Compare" })}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-1 items-center justify-end gap-4">
            <LanguageSwitcher />
            <div className="flex shrink-0 items-center gap-5">
              <a
                href="https://dash.better-i18n.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-mist-950 px-4 py-1.5 text-sm/7 font-medium text-white hover:bg-mist-800"
              >
                {t("getStarted", { defaultValue: "Get Started" })}
              </a>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="lg:hidden">
                <div className="flex size-10 items-center justify-center rounded-lg text-mist-950">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16" />
                  </svg>
                </div>
              </div>
            }
          >
            <LazyMobileNav />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
