import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { LANDING_URL, SIGNUP_URL } from "@/lib/config";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export function HelpHeader({ locale }: { locale: string }) {
  const t = useT("common");

  return (
    <header className="sticky top-0 z-10 h-14 border-b border-mist-200 bg-[var(--color-background)]/80 backdrop-blur-lg">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-6">
        {/* Logo — "Better I18N / Help" breadcrumb style */}
        <div className="flex items-center gap-2.5">
          <a
            href={LANDING_URL}
            className="flex items-center gap-2 font-semibold text-mist-950 transition-colors hover:text-mist-700"
          >
            <img
              src="https://better-i18n.com/cdn-cgi/image/width=56,height=56,fit=contain/logo.png"
              alt="Better i18n"
              width={24}
              height={24}
              className="shrink-0 rounded"
            />
            <span className="hidden sm:inline">Better I18N</span>
          </a>
          <span className="text-mist-300">/</span>
          <Link
            to="/$locale"
            params={{ locale }}
            className="text-sm text-mist-500 transition-colors hover:text-mist-950"
          >
            {t("header.title")}
          </Link>
        </div>

        {/* Right side */}
        <nav className="ml-auto flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href={SIGNUP_URL}
            className="rounded-full bg-[var(--color-foreground)] px-4 py-1.5 text-sm font-medium text-[var(--color-background)] transition-colors hover:opacity-80"
          >
            {t("header.cta")}
          </a>
        </nav>
      </div>
    </header>
  );
}
