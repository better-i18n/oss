import { useTranslations } from "@better-i18n/use-intl";
import { Link, useParams } from "@tanstack/react-router";
import { Demo } from "../demo";
import {
  IconChevronRight,
  IconArrowRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export default function Hero() {
  const t = useTranslations("hero");
  const { locale } = useParams({ strict: false });

  return (
    <section className="flex flex-col gap-16 px-2 pb-16 lg:gap-20 mx-auto w-full max-w-[1400px]">
      {/* Wallpaper Background - relative for absolute positioning of drawer */}
      <div className="wallpaper rounded-lg relative overflow-hidden w-full flex flex-col min-[900px]:block min-[900px]:min-h-[780px]">
        {/* Content Container */}
        <div className="px-6 lg:px-10 h-full min-[900px]:min-h-[780px] min-[900px]:flex min-[900px]:flex-col min-[900px]:justify-center relative z-10 lg:z-auto">
          <div className="flex items-center">
            {/* Left: Text Content - Vertically centered */}
            <div className="flex shrink-0 flex-col items-start justify-center gap-4 pt-16 pb-8 min-[900px]:py-0 max-w-full lg:max-w-[calc(100%-620px)] xl:max-w-[calc(100%-750px)]">
              {/* Announcement Badge */}
              <Link
                to="/$locale/changelog"
                params={{ locale: locale || "en" }}
                className="inline-flex items-center gap-x-3 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/80 hover:bg-white/15 transition-colors"
              >
                <span>{t("badge")}</span>
                <span className="h-3 w-px bg-white/20" />
                <span className="inline-flex items-center gap-1 font-medium text-white">
                  {t("learnMore")}
                  <IconChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <h1
                className="text-3xl/[1.1] font-semibold tracking-[-0.02em] text-white sm:text-4xl/[1.1] lg:text-[3rem]/[1.1]"
                style={{ textWrap: "balance" }}
              >
                {t("title")}
              </h1>

              <p className="max-w-xl text-base/7 text-white/70">
                {t("subtitle")}
              </p>

              {/* Email Signup Form */}
              <div className="relative w-full max-w-sm">
                <input
                  type="email"
                  placeholder={t("inputPlaceholder")}
                  className="w-full text-sm pl-5 pr-36 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:border-white/40"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-white/90 transition-colors">
                  {t("cta")}
                  <IconArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Drawer - Desktop: Absolute to wallpaper, right side, with top padding */}
        <div className="hidden min-[900px]:block absolute right-0 top-20 bottom-0">
          <div
            className="rounded-tl-2xl bg-white h-full w-[600px] xl:w-[700px]"
            style={{
              boxShadow:
                "0 28px 70px rgba(0, 0, 0, 0.25), 0 14px 32px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Demo />
          </div>
        </div>

        {/* Mobile Demo - below 900px, centered */}
        <div className="min-[900px]:hidden relative px-4 pb-10">
          <div
            className="rounded-xl bg-white mx-auto overflow-hidden"
            style={{
              boxShadow:
                "0 28px 70px rgba(0, 0, 0, 0.25), 0 14px 32px rgba(0, 0, 0, 0.15)",
              maxWidth: "100%",
              height: "600px",
            }}
          >
            <Demo />
          </div>
        </div>
      </div>

      {/* Logo Grid Footer */}
      <div className="w-full px-6 lg:px-10 mt-[-24px] mb-8">
        <div className="logo-grid mx-auto w-full">
          {[
            {
              src: "https://carna.ai/_next/image?url=%2Flogo_full.svg&w=640&q=75",
              alt: "Carna",
              className: "h-8 w-auto opacity-50 grayscale",
            },
            ...[9, 10, 11, 12, 13].map((num) => ({
              src: `https://assets.tailwindplus.com/logos/${num}.svg?color=black&height=32`,
              alt: "Logo",
              className: "h-8 w-auto opacity-50",
            })),
          ].map((logo, index) => (
            <span key={index} className="flex h-8 items-stretch justify-center">
              <img src={logo.src} alt={logo.alt} className={logo.className} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
