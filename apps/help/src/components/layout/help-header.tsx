import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { SIGNUP_URL } from "@/lib/config";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { IconQuickSearch } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export function HelpHeader({ locale }: { locale: string }) {
  const t = useT("common");

  return (
    <header className="sticky top-0 z-10 h-14 border-b border-mist-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-6">
        {/* Logo */}
        <Link
          to="/$locale"
          params={{ locale }}
          className="flex items-center gap-2 font-semibold text-mist-950"
        >
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="shrink-0">
            <rect width="32" height="32" rx="8" fill="#181c1e" />
            <path d="M8 16h16M16 8v16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">
            {t("header.title", "Help Center")}
          </span>
        </Link>

        {/* Search trigger — Cmd+K */}
        <button
          type="button"
          className="ml-4 flex flex-1 items-center gap-2 rounded-lg border border-mist-200 bg-mist-50 px-3 py-1.5 text-sm text-mist-500 transition-colors hover:border-mist-300 hover:bg-white sm:max-w-xs"
          onClick={() => {
            // Will be implemented in Phase 2 with search dialog
            document.dispatchEvent(new CustomEvent("open-search"));
          }}
        >
          <IconQuickSearch className="size-4" />
          <span className="hidden sm:inline">{t("header.search", "Search articles...")}</span>
          <kbd className="ml-auto hidden rounded border border-mist-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-mist-400 sm:inline">
            ⌘K
          </kbd>
        </button>

        {/* Navigation */}
        <nav className="ml-auto flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href={SIGNUP_URL}
            className="rounded-full bg-mist-950 px-4 py-1.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
          >
            {t("header.cta", "Start Free")}
          </a>
        </nav>
      </div>
    </header>
  );
}
