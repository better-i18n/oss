import { useTranslations } from "@better-i18n/use-intl";
import { IconChevronRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export default function CTA() {
  const t = useTranslations("cta");

  return (
    <section className="py-16 bg-mist-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1]">
            {t("title")}
          </h2>
          <p className="text-base/7 text-mist-700 max-w-2xl">{t("subtitle")}</p>
          <div className="flex items-center gap-4">
            <a
              href="https://dash.better-i18n.com"
              className="inline-flex items-center justify-center rounded-full bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800"
            >
              {t("startTrial")}
            </a>
            <a
              href="https://cal.com/better-i18n/30min?overlayCalendar=true"
              className="inline-flex items-center gap-1 text-sm font-medium text-mist-700 hover:text-mist-950"
            >
              {t("bookDemo")}
              <IconChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
