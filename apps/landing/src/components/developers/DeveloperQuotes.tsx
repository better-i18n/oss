import { useTranslations } from "@better-i18n/use-intl";
import {
  IconCheckCircle2,
  IconQuotation,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const QUOTE_KEYS = ["yamlHell", "contextSwitching", "missingKeys"] as const;

const SOURCES: Record<(typeof QUOTE_KEYS)[number], string> = {
  yamlHell: "Dev.to",
  contextSwitching: "Hacker News",
  missingKeys: "Dev.to",
};

export default function DeveloperQuotes() {
  const t = useTranslations("developers");

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 lg:mb-16">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("quotes.title")}
          </h2>
          <p className="mt-4 text-lg text-mist-600">
            {t("quotes.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {QUOTE_KEYS.map((key) => (
            <div
              key={key}
              className="group relative bg-mist-50 border border-mist-200 rounded-2xl p-6 lg:p-8 hover:border-mist-300 transition-colors"
            >
              {/* Quote */}
              <div className="mb-6">
                <IconQuotation className="size-8 text-mist-300 mb-3" />
                <p className="text-base font-medium text-mist-950 leading-relaxed">
                  "{t(`quotes.items.${key}.quote`)}"
                </p>
                <span className="mt-2 inline-block text-xs text-mist-400">
                  — {SOURCES[key]}
                </span>
              </div>

              {/* Solution */}
              <div className="flex gap-3 pt-5 border-t border-mist-200">
                <div className="flex-shrink-0 mt-0.5">
                  <IconCheckCircle2 className="size-5 text-emerald-500" />
                </div>
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-mist-400">
                    {t("quotes.solutionLabel")}
                  </span>
                  <p className="text-sm text-mist-700 mt-1">
                    {t(`quotes.items.${key}.solution`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
