import { Link, useParams } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import {
  IconArrowRight,
  IconSparklesSoft,
  IconMagnifyingGlass,
  IconZap,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const alternatives = [
  { key: "crowdin", name: "Crowdin", href: "/$locale/compare/crowdin" },
  { key: "lokalise", name: "Lokalise", href: "/$locale/compare/lokalise" },
  { key: "phrase", name: "Phrase", href: "/$locale/compare/phrase" },
  { key: "transifex", name: "Transifex", href: "/$locale/compare/transifex" },
] as const;

const differentiators = [
  { key: "differentiator1", icon: IconSparklesSoft },
  { key: "differentiator2", icon: IconMagnifyingGlass },
  { key: "differentiator3", icon: IconZap },
] as const;

export default function Alternatives() {
  const t = useT("alternatives");
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
            <div className="mt-8 space-y-5">
              {differentiators.map(({ key, icon: Icon }) => (
                <div key={key} className="flex items-start gap-4">
                  <span className="flex-shrink-0 size-10 rounded-lg bg-mist-100 text-mist-900 flex items-center justify-center">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-mist-950">
                      {t(`${key}.title`)}
                    </h3>
                    <p className="mt-0.5 text-sm text-mist-600">
                      {t(`${key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
                  <span className="text-xs text-mist-700 uppercase tracking-wider font-medium">
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
