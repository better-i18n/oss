import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { cn } from "@better-i18n/ui/lib/utils";
import {
  IconChevronBottom,
  IconAiTranslate,
  IconCodeBrackets,
  IconRocket,
  IconPeople,
  IconShieldCheck,
  IconScript,
  IconBook,
  IconSparklesSoft,
  IconNewspaper,
  IconApiConnection,
  IconLiveActivity,
  IconGlobe,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

const MENU_ID = "mobile-nav-menu";

type SectionKey = "product" | "developers" | "resources" | null;

function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [isActive, containerRef]);
}

export function MobileNav() {
  const { locale } = useParams({ strict: false });
  const t = useT("header");
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<SectionKey>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const localeParam = locale || "en";

  useFocusTrap(menuRef, isOpen);

  const close = useCallback(() => {
    setIsOpen(false);
    setExpandedSection(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) setExpandedSection(null);
      return !prev;
    });
  }, []);

  const toggleSection = useCallback((section: SectionKey) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      {/* Hamburger button */}
      <button
        ref={toggleRef}
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={MENU_ID}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="relative z-50 flex size-10 items-center justify-center rounded-lg text-mist-950 hover:bg-mist-200 transition-colors"
      >
        <svg
          className="size-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "origin-center transition-all duration-300",
              isOpen && "translate-y-[7px] rotate-45",
            )}
            d="M4 5h16"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "transition-opacity duration-200",
              isOpen && "opacity-0",
            )}
            d="M4 12h16"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "origin-center transition-all duration-300",
              isOpen && "-translate-y-[7px] -rotate-45",
            )}
            d="M4 19h16"
          />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={close}
      />

      {/* Drawer panel */}
      <div
        ref={menuRef}
        id={MENU_ID}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          "fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col bg-mist-100 shadow-xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header spacer to align below the main header */}
        <div className="h-[5.25rem] shrink-0" />

        {/* Scrollable content */}
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6"
        >
          <div className="space-y-1">
            {/* Features - simple link */}
            <Link
              to="/$locale/features"
              params={{ locale: localeParam }}
              onClick={close}
              className="block rounded-lg px-3 py-2.5 text-base font-medium text-mist-950 hover:bg-mist-200 transition-colors"
            >
              {t("features", { defaultValue: "Features" })}
            </Link>

            {/* Product - expandable */}
            <AccordionSection
              label={t("forProduct", { defaultValue: "Product" })}
              isExpanded={expandedSection === "product"}
              onToggle={() => toggleSection("product")}
            >
              <div className="space-y-1 pb-1">
                <Link
                  to="/$locale/for-translators"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-mist-200 transition-colors"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-mist-200 bg-white text-mist-700 shadow-sm">
                    <IconAiTranslate className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-mist-950">
                      {t("segments.translators.title", { defaultValue: "For Translators" })}
                    </div>
                    <div className="text-xs text-mist-500">
                      {t("segments.translators.shortDescription", {
                        defaultValue: "Context-rich translation environment",
                      })}
                    </div>
                  </div>
                </Link>

                <Link
                  to="/$locale/for-developers"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-mist-200 transition-colors"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-mist-200 bg-white text-mist-700 shadow-sm">
                    <IconCodeBrackets className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-mist-950">
                      {t("segments.developers.title", { defaultValue: "For Developers" })}
                    </div>
                    <div className="text-xs text-mist-500">
                      {t("segments.developers.shortDescription", {
                        defaultValue: "Automated sync and developer-first tools",
                      })}
                    </div>
                  </div>
                </Link>

                <Link
                  to="/$locale/for-product-teams"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-mist-200 transition-colors"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-mist-200 bg-white text-mist-700 shadow-sm">
                    <IconRocket className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-mist-950">
                      {t("segments.productTeams.title", { defaultValue: "For Product Teams" })}
                    </div>
                    <div className="text-xs text-mist-500">
                      {t("segments.productTeams.shortDescription", {
                        defaultValue: "Manage localization without the hassle",
                      })}
                    </div>
                  </div>
                </Link>

                {/* More Solutions */}
                <div className="px-3 pt-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-mist-400 mb-1.5">
                    {t("menu.moreSolutions", { defaultValue: "More Solutions" })}
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                    {/* Business & Industry */}
                    {[
                      { to: "/$locale/for-enterprises" as const, key: "enterprises", label: "Enterprises" },
                      { to: "/$locale/for-saas" as const, key: "saas", label: "SaaS" },
                      { to: "/$locale/for-ecommerce" as const, key: "ecommerce", label: "E-Commerce" },
                      { to: "/$locale/for-startups" as const, key: "startups", label: "Startups" },
                      { to: "/$locale/for-healthcare" as const, key: "healthcare", label: "Healthcare" },
                      { to: "/$locale/for-education" as const, key: "education", label: "Education" },
                      { to: "/$locale/for-gaming" as const, key: "gaming", label: "Gaming" },
                      { to: "/$locale/for-open-source" as const, key: "openSource", label: "Open Source" },
                      // Teams & Roles
                      { to: "/$locale/for-marketers" as const, key: "marketers", label: "Marketers" },
                      { to: "/$locale/for-designers" as const, key: "designers", label: "Designers" },
                      { to: "/$locale/for-content-teams" as const, key: "contentTeams", label: "Content Teams" },
                      { to: "/$locale/for-engineering-leaders" as const, key: "engineeringLeaders", label: "Engineering Leaders" },
                      { to: "/$locale/for-mobile-teams" as const, key: "mobileTeams", label: "Mobile Teams" },
                      { to: "/$locale/for-agencies" as const, key: "agencies", label: "Agencies" },
                      { to: "/$locale/for-freelancers" as const, key: "freelancers", label: "Freelancers" },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        params={{ locale: localeParam }}
                        onClick={close}
                        className="py-1.5 text-sm text-mist-700 hover:text-mist-950 transition-colors"
                      >
                        {t(`menu.solutions.${item.key}`, { defaultValue: item.label })}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionSection>

            {/* Developers - expandable */}
            <AccordionSection
              label={t("developers.title", { defaultValue: "Developers" })}
              isExpanded={expandedSection === "developers"}
              onToggle={() => toggleSection("developers")}
            >
              <div className="space-y-1 pb-1">
                <p className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-mist-500">
                  {t("developers.frameworkGuides", { defaultValue: "Framework Guides" })}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { to: "/$locale/i18n/react" as const, label: "React" },
                    { to: "/$locale/i18n/nextjs" as const, label: "Next.js" },
                    { to: "/$locale/i18n/vue" as const, label: "Vue" },
                    { to: "/$locale/i18n/nuxt" as const, label: "Nuxt" },
                    { to: "/$locale/i18n/angular" as const, label: "Angular" },
                    { to: "/$locale/i18n/svelte" as const, label: "Svelte" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      params={{ locale: localeParam }}
                      onClick={close}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-mist-950 hover:bg-mist-200 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="px-3 pt-2">
                  <a
                    href="https://docs.better-i18n.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-mist-700 hover:text-mist-950 transition-colors"
                  >
                    {t("developers.viewDocs", { defaultValue: "View full documentation" })}
                  </a>
                </div>
              </div>
            </AccordionSection>

            {/* Pricing - simple link */}
            <Link
              to="/$locale/pricing"
              params={{ locale: localeParam }}
              onClick={close}
              className="block rounded-lg px-3 py-2.5 text-base font-medium text-mist-950 hover:bg-mist-200 transition-colors"
            >
              {t("pricing", { defaultValue: "Pricing" })}
            </Link>

            {/* Compare - simple link */}
            <Link
              to="/$locale/compare"
              params={{ locale: localeParam }}
              onClick={close}
              className="block rounded-lg px-3 py-2.5 text-base font-medium text-mist-950 hover:bg-mist-200 transition-colors"
            >
              {t("compare", { defaultValue: "Compare" })}
            </Link>

            {/* Resources - expandable */}
            <AccordionSection
              label={t("resources.title", { defaultValue: "Resources" })}
              isExpanded={expandedSection === "resources"}
              onToggle={() => toggleSection("resources")}
            >
              <div className="space-y-1 pb-1">
                <Link
                  to="/$locale/about"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-mist-200 transition-colors"
                >
                  <IconPeople className="size-4 text-mist-600" />
                  <span className="text-sm font-medium text-mist-950">
                    {t("resources.about.title", { defaultValue: "About Us" })}
                  </span>
                </Link>

                <Link
                  to="/$locale/privacy"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-mist-200 transition-colors"
                >
                  <IconShieldCheck className="size-4 text-mist-600" />
                  <span className="text-sm font-medium text-mist-950">
                    {t("resources.privacy.title", { defaultValue: "Privacy Policy" })}
                  </span>
                </Link>

                <Link
                  to="/$locale/terms"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-mist-200 transition-colors"
                >
                  <IconScript className="size-4 text-mist-600" />
                  <span className="text-sm font-medium text-mist-950">
                    {t("resources.terms.title", { defaultValue: "Terms of Service" })}
                  </span>
                </Link>

                <div className="my-1 border-t border-mist-200" />

                <a
                  href="https://docs.better-i18n.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-mist-200 transition-colors"
                >
                  <IconBook className="size-4 text-mist-600" />
                  <span className="text-sm font-medium text-mist-950">
                    {t("documentation", { defaultValue: "Documentation" })}
                  </span>
                </a>

                <Link
                  to="/$locale/changelog"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-mist-200 transition-colors"
                >
                  <IconSparklesSoft className="size-4 text-mist-600" />
                  <span className="text-sm font-medium text-mist-950">
                    {t("changelog", { defaultValue: "Changelog" })}
                  </span>
                </Link>

                <Link
                  to="/$locale/blog"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-mist-200 transition-colors"
                >
                  <IconNewspaper className="size-4 text-mist-600" />
                  <span className="text-sm font-medium text-mist-950">
                    {t("blog", { defaultValue: "Blog" })}
                  </span>
                </Link>

                <a
                  href="https://docs.better-i18n.com/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-mist-200 transition-colors"
                >
                  <IconApiConnection className="size-4 text-mist-600" />
                  <span className="text-sm font-medium text-mist-950">
                    {t("apiReference", { defaultValue: "API Reference" })}
                  </span>
                </a>

                <a
                  href="https://status.better-i18n.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-mist-200 transition-colors"
                >
                  <IconLiveActivity className="size-4 text-mist-600" />
                  <span className="text-sm font-medium text-mist-950">
                    {t("status", { defaultValue: "Status" })}
                  </span>
                </a>

                <Link
                  to="/$locale/what-is"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-mist-200 transition-colors"
                >
                  <IconGlobe className="size-4 text-mist-600" />
                  <span className="text-sm font-medium text-mist-950">
                    {t("resources.whatIsI18n", { defaultValue: "What is i18n?" })}
                  </span>
                </Link>
              </div>
            </AccordionSection>
          </div>

          {/* Bottom section: Language switcher + CTA */}
          <div className="mt-6 space-y-4 border-t border-mist-200 pt-6">
            <div className="flex items-center justify-between px-3">
              <span className="text-sm font-medium text-mist-500">
                {t("language", { defaultValue: "Language" })}
              </span>
              <LanguageSwitcher />
            </div>

            <a
              href="https://dash.better-i18n.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="flex w-full items-center justify-center rounded-full bg-mist-950 px-4 py-3 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
            >
              {t("getStarted", { defaultValue: "Get Started" })}
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}

function AccordionSection({
  label,
  isExpanded,
  onToggle,
  children,
}: {
  label: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const contentId = `mobile-section-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-mist-950 hover:bg-mist-200 transition-colors"
      >
        {label}
        <IconChevronBottom
          className={cn(
            "size-4 text-mist-400 transition-transform duration-200",
            isExpanded && "rotate-180",
          )}
        />
      </button>
      <div
        id={contentId}
        role="region"
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden pl-2">{children}</div>
      </div>
    </div>
  );
}
