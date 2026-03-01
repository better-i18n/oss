import { Link, useParams } from "@tanstack/react-router";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { IconSquareArrowTopRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { useTranslations } from "@better-i18n/use-intl";

const footerLinks = [
  {
    category: "product",
    categoryTitle: "Product",
    links: [
      { key: "features", label: "Features", href: "/$locale/features" },
      { key: "pricing", label: "Pricing", href: "/$locale/pricing" },
      { key: "integrations", label: "Integrations", href: "/$locale/integrations" },
    ],
  },
  {
    category: "frameworks",
    categoryTitle: "Frameworks",
    links: [
      { key: "react", label: "React", href: "/$locale/i18n/react" },
      { key: "nextjs", label: "Next.js", href: "/$locale/i18n/nextjs" },
      { key: "vue", label: "Vue", href: "/$locale/i18n/vue" },
      { key: "nuxt", label: "Nuxt", href: "/$locale/i18n/nuxt" },
      { key: "angular", label: "Angular", href: "/$locale/i18n/angular" },
      { key: "svelte", label: "Svelte", href: "/$locale/i18n/svelte" },
    ],
  },
  {
    category: "compare",
    categoryTitle: "Compare",
    links: [
      { key: "crowdin", label: "vs Crowdin", href: "/$locale/compare/crowdin" },
      { key: "lokalise", label: "vs Lokalise", href: "/$locale/compare/lokalise" },
      { key: "phrase", label: "vs Phrase", href: "/$locale/compare/phrase" },
      { key: "transifex", label: "vs Transifex", href: "/$locale/compare/transifex" },
    ],
  },
  {
    category: "company",
    categoryTitle: "Company",
    links: [
      { key: "about", label: "About", href: "/$locale/about" },
      { key: "careers", label: "Careers", href: "/$locale/careers" },
      { key: "blog", label: "Blog", href: "/$locale/blog" },
    ],
  },
  {
    category: "resources",
    categoryTitle: "Resources",
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
      { key: "whatIs", label: "What is i18n?", href: "/$locale/what-is" },
      { key: "status", label: "Status", href: "/$locale/status" },
      { key: "changelog", label: "Changelog", href: "/$locale/changelog" },
    ],
  },
  {
    category: "legal",
    categoryTitle: "Legal",
    links: [
      { key: "privacy", label: "Privacy", href: "/$locale/privacy" },
      { key: "terms", label: "Terms", href: "/$locale/terms" },
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
  const t = useTranslations("footer");

  return (
    <footer className="py-16 bg-mist-950/[0.025]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-7 mb-12">
          {footerLinks.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-medium text-mist-950 mb-4">
                {t(`${group.category}.title`, { defaultValue: group.categoryTitle })}
              </h3>
              <ul className="space-y-3 text-sm text-mist-700">
                {group.links.map((link) => {
                  const label = t(`${group.category}.${link.key}`, { defaultValue: link.label });
                  const isExternal = link.href.startsWith("http");

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
                          to={link.href as "/$locale" | "/$locale/features" | "/$locale/pricing" | "/$locale/integrations" | "/$locale/about" | "/$locale/careers" | "/$locale/blog" | "/$locale/status" | "/$locale/changelog" | "/$locale/privacy" | "/$locale/terms" | "/$locale/what-is" | "/$locale/compare/crowdin" | "/$locale/compare/lokalise" | "/$locale/compare/phrase" | "/$locale/compare/transifex" | "/$locale/i18n/react" | "/$locale/i18n/nextjs" | "/$locale/i18n/vue" | "/$locale/i18n/nuxt" | "/$locale/i18n/angular" | "/$locale/i18n/svelte"}
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
