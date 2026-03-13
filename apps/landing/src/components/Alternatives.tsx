import { Link, useParams } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

const alternatives = [
  { key: "crowdin", name: "Crowdin", href: "/$locale/compare/crowdin" },
  { key: "lokalise", name: "Lokalise", href: "/$locale/compare/lokalise" },
  { key: "phrase", name: "Phrase", href: "/$locale/compare/phrase" },
  { key: "transifex", name: "Transifex", href: "/$locale/compare/transifex" },
];

export default function Alternatives() {
  const t = useT("alternatives");
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";

  return (
    <section id="alternatives" className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-mist-200 bg-mist-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-mist-600">
            {t("vsLabel", { defaultValue: "Compare" })}
          </div>
          <h2 className="mt-4 font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("title", { defaultValue: "Why Teams Switch to Better i18n" })}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-mist-700">
            {t("subtitle", { defaultValue: "A modern alternative to legacy localization platforms." })}
          </p>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-mist-500">
              {t("benefitsLabel", { defaultValue: "Why it lands better" })}
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mist-900 text-xs font-medium text-white">
                  1
                </span>
                <span className="text-mist-700">{t("benefit1", { defaultValue: "AI translations that understand your brand and context" })}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mist-900 text-xs font-medium text-white">
                  2
                </span>
                <span className="text-mist-700">{t("benefit2", { defaultValue: "Git-native workflow — no manual file imports" })}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mist-900 text-xs font-medium text-white">
                  3
                </span>
                <span className="text-mist-700">{t("benefit3", { defaultValue: "Instant CDN delivery, no build step required" })}</span>
              </li>
            </ul>

            <div className="mt-auto pt-8">
              <Link
                to="/$locale/i18n/best-tms"
                params={{ locale: currentLocale }}
                className="inline-flex items-center gap-2 rounded-full border border-mist-200 bg-mist-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mist-800"
              >
                {t("viewFullComparison", { defaultValue: "View full comparison" })}
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2">
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
                className="group flex h-full min-h-[180px] flex-col rounded-2xl border border-mist-200 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-1 hover:border-mist-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center rounded-full border border-mist-200 bg-mist-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-mist-600">
                    {t("vsLabel", { defaultValue: "VS" })}
                  </span>
                  <div className="rounded-full border border-mist-200 bg-mist-50 p-2 text-mist-400 transition-colors group-hover:text-mist-700">
                    <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <span className="block text-lg font-medium text-mist-950">
                    {alt.name}
                  </span>
                  <p className="mt-2 text-sm leading-6 text-mist-600">
                    {t(`${alt.key}.description`, {
                      defaultValue: `See how Better i18n compares with ${alt.name}.`,
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
