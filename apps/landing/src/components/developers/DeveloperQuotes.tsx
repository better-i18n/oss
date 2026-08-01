import { useTranslations } from "@better-i18n/use-intl";
import {
  IconCheckCircle2,
  IconOpenQuote1,
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
    <section className="bg-white">
      <div className="section">
        <div className="mb-12 lg:mb-16">
          <h2 className="section-h2">
            {t("quotes.title")}
          </h2>
          <p className="section-p mt-3">
            {t("quotes.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-9 md:grid-cols-3">
          {QUOTE_KEYS.map((key) => (
            <div
              key={key}
              className="flex flex-col"
            >
              {/* Quote */}
              <div className="mb-6">
                <IconOpenQuote1 className="size-8 text-mist-300 mb-3" />
                <p className="text-[15px] leading-relaxed text-mist-900">
                  "{t(`quotes.items.${key}.quote`)}"
                </p>
                <span className="mt-2 inline-block text-xs text-mist-400">
                  — {SOURCES[key]}
                </span>
              </div>

              {/* Solution */}
              <div className="flex gap-3 border-t border-black/[0.05] pt-4">
                <div className="flex-shrink-0 mt-0.5">
                  <IconCheckCircle2 className="size-5 text-emerald-500" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-mist-400">
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
