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
import { CompetitorMark, type CompetitorKey } from "@/components/icons/CompetitorMarks";

interface ComplianceBadgeProps {
  label: string;
  icon: ReactNode;
  href: string;
  external?: boolean;
}

function ComplianceBadge({ label, icon, href, external }: ComplianceBadgeProps) {
  // Hairline chip, not a pill button — these are evidence, not calls to action.
  const className =
    "inline-flex items-center gap-1.5 rounded-sm border border-black/[0.06] bg-white px-2.5 py-1 text-[11px] font-medium text-mist-400 transition-colors hover:border-black/[0.1] hover:text-mist-600";

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

type FooterLink =
  | {
      key: string;
      label: string;
      href: string;
      localeAware?: boolean;
      /** Vendor whose mark renders before the label (rule/name-a-thing-with-its-mark). */
      mark?: CompetitorKey;
    }
  | { key: string; label: string; action: string };

interface FooterLinkGroup {
  category: string;
  categoryTitle: string;
  links: FooterLink[];
}

const footerLinks: FooterLinkGroup[] = [
  {
    category: "product",
    categoryTitle: "Product",
    links: [
      { key: "features", label: "Features", href: "/$locale/features/" },
      { key: "content", label: "Better Content", href: "/$locale/content/" },
      { key: "analytics", label: "Better Analytics", href: "/$locale/analytics/" },
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
      { key: "crowdin", mark: "crowdin", label: "vs Crowdin", href: "/$locale/compare/crowdin/" },
      { key: "lokalise", mark: "lokalise", label: "vs Lokalise", href: "/$locale/compare/lokalise/" },
      { key: "phrase", mark: "phrase", label: "vs Phrase", href: "/$locale/compare/phrase/" },
      { key: "transifex", mark: "transifex", label: "vs Transifex", href: "/$locale/compare/transifex/" },
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
    <footer aria-label="Site footer" className="relative z-[1]">
      {/* Brand + links live inside the frame; the bottom bar spans full width so
          its rule reads as the page's closing edge (mirrors the header). */}
      <div className="footer-inner">
        <div className="px-8 pt-12 max-sm:px-5">
          <Link
            to="/$locale/"
            params={{ locale: currentLocale }}
            className="site-logo mb-3"
          >
            <img
              src="/brand/logo.svg"
              alt="Better I18N"
              width={22}
              height={22}
              className="size-[22px]"
            />
            Better I18N
          </Link>
          <p className="max-w-[36ch] text-[13px] leading-relaxed text-mist-400">
            {t("tagline")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 px-8 py-10 sm:grid-cols-4 max-sm:px-5">
          {footerLinks.map((group) => (
            <div key={group.category}>
              <h3 className="mb-4 text-xs font-medium tracking-[-0.01em] text-mist-900">
                {t(`${group.category}.title`)}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => {
                  const label = t(`${group.category}.${link.key}`);

                  if ("action" in link) {
                    return (
                      <li key={link.key}>
                        <button
                          type="button"
                          onClick={() => window.dispatchEvent(new Event("bi18n:show-cookie-banner"))}
                          className="footer-link cursor-pointer"
                        >
                          {label}
                        </button>
                      </li>
                    );
                  }

                  const { href, localeAware } = link;
                  const isExternal = href.startsWith("http");
                  const resolvedHref = isExternal && localeAware ? `${href}/${currentLocale}` : href;

                  return (
                    <li key={link.key}>
                      {isExternal ? (
                        <a
                          href={resolvedHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="footer-link group/link inline-flex items-center gap-1.5"
                        >
                          {label}
                          <IconSquareArrowTopRight className="size-3 opacity-0 transition-opacity group-hover/link:opacity-40" />
                        </a>
                      ) : (
                        <Link
                          to={href}
                          params={{ locale: currentLocale }}
                          className={
                            "mark" in link
                              ? "footer-link inline-flex items-center gap-2"
                              : "footer-link"
                          }
                        >
                          {/* A vendor name gets its own mark, at one size, on the
                              same neutral tile as everywhere else
                              (rule/name-a-thing-with-its-mark). */}
                          {"mark" in link && (
                            <CompetitorMark
                              competitor={link.mark as CompetitorKey}
                              size={16}
                              className="!rounded-[4px]"
                            />
                          )}
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
        {/* Compliance badges — evidence row, inside the frame above the rule. */}
        <div className="flex flex-wrap items-center gap-1.5 px-8 pb-10 max-sm:px-5">
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
            label={t("badges.consentMode")}
            icon={<GoogleIcon className="w-3.5 h-3.5 shrink-0" />}
            href={`/${currentLocale}/cookies/#consentMode`}
          />
          <ComplianceBadge
            label={t("badges.usStateLaws")}
            icon={<UsPrivacyIcon className="w-3.5 h-3.5 shrink-0" />}
            href={`/${currentLocale}/privacy/#us-state-laws`}
          />
          <ComplianceBadge
            label={t("badges.encryption")}
            icon={<TlsLockIcon className="w-3.5 h-3.5 shrink-0" />}
            href="https://docs.better-i18n.com/security"
            external
          />
        </div>
      </div>

      <div className="footer-bottom-wrap">
        <div className="footer-bottom-inner">
          <span className="text-xs text-mist-400">
            {t("copyright")}
          </span>
          <div className="flex items-center gap-4">
            <a
              href="/llms.txt"
              className="footer-social text-xs"
              target="_blank"
              rel="noopener noreferrer"
            >
              LLMs.txt
            </a>
            <LanguageSwitcher />
            {/* Both of these leave the site, so they open in a new tab and carry
                `noopener` — the LLMs.txt link beside them already did, and two
                links in the same row behaving differently is the kind of thing a
                reader notices without being able to name. `noopener` is the
                security half: without it the opened page gets `window.opener`
                and can navigate this tab somewhere else. */}
            <a
              href="https://x.com/betteri18n"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social"
              aria-label="X (Twitter)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com/better-i18n"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social"
              aria-label="GitHub"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
