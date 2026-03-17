import type { ReactNode } from "react";
import { HelpHeader } from "./help-header";
import { HelpFooter } from "./help-footer";

interface HelpLayoutProps {
  locale: string;
  children: ReactNode;
}

export function HelpLayout({ locale, children }: HelpLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <HelpHeader locale={locale} />
      <main className="flex-1">{children}</main>
      <HelpFooter locale={locale} />
    </div>
  );
}
