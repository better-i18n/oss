import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";

interface FrameworkHeroProps {
  title: string;
  subtitle: string;
  badgeText?: string;
}

export function FrameworkHero({
  title,
  subtitle,
  badgeText,
}: FrameworkHeroProps) {
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
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-white rounded-xl border border-mist-100"
            >
              <SpriteIcon name="checkmark" className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
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
}

export function CodeExample({ title, description, code }: CodeExampleProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-4">
          {title}
        </h2>
        <p className="text-mist-600 mb-6">{description}</p>
        <div className="rounded-xl overflow-hidden border border-mist-200">
          <div className="bg-mist-950 p-6 overflow-x-auto">
            <pre className="text-sm text-mist-100 font-mono whitespace-pre">
              {code}
            </pre>
          </div>
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

export function FrameworkCTA({
  title,
  subtitle,
  primaryCTA,
  primaryHref,
  secondaryCTA,
  secondaryHref,
}: FrameworkCTAProps) {
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

export function LibraryIntegration({
  title,
  subtitle,
  libraries,
}: LibraryIntegrationProps) {
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
                <SpriteIcon name="checkmark" className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-mist-700">{lib.integrationText}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface SetupStep {
  step: number;
  title: string;
  description: string;
  code?: string;
  fileName?: string;
}

export function SetupGuide({
  title,
  steps,
}: {
  title: string;
  steps: SetupStep[];
}) {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-2xl font-medium tracking-tight text-mist-950 sm:text-3xl mb-12">
          {title}
        </h2>
        <div className="space-y-10">
          {steps.map((step) => (
            <div key={step.step} className="flex gap-6">
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center size-8 rounded-full bg-mist-950 text-white text-sm font-mono font-medium">
                  {step.step}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-mist-950 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-mist-600 mb-4">{step.description}</p>
                {step.code && (
                  <div className="rounded-xl overflow-hidden border border-mist-200">
                    {step.fileName && (
                      <div className="px-4 py-2 bg-mist-50 border-b border-mist-200 text-xs text-mist-500 font-mono">
                        {step.fileName}
                      </div>
                    )}
                    <div className="bg-mist-50 p-5 overflow-x-auto">
                      <pre className="text-sm text-mist-800 font-mono whitespace-pre">
                        {step.code}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CodeTab {
  label: string;
  code: string;
  fileName?: string;
}

export function TabbedCode({
  title,
  description,
  tabs,
}: {
  title: string;
  description: string;
  tabs: CodeTab[];
}) {
  const [active, setActive] = useState(0);
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-2xl font-medium tracking-tight text-mist-950 sm:text-3xl mb-4">
          {title}
        </h2>
        <p className="text-mist-600 mb-6">{description}</p>
        <div className="rounded-xl overflow-hidden border border-mist-200">
          <div className="flex bg-mist-50 border-b border-mist-200">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActive(i)}
                className={`px-4 py-2.5 text-xs font-mono transition-colors ${
                  i === active
                    ? "text-mist-950 border-b-2 border-mist-950 -mb-px"
                    : "text-mist-500 hover:text-mist-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {tabs[active].fileName && (
            <div className="px-4 py-1.5 bg-mist-50 border-b border-mist-200 text-xs text-mist-500 font-mono">
              {tabs[active].fileName}
            </div>
          )}
          <div className="bg-mist-950 p-5 overflow-x-auto">
            <pre className="text-sm text-mist-100 font-mono whitespace-pre">
              {tabs[active].code}
            </pre>
          </div>
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
  { name: "Vite", slug: "vite" },
  { name: "Remix & Hydrogen", slug: "remix-hydrogen" },
  { name: "Expo", slug: "expo" },
  { name: "iOS", slug: "ios" },
  { name: "Flutter", slug: "flutter" },
  { name: "TanStack Start", slug: "tanstack-start" },
  { name: "Server / Hono", slug: "server" },
];

export function OtherFrameworks({
  title,
  currentFramework,
  locale,
}: OtherFrameworksProps) {
  const others = allFrameworks.filter((f) => f.slug !== currentFramework);

  return (
    <section className="py-12 border-t border-mist-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-lg font-medium text-mist-950 mb-6">{title}</h2>
        <div className="flex flex-wrap gap-3">
          {others.map((framework) => (
            <Link
              key={framework.slug}
              to={
                `/$locale/i18n/${framework.slug}` as
                  | "/$locale/i18n/react"
                  | "/$locale/i18n/nextjs"
                  | "/$locale/i18n/vue"
                  | "/$locale/i18n/nuxt"
                  | "/$locale/i18n/angular"
                  | "/$locale/i18n/svelte"
                  | "/$locale/i18n/vite"
                  | "/$locale/i18n/remix-hydrogen"
                  | "/$locale/i18n/expo"
                  | "/$locale/i18n/ios"
                  | "/$locale/i18n/flutter"
                  | "/$locale/i18n/tanstack-start"
                  | "/$locale/i18n/server"
              }
              params={{ locale }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mist-200 bg-white text-sm text-mist-700 hover:border-mist-400 hover:text-mist-950 transition-colors"
            >
              {framework.name} i18n
              <SpriteIcon name="arrow-right" className="w-3 h-3" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

interface FrameworkFAQProps {
  title?: string;
  items: FAQItemProps[];
}

export function FrameworkFAQ({
  title = "Frequently Asked Questions",
  items,
}: FrameworkFAQProps) {
  return (
    <section className="py-16 border-t border-mist-200">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-10">
          {title}
        </h2>
        <div className="space-y-8">
          {items.map((item, i) => (
            <div key={i} className="border-b border-mist-100 pb-8 last:border-0 last:pb-0">
              <h3 className="text-base font-medium text-mist-950 mb-3">{item.question}</h3>
              <p className="text-sm/6 text-mist-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
