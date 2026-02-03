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
      <Header className={headerClassName} />
      <main>{children}</main>
      {showCTA && <CTA />}
      <Footer />
    </div>
  );
}
