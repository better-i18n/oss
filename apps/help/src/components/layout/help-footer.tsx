import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { LANDING_URL, DASHBOARD_URL } from "@/lib/config";

function ThemeToggle() {
  const t = useT("common");
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
      className="cursor-pointer rounded-md p-1.5 text-mist-400 transition-colors hover:bg-mist-100 hover:text-mist-700"
      aria-label={theme === "light" ? t("footer.switchToDark") : t("footer.switchToLight")}
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

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="rounded-md p-1.5 text-mist-400 transition-colors hover:bg-mist-100 hover:text-mist-700"
    >
      {children}
    </a>
  );
}

export function HelpFooter({ locale }: { locale: string }) {
  const t = useT("common");

  return (
    <footer className="border-t border-mist-200 bg-mist-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand + links */}
          <div className="flex items-center gap-5">
            <a
              href={LANDING_URL}
              className="flex items-center gap-1.5 text-mist-600 transition-colors hover:text-mist-900"
            >
              <img
                src="https://better-i18n.com/cdn-cgi/image/width=32,height=32,fit=contain/brand/logo.svg"
                alt="Better I18N"
                width={16}
                height={16}
                className="dark:invert"
              />
              <span className="text-sm font-semibold">Better I18N</span>
            </a>
            <span className="hidden h-4 w-px bg-mist-200 sm:block" />
            <nav className="flex items-center gap-4 text-sm text-mist-500">
              <Link
                to="/$locale"
                params={{ locale }}
                className="transition-colors hover:text-mist-950"
              >
                {t("footer.helpCenter")}
              </Link>
              <a href={DASHBOARD_URL} className="transition-colors hover:text-mist-950">
                {t("footer.dashboard")}
              </a>
              <a href={LANDING_URL} className="transition-colors hover:text-mist-950">
                {t("footer.website")}
              </a>
            </nav>
          </div>

          {/* Social + theme toggle */}
          <div className="flex items-center gap-1">
            <SocialIcon href="https://x.com/betteri18n" label="X">
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://github.com/nicholasgriffintn/better-i18n" label="GitHub">
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://youtube.com/@betteri18n" label="YouTube">
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </SocialIcon>
            <span className="mx-1 h-4 w-px bg-mist-200" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
