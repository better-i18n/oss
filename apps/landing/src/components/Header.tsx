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
  IconArrowRight,
  IconLiveActivity,
  IconGlobe,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { useT } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { LanguageSwitcher } from "./LanguageSwitcher";

export default function Header({ className }: { className?: string }) {
  const { locale } = useParams({ strict: false });
  const t = useT("header");

  const { data: statusData } = useQuery<{ status: string }>({
    queryKey: ["site-status"],
    queryFn: () => fetch("/api/status").then((r) => r.json()),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
  const isStatusOk = !statusData || statusData.status === "operational";

  return (
    <header className={cn("sticky top-0 z-10 bg-mist-100", className)}>
      <nav aria-label="Main navigation">
        <div className="mx-auto flex h-[5.25rem] max-w-7xl items-center gap-4 px-6 lg:px-10">
          <div className="flex flex-1 items-center">
            <Link
              to="/$locale"
              params={{ locale: locale || "en" }}
              className="inline-flex items-center gap-2.5"
            >
              <img
                src="https://better-i18n.com/cdn-cgi/image/width=48/logo.png"
                alt="Better i18n - Translation Management Platform"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="font-display font-semibold text-base">
                Better I18N
              </span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/$locale/features"
              params={{ locale: locale || "en" }}
              className="text-sm/7 font-medium text-mist-950 hover:text-mist-600"
            >
              {t("features", { defaultValue: "Features" })}
            </Link>
            {/* For Product Mega Menu */}
            <div className="relative group">
              <button aria-haspopup="true" aria-expanded="false" className="inline-flex items-center gap-1 text-sm/7 font-medium text-mist-950 hover:text-mist-600">
                {t("forProduct", { defaultValue: "Product" })}
                <IconChevronBottom className="w-4 h-4 text-mist-400 group-hover:text-mist-600 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-mist-50 rounded-xl border border-mist-200 p-1.5 w-[540px] shadow-lg">
                  {/* Grid container with border */}
                  <div className="bg-white rounded-lg border border-mist-200 p-2 shadow-sm" role="menu">
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

                  {/* More Solutions */}
                  <div className="px-3 py-2">
                    <p className="text-xs font-medium text-mist-400 uppercase tracking-wider mb-1.5">
                      {t("menu.moreSolutions", { defaultValue: "More Solutions" })}
                    </p>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                      {/* Business & Industry */}
                      <Link
                        to="/$locale/for-enterprises"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.enterprises", { defaultValue: "Enterprises" })}
                      </Link>
                      <Link
                        to="/$locale/for-saas"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.saas", { defaultValue: "SaaS" })}
                      </Link>
                      <Link
                        to="/$locale/for-ecommerce"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.ecommerce", { defaultValue: "E-Commerce" })}
                      </Link>
                      <Link
                        to="/$locale/for-startups"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.startups", { defaultValue: "Startups" })}
                      </Link>
                      <Link
                        to="/$locale/for-healthcare"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.healthcare", { defaultValue: "Healthcare" })}
                      </Link>
                      <Link
                        to="/$locale/for-education"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.education", { defaultValue: "Education" })}
                      </Link>
                      <Link
                        to="/$locale/for-gaming"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.gaming", { defaultValue: "Gaming" })}
                      </Link>
                      <Link
                        to="/$locale/for-open-source"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.openSource", { defaultValue: "Open Source" })}
                      </Link>
                      {/* Teams & Roles */}
                      <Link
                        to="/$locale/for-marketers"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.marketers", { defaultValue: "Marketers" })}
                      </Link>
                      <Link
                        to="/$locale/for-designers"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.designers", { defaultValue: "Designers" })}
                      </Link>
                      <Link
                        to="/$locale/for-content-teams"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.contentTeams", { defaultValue: "Content Teams" })}
                      </Link>
                      <Link
                        to="/$locale/for-engineering-leaders"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.engineeringLeaders", { defaultValue: "Engineering Leaders" })}
                      </Link>
                      <Link
                        to="/$locale/for-mobile-teams"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.mobileTeams", { defaultValue: "Mobile Teams" })}
                      </Link>
                      <Link
                        to="/$locale/for-agencies"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.agencies", { defaultValue: "Agencies" })}
                      </Link>
                      <Link
                        to="/$locale/for-freelancers"
                        params={{ locale: locale || "en" }}
                        className="text-sm text-mist-700 hover:text-mist-950 py-1 transition-colors"
                      >
                        {t("menu.solutions.freelancers", { defaultValue: "Freelancers" })}
                      </Link>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="px-3 py-2.5 border-t border-mist-100">
                    <p className="text-sm text-mist-500">
                      {t("menu.interested", { defaultValue: "Interested?" })}{" "}
                      <a
                        href="https://cal.com/better-i18n/30min?overlayCalendar=true"
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
            {/* Developers Mega Menu */}
            <div className="relative group">
              <button aria-haspopup="true" aria-expanded="false" className="inline-flex items-center gap-1 text-sm/7 font-medium text-mist-950 hover:text-mist-600">
                {t("developers.title", { defaultValue: "Developers" })}
                <IconChevronBottom className="w-4 h-4 text-mist-400 group-hover:text-mist-600 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-mist-50 rounded-xl border border-mist-200 p-1.5 w-[520px] shadow-lg">
                  <div className="bg-white rounded-lg border border-mist-200 p-2 shadow-sm" role="menu">
                    <p className="px-2.5 py-1.5 text-xs font-medium text-mist-500 uppercase tracking-wider">
                      {t("developers.frameworkGuides", { defaultValue: "Framework Guides" })}
                    </p>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      <Link
                        to="/$locale/i18n/react"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">React</span>
                        <IconArrowRight className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </Link>
                      <Link
                        to="/$locale/i18n/nextjs"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">Next.js</span>
                        <IconArrowRight className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </Link>
                      <Link
                        to="/$locale/i18n/vue"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">Vue</span>
                        <IconArrowRight className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </Link>
                      <Link
                        to="/$locale/i18n/nuxt"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">Nuxt</span>
                        <IconArrowRight className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </Link>
                      <Link
                        to="/$locale/i18n/angular"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">Angular</span>
                        <IconArrowRight className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </Link>
                      <Link
                        to="/$locale/i18n/svelte"
                        params={{ locale: locale || "en" }}
                        className="group/item flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-mist-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-mist-950">Svelte</span>
                        <IconArrowRight className="size-3.5 text-mist-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </Link>
                    </div>
                  </div>
                  <div className="px-3 py-2.5 flex items-center justify-between">
                    <p className="text-sm text-mist-500">
                      {t("developers.viewDocs", { defaultValue: "View full documentation" })}
                    </p>
                    <a
                      href="https://docs.better-i18n.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-mist-950 hover:underline"
                    >
                      {t("documentation", { defaultValue: "Documentation" })}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <Link
              to="/$locale/pricing"
              params={{ locale: locale || "en" }}
              className="text-sm/7 font-medium text-mist-950 hover:text-mist-600"
            >
              {t("pricing", { defaultValue: "Pricing" })}
            </Link>
            <Link
              to="/$locale/compare"
              params={{ locale: locale || "en" }}
              className="text-sm/7 font-medium text-mist-950 hover:text-mist-600"
            >
              {t("compare", { defaultValue: "Compare" })}
            </Link>
            <div className="relative group">
              <button aria-haspopup="true" aria-expanded="false" className="inline-flex items-center gap-1 text-sm/7 font-medium text-mist-950 hover:text-mist-600">
                {t("resources.title", { defaultValue: "Resources" })}
                <IconChevronBottom className="w-4 h-4 text-mist-400 group-hover:text-mist-600 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-mist-50 rounded-xl border border-mist-200 p-1.5 shadow-lg min-w-[480px]">
                  <div className="flex gap-2">
                    {/* Left column - Main links with icons and descriptions */}
                    <div className="bg-white rounded-lg border border-mist-200 p-2 shadow-sm space-y-1 min-w-[260px]" role="menu">
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
                              defaultValue: "The team behind Better i18n",
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
                    <div className="p-3 space-y-1 min-w-[180px]" role="menu">
                      {/* Documentation */}
                      <a
                        href="https://docs.better-i18n.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <IconBook className="size-4 text-mist-600" />
                        <span className="text-sm font-medium text-mist-950">
                          {t("documentation", { defaultValue: "Documentation" })}
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
                          {t("changelog", { defaultValue: "Changelog" })}
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
                          {t("blog", { defaultValue: "Blog" })}
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
                          {t("apiReference", { defaultValue: "API Reference" })}
                        </span>
                      </a>

                      {/* Status */}
                      <a
                        href="https://status.better-i18n.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <div className="relative">
                          <IconLiveActivity className="size-4 text-mist-600" />
                          {!isStatusOk && (
                            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-red-500 ring-1 ring-white" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-mist-950">
                          {t("status", { defaultValue: "Status" })}
                        </span>
                      </a>

                      {/* What is i18n? */}
                      <Link
                        to="/$locale/what-is-i18n"
                        params={{ locale: locale || "en" }}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <IconGlobe className="size-4 text-mist-600" />
                        <span className="text-sm font-medium text-mist-950">
                          {t("resources.whatIsI18n", { defaultValue: "What is i18n?" })}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <LanguageSwitcher />
            <div className="flex shrink-0 items-center gap-5">
              <a
                href="https://dash.better-i18n.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-mist-950 px-4 py-1.5 text-sm/7 font-medium text-white hover:bg-mist-800"
              >
                {t("getStarted", { defaultValue: "Get Started" })}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
