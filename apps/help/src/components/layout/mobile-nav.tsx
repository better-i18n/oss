/**
 * Mobile navigation drawer — placeholder for Phase 2.
 * Will include collection tree navigation and language switcher.
 */

import type { HelpCollection } from "@/lib/content";

interface MobileNavProps {
  locale: string;
  collections: HelpCollection[];
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close navigation"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[var(--color-card)] shadow-xl lg:hidden">
        <div className="flex h-14 items-center justify-between border-b border-mist-200 px-4">
          <span className="font-semibold text-mist-950">Help Center</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-mist-500 hover:bg-mist-100 hover:text-mist-900"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-4 py-6 text-sm text-mist-500">
          Full navigation coming in Phase 2.
        </div>
      </div>
    </>
  );
}
