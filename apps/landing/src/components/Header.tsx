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
import { LifeBuoy } from "lucide-react";
import { guideIcon } from "@/lib/i18n-guide-icons";
import { SpriteIcon } from "@/components/SpriteIcon";
import { useT } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ProductTile } from "./ui/product-tile";
import {
  MegaMenu,
  MegaMenuPanel,
  MegaMenuSection,
  MegaMenuCard,
  MegaMenuRail,
  MegaMenuRailGroup,
  MegaMenuRailLink,
  MegaMenuSplit,
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
      const handle = ric(warm, { timeout: 4000 });
      return () => {
        const cic = (window as Window & { cancelIdleCallback?: (h: number) => void })
          .cancelIdleCallback;
        cic?.(handle);
      };
    }
    // Own the timer: without cleanup an unmount mid-delay still fires the import.
    const timer = setTimeout(warm, 3000);
    return () => clearTimeout(timer);
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
    queryFn: async () => {
      const r = await fetch("/api/status");
      // A non-2xx (e.g. 404 from an unrouted /api/status) still returns valid
      // JSON like {"error":"Not found"} — parsing it would leave status
      // undefined and paint a false red dot. Throw so the query stays in its
      // (undefined) loading state, which renders as operational.
      if (!r.ok) throw new Error(`status ${r.status}`);
      return r.json();
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: statusQueryEnabled,
  });
  // Default to OK: only flip to the red/"Status" state when the endpoint
  // explicitly reports a non-operational aggregate_state. Missing data or a
  // malformed payload must never read as an outage.
  const isStatusOk = !statusData?.status || statusData.status === "operational";

  return (
    <header className={cn("site-header", className)}>
      <nav aria-label="Main navigation">
        <div className="header-inner">
          {/* The frame's corner ticks, continuing the vertical rules downward. */}
          <span className="header-tick header-tick--l" aria-hidden="true" />
          <span className="header-tick header-tick--r" aria-hidden="true" />

          <div className="flex flex-1 items-center">
            <Link
              to="/$locale/"
              params={{ locale: locale || "en" }}
              className="site-logo"
            >
              <img
                src="/brand/logo.svg"
                alt="Better I18N - Translation Management Platform"
                width={24}
                height={24}
                className="size-6"
              />
              Better I18N
            </Link>
          </div>
          {/* Centred nav — the frame is the page's spine, so the nav sits on it. */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-px lg:flex">
            {/* Product Mega Menu */}
            <MegaMenu label={t("forProduct")}>
              <MegaMenuPanel widthClass="w-[700px]">
                {/* cal.com-style split: the products carry the weight on the
                    left, every secondary route sits in the tinted rail at one
                    uniform density. Previously personas were cards (icon tile +
                    two-line description) stacked above industry pills (bare 13px
                    rows), so one panel held two different densities and read as
                    "one big block and one small one". */}
                <MegaMenuSplit railWidth="248px">
                  <MegaMenuSection
                    label={t("menu.products")}
                    noDivider
                    layoutClass="flex flex-col gap-0.5"
                  >
                    <MegaMenuCard
                      index={0}
                      to="/$locale/features/"
                      params={{ locale: locale || "en" }}
                      icon={<ProductTile product="i18n" size="md" />}
                      plainIcon
                      title={t("products.i18n.title")}
                      description={t("products.i18n.description")}
                    />
                    <MegaMenuCard
                      index={1}
                      to="/$locale/content/"
                      params={{ locale: locale || "en" }}
                      icon={<ProductTile product="content" size="md" />}
                      plainIcon
                      title={t("products.content.title")}
                      description={t("products.content.description")}
                    />
                    <MegaMenuCard
                      index={2}
                      to="/$locale/analytics/"
                      params={{ locale: locale || "en" }}
                      icon={<ProductTile product="analytics" size="md" />}
                      plainIcon
                      title={t("products.analytics.title")}
                      description={t("products.analytics.description")}
                    />
                  </MegaMenuSection>

                  <MegaMenuRail>
                    <MegaMenuRailGroup
                      label={t("menu.whoItsFor")}
                    >
                      <MegaMenuRailLink
                        to="/$locale/for-developers/"
                        params={{ locale: locale || "en" }}
                        icon={<SpriteIcon name="code-brackets" className="size-4" />}
                        label={t("segments.developers.title")}
                      />
                      <MegaMenuRailLink
                        to="/$locale/for-translators/"
                        params={{ locale: locale || "en" }}
                        icon={<IconAiTranslate className="size-4" />}
                        label={t("segments.translators.title")}
                      />
                      <MegaMenuRailLink
                        to="/$locale/for-product-teams/"
                        params={{ locale: locale || "en" }}
                        icon={<SpriteIcon name="rocket" className="size-4" />}
                        label={t("segments.productTeams.title")}
                      />
                      <MegaMenuRailLink
                        to="/$locale/for-enterprises/"
                        params={{ locale: locale || "en" }}
                        icon={<IconPeople className="size-4" />}
                        label={t("segments.enterprises.title")}
                      />
                    </MegaMenuRailGroup>

                    <MegaMenuRailGroup
                      label={t("menu.byIndustry")}
                    >
                      <MegaMenuRailLink
                        to="/$locale/for-startups/"
                        params={{ locale: locale || "en" }}
                        icon={<SpriteIcon name="zap" className="size-4" />}
                        label={t("menu.solutions.startups")}
                      />
                      <MegaMenuRailLink
                        to="/$locale/for-saas/"
                        params={{ locale: locale || "en" }}
                        icon={<IconCloudySparkle className="size-4" />}
                        label={t("menu.solutions.saas")}
                      />
                      <MegaMenuRailLink
                        to="/$locale/for-ecommerce/"
                        params={{ locale: locale || "en" }}
                        icon={<SpriteIcon name="chart" className="size-4" />}
                        label={t("menu.solutions.ecommerce")}
                      />
                      <MegaMenuRailLink
                        to="/$locale/for-agencies/"
                        params={{ locale: locale || "en" }}
                        icon={<SpriteIcon name="group" className="size-4" />}
                        label={t("menu.solutions.agencies")}
                      />
                    </MegaMenuRailGroup>
                  </MegaMenuRail>
                </MegaMenuSplit>

                <MegaMenuFooter
                  primary={
                    <Link
                      to="/$locale/features/"
                      params={{ locale: locale || "en" }}
                      className="inline-flex items-center gap-1 hover:text-mist-700 transition-colors"
                    >
                      {t("features")}
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
                      {t("menu.scheduleDemo")}
                    </a>
                  }
                />
              </MegaMenuPanel>
            </MegaMenu>
            {/* Integrations Mega Menu (merged Developers + Integrations) */}
            <MegaMenu label={t("integrations.title")}>
              <MegaMenuPanel widthClass="w-[720px]">
                <MegaMenuSplit railWidth="248px">
                  <MegaMenuSection
                    label={t("integrations.frameworkSdks")}
                    noDivider
                    layoutClass="grid grid-cols-3 gap-0.5"
                  >
                    <MegaMenuPill index={0} to="/$locale/i18n/react/" params={{ locale: locale || "en" }} icon={guideIcon("react")} label="React" />
                    <MegaMenuPill index={1} to="/$locale/i18n/nextjs/" params={{ locale: locale || "en" }} icon={guideIcon("nextjs")} label="Next.js" />
                    <MegaMenuPill index={2} to="/$locale/i18n/vue/" params={{ locale: locale || "en" }} icon={guideIcon("vue")} label="Vue" />
                    <MegaMenuPill index={3} to="/$locale/i18n/nuxt/" params={{ locale: locale || "en" }} icon={guideIcon("nuxt")} label="Nuxt" />
                    <MegaMenuPill index={4} to="/$locale/i18n/angular/" params={{ locale: locale || "en" }} icon={guideIcon("angular")} label="Angular" />
                    <MegaMenuPill index={5} to="/$locale/i18n/svelte/" params={{ locale: locale || "en" }} icon={guideIcon("svelte")} label="Svelte" />
                    <MegaMenuPill index={6} to="/$locale/i18n/expo/" params={{ locale: locale || "en" }} icon={guideIcon("expo")} label="Expo" />
                    <MegaMenuPill index={7} to="/$locale/i18n/tanstack-start/" params={{ locale: locale || "en" }} icon={guideIcon("tanstack-start")} label="TanStack" />
                    <MegaMenuPill index={8} to="/$locale/i18n/server/" params={{ locale: locale || "en" }} icon={<IconConsoleSimple className="size-4" />} label="Hono / Node" />
                  </MegaMenuSection>

                  <MegaMenuRail>
                    <MegaMenuRailGroup
                      label={t("integrations.aiTranslation")}
                    >
                      <MegaMenuRailLink
                        to="/$locale/integrations/$slug/"
                        params={{ locale: locale || "en", slug: "mcp-server" }}
                        icon={<IconModelcontextprotocol className="size-4" />}
                        label={t("integrations.featured.mcp-server.name")}
                      />
                      <MegaMenuRailLink
                        to="/$locale/integrations/$slug/"
                        params={{ locale: locale || "en", slug: "ai-translation" }}
                        icon={<IconAiTranslate className="size-4" />}
                        label={t("integrations.featured.ai-translation.name")}
                      />
                    </MegaMenuRailGroup>

                    <MegaMenuRailGroup
                      label={t("integrations.devTools")}
                    >
                      <MegaMenuRailLink
                        to="/$locale/integrations/$slug/"
                        params={{ locale: locale || "en", slug: "github" }}
                        icon={<IconGithub className="size-4" />}
                        label={t("integrations.featured.github.name")}
                      />
                      <MegaMenuRailLink
                        to="/$locale/integrations/$slug/"
                        params={{ locale: locale || "en", slug: "cli" }}
                        icon={<IconConsoleSimple className="size-4" />}
                        label={t("integrations.featured.cli.name")}
                      />
                      <MegaMenuRailLink
                        to="/$locale/integrations/$slug/"
                        params={{ locale: locale || "en", slug: "global-cdn" }}
                        icon={<IconCloudySparkle className="size-4" />}
                        label={t("integrations.featured.global-cdn.name")}
                      />
                    </MegaMenuRailGroup>
                  </MegaMenuRail>
                </MegaMenuSplit>

                <MegaMenuFooter
                  primary={
                    <Link
                      to="/$locale/integrations/"
                      params={{ locale: locale || "en" }}
                      className="inline-flex items-center gap-1 hover:text-mist-700 transition-colors"
                    >
                      {t("integrations.exploreAll")}
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
                      {t("documentation")}
                    </a>
                  }
                />
              </MegaMenuPanel>
            </MegaMenu>

            <Link
              to="/$locale/pricing/"
              params={{ locale: locale || "en" }}
              className="nav-link"
            >
              {t("pricing")}
            </Link>
            {/* Resources Mega Menu */}
            <MegaMenu label={t("resources.title")}>
              <MegaMenuPanel widthClass="w-[660px]">
                <MegaMenuSplit railWidth="248px">
                  <MegaMenuSection
                    label={t("resources.learn")}
                    noDivider
                    layoutClass="flex flex-col gap-0.5"
                  >
                    <MegaMenuCard
                      index={0}
                      to="/$locale/what-is/"
                      params={{ locale: locale || "en" }}
                      icon={<SpriteIcon name="globe" className="size-5" />}
                      title={t("resources.whatIsI18n")}
                      description={t("resources.whatIsI18nDesc")}
                    />
                    <MegaMenuCard
                      index={1}
                      to="/$locale/i18n/complete-guide/"
                      params={{ locale: locale || "en" }}
                      icon={<SpriteIcon name="book" className="size-5" />}
                      title={t("resources.completeGuide")}
                      description={t("resources.completeGuideDesc")}
                    />
                    <MegaMenuCard
                      index={2}
                      to="/$locale/blog/"
                      params={{ locale: locale || "en" }}
                      icon={<IconNewspaper className="size-5" />}
                      title={t("blog")}
                      description={t("resources.blogDesc")}
                    />
                  </MegaMenuSection>

                  <MegaMenuRail>
                    <MegaMenuRailGroup label={t("resources.toolsUpdates")}>
                      <MegaMenuRailLink
                        to="/$locale/tools/"
                        params={{ locale: locale || "en" }}
                        icon={<SpriteIcon name="code-brackets" className="size-4" />}
                        label={t("resources.freeTools")}
                      />
                      <MegaMenuRailLink
                        to="/$locale/compare/"
                        params={{ locale: locale || "en" }}
                        icon={<SpriteIcon name="chart" className="size-4" />}
                        label={t("compare")}
                      />
                      <MegaMenuRailLink
                        to="/$locale/changelog/"
                        params={{ locale: locale || "en" }}
                        icon={<SpriteIcon name="rocket" className="size-4" />}
                        label={t("changelog")}
                      />
                    </MegaMenuRailGroup>

                    <MegaMenuRailGroup
                      label={t("resources.support")}
                    >
                      <MegaMenuRailLink
                        to="/$locale/about/"
                        params={{ locale: locale || "en" }}
                        icon={<IconPeople className="size-4" />}
                        label={t("resources.about.title")}
                      />
                      <MegaMenuPillExternal
                        href="https://docs.better-i18n.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        external
                        bareIcon
                        icon={<SpriteIcon name="script" className="size-4" />}
                        label={t("documentation")}
                      />
                      <MegaMenuPillButton
                        onClick={openHelpWidget}
                        bareIcon
                        icon={<LifeBuoy className="size-4" />}
                        label={t("resources.helpCenter")}
                      />
                    </MegaMenuRailGroup>
                  </MegaMenuRail>
                </MegaMenuSplit>

                <MegaMenuFooter
                  primary={
                    <button
                      type="button"
                      onClick={openHelpWidget}
                      className="inline-flex items-center gap-1.5 hover:text-mist-700 transition-colors"
                    >
                      <LifeBuoy className="size-3.5" />
                      {t("resources.contactSupport")}
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
                        ? t("resources.allOperational")
                        : t("status")}
                      {/* Named properties instead of `transition-all`: the
                          latter also animates layout properties, so any hover
                          re-style on this row costs a paint it doesn't need. */}
                      <IconArrowUpRight className="size-3 -translate-y-0.5 translate-x-0.5 text-mist-400 opacity-0 transition-[opacity,transform,color] duration-200 group-hover/status:translate-x-0 group-hover/status:translate-y-0 group-hover/status:text-mist-700 group-hover/status:opacity-100" />
                    </a>
                  }
                />
              </MegaMenuPanel>
            </MegaMenu>
            <Link
              to="/$locale/careers/"
              params={{ locale: locale || "en" }}
              className="nav-link"
            >
              {t("hiring")}
              <span className="ml-0.5 size-1.5 rounded-full bg-emerald-500" />
            </Link>
          </div>
          <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
            <LanguageSwitcher />
            <a
              href="https://dash.better-i18n.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark"
            >
              {t("getStarted")}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
