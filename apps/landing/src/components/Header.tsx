import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";

import { cn } from "@better-i18n/ui/lib/utils";
import {
  IconAiTranslate,
  IconPeople,
  IconNewspaper,
  IconGithub,
  IconModelcontextprotocol,
  IconCloudySparkle,
  IconConsoleSimple,
  IconArrowUpRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import {
  NextjsIcon,
  ReactIcon,
  VueIcon,
  NuxtIcon,
  AngularIcon,
  SvelteIcon,
  ExpoIcon,
  TanStackIcon,
} from "@/components/icons/FrameworkIcons";
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
  MegaMenuPillExternal,
  MegaMenuPillButton,
  MegaMenuFooter,
} from "./header/mega-menu";

// Helpway widget exposes a global window.Helpway API once mounted.
// Header lives outside <SupportProvider> tree, so we call this global
// instead of useWidgetStore (which throws without provider context).
declare global {
  interface Window {
    Helpway?: {
      open: () => void;
      close: () => void;
      toggle: () => void;
    };
  }
}

// MobileNav is now lightweight (~1KB trigger only) — its panel chunk is
// lazy-loaded inside MobileNav itself when the user opens the menu.
import { MobileNav } from "./MobileNav";

export default function Header({ className }: { className?: string }) {
  const { locale } = useParams({ strict: false });
  const t = useT("header");

  // Pre-warm widget chunk during browser idle so it's hydrated by the time
  // the user clicks Help Center. Lazy-load is for LCP — pre-warming on idle
  // doesn't hurt LCP but eliminates the click-to-open delay.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ric = (
      window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback;
    const warm = () => {
      // The chunk import primes the network + parse, but doesn't mount.
      // Mount happens via the <LazyHelpwayWidget> in __root.tsx.
      import("@helpway/react").catch(() => {});
    };
    if (ric) {
      ric(warm, { timeout: 4000 });
    } else {
      setTimeout(warm, 3000);
    }
  }, []);

  // Open Helpway widget via global API (window.Helpway.open). The widget
  // is lazy-loaded in __root.tsx, so window.Helpway may not be available
  // immediately on first click — retry briefly until the widget hydrates.
  // Using the global avoids needing <SupportProvider> context in the header.
  const openHelpWidget = useCallback(() => {
    if (typeof window === "undefined") return;
    let attempts = 0;
    const tryOpen = () => {
      if (window.Helpway?.open) {
        window.Helpway.open();
        return;
      }
      if (attempts++ < 30) {
        setTimeout(tryOpen, 100); // up to ~3s while widget chunk loads
      }
    };
    tryOpen();
  }, []);

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
    <header className={cn("sticky top-0 z-40 bg-mist-100", className)}>
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
                    index={0}
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
                    index={1}
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
                    index={2}
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
                    index={3}
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
                    index={4}
                    to="/$locale/for-startups/"
                    params={{ locale: locale || "en" }}
                    icon={<SpriteIcon name="zap" className="size-4" />}
                    label={t("menu.solutions.startups", {
                      defaultValue: "Startups",
                    })}
                  />
                  <MegaMenuPill
                    index={5}
                    to="/$locale/for-saas/"
                    params={{ locale: locale || "en" }}
                    icon={<IconCloudySparkle className="size-4" />}
                    label={t("menu.solutions.saas", { defaultValue: "SaaS" })}
                  />
                  <MegaMenuPill
                    index={6}
                    to="/$locale/for-ecommerce/"
                    params={{ locale: locale || "en" }}
                    icon={<SpriteIcon name="chart" className="size-4" />}
                    label={t("menu.solutions.ecommerce", {
                      defaultValue: "E-Commerce",
                    })}
                  />
                  <MegaMenuPill
                    index={7}
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
            {/* Integrations Mega Menu (merged Developers + Integrations) */}
            <MegaMenu label={t("integrations.title", { defaultValue: "Integrations" })}>
              <MegaMenuPanel widthClass="w-[680px]">
                <MegaMenuSection
                  label={t("integrations.frameworkSdks", {
                    defaultValue: "Framework SDKs",
                  })}
                  noDivider
                  layoutClass="grid grid-cols-3 gap-1"
                >
                  <MegaMenuPill
                    index={0}
                    to="/$locale/i18n/react/"
                    params={{ locale: locale || "en" }}
                    icon={<ReactIcon className="size-4" />}
                    label="React"
                  />
                  <MegaMenuPill
                    index={1}
                    to="/$locale/i18n/nextjs/"
                    params={{ locale: locale || "en" }}
                    icon={<NextjsIcon className="size-4" />}
                    label="Next.js"
                  />
                  <MegaMenuPill
                    index={2}
                    to="/$locale/i18n/vue/"
                    params={{ locale: locale || "en" }}
                    icon={<VueIcon className="size-4" />}
                    label="Vue"
                  />
                  <MegaMenuPill
                    index={3}
                    to="/$locale/i18n/nuxt/"
                    params={{ locale: locale || "en" }}
                    icon={<NuxtIcon className="size-4" />}
                    label="Nuxt"
                  />
                  <MegaMenuPill
                    index={4}
                    to="/$locale/i18n/angular/"
                    params={{ locale: locale || "en" }}
                    icon={<AngularIcon className="size-4" />}
                    label="Angular"
                  />
                  <MegaMenuPill
                    index={5}
                    to="/$locale/i18n/svelte/"
                    params={{ locale: locale || "en" }}
                    icon={<SvelteIcon className="size-4" />}
                    label="Svelte"
                  />
                  <MegaMenuPill
                    index={6}
                    to="/$locale/i18n/expo/"
                    params={{ locale: locale || "en" }}
                    icon={<ExpoIcon className="size-4" />}
                    label="Expo"
                  />
                  <MegaMenuPill
                    index={7}
                    to="/$locale/i18n/tanstack-start/"
                    params={{ locale: locale || "en" }}
                    icon={<TanStackIcon className="size-4" />}
                    label="TanStack"
                  />
                  <MegaMenuPill
                    index={8}
                    to="/$locale/i18n/server/"
                    params={{ locale: locale || "en" }}
                    icon={<IconConsoleSimple className="size-4" />}
                    label="Hono / Node"
                  />
                </MegaMenuSection>

                <MegaMenuSection
                  label={t("integrations.aiTranslation", {
                    defaultValue: "AI & Machine Translation",
                  })}
                  layoutClass="grid grid-cols-2 gap-1"
                >
                  <MegaMenuCard
                    index={9}
                    to="/$locale/integrations/$slug/"
                    params={{ locale: locale || "en", slug: "mcp-server" }}
                    icon={<IconModelcontextprotocol className="size-5" />}
                    title={t("integrations.featured.mcp-server.name", {
                      defaultValue: "MCP Server",
                    })}
                    description={t("integrations.featured.mcp-server.description", {
                      defaultValue: "AI agents manage translations natively",
                    })}
                  />
                  <MegaMenuCard
                    index={10}
                    to="/$locale/integrations/$slug/"
                    params={{ locale: locale || "en", slug: "ai-translation" }}
                    icon={<IconAiTranslate className="size-5" />}
                    title={t("integrations.featured.ai-translation.name", {
                      defaultValue: "AI Translation",
                    })}
                    description={t("integrations.featured.ai-translation.description", {
                      defaultValue: "Multi-provider LLM translation pipeline",
                    })}
                  />
                </MegaMenuSection>

                <MegaMenuSection
                  label={t("integrations.devTools", {
                    defaultValue: "Developer Tools",
                  })}
                  layoutClass="grid grid-cols-3 gap-1"
                >
                  <MegaMenuPill
                    index={11}
                    to="/$locale/integrations/$slug/"
                    params={{ locale: locale || "en", slug: "github" }}
                    icon={<IconGithub className="size-4" />}
                    label={t("integrations.featured.github.name", {
                      defaultValue: "GitHub Sync",
                    })}
                  />
                  <MegaMenuPill
                    index={12}
                    to="/$locale/integrations/$slug/"
                    params={{ locale: locale || "en", slug: "cli" }}
                    icon={<IconConsoleSimple className="size-4" />}
                    label={t("integrations.featured.cli.name", {
                      defaultValue: "CLI",
                    })}
                  />
                  <MegaMenuPill
                    index={13}
                    to="/$locale/integrations/$slug/"
                    params={{ locale: locale || "en", slug: "global-cdn" }}
                    icon={<IconCloudySparkle className="size-4" />}
                    label={t("integrations.featured.global-cdn.name", {
                      defaultValue: "Global CDN",
                    })}
                  />
                </MegaMenuSection>

                <MegaMenuFooter
                  primary={
                    <Link
                      to="/$locale/integrations/"
                      params={{ locale: locale || "en" }}
                      className="inline-flex items-center gap-1 hover:text-mist-700 transition-colors"
                    >
                      {t("integrations.exploreAll", {
                        defaultValue: "All integrations",
                      })}
                      <SpriteIcon name="arrow-right" className="size-3.5" />
                    </Link>
                  }
                  secondary={
                    <a
                      href="https://docs.better-i18n.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-mist-950 transition-colors"
                    >
                      <SpriteIcon name="book" className="size-3.5" />
                      {t("documentation", { defaultValue: "Documentation" })}
                    </a>
                  }
                />
              </MegaMenuPanel>
            </MegaMenu>

            <Link
              to="/$locale/pricing/"
              params={{ locale: locale || "en" }}
              className="text-sm/7 font-medium text-mist-950 hover:text-mist-600"
            >
              {t("pricing", { defaultValue: "Pricing" })}
            </Link>
            {/* Resources Mega Menu */}
            <MegaMenu label={t("resources.title", { defaultValue: "Resources" })}>
              <MegaMenuPanel widthClass="w-[600px]">
                <MegaMenuSection
                  label={t("resources.learn", { defaultValue: "Learn" })}
                  noDivider
                  layoutClass="grid grid-cols-2 gap-1"
                >
                  <MegaMenuCard
                    index={0}
                    to="/$locale/what-is/"
                    params={{ locale: locale || "en" }}
                    icon={<SpriteIcon name="book" className="size-5" />}
                    title={t("resources.whatIsI18n", {
                      defaultValue: "What is i18n?",
                    })}
                    description={t("resources.whatIsI18nDesc", {
                      defaultValue: "Complete guide to i18n & l10n",
                    })}
                  />
                  <MegaMenuCard
                    index={1}
                    to="/$locale/blog/"
                    params={{ locale: locale || "en" }}
                    icon={<IconNewspaper className="size-5" />}
                    title={t("blog", { defaultValue: "Blog" })}
                    description={t("resources.blogDesc", {
                      defaultValue: "Engineering & localization insights",
                    })}
                  />
                </MegaMenuSection>

                <MegaMenuSection
                  label={t("resources.tools", { defaultValue: "Tools & utilities" })}
                  layoutClass="grid grid-cols-3 gap-1"
                >
                  <MegaMenuPill
                    index={2}
                    to="/$locale/tools/"
                    params={{ locale: locale || "en" }}
                    icon={<SpriteIcon name="code-brackets" className="size-4" />}
                    label={t("resources.freeTools", {
                      defaultValue: "Free Tools",
                    })}
                  />
                  <MegaMenuPill
                    index={3}
                    to="/$locale/compare/"
                    params={{ locale: locale || "en" }}
                    icon={<SpriteIcon name="sparkles-soft" className="size-4" />}
                    label={t("compare", { defaultValue: "Compare" })}
                  />
                  <MegaMenuPill
                    index={4}
                    to="/$locale/changelog/"
                    params={{ locale: locale || "en" }}
                    icon={<SpriteIcon name="sparkles-soft" className="size-4" />}
                    label={t("changelog", { defaultValue: "Changelog" })}
                  />
                </MegaMenuSection>

                <MegaMenuSection
                  label={t("resources.support", { defaultValue: "Support & company" })}
                  layoutClass="grid grid-cols-3 gap-1"
                >
                  <MegaMenuPillButton
                    onClick={openHelpWidget}
                    icon={<LifeBuoy className="size-4" />}
                    label={t("resources.helpCenter", {
                      defaultValue: "Help Center",
                    })}
                  />
                  <MegaMenuPillExternal
                    href="https://docs.better-i18n.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    external
                    icon={<SpriteIcon name="book" className="size-4" />}
                    label={t("documentation", {
                      defaultValue: "Documentation",
                    })}
                  />
                  <MegaMenuPill
                    to="/$locale/about/"
                    params={{ locale: locale || "en" }}
                    icon={<IconPeople className="size-4" />}
                    label={t("resources.about.title", { defaultValue: "About" })}
                  />
                </MegaMenuSection>

                <MegaMenuFooter
                  primary={
                    <button
                      type="button"
                      onClick={openHelpWidget}
                      className="inline-flex items-center gap-1.5 hover:text-mist-700 transition-colors"
                    >
                      <LifeBuoy className="size-3.5" />
                      {t("resources.contactSupport", {
                        defaultValue: "Contact support",
                      })}
                    </button>
                  }
                  secondary={
                    <a
                      href="https://status.better-i18n.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/status inline-flex items-center gap-1.5 hover:text-mist-950 transition-colors"
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          isStatusOk ? "bg-emerald-500" : "bg-red-500",
                        )}
                      />
                      {isStatusOk
                        ? t("resources.allOperational", {
                            defaultValue: "All systems operational",
                          })
                        : t("status", { defaultValue: "Status" })}
                      <IconArrowUpRight className="size-3 text-mist-400 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all duration-200 group-hover/status:opacity-100 group-hover/status:translate-y-0 group-hover/status:translate-x-0 group-hover/status:text-mist-700" />
                    </a>
                  }
                />
              </MegaMenuPanel>
            </MegaMenu>
            <Link
              to="/$locale/careers/"
              params={{ locale: locale || "en" }}
              className="text-sm/7 font-medium text-mist-950 hover:text-mist-600 inline-flex items-center gap-1.5"
            >
              {t("hiring", { defaultValue: "Hiring" })}
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </Link>
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
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
