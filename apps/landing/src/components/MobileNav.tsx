import { lazy, Suspense, useCallback, useState } from "react";
import { cn } from "@better-i18n/ui/lib/utils";
import { useT } from "@/lib/i18n";

/**
 * Mobile nav trigger — lightweight (~1KB) and always present in the main
 * bundle so the hamburger button is interactive immediately on hydration.
 *
 * The full panel content (drawer, portal, accordion sections, all icon
 * imports) lives in MobileNavPanel.tsx and is lazy-loaded only after the
 * user actually opens the menu. Once loaded, the panel stays mounted so
 * close/open animations work without re-fetching the chunk.
 */

const MobileNavPanel = lazy(() =>
  import("./MobileNavPanel").then((m) => ({ default: m.MobileNavPanel })),
);

const MENU_ID = "mobile-nav-menu";

export function MobileNav() {
  const t = useT("header");
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => {
    setHasOpened(true);
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={MENU_ID}
        aria-label={
          isOpen
            ? t("aria.closeMenu", { defaultValue: "Close menu" })
            : t("aria.openMenu", { defaultValue: "Open menu" })
        }
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

      {hasOpened && (
        <Suspense fallback={null}>
          <MobileNavPanel
            isOpen={isOpen}
            onClose={close}
            menuId={MENU_ID}
          />
        </Suspense>
      )}
    </div>
  );
}
