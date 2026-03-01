import { Link, useParams } from "@tanstack/react-router";
import { useTranslations } from "@better-i18n/use-intl";
import { IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

const alternatives = [
  { key: "crowdin", name: "Crowdin", href: "/$locale/compare/crowdin" },
  { key: "lokalise", name: "Lokalise", href: "/$locale/compare/lokalise" },
  { key: "phrase", name: "Phrase", href: "/$locale/compare/phrase" },
  { key: "transifex", name: "Transifex", href: "/$locale/compare/transifex" },
];

export default function Alternatives() {
  const t = useTranslations("alternatives");
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";

  return (
    <section id="alternatives" className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
              {t("title", { defaultValue: "Why Teams Switch to Better i18n" })}
            </h2>
            <p className="mt-4 text-lg text-mist-700">{t("subtitle", { defaultValue: "A modern alternative to legacy localization platforms." })}</p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 size-5 rounded-full bg-mist-900 text-white text-xs flex items-center justify-center font-medium">
                  1
                </span>
                <span className="text-mist-700">{t("benefit1", { defaultValue: "AI translations that understand your brand and context" })}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 size-5 rounded-full bg-mist-900 text-white text-xs flex items-center justify-center font-medium">
                  2
                </span>
                <span className="text-mist-700">{t("benefit2", { defaultValue: "Git-native workflow — no manual file imports" })}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 size-5 rounded-full bg-mist-900 text-white text-xs flex items-center justify-center font-medium">
                  3
                </span>
                <span className="text-mist-700">{t("benefit3", { defaultValue: "Instant CDN delivery, no build step required" })}</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {alternatives.map((alt) => (
              <Link
                key={alt.key}
                to={
                  alt.href as
                    | "/$locale/compare/crowdin"
                    | "/$locale/compare/lokalise"
                    | "/$locale/compare/phrase"
                    | "/$locale/compare/transifex"
                }
                params={{ locale: currentLocale }}
                className="group flex items-center justify-between p-5 rounded-xl border border-mist-200 bg-mist-50/50 hover:border-mist-300 hover:bg-white hover:shadow-md transition-all"
              >
                <div>
                  <span className="text-xs text-mist-500 uppercase tracking-wider font-medium">
                    {t("vsLabel", { defaultValue: "VS" })}
                  </span>
                  <span className="block text-base font-medium text-mist-950 mt-0.5">
                    {alt.name}
                  </span>
                </div>
                <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/$locale/i18n/best-tms"
            params={{ locale: currentLocale }}
            className="inline-flex items-center gap-2 text-sm font-medium text-mist-700 hover:text-mist-950"
          >
            {t("viewFullComparison", { defaultValue: "View full comparison" })}
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
