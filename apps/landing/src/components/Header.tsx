import { Link, useParams } from "@tanstack/react-router";
import { cn } from "@better-i18n/ui/lib/utils";
import {
  IconChevronBottom,
  IconAiTranslate,
  IconCodeBrackets,
  IconRocket,
  IconPeople,
  IconShieldCheck,
  IconScript,
  IconBook,
  IconSparklesSoft,
  IconNewspaper,
  IconApiConnection,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { useTranslations } from "@better-i18n/use-intl";

export default function Header({ className }: { className?: string }) {
  const { locale } = useParams({ strict: false });
  const t = useTranslations("header");

  return (
    <header className={cn("sticky top-0 z-10 bg-mist-100", className)}>
      <nav>
        <div className="mx-auto flex h-[5.25rem] max-w-7xl items-center gap-4 px-6 lg:px-10">
          <div className="flex flex-1 items-center">
            <Link
              to="/$locale"
              params={{ locale: locale || "en" }}
              className="inline-flex items-center gap-2.5"
            >
              <img
                src="https://better-i18n.com/cdn-cgi/image/width=48/logo.png"
                alt="Better I18N"
                className="w-6 h-6"
              />
              <span className="font-display font-semibold text-base">
                Better I18N
              </span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/$locale"
              params={{ locale: locale || "en" }}
              hash="features"
              className="text-sm/7 font-medium text-mist-950 hover:text-mist-600"
            >
              {t("features")}
            </Link>
            {/* For Product Mega Menu */}
            <div className="relative group">
              <button className="inline-flex items-center gap-1 text-sm/7 font-medium text-mist-950 hover:text-mist-600">
                {t("forProduct", { defaultValue: "Product" })}
                <IconChevronBottom className="w-4 h-4 text-mist-400 group-hover:text-mist-600 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-mist-50 rounded-xl border border-mist-200 p-1.5 w-[480px] shadow-lg">
                  {/* Grid container with border */}
                  <div className="bg-white rounded-lg border border-mist-200 p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      {/* For Translators */}
                      <Link
                        to="/$locale/for-translators"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-start gap-3 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <div className="flex-shrink-0 size-12 rounded-lg bg-white border border-mist-200 shadow-sm flex items-center justify-center text-mist-700">
                          <IconAiTranslate className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-sm font-medium text-mist-950">
                            {t("segments.translators.title", {
                              defaultValue: "For Translators",
                            })}
                          </div>
                          <div className="text-xs text-mist-500 leading-relaxed mt-0.5">
                            {t("segments.translators.shortDescription", {
                              defaultValue:
                                "Context-rich translation environment",
                            })}
                          </div>
                        </div>
                      </Link>

                      {/* For Developers */}
                      <Link
                        to="/$locale/for-developers"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-start gap-3 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <div className="flex-shrink-0 size-12 rounded-lg bg-white border border-mist-200 shadow-sm flex items-center justify-center text-mist-700">
                          <IconCodeBrackets className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-sm font-medium text-mist-950">
                            {t("segments.developers.title", {
                              defaultValue: "For Developers",
                            })}
                          </div>
                          <div className="text-xs text-mist-500 leading-relaxed mt-0.5">
                            {t("segments.developers.shortDescription", {
                              defaultValue:
                                "Automated sync and developer-first tools",
                            })}
                          </div>
                        </div>
                      </Link>

                      {/* For Product Teams */}
                      <Link
                        to="/$locale/for-product-teams"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-start gap-3 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <div className="flex-shrink-0 size-12 rounded-lg bg-white border border-mist-200 shadow-sm flex items-center justify-center text-mist-700">
                          <IconRocket className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-sm font-medium text-mist-950">
                            {t("segments.productTeams.title", {
                              defaultValue: "For Product Teams",
                            })}
                          </div>
                          <div className="text-xs text-mist-500 leading-relaxed mt-0.5">
                            {t("segments.productTeams.shortDescription", {
                              defaultValue:
                                "Manage localization without the hassle",
                            })}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="px-3 py-2.5">
                    <p className="text-sm text-mist-500">
                      {t("menu.interested", { defaultValue: "Interested?" })}{" "}
                      <a
                        href="https://cal.com/aliosman/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-mist-950 hover:underline"
                      >
                        {t("menu.scheduleDemo", {
                          defaultValue: "Schedule a demo",
                        })}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Link
              to="/$locale"
              params={{ locale: locale || "en" }}
              hash="pricing"
              className="text-sm/7 font-medium text-mist-950 hover:text-mist-600"
            >
              {t("pricing")}
            </Link>
            <div className="relative group">
              <button className="inline-flex items-center gap-1 text-sm/7 font-medium text-mist-950 hover:text-mist-600">
                {t("resources.title")}
                <IconChevronBottom className="w-4 h-4 text-mist-400 group-hover:text-mist-600 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-mist-50 rounded-xl border border-mist-200 p-1.5 shadow-lg min-w-[480px]">
                  <div className="flex gap-2">
                    {/* Left column - Main links with icons and descriptions */}
                    <div className="bg-white rounded-lg border border-mist-200 p-2 shadow-sm space-y-1 min-w-[260px]">
                      {/* About Us */}
                      <Link
                        to="/$locale/about"
                        params={{ locale: locale || "en" }}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <div className="flex-shrink-0 size-12 rounded-lg bg-white border border-mist-200 shadow-sm flex items-center justify-center text-mist-700">
                          <IconPeople className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-sm font-medium text-mist-950">
                            {t("resources.about.title", {
                              defaultValue: "About Us",
                            })}
                          </div>
                          <div className="text-xs text-mist-500 leading-relaxed mt-0.5">
                            {t("resources.about.description", {
                              defaultValue: "Learn more about our story",
                            })}
                          </div>
                        </div>
                      </Link>

                      {/* Privacy Policy */}
                      <Link
                        to="/$locale/privacy"
                        params={{ locale: locale || "en" }}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <div className="flex-shrink-0 size-12 rounded-lg bg-white border border-mist-200 shadow-sm flex items-center justify-center text-mist-700">
                          <IconShieldCheck className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-sm font-medium text-mist-950">
                            {t("resources.privacy.title", {
                              defaultValue: "Privacy Policy",
                            })}
                          </div>
                          <div className="text-xs text-mist-500 leading-relaxed mt-0.5">
                            {t("resources.privacy.description", {
                              defaultValue: "How we handle your data",
                            })}
                          </div>
                        </div>
                      </Link>

                      {/* Terms of Service */}
                      <Link
                        to="/$locale/terms"
                        params={{ locale: locale || "en" }}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <div className="flex-shrink-0 size-12 rounded-lg bg-white border border-mist-200 shadow-sm flex items-center justify-center text-mist-700">
                          <IconScript className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-sm font-medium text-mist-950">
                            {t("resources.terms.title", {
                              defaultValue: "Terms of Service",
                            })}
                          </div>
                          <div className="text-xs text-mist-500 leading-relaxed mt-0.5">
                            {t("resources.terms.description", {
                              defaultValue: "Our terms and conditions",
                            })}
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Right column - Simple links with small icons */}
                    <div className="p-3 space-y-1 min-w-[180px]">
                      {/* Documentation */}
                      <a
                        href="https://docs.better-i18n.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <IconBook className="size-4 text-mist-600" />
                        <span className="text-sm font-medium text-mist-950">
                          {t("documentation")}
                        </span>
                      </a>

                      {/* Changelog */}
                      <Link
                        to="/$locale/changelog"
                        params={{ locale: locale || "en" }}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <IconSparklesSoft className="size-4 text-mist-600" />
                        <span className="text-sm font-medium text-mist-950">
                          {t("changelog")}
                        </span>
                      </Link>

                      {/* Blog */}
                      <Link
                        to="/$locale/blog"
                        params={{ locale: locale || "en" }}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <IconNewspaper className="size-4 text-mist-600" />
                        <span className="text-sm font-medium text-mist-950">
                          {t("blog")}
                        </span>
                      </Link>

                      {/* API Reference */}
                      <a
                        href="https://docs.better-i18n.com/api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <IconApiConnection className="size-4 text-mist-600" />
                        <span className="text-sm font-medium text-mist-950">
                          {t("apiReference")}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="flex shrink-0 items-center gap-5">
              <a
                href="https://dash.better-i18n.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-mist-950 px-4 py-1.5 text-sm/7 font-medium text-white hover:bg-mist-800"
              >
                {t("getStarted")}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
