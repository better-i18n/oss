import { useTranslations } from "@better-i18n/use-intl";
import {
  IconArrowRight,
  IconChevronRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export default function TranslatorCTA() {
  const t = useTranslations("translators");

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-mist-950 px-8 py-16 lg:px-16 lg:py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          </div>

          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-lg text-white/70">{t("cta.subtitle")}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://dash.better-i18n.com"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-white/90 transition-colors"
              >
                {t("cta.startTrial")}
                <IconArrowRight className="size-4" />
              </a>
              <a
                href="https://cal.com/better-i18n/demo"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                {t("cta.bookDemo")}
                <IconChevronRight className="size-4" />
              </a>
            </div>

            {/* Resources Links */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-sm text-white/50 mb-4">
                {t("cta.resourcesTitle")}
              </p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                <a
                  href="https://docs.better-i18n.com"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t("cta.resources.docs")}
                </a>
                <a
                  href="https://docs.better-i18n.com/glossary"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t("cta.resources.glossary")}
                </a>
                <a
                  href="https://docs.better-i18n.com/ai-chat"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t("cta.resources.aiChat")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
