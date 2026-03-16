import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { LANDING_URL, DASHBOARD_URL } from "@/lib/config";

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
              {t("footer.helpCenter", "Help Center")}
            </Link>
            <a href={DASHBOARD_URL} className="hover:text-mist-950 transition-colors">
              {t("footer.dashboard", "Dashboard")}
            </a>
            <a href={LANDING_URL} className="hover:text-mist-950 transition-colors">
              {t("footer.website", "Website")}
            </a>
          </nav>

          {/* Powered by badge */}
          <a
            href={LANDING_URL}
            className="flex items-center gap-2 text-xs text-mist-400 hover:text-mist-600 transition-colors"
          >
            {t("footer.poweredBy", "Powered by")}
            <img
              src="https://better-i18n.com/cdn-cgi/image/width=48,height=48,fit=contain/logo.png"
              alt="Better i18n"
              width={20}
              height={20}
              className="rounded"
            />
            <span className="font-semibold text-mist-600">better-i18n</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
