import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CTA from "./CTA";
import { MarketingBreadcrumb, type BreadcrumbItem } from "./MarketingBreadcrumb";
import { cn } from "@better-i18n/ui/lib/utils";
import { useT } from "@/lib/i18n";

interface MarketingLayoutProps {
  children: ReactNode;
  /** Custom header className */
  headerClassName?: string;
  /** Background color for the page */
  bgClassName?: string;
  /** Whether to show CTA section before footer */
  showCTA?: boolean;
  /** Breadcrumb trail items (last item = current page, no href) */
  breadcrumbs?: readonly BreadcrumbItem[];
}

/**
 * Shared layout for all marketing pages.
 * Provides consistent Header, Footer, and optional CTA.
 */
export function MarketingLayout({
  children,
  headerClassName,
  bgClassName = "bg-mist-100",
  showCTA = true,
  breadcrumbs,
}: MarketingLayoutProps) {
  const t = useT("common");

  return (
    <div className={cn("min-h-screen", bgClassName)}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-mist-950 focus:text-sm focus:font-medium"
      >
        {t("skipToContent", "Skip to content")}
      </a>
      <Header className={headerClassName} />
      <main id="main-content">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <MarketingBreadcrumb items={breadcrumbs} />
          </div>
        )}
        {children}
      </main>
      {showCTA && <CTA />}
      <Footer />
    </div>
  );
}
