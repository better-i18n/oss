import { Link, useParams } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { IconSquareArrowTopRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import {
  GdprIcon,
  CcpaIcon,
  LgpdIcon,
  GoogleIcon,
  UsPrivacyIcon,
  TlsLockIcon,
} from "./icons/ComplianceIcons";
import { useT } from "@/lib/i18n";

function ComplianceBadge({
  label,
  icon,
  href,
  external,
}: {
  label: string;
  icon: ReactNode;
  href: string;
  external?: boolean;
}) {
  const className =
    "inline-flex items-center gap-1.5 rounded-full border border-mist-200 bg-white px-3 py-1.5 text-xs font-medium text-mist-600 hover:border-mist-300 hover:text-mist-800 transition-colors";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {icon}
        {label}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {icon}
      {label}
    </Link>
  );
}

const footerLinks = [
  {
    category: "product",
    categoryTitle: "Product",
    links: [
      { key: "features", label: "Features", href: "/$locale/features/" },
      { key: "pricing", label: "Pricing", href: "/$locale/pricing/" },
      { key: "integrations", label: "Integrations", href: "/$locale/integrations/" },
    ],
  },
  {
    category: "frameworks",
    categoryTitle: "Frameworks",
    links: [
      { key: "react", label: "React", href: "/$locale/i18n/react/" },
      { key: "nextjs", label: "Next.js", href: "/$locale/i18n/nextjs/" },
      { key: "vue", label: "Vue", href: "/$locale/i18n/vue/" },
      { key: "nuxt", label: "Nuxt", href: "/$locale/i18n/nuxt/" },
      { key: "angular", label: "Angular", href: "/$locale/i18n/angular/" },
      { key: "svelte", label: "Svelte", href: "/$locale/i18n/svelte/" },
    ],
  },
  {
    category: "solutions",
    categoryTitle: "Solutions",
    links: [
      { key: "translators", label: "For Translators", href: "/$locale/for-translators/" },
      { key: "developers", label: "For Developers", href: "/$locale/for-developers/" },
      { key: "productTeams", label: "For Product Teams", href: "/$locale/for-product-teams/" },
      { key: "enterprises", label: "For Enterprises", href: "/$locale/for-enterprises/" },
      { key: "startups", label: "For Startups", href: "/$locale/for-startups/" },
      { key: "agencies", label: "For Agencies", href: "/$locale/for-agencies/" },
      { key: "ecommerce", label: "For E-Commerce", href: "/$locale/for-ecommerce/" },
      { key: "saas", label: "For SaaS", href: "/$locale/for-saas/" },
    ],
  },
  {
    category: "compare",
    categoryTitle: "Compare",
    links: [
      { key: "overview", label: "All Comparisons", href: "/$locale/compare/" },
      { key: "crowdin", label: "vs Crowdin", href: "/$locale/compare/crowdin/" },
      { key: "lokalise", label: "vs Lokalise", href: "/$locale/compare/lokalise/" },
      { key: "phrase", label: "vs Phrase", href: "/$locale/compare/phrase/" },
      { key: "transifex", label: "vs Transifex", href: "/$locale/compare/transifex/" },
    ],
  },
  {
    category: "company",
    categoryTitle: "Company",
    links: [
      { key: "about", label: "About", href: "/$locale/about/" },
      { key: "careers", label: "Careers", href: "/$locale/careers/" },
      { key: "blog", label: "Blog", href: "/$locale/blog/" },
    ],
  },
  {
    category: "resources",
    categoryTitle: "Resources",
    links: [
      {
        key: "helpCenter",
        label: "Help Center",
        href: "https://help.better-i18n.com",
        localeAware: true,
      },
      {
        key: "apiDocs",
        label: "API Docs",
        href: "https://docs.better-i18n.com/",
      },
      { key: "whatIs", label: "What is i18n?", href: "/$locale/what-is/" },
      { key: "tools", label: "Free Tools", href: "/$locale/tools/" },
      { key: "status", label: "Status", href: "https://status.better-i18n.com" },
      { key: "changelog", label: "Changelog", href: "/$locale/changelog/" },
    ],
  },
  {
    category: "legal",
    categoryTitle: "Legal",
    links: [
      { key: "privacy", label: "Privacy", href: "/$locale/privacy/" },
      { key: "terms", label: "Terms", href: "/$locale/terms/" },
      { key: "cookies", label: "Cookie Policy", href: "/$locale/cookies/" },
      { key: "cookiePreferences", label: "Cookie Preferences", action: "cookie-preferences" },
      { key: "doNotSell", label: "Do Not Sell My Personal Information", action: "cookie-preferences" },
      { key: "security", label: "Security", href: "https://docs.better-i18n.com/security" },
    ],
  },
  {
    category: "connect",
    categoryTitle: "Connect",
    links: [
      { key: "x", label: "X", href: "https://x.com/betteri18n" },
      { key: "github", label: "GitHub", href: "https://github.com/better-i18n" },
      { key: "youtube", label: "YouTube", href: "https://youtube.com/@betteri18n" },
    ],
  },
];

export default function Footer() {
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";
  const t = useT("footer");

  return (
    <footer aria-label="Site footer" className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-8 mb-12">
          {footerLinks.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-medium text-mist-950 mb-4">
                {t(`${group.category}.title`, { defaultValue: group.categoryTitle })}
              </h3>
              <ul className="space-y-3 text-sm text-mist-700">
                {group.links.map((link) => {
                  const label = t(`${group.category}.${link.key}`, { defaultValue: link.label });

                  // Action-based link (e.g. cookie preferences button)
                  if ("action" in link && link.action === "cookie-preferences") {
                    return (
                      <li key={link.key}>
                        <button
                          type="button"
                          onClick={() => window.dispatchEvent(new Event("bi18n:show-cookie-banner"))}
                          className="hover:text-mist-950 cursor-pointer"
                        >
                          {label}
                        </button>
                      </li>
                    );
                  }

                  const href = link.href!;
                  const isExternal = href.startsWith("http");
                  const resolvedHref =
                    isExternal && "localeAware" in link && link.localeAware
                      ? `${href}/${currentLocale}`
                      : href;

                  return (
                    <li key={link.key}>
                      {isExternal ? (
                        <a
                          href={resolvedHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link flex items-center gap-1.5 hover:text-mist-950"
                        >
                          {label}
                          <IconSquareArrowTopRight className="w-3 h-3 opacity-0 group-hover/link:opacity-50 transition-opacity" />
                        </a>
                      ) : (
                        <Link
                          to={href}
                          params={{ locale: currentLocale }}
                          className="hover:text-mist-950"
                        >
                          {label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        {/* Compliance Badges */}
        <div className="pt-8 border-t border-mist-200 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <ComplianceBadge
              label="GDPR"
              icon={<GdprIcon className="w-5 h-3.5 shrink-0 rounded-[2px]" />}
              href={`/${currentLocale}/privacy/#gdpr`}
            />
            <ComplianceBadge
              label="CCPA"
              icon={<CcpaIcon className="w-3.5 h-3.5 shrink-0" />}
              href={`/${currentLocale}/privacy/#ccpa`}
            />
            <ComplianceBadge
              label="LGPD"
              icon={<LgpdIcon className="w-5 h-3.5 shrink-0 rounded-[2px]" />}
              href={`/${currentLocale}/privacy/#brazil`}
            />
            <ComplianceBadge
              label={t("badges.consentMode", { defaultValue: "Google Consent Mode v2" })}
              icon={<GoogleIcon className="w-3.5 h-3.5 shrink-0" />}
              href={`/${currentLocale}/cookies/#consentMode`}
            />
            <ComplianceBadge
              label={t("badges.usStateLaws", { defaultValue: "US State Privacy Laws" })}
              icon={<UsPrivacyIcon className="w-3.5 h-3.5 shrink-0" />}
              href={`/${currentLocale}/privacy/#us-state-laws`}
            />
            <ComplianceBadge
              label={t("badges.encryption", { defaultValue: "TLS 1.3 Encrypted" })}
              icon={<TlsLockIcon className="w-3.5 h-3.5 shrink-0" />}
              href="https://docs.better-i18n.com/security"
              external
            />
          </div>
        </div>

        <div className="pt-6 border-t border-mist-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <span className="text-sm text-mist-700">
            {t("copyright", { defaultValue: "© 2026 Better i18n, Inc." })}
          </span>
          <div className="flex items-center gap-4">
            <a
              href="/llms.txt"
              className="text-sm text-mist-500 hover:text-mist-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              LLMs.txt
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
