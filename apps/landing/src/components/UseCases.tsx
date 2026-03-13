import { useT } from "@/lib/i18n";
import {
  IconCodeBrackets,
  IconGlobe,
  IconGithub,
  IconScript,
  IconZap,
  IconPageText,
  IconCircleInfo,
  IconApiConnection,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const features = [
  { key: "typescript", icon: IconCodeBrackets, title: "Type-Safe SDKs", description: "Full TypeScript support with autocompletion for every translation key." },
  { key: "cli", icon: IconScript, title: "CLI Tooling", description: "Scan your codebase, check for missing keys, and sync translations from the terminal." },
  { key: "git", icon: IconGithub, title: "Git Integration", description: "Translation updates delivered via pull requests to your repository." },
  { key: "cdn", icon: IconGlobe, title: "CDN Delivery", description: "Translations served globally with edge caching for instant load times." },
  { key: "saas", icon: IconZap, title: "SaaS Apps", description: "Multi-tenant localization with per-workspace language configurations." },
  { key: "ecommerce", icon: IconPageText, title: "E-Commerce", description: "Localize product listings, checkout flows, and marketing content." },
  { key: "mobile", icon: IconCircleInfo, title: "Mobile Apps", description: "Over-the-air translation updates without app store resubmissions." },
  { key: "contentPlatforms", icon: IconApiConnection, title: "Content Platforms", description: "Manage translations alongside your CMS content with full API access." },
];

export default function UseCases() {
  const t = useT("developerFeatures");

  return (
    <section id="developer-features" className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 max-w-3xl">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("title", { defaultValue: "Built for Developers" })}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-mist-600">
            {t("subtitle", { defaultValue: "Developer-first tools and integrations for every use case." })}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" id="use-cases">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                className="group rounded-2xl border border-mist-200 bg-white p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-1 hover:border-mist-200 hover:shadow-md"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-mist-100 bg-mist-50 shadow-sm">
                  <Icon className="size-5 text-mist-700" />
                </div>
                <h3 className="text-base font-medium text-mist-950">
                  {t(`${feature.key}.title`, { defaultValue: feature.title })}
                </h3>
                <p className="mt-2 text-sm leading-6 text-mist-600">
                  {t(`${feature.key}.description`, { defaultValue: feature.description })}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
