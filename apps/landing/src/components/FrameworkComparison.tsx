import { Link } from "@tanstack/react-router";
import {
  IconCheckmark1,
  IconArrowRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

interface FrameworkHeroProps {
  framework: string;
  title: string;
  subtitle: string;
  badgeText?: string;
}

export function FrameworkHero({ framework, title, subtitle, badgeText }: FrameworkHeroProps) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          {badgeText && (
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <span>{badgeText}</span>
            </div>
          )}
          <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
            {title}
          </h1>
          <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}

interface FeatureListProps {
  title: string;
  features: string[];
}

export function FeatureList({ title, features }: FeatureListProps) {
  return (
    <section className="py-16 bg-mist-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-mist-100">
              <IconCheckmark1 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-mist-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CodeExampleProps {
  title: string;
  description: string;
  code: string;
  language?: string;
}

export function CodeExample({ title, description, code }: CodeExampleProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-4">
          {title}
        </h2>
        <p className="text-mist-600 mb-6">{description}</p>
        <div className="bg-mist-950 rounded-xl p-6 overflow-x-auto">
          <pre className="text-sm text-mist-100 font-mono whitespace-pre">{code}</pre>
        </div>
      </div>
    </section>
  );
}

interface RelatedPageProps {
  title: string;
  pages: Array<{
    name: string;
    href: string;
    description: string;
  }>;
  locale: string;
}

export function RelatedPages({ title, pages, locale }: RelatedPageProps) {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link
              key={page.href}
              to={page.href}
              params={{ locale }}
              className="group flex items-center justify-between p-4 bg-mist-50 rounded-xl border border-mist-100 hover:border-mist-300 hover:bg-white transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{page.name}</h3>
                <p className="text-xs text-mist-500 mt-1">{page.description}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FrameworkCTAProps {
  title: string;
  subtitle: string;
  primaryCTA: string;
  primaryHref: string;
  secondaryCTA?: string;
  secondaryHref?: string;
}

export function FrameworkCTA({ title, subtitle, primaryCTA, primaryHref, secondaryCTA, secondaryHref }: FrameworkCTAProps) {
  return (
    <section className="py-16 sm:py-24 bg-mist-950 rounded-3xl mx-6 lg:mx-10 mb-16">
      <div className="mx-auto max-w-2xl text-center px-6">
        <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
          {title}
        </h2>
        <p className="mt-4 text-lg text-mist-300">{subtitle}</p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <a
            href={primaryHref}
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
          >
            {primaryCTA}
          </a>
          {secondaryCTA && secondaryHref && (
            <a
              href={secondaryHref}
              className="rounded-full border border-mist-600 px-6 py-3 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
            >
              {secondaryCTA}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

interface LibraryIntegrationProps {
  title: string;
  subtitle: string;
  libraries: Array<{
    name: string;
    description: string;
    integrationText: string;
  }>;
}

export function LibraryIntegration({ title, subtitle, libraries }: LibraryIntegrationProps) {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl mb-12">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1]">
            {title}
          </h2>
          <p className="mt-4 text-mist-600">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {libraries.map((lib) => (
            <div
              key={lib.name}
              className="p-6 rounded-2xl border border-mist-200 bg-mist-50/50"
            >
              <h3 className="text-lg font-medium text-mist-950 mb-2">
                Better i18n + {lib.name}
              </h3>
              <p className="text-sm text-mist-600 mb-4">{lib.description}</p>
              <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-mist-100">
                <IconCheckmark1 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-mist-700">{lib.integrationText}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface OtherFrameworksProps {
  title: string;
  currentFramework: string;
  locale: string;
}

const allFrameworks = [
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextjs" },
  { name: "Vue", slug: "vue" },
  { name: "Nuxt", slug: "nuxt" },
  { name: "Angular", slug: "angular" },
  { name: "Svelte", slug: "svelte" },
];

export function OtherFrameworks({ title, currentFramework, locale }: OtherFrameworksProps) {
  const others = allFrameworks.filter((f) => f.slug !== currentFramework);

  return (
    <section className="py-12 border-t border-mist-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-lg font-medium text-mist-950 mb-6">{title}</h2>
        <div className="flex flex-wrap gap-3">
          {others.map((framework) => (
            <Link
              key={framework.slug}
              to={`/$locale/i18n/${framework.slug}` as "/$locale/i18n/react" | "/$locale/i18n/nextjs" | "/$locale/i18n/vue" | "/$locale/i18n/nuxt" | "/$locale/i18n/angular" | "/$locale/i18n/svelte"}
              params={{ locale }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mist-200 bg-white text-sm text-mist-700 hover:border-mist-400 hover:text-mist-950 transition-colors"
            >
              {framework.name} i18n
              <IconArrowRight className="w-3 h-3" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
