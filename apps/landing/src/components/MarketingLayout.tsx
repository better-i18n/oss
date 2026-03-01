import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CTA from "./CTA";
import { cn } from "@better-i18n/ui/lib/utils";

interface MarketingLayoutProps {
  children: ReactNode;
  /** Custom header className */
  headerClassName?: string;
  /** Background color for the page */
  bgClassName?: string;
  /** Whether to show CTA section before footer */
  showCTA?: boolean;
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
}: MarketingLayoutProps) {
  return (
    <div className={cn("min-h-screen", bgClassName)}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-mist-950 focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <Header className={headerClassName} />
      <main id="main-content">{children}</main>
      {showCTA && <CTA />}
      <Footer />
    </div>
  );
}
