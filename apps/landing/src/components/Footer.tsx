import { Link, useParams } from "@tanstack/react-router";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { IconSquareArrowTopRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { useTranslations } from "@better-i18n/use-intl";

const footerLinks = [
  {
    category: "product",
    links: [
      { key: "features", label: "Features", href: "/#features" },
      { key: "pricing", label: "Pricing", href: "/#pricing" },
      { key: "integrations", label: "Integrations", href: "#" },
    ],
  },
  {
    category: "company",
    links: [
      { key: "about", label: "About", href: "#" },
      { key: "careers", label: "Careers", href: "#" },
      { key: "blog", label: "Blog", href: "#" },
    ],
  },
  {
    category: "resources",
    links: [
      {
        key: "helpCenter",
        label: "Help Center",
        href: "https://docs.better-i18n.com/",
      },
      {
        key: "apiDocs",
        label: "API Docs",
        href: "https://docs.better-i18n.com/",
      },
      { key: "status", label: "Status", href: "#" },
      { key: "changelog", label: "Changelog", href: "/$locale/changelog" },
    ],
  },
  {
    category: "legal",
    links: [
      { key: "privacy", label: "Privacy", href: "/$locale/privacy" },
      { key: "terms", label: "Terms", href: "/$locale/terms" },
      { key: "security", label: "Security", href: "#" },
    ],
  },
  {
    category: "connect",
    links: [
      { key: "x", label: "X", href: "#" },
      { key: "github", label: "GitHub", href: "#" },
      { key: "youtube", label: "YouTube", href: "#" },
    ],
  },
];

export default function Footer() {
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";
  const t = useTranslations("footer");

  return (
    <footer className="py-16 bg-mist-950/[0.025]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 mb-12">
          {footerLinks.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-medium text-mist-950 mb-4">
                {t(`${group.category}.title`)}
              </h3>
              <ul className="space-y-3 text-sm text-mist-700">
                {group.links.map((link) => {
                  const label = t(`${group.category}.${link.key}`);
                  const isExternal = link.href.startsWith("http");
                  const isHash = link.href.startsWith("/#");

                  return (
                    <li key={link.key}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link flex items-center gap-1.5 hover:text-mist-950"
                        >
                          {label}
                          <IconSquareArrowTopRight className="w-3 h-3 opacity-0 group-hover/link:opacity-50 transition-opacity" />
                        </a>
                      ) : (
                        <Link
                          to={
                            isHash
                              ? "/$locale"
                              : (link.href as
                                  | "/$locale"
                                  | "/$locale/changelog"
                                  | "/$locale/privacy"
                                  | "/$locale/terms")
                          }
                          params={{ locale: currentLocale }}
                          hash={
                            isHash ? link.href.replace("/#", "") : undefined
                          }
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
        <div className="pt-8 border-t border-mist-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <span className="text-sm text-mist-500">
            {t("copyright", { defaultValue: "© 2026 Better i18n, Inc." })}
          </span>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
