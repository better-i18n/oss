import { Link, useParams } from "@tanstack/react-router";
import { cn } from "@better-i18n/ui/lib/utils";
import { useTranslations } from "@better-i18n/use-intl";

interface LegalLayoutProps {
  children: React.ReactNode;
  active: "terms" | "privacy";
  lastUpdated: string;
  title: string;
}

export function LegalLayout({
  children,
  active,
  lastUpdated,
  title,
}: LegalLayoutProps) {
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";
  const t = useTranslations("legal");

  return (
    <div className="bg-[#f9f9f9] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <nav className="sticky top-32 space-y-1">
              <Link
                to="/$locale/terms"
                params={{ locale: currentLocale }}
                className={cn(
                  "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active === "terms"
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                )}
              >
                {t("termsOfService")}
              </Link>
              <Link
                to="/$locale/privacy"
                params={{ locale: currentLocale }}
                className={cn(
                  "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active === "privacy"
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                )}
              >
                {t("privacyPolicy")}
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="mb-10">
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl mb-4">
                {title}
              </h1>
              <p className="text-gray-500 text-lg">
                {t("lastUpdated", { date: lastUpdated })}
              </p>
            </div>

            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-medium prose-a:text-blue-600 hover:prose-a:text-blue-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
