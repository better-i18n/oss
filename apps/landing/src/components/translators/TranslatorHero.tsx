import { useTranslations } from "@better-i18n/use-intl";
import {
  IconArrowRight,
  IconChevronRight,
  IconSparklesSoft,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export default function TranslatorHero() {
  const t = useTranslations("translators");

  return (
    <section className="px-2 pt-8 pb-16 lg:pb-24">
      <div className="w-full mx-auto max-w-[1400px]">
        <div className="px-6 lg:px-10 py-12 lg:py-16">
          {/* Stacked layout: Text on top, Video below */}
          <div className="flex flex-col gap-12 lg:gap-16">
            {/* Text Content - Left Aligned, Dark Text */}
            <div className="flex flex-col gap-6 max-w-3xl">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 rounded-full bg-mist-200 px-3 py-1.5 text-sm text-mist-700 w-fit">
                <IconSparklesSoft className="size-4" />
                {t("hero.badge")}
              </span>

              <h1
                className="text-3xl/[1.1] font-semibold tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1] lg:text-5xl/[1.1]"
                style={{ textWrap: "balance" }}
              >
                {t("hero.title")}
              </h1>

              <p
                className="text-base/7 text-mist-600 lg:text-lg/8"
                style={{ textWrap: "pretty" }}
              >
                {t("hero.description")}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <a
                  href="https://dash.better-i18n.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-mist-950 px-6 py-3 text-sm font-medium text-white hover:bg-mist-900 transition-colors"
                >
                  {t("hero.cta.primary")}
                  <IconArrowRight className="size-4" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 text-sm font-medium text-mist-600 hover:text-mist-950 transition-colors"
                >
                  {t("hero.cta.secondary")}
                  <IconChevronRight className="size-4" />
                </a>
              </div>
            </div>

            {/* Screenshot - Wrapped in wallpaper */}
            <div className="w-full wallpaper rounded-lg overflow-hidden p-4 lg:p-6">
              <div
                className="bg-white rounded-xl overflow-hidden relative"
                style={{
                  boxShadow:
                    "0 28px 70px rgba(0, 0, 0, 0.25), 0 14px 32px rgba(0, 0, 0, 0.15)",
                  aspectRatio: "16 / 8.40",
                }}
              >
                <img
                  src="/translators.png"
                  alt="Better i18n Translation Editor"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
