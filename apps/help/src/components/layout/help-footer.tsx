import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { LANDING_URL, DASHBOARD_URL } from "@/lib/config";

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1.5 text-sm text-mist-500 hover:text-mist-950 transition-colors"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      ) : (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      )}
    </button>
  );
}

export function HelpFooter({ locale }: { locale: string }) {
  const t = useT("common");

  return (
    <footer className="border-t border-mist-200 bg-mist-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-mist-500">
            <Link
              to="/$locale"
              params={{ locale }}
              className="hover:text-mist-950 transition-colors"
            >
              {t("footer.helpCenter")}
            </Link>
            <a href={DASHBOARD_URL} className="hover:text-mist-950 transition-colors">
              {t("footer.dashboard")}
            </a>
            <a href={LANDING_URL} className="hover:text-mist-950 transition-colors">
              {t("footer.website")}
            </a>
            <ThemeToggle />
          </nav>

          {/* Powered by badge */}
          <a
            href={LANDING_URL}
            className="flex items-center gap-2 text-xs text-mist-400 hover:text-mist-600 transition-colors"
          >
            {t("footer.poweredBy")}
            <img
              src="https://better-i18n.com/cdn-cgi/image/width=40,height=40,fit=contain/brand/logo.svg"
              alt="Better i18n"
              width={20}
              height={20}
              className="dark:invert"
            />
            <span className="font-semibold text-mist-600">better-i18n</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
