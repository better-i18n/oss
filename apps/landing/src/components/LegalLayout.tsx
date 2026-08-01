import type { ReactNode } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useTranslations } from "@better-i18n/use-intl";
import { Divider, Section } from "@/components/ui/page";
import { ProseBody } from "@/components/ProseBody";

/**
 * The shell shared by the three legal documents (terms, privacy, cookies).
 *
 * What changed and why:
 *   - The canvas was `bg-[#f9f9f9]` with a `bg-[#f9f9f9]` header override on each
 *     page, so the one long document on the site was the one page that was not
 *     white. rule/white-page-hairline-separation: the page is white and
 *     separation is hairlines, so the document now sits on the same ground as
 *     everything else and the sidebar is divided by a rule instead of a tint.
 *   - Type came from `prose-slate prose-lg`, which ships Tailwind Typography's
 *     own scale and weights: h2/h3 arrived bold and oversized next to our 500
 *     headings (rule/weight-500-headings), and `prose-a:text-blue-600` made
 *     every link and list marker in a 600-line document blue
 *     (rule/neutral-ink-accent-is-identity-only). Both are replaced by the one
 *     shared prose scale in `components/ProseBody.tsx`, which the blog and CMS
 *     feature pages use too.
 *   - The heading was `text-4xl/5xl font-medium tracking-tight`, a fourth h1
 *     size on the site; it is now `.section-h2` like every other page title.
 *   - The container was a hand-rolled 12-column grid inside `.section`. It keeps
 *     the 12-column split (a document needs its nav rail) but the container is
 *     `<Section>`, so the text column lines up with the frame rules.
 *
 * The nav labels still fall back to an English literal when the `legal`
 * namespace is missing, because these three pages are the only place that used
 * `t.has()` for that; the fallback is a plain conditional here, not a
 * `defaultValue` on `t()`.
 */

type LegalSection = "terms" | "privacy" | "cookies";

interface LegalLayoutProps {
  children: ReactNode;
  active: LegalSection;
  lastUpdated: string;
  title: string;
}

const NAV_ITEMS: Array<{
  section: LegalSection;
  to: "/$locale/terms/" | "/$locale/privacy/" | "/$locale/cookies/";
  labelKey: string;
  defaultLabel: string;
}> = [
  { section: "terms", to: "/$locale/terms/", labelKey: "termsOfService", defaultLabel: "Terms of Service" },
  { section: "privacy", to: "/$locale/privacy/", labelKey: "privacyPolicy", defaultLabel: "Privacy Policy" },
  { section: "cookies", to: "/$locale/cookies/", labelKey: "cookiePolicy", defaultLabel: "Cookie Policy" },
];

export function LegalLayout({ children, active, lastUpdated, title }: LegalLayoutProps) {
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";
  const t = useTranslations("legal");

  return (
    <>
      <Section>
        <h1 className="section-h2">{title}</h1>
        <p className="mt-3 text-[13px] text-mist-500">
          {t("lastUpdated", { date: lastUpdated })}
        </p>
      </Section>

      <Divider />

      <Section>
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Nav rail: a hairline list, not tinted pills. The active row is
              carried by ink weight plus a single left rule. */}
          <aside className="hidden lg:col-span-3 lg:block">
            <nav className="sticky top-32 flex flex-col">
              {NAV_ITEMS.map(({ section, to, labelKey, defaultLabel }) => {
                const isActive = active === section;
                return (
                  <Link
                    key={section}
                    to={to}
                    params={{ locale: currentLocale }}
                    aria-current={isActive ? "page" : undefined}
                    className={`border-l py-2 pl-3 text-[13px] transition-colors ${
                      isActive
                        ? "border-mist-900 font-medium text-mist-900"
                        : "border-black/[0.07] text-mist-500 hover:text-mist-900"
                    }`}
                  >
                    {t.has(labelKey) ? t(labelKey) : defaultLabel}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="lg:col-span-9">
            <ProseBody>{children}</ProseBody>
          </main>
        </div>
      </Section>
    </>
  );
}
