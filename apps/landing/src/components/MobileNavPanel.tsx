import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useParams } from "@tanstack/react-router";
import { cn } from "@better-i18n/ui/lib/utils";
import {
  IconAiTranslate,
  IconPeople,
  IconNewspaper,
  IconLiveActivity,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { LifeBuoy } from "lucide-react";
import { SpriteIcon } from "@/components/SpriteIcon";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useState } from "react";

type SectionKey = "product" | "developers" | "resources" | null;

/* The drawer is the first surface a phone visitor sees, so it follows the same
   grammar as the page behind it: white ground, hairline separation, weight-500
   headings, neutral ink. Two shared class strings keep that consistent across
   the ~25 rows below — a tinted `bg-mist-200` hover on one row and a hairline
   hover on the next is exactly how the panel drifted out of the system.

   ROW: full-width tap target, hover is a 3% ink wash rather than a grey fill.
   TILE: the 36px icon holder — hairline box, no shadow. */
const ROW =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-black/[0.03]";
const TOP_ROW =
  "block rounded-lg px-3 py-2.5 text-base font-medium text-mist-950 transition-colors hover:bg-black/[0.03]";
const TILE =
  "flex size-9 shrink-0 items-center justify-center rounded-lg border border-black/[0.07] bg-white text-mist-700";
const ROW_LABEL = "text-sm font-medium text-mist-950";

function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  isActive: boolean,
) {
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

interface MobileNavPanelProps {
  isOpen: boolean;
  onClose: () => void;
  menuId: string;
}

export function MobileNavPanel({ isOpen, onClose, menuId }: MobileNavPanelProps) {
  const { locale } = useParams({ strict: false });
  const t = useT("header");
  const [expandedSection, setExpandedSection] = useState<SectionKey>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const localeParam = locale || "en";

  useFocusTrap(menuRef, isOpen);

  const close = useCallback(() => {
    setExpandedSection(null);
    onClose();
  }, [onClose]);

  const toggleSection = useCallback((section: SectionKey) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  }, []);

  // Close on Escape.
  //
  // `close` is an event, not a dependency: listing it re-registers the keydown
  // listener every time the parent hands down a new `onClose` identity, even
  // though the effect's actual trigger is only "is the drawer open". A ref
  // holding the latest callback keeps the listener attached once per open.
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  }, [close]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

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

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop. The drawer covers the viewport (inset-0), so this is only
          visible during the slide transition — a plain ink wash is enough, and
          a backdrop blur would be a filter the grammar does not use. */}
      <div
        className={cn(
          "fixed inset-0 z-[9998] bg-black/20 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={close}
      />

      {/* Drawer panel. White, not #f5f5f5: the page behind it is white, and a
          grey drawer reads as a different application. No drop shadow either —
          the panel is full-bleed, so a shadow would never be seen. */}
      <div
        ref={menuRef}
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label={t("aria.mobileNav")}
        className={cn(
          "fixed inset-0 z-[9999] flex w-full flex-col bg-white transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Drawer header: logo left, close button right */}
        <div className="flex h-[5.25rem] shrink-0 items-center justify-between border-b border-black/[0.07] px-6">
          <Link
            to="/$locale/"
            params={{ locale: localeParam }}
            onClick={close}
            className="inline-flex items-center"
          >
            <img
              src="/brand/logo.svg"
              alt="Better I18N"
              width={28}
              height={28}
              className="h-7 w-8"
            />
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label={t("aria.closeMenu")}
            className="flex size-10 items-center justify-center rounded-lg text-mist-950 transition-colors hover:bg-black/[0.03]"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <nav
          aria-label={t("aria.mobileNav")}
          className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-4"
        >
          <div className="space-y-1">
            <Link
              to="/$locale/features/"
              params={{ locale: localeParam }}
              onClick={close}
              className={TOP_ROW}
            >
              {t("features")}
            </Link>

            <Link
              to="/$locale/tools/"
              params={{ locale: localeParam }}
              onClick={close}
              className={TOP_ROW}
            >
              {t("tools")}
            </Link>

            {/* Product */}
            <AccordionSection
              label={t("forProduct")}
              isExpanded={expandedSection === "product"}
              onToggle={() => toggleSection("product")}
            >
              <div className="space-y-1 pb-1">
                <Link
                  to="/$locale/for-translators/"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className={ROW}
                >
                  <div className={TILE}>
                    <IconAiTranslate className="size-4" />
                  </div>
                  <div>
                    <div className={ROW_LABEL}>{t("segments.translators.title")}</div>
                    <div className="text-xs text-mist-600">
                      {t("segments.translators.shortDescription")}
                    </div>
                  </div>
                </Link>

                <Link
                  to="/$locale/for-developers/"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className={ROW}
                >
                  <div className={TILE}>
                    <SpriteIcon name="code-brackets" className="size-4" />
                  </div>
                  <div>
                    <div className={ROW_LABEL}>{t("segments.developers.title")}</div>
                    <div className="text-xs text-mist-600">
                      {t("segments.developers.shortDescription")}
                    </div>
                  </div>
                </Link>

                <Link
                  to="/$locale/for-product-teams/"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className={ROW}
                >
                  <div className={TILE}>
                    <SpriteIcon name="rocket" className="size-4" />
                  </div>
                  <div>
                    <div className={ROW_LABEL}>{t("segments.productTeams.title")}</div>
                    <div className="text-xs text-mist-600">
                      {t("segments.productTeams.shortDescription")}
                    </div>
                  </div>
                </Link>

                <div className="px-3 pt-3">
                  <p className="eyebrow">{t("menu.moreSolutions")}</p>
                  <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5">
                    {[
                      { to: "/$locale/for-enterprises/" as const, key: "enterprises" },
                      { to: "/$locale/for-saas/" as const, key: "saas" },
                      { to: "/$locale/for-ecommerce/" as const, key: "ecommerce" },
                      { to: "/$locale/for-startups/" as const, key: "startups" },
                      { to: "/$locale/for-agencies/" as const, key: "agencies" },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        params={{ locale: localeParam }}
                        onClick={close}
                        className="py-1.5 text-sm text-mist-600 transition-colors hover:text-mist-950"
                      >
                        {t(`menu.solutions.${item.key}`)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionSection>

            {/* Developers */}
            <AccordionSection
              label={t("developers.title")}
              isExpanded={expandedSection === "developers"}
              onToggle={() => toggleSection("developers")}
            >
              <div className="space-y-1 pb-1">
                <p className="eyebrow px-3 py-1">{t("developers.frameworkGuides")}</p>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { to: "/$locale/i18n/react/" as const, label: "React" },
                    { to: "/$locale/i18n/nextjs/" as const, label: "Next.js" },
                    { to: "/$locale/i18n/vue/" as const, label: "Vue" },
                    { to: "/$locale/i18n/nuxt/" as const, label: "Nuxt" },
                    { to: "/$locale/i18n/angular/" as const, label: "Angular" },
                    { to: "/$locale/i18n/svelte/" as const, label: "Svelte" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      params={{ locale: localeParam }}
                      onClick={close}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-mist-950 transition-colors hover:bg-black/[0.03]"
                    >
                      {/* Framework names are product nouns, not copy — they are
                          the same in every locale, so they stay literal. */}
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="px-3 pt-2">
                  <a
                    href="https://docs.better-i18n.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="learn-more"
                  >
                    {t("developers.viewDocs")}
                  </a>
                </div>
              </div>
            </AccordionSection>

            <Link
              to="/$locale/pricing/"
              params={{ locale: localeParam }}
              onClick={close}
              className={TOP_ROW}
            >
              {t("pricing")}
            </Link>

            <Link
              to="/$locale/compare/"
              params={{ locale: localeParam }}
              onClick={close}
              className={TOP_ROW}
            >
              {t("compare")}
            </Link>

            {/* Resources */}
            <AccordionSection
              label={t("resources.title")}
              isExpanded={expandedSection === "resources"}
              onToggle={() => toggleSection("resources")}
            >
              <div className="space-y-1 pb-1">
                <Link
                  to="/$locale/about/"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className={ROW}
                >
                  <IconPeople className="size-4 text-mist-500" />
                  <span className={ROW_LABEL}>{t("resources.about.title")}</span>
                </Link>

                <Link
                  to="/$locale/privacy/"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className={ROW}
                >
                  <SpriteIcon name="shield-check" className="size-4 text-mist-500" />
                  <span className={ROW_LABEL}>{t("resources.privacy.title")}</span>
                </Link>

                <Link
                  to="/$locale/terms/"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className={ROW}
                >
                  <SpriteIcon name="script" className="size-4 text-mist-500" />
                  <span className={ROW_LABEL}>{t("resources.terms.title")}</span>
                </Link>

                <div className="my-1 border-t border-black/[0.07]" />

                <button
                  type="button"
                  onClick={() => {
                    close();
                    if (typeof window !== "undefined") window.Helpway?.open();
                  }}
                  className={`${ROW} w-full text-left`}
                >
                  <LifeBuoy className="size-4 text-mist-500" />
                  <span className={ROW_LABEL}>{t("resources.helpCenter")}</span>
                </button>

                <a
                  href="https://docs.better-i18n.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ROW}
                >
                  <SpriteIcon name="book" className="size-4 text-mist-500" />
                  <span className={ROW_LABEL}>{t("documentation")}</span>
                </a>

                <Link
                  to="/$locale/changelog/"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className={ROW}
                >
                  <SpriteIcon name="sparkles-soft" className="size-4 text-mist-500" />
                  <span className={ROW_LABEL}>{t("changelog")}</span>
                </Link>

                <Link
                  to="/$locale/blog/"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className={ROW}
                >
                  <IconNewspaper className="size-4 text-mist-500" />
                  <span className={ROW_LABEL}>{t("blog")}</span>
                </Link>

                <a
                  href="https://docs.better-i18n.com/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ROW}
                >
                  <SpriteIcon name="api-connection" className="size-4 text-mist-500" />
                  <span className={ROW_LABEL}>{t("apiReference")}</span>
                </a>

                <a
                  href="https://status.better-i18n.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ROW}
                >
                  <IconLiveActivity className="size-4 text-mist-500" />
                  <span className={ROW_LABEL}>{t("status")}</span>
                </a>

                <Link
                  to="/$locale/what-is/"
                  params={{ locale: localeParam }}
                  onClick={close}
                  className={ROW}
                >
                  <SpriteIcon name="globe" className="size-4 text-mist-500" />
                  <span className={ROW_LABEL}>{t("resources.whatIsI18n")}</span>
                </Link>
              </div>
            </AccordionSection>
          </div>

          <div className="mt-6 border-t border-black/[0.07] pt-6">
            <div className="flex items-center justify-between px-3">
              <span className="text-sm font-medium text-mist-600">
                {t("language")}
              </span>
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      </div>
    </>,
    document.body,
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
        className={`${TOP_ROW} flex w-full items-center justify-between`}
      >
        {label}
        <SpriteIcon
          name="chevron-bottom"
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
