import type { ReactNode } from "react";
import { StepNumber } from "@/components/ui/step-number";
import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { LibraryIntegration, OtherFrameworks } from "@/components/FrameworkComparison";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { PillarBlogPosts } from "@/components/PillarBlogPosts";
import {
  ClosingCta,
  Divider,
  FeatureGrid,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui/page";
import { SpriteIcon } from "@/components/SpriteIcon";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { loadPillarBlogPosts } from "@/lib/pillar-blog-loader";
import { useT } from "@/lib/i18n";
import { HighlightedCode } from "@/components/CodeBlock";

/**
 * Next.js i18n — the site's highest-traffic SEO page, rebuilt on the pillar page
 * shape (rule/pillar-page-shape): PageHero + bespoke visual → Divider → six
 * Sections that each open with a SectionHeader → ClosingCta.
 *
 * What changed and why:
 *   - It was 15 consecutive <CodeExample> sections, every one of them opening
 *     with the eyebrow "Example". A reader scrolling had no way to tell the
 *     middleware block from the server-action block, and the page read as a
 *     dumped snippet archive rather than a guide.
 *   - The 18 code blocks are now GROUPED into five topics (setup, routing/edge,
 *     rendering/ISR, advanced + troubleshooting, capabilities). Not one code
 *     block, title, description or translation key was dropped —
 *     rule/seo-content-is-load-bearing: merging sections is a container change,
 *     never a content cut.
 *   - Two bespoke DOM+SVG visuals replace the wall of text at the two points
 *     where the mental model matters: how a request flows through middleware →
 *     Server Component → Client Component, and how a published string reaches an
 *     ISR-cached page.
 *
 * i18n: no `defaultValue` anywhere — the CDN source_text is the only source of
 * truth. The section eyebrows and the publish-timeline labels used to live in
 * local `SECTION_EYEBROWS` / `PUBLISH_TIMELINE` constants, which meant they
 * rendered in English in all 22 locales; they are now `i18n.nextjs.eyebrow.*`
 * and `i18n.nextjs.visual.timeline.*`. `PUBLISH_TIMELINE` still exists, but it
 * holds key SUFFIXES rather than copy.
 */

const PILLAR_KEYWORDS = ["next.js", "nextjs", "i18n"] as const;

const baseLoader = createPageLoader();

export const Route = createFileRoute("/$locale/i18n/nextjs")({
  loader: async (args: Parameters<typeof baseLoader>[0]) => {
    const [base, pillarPosts] = await Promise.all([
      baseLoader(args),
      loadPillarBlogPosts({
        data: { locale: args.context.locale, keywords: PILLAR_KEYWORDS },
      }),
    ]);
    return { ...base, pillarPosts };
  },
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nNextjs",
      pathname: "/i18n/nextjs",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Next.js",
        frameworkDescription: "Next.js internationalization with App Router, Server Components, ISR, and edge CDN delivery.",
        dependencies: ["next", "next-intl", "react", "@better-i18n/next"],
        proficiencyLevel: "Expert",
      },
    });
  },
  component: NextjsI18nPage,
});

/* ═══ Bespoke visual 1 — the request path ══════════════════════════════════
   Answers "which file runs when", with the real file names, because that is the
   single thing a developer evaluating a Next.js i18n setup needs to hold in their
   head. DOM cells for the text (selectable, fixed size) + one SVG layer for the
   CDN feed line. `vector-effect="non-scaling-stroke"` keeps the hairline exactly
   1px while `preserveAspectRatio="none"` lets the curve span any width. */

const REQUEST_STAGES: {
  file: string;
  label: string;
  icon: Parameters<typeof SpriteIcon>[0]["name"];
}[] = [
  { file: "middleware.ts", label: "middleware", icon: "globe" },
  { file: "i18n/request.ts", label: "getRequestConfig", icon: "settings-gear" },
  { file: "app/[locale]/page.tsx", label: "getMessages()", icon: "script" },
  { file: "components/Hero.tsx", label: "useTranslations()", icon: "code-brackets" },
];

function RequestFlowVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      {/* Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {REQUEST_STAGES.map((stage, index) => (
          <div
            key={stage.file}
            className="flex flex-col gap-2 border-black/[0.05] p-4 max-lg:border-b lg:border-r lg:last:border-r-0"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tabular-nums text-mist-400">
                {index + 1}
              </span>
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                <SpriteIcon name={stage.icon} className="size-3.5" aria-hidden="true" />
              </span>
              <code className="min-w-0 truncate font-mono text-[12px] font-medium text-mist-900">
                {stage.label}
              </code>
            </div>
            <code className="truncate rounded-sm bg-black/[0.03] px-1.5 py-0.5 font-mono text-[11px] text-mist-600">
              {stage.file}
            </code>
          </div>
        ))}
      </div>

      {/* CDN feed — the curve lands under the Server Component column */}
      <div className="border-t border-black/[0.05] bg-mist-50 px-4 py-3">
        <svg
          viewBox="0 0 1000 40"
          preserveAspectRatio="none"
          className="h-8 w-full text-black/15"
          aria-hidden="true"
        >
          <path
            d="M20 34 H520 C560 34 560 8 600 8 H980"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-mono text-[11px] text-mist-500">
            cdn.better-i18n.com/your-org/your-project/&#123;locale&#125;/translations.json
          </span>
          <span className="ml-auto font-mono text-[10px] text-mist-400">max-age=60</span>
        </div>
      </div>
    </div>
  );
}

/* ═══ Bespoke visual 2 — publish to an ISR-cached page ══════════════════════
   The question this answers: "if my page is statically generated, when does a
   published string actually appear?" Three revalidation strategies, on one
   timeline, with the real numbers from the code samples below. */

const REVALIDATION_MODES = [
  { mode: "revalidate = 3600", file: "app/[locale]/layout.tsx", worst: "~60 min" },
  { mode: "revalidate = 1800", file: "app/[locale]/[slug]/page.tsx", worst: "~30 min" },
  { mode: "revalidatePath()", file: "app/api/revalidate/route.ts", worst: "< 1 min" },
];

/* Key suffixes, not copy: the labels are resolved inside the component with
   t() so the timeline translates with the rest of the page. */
const PUBLISH_TIMELINE = ["publish", "r2Write", "cdnPurge", "revalidate", "served"];

function IsrFlowVisual() {
  const t = useT("marketing");

  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      {/* Timeline */}
      <div className="px-4 pt-4">
        <svg
          viewBox="0 0 1000 24"
          preserveAspectRatio="none"
          className="h-6 w-full text-black/15"
          aria-hidden="true"
        >
          <path
            d="M8 12 H992"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {[8, 254, 500, 746, 992].map((x) => (
            <circle key={x} cx={x} cy="12" r="3" fill="#fff" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        <div className="mb-4 grid grid-cols-5">
          {PUBLISH_TIMELINE.map((step, index) => (
            <span
              key={step}
              className={`text-[10px] font-medium text-mist-500 ${ index === 0 ? "text-left" : index === PUBLISH_TIMELINE.length - 1 ? "text-right" : "text-center" }`}
            >
              {t(`i18n.nextjs.visual.timeline.${step}`)}
            </span>
          ))}
        </div>
      </div>

      {/* Strategies */}
      <div className="overflow-hidden border-t border-black/[0.05]">
        <FeatureGrid cols="sm:grid-cols-3" inset={16} padY={12}>
          {REVALIDATION_MODES.map((row) => (
            <div
              key={row.mode}
              className="feat-cell flex flex-col gap-1.5"
            >
              <code className="w-fit rounded-sm bg-black/[0.03] px-1.5 py-0.5 font-mono text-[11px] text-mist-700">
                {row.mode}
              </code>
              <code className="truncate font-mono text-[11px] text-mist-600">{row.file}</code>
              <span className="mt-auto font-mono text-[10px] text-mist-400">{row.worst}</span>
            </div>
          ))}
        </FeatureGrid>
      </div>
    </div>
  );
}

/* ═══ Shared pieces ════════════════════════════════════════════════════════ */

/**
 * A code block inside a section: hairline shell, file name bar, light body.
 * One treatment for all 18 blocks on this page.
 */
function CodeCard({
  label,
  description,
  code,
  fileName,
}: {
  /** Omitted when the section header already names this block. */
  label?: string;
  description?: string;
  code: string;
  fileName?: string;
}) {
  return (
    <div>
      {label && (
        <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">{label}</h3>
      )}
      {description && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">{description}</p>
      )}
      <div className={`overflow-hidden rounded-xl border border-black/[0.07] ${label || description ? "mt-3" : ""}`}>
        {fileName && (
          <div className="border-b border-black/[0.05] bg-white px-4 py-2 font-mono text-[11px] text-mist-500">
            {fileName}
          </div>
        )}
        <div className="overflow-x-auto bg-mist-50 p-4">
          <HighlightedCode
            code={code}
            lang="tsx"
            className="font-mono text-[12px] leading-[1.7] whitespace-pre text-mist-800"
          />
        </div>
      </div>
    </div>
  );
}

/** Numbered step: mono index, hairline separated. Used by the setup section. */
function Step({
  index,
  title,
  description,
  children,
}: {
  index: number;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`flex gap-4 py-6 ${index === 1 ? "pt-0" : "border-t border-black/[0.05]"}`}
    >
      <StepNumber n={index} />
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">{title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">{description}</p>
        {children}
      </div>
    </div>
  );
}

/** Bare code body, for use inside a <Step>. */
function StepCode({ code, fileName }: { code: string; fileName: string }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-black/[0.07]">
      <div className="border-b border-black/[0.05] bg-white px-4 py-2 font-mono text-[11px] text-mist-500">
        {fileName}
      </div>
      <div className="overflow-x-auto bg-mist-50 p-4">
        <HighlightedCode
            code={code}
            lang="tsx"
            className="font-mono text-[12px] leading-[1.7] whitespace-pre text-mist-800"
          />
      </div>
    </div>
  );
}

/* ═══ Code samples — unchanged from the previous revision ═══════════════════
   Every string below is existing indexed page content. Kept verbatim. */

const INSTALL_CODE = "npm install @better-i18n/next next-intl";

const MIDDLEWARE_STEP_CODE = `import { createBetterI18nMiddleware } from '@better-i18n/next';

export default createBetterI18nMiddleware({
  project: 'your-org/your-project',
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const config = { matcher: ['/((?!api|_next).*)'] };`;

const LAYOUT_STEP_CODE = `// app/[locale]/layout.tsx
import { BetterI18nProvider } from '@better-i18n/next/client';
import { getMessages } from '@better-i18n/next/server';

const config = { project: 'your-org/your-project', defaultLocale: 'en' };

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages(config, locale);

  return (
    <html lang={locale}>
      <body>
        <BetterI18nProvider locale={locale} messages={messages} config={config}>
          {children}
        </BetterI18nProvider>
      </body>
    </html>
  );
}`;

const CLIENT_STEP_CODE = `'use client';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('home');
  return <h1>{t('title')}</h1>;
}`;

const MIDDLEWARE_CODE = `// middleware.ts — locale detection
import { createBetterI18nMiddleware } from '@better-i18n/next'

export default createBetterI18nMiddleware({
  project: 'your-org/your-project',
  defaultLocale: 'en',
  localePrefix: 'always',
})

export const config = { matcher: ['/((?!api|_next).*)'] }`;

const PAGE_CODE = `// app/[locale]/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </main>
  );
}`;

const ISR_LAYOUT_CODE = `// app/[locale]/layout.tsx — ISR with i18n
import { getMessages } from '@better-i18n/next/server';
import { BetterI18nProvider } from '@better-i18n/next/client';

export const revalidate = 3600; // Revalidate every hour

const config = { project: 'your-org/your-project', defaultLocale: 'en' };

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(config, locale);

  return (
    <BetterI18nProvider locale={locale} messages={messages} config={config}>
      {children}
    </BetterI18nProvider>
  );
}`;

const ISR_STATIC_PARAMS_CODE = `// app/[locale]/[slug]/page.tsx — Generate static pages per locale
import { getMessages } from '@better-i18n/next/server';

const config = { project: 'your-org/your-project', defaultLocale: 'en' };

export async function generateStaticParams() {
  const locales = ['en', 'de', 'fr', 'ja'];
  const slugs = await fetchAllSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export const revalidate = 1800; // ISR: refresh every 30 min

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const messages = await getMessages(config, locale, { namespaces: ['blog'] });
  return <article><h1>{messages.blog[slug + '.title']}</h1></article>;
}`;

const ISR_ON_DEMAND_CODE = `// app/api/i18n/revalidate/route.ts — On-demand ISR for translation updates
import { createRevalidateHandler } from '@better-i18n/next/revalidate';

// Called by the Better i18n publish webhook — verifies the HMAC signature,
// then revalidates the paths/tags below.
export const POST = createRevalidateHandler({
  secret: process.env.BETTER_I18N_WEBHOOK_SECRET!,
  revalidatePaths: ['/'],
  revalidateTags: ['i18n-messages'],
});`;

const EDGE_MIDDLEWARE_CODE = `// middleware.ts — Edge-based locale detection
import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'de', 'fr', 'ja', 'es'] as const;
const DEFAULT_LOCALE = 'en';

function getPreferredLocale(request: NextRequest): string {
  // 1. Check URL prefix
  const pathname = request.nextUrl.pathname;
  const urlLocale = SUPPORTED_LOCALES.find(
    (l) => pathname.startsWith(\`/\${l}/\`) || pathname === \`/\${l}\`
  );
  if (urlLocale) return urlLocale;

  // 2. Check cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // 3. Parse Accept-Language header
  const acceptLang = request.headers.get('accept-language') ?? '';
  const preferred = acceptLang
    .split(',')
    .map((part) => part.split(';')[0].trim().substring(0, 2))
    .find((code) => SUPPORTED_LOCALES.includes(code as any));

  return preferred ?? DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const locale = getPreferredLocale(request);
  const { pathname } = request.nextUrl;

  const hasLocale = SUPPORTED_LOCALES.some(
    (l) => pathname.startsWith(\`/\${l}/\`) || pathname === \`/\${l}\`
  );

  if (!hasLocale) {
    return NextResponse.redirect(
      new URL(\`/\${locale}\${pathname}\`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};`;

const EDGE_MESSAGE_LOADING_CODE = `// lib/edge-messages.ts — Edge-compatible message loading
const messageCache = new Map<string, { data: Record<string, string>; ts: number }>();
const TTL = 60_000; // 1 minute cache at edge

export async function getEdgeMessages(
  locale: string,
  namespace: string
): Promise<Record<string, string>> {
  const cacheKey = \`\${locale}:\${namespace}\`;
  const cached = messageCache.get(cacheKey);

  if (cached && Date.now() - cached.ts < TTL) {
    return cached.data;
  }

  const response = await fetch(
    \`https://cdn.better-i18n.com/your-org/your-project/\${locale}/\${namespace}.json\`,
    { next: { revalidate: 60 } }
  );

  const data = await response.json();
  messageCache.set(cacheKey, { data, ts: Date.now() });
  return data;
}`;

const EDGE_ROUTE_HANDLER_CODE = `// app/api/translate/route.ts — Edge API route with i18n
import { getEdgeMessages } from '@/lib/edge-messages';

export const runtime = 'edge';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') ?? 'en';
  const key = url.searchParams.get('key') ?? '';

  const messages = await getEdgeMessages(locale, 'api-responses');
  const translated = messages[key] ?? key;

  return Response.json({ text: translated, locale });
}`;

const HYDRATION_FIX_CODE = `// Fix: Hydration mismatch with date/number formatting
// Problem: Server renders "1,000" but client renders "1.000"
// Solution: BetterI18nProvider already passes an explicit timeZone down to
// NextIntlClientProvider, so server and client share the same formatting locale.

// app/[locale]/layout.tsx
import { getFormatter } from 'next-intl/server';

export default async function Layout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Pre-format on server with the explicit locale
  const format = await getFormatter({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

// components/Price.tsx — Client component
'use client';
import { useFormatter } from 'next-intl';

export function Price({ amount }: { amount: number }) {
  const format = useFormatter();
  // useFormatter automatically uses the locale/timeZone from BetterI18nProvider
  // ensuring server and client render the same output
  return <span>{format.number(amount, { style: 'currency', currency: 'USD' })}</span>;
}`;

const FALLBACK_CODE = `// lib/i18n-config.ts — Locale fallback chain
const FALLBACK_CHAIN: Record<string, string[]> = {
  'pt-BR': ['pt', 'en'],
  'zh-TW': ['zh-CN', 'en'],
  'en-GB': ['en'],
  'de-AT': ['de', 'en'],
};

export function resolveMessages(
  locale: string,
  allMessages: Record<string, Record<string, string>>
): Record<string, string> {
  const chain = FALLBACK_CHAIN[locale] ?? ['en'];
  const primary = allMessages[locale] ?? {};

  // Merge fallback messages (primary overrides fallbacks)
  return chain.reduceRight(
    (merged, fallbackLocale) => ({
      ...merged,
      ...(allMessages[fallbackLocale] ?? {}),
    }),
    primary
  );
}`;

const DATE_FORMAT_CODE = `// components/LocalizedDate.tsx — Consistent date formatting
'use client';
import { useFormatter, useLocale } from 'next-intl';

export function LocalizedDate({ date }: { date: Date | string }) {
  const format = useFormatter();
  const locale = useLocale();
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return (
    <time dateTime={dateObj.toISOString()}>
      {format.dateTime(dateObj, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        // Explicitly set timeZone to avoid server/client mismatch
        timeZone: 'UTC',
      })}
    </time>
  );
}`;

const NESTED_LAYOUT_CODE = `// app/[locale]/dashboard/layout.tsx — Nested layout with namespace
import { getMessages } from '@better-i18n/next/server';
import { BetterI18nProvider } from '@better-i18n/next/client';
import { DashboardNav } from '@/components/DashboardNav';

const config = { project: 'your-org/your-project', defaultLocale: 'en' };

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Load the dashboard-specific namespace alongside common messages
  const messages = await getMessages(config, locale, {
    namespaces: ['common', 'dashboard'],
  });

  return (
    <BetterI18nProvider locale={locale} messages={messages} config={config}>
      <DashboardNav />
      <main>{children}</main>
    </BetterI18nProvider>
  );
}`;

const PARALLEL_ROUTES_CODE = `// app/[locale]/@analytics/page.tsx — Parallel route with i18n
import { getTranslations } from 'next-intl/server';

export default async function AnalyticsSlot({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'analytics' });

  return (
    <section aria-label={t('title')}>
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
    </section>
  );
}

// app/[locale]/layout.tsx — Consuming parallel routes
export default function Layout({
  children,
  analytics,
  notifications,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  notifications: React.ReactNode;
}) {
  return (
    <div>
      <main>{children}</main>
      <aside>{analytics}</aside>
      <aside>{notifications}</aside>
    </div>
  );
}`;

const SERVER_ACTIONS_CODE = `// app/[locale]/contact/actions.ts — Server action with i18n
'use server';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';

export async function submitContactForm(formData: FormData) {
  const headersList = await headers();
  // Set by createBetterI18nMiddleware — see the routing section above
  const locale = headersList.get('x-locale') ?? 'en';
  const t = await getTranslations({ locale, namespace: 'contact' });

  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!email || !message) {
    return { error: t('validation.required') };
  }

  try {
    await sendEmail({ email, message, locale });
    return { success: t('form.success') };
  } catch {
    return { error: t('form.error') };
  }
}

// app/[locale]/contact/page.tsx — Using the server action
'use client';
import { useTranslations } from 'next-intl';
import { submitContactForm } from './actions';

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <form action={submitContactForm}>
      <label>{t('form.email')}</label>
      <input name="email" type="email" required />
      <label>{t('form.message')}</label>
      <textarea name="message" required />
      <button type="submit">{t('form.submit')}</button>
    </form>
  );
}`;

function NextjsI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();
  const { pillarPosts } = Route.useLoaderData();

  const features = [
    t("i18n.nextjs.features.appRouter"),
    t("i18n.nextjs.features.middleware"),
    t("i18n.nextjs.features.serverComponents"),
    t("i18n.nextjs.features.staticGeneration"),
    t("i18n.nextjs.features.isr"),
    t("i18n.nextjs.features.typesafe"),
    t("i18n.nextjs.features.cdn"),
    t("i18n.nextjs.features.seo"),
    t("i18n.nextjs.features.routing"),
  ];

  const libraries = [
    {
      name: "next-intl",
      description: t("i18n.nextjs.libraries.nextIntl.description"),
      integrationText: t("i18n.nextjs.libraries.nextIntl.integration"),
    },
    {
      name: "next-i18next",
      description: t("i18n.nextjs.libraries.nextI18next.description"),
      integrationText: t("i18n.nextjs.libraries.nextI18next.integration"),
    },
    {
      name: "Lingui",
      description: t("i18n.nextjs.libraries.lingui.description"),
      integrationText: t("i18n.nextjs.libraries.lingui.integration"),
    },
  ];

  const relatedLinks = [
    { title: "React i18n", to: "/$locale/i18n/react", description: t("i18n.nextjs.related.react") },
    { title: "For Developers", to: "/$locale/for-developers", description: t("i18n.nextjs.related.forDevelopers") },
    { title: "next-intl Alternative", to: "/$locale/compare", description: t("i18n.nextjs.related.nextIntl") },
    { title: t("i18n.nextjs.related.docs"), to: "https://docs.better-i18n.com/frameworks/nextjs", description: t("i18n.nextjs.related.docsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />

      <PageHero
        pillar="mcp"
        pillarLabel="Next.js i18n"
        title={t("i18n.nextjs.hero.title")}
        subtitle={t("i18n.nextjs.hero.subtitle")}
        primary={{
          label: t("i18n.nextjs.cta.primary"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("i18n.nextjs.cta.secondary"),
          href: "https://docs.better-i18n.com/frameworks/nextjs",
        }}
        visual={<RequestFlowVisual />}
      />

      {/* ── 1. Setup ─────────────────────────────────────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("i18n.nextjs.eyebrow.setup")}
          title="Set up in 4 steps"
        />
        <div className="mt-8">
          <Step
            index={1}
            title="Install"
            description="Add @better-i18n/next and next-intl to your project."
          >
            <StepCode code={INSTALL_CODE} fileName="terminal" />
          </Step>
          <Step
            index={2}
            title="Add middleware for locale detection"
            description="The middleware reads the Accept-Language header and URL prefix to detect the user's locale and redirect accordingly."
          >
            <StepCode code={MIDDLEWARE_STEP_CODE} fileName="middleware.ts" />
          </Step>
          <Step
            index={3}
            title="Load messages in a Server Component"
            description="Use getMessages() in your root layout to fetch translations server-side and pass them to BetterI18nProvider."
          >
            <StepCode code={LAYOUT_STEP_CODE} fileName="app/[locale]/layout.tsx" />
          </Step>
          <Step
            index={4}
            title="Use translations in Client Components"
            description="Call useTranslations() in any Client Component. Messages are already hydrated from the server — no extra fetch."
          >
            <StepCode code={CLIENT_STEP_CODE} fileName="components/HeroSection.tsx" />
          </Step>
        </div>
      </Section>

      {/* ── 2. Routing and the edge ───────────────────────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("i18n.nextjs.eyebrow.routing")}
          title={t("i18n.nextjs.edge.title")}
          subtitle={t("i18n.nextjs.edge.description")}
        />
        <div className="mt-8 flex flex-col gap-10">
          <CodeCard
            label="Middleware Setup"
            description="Add locale detection and routing to your Next.js app with a single middleware file."
            code={MIDDLEWARE_CODE}
            fileName="middleware.ts"
          />
          {/* Titled by this section's header (i18n.nextjs.edge.*) — a second
              heading here would just repeat it. */}
          <CodeCard
            code={EDGE_MIDDLEWARE_CODE}
            fileName="middleware.ts"
          />
          <CodeCard
            label="Edge-Compatible Message Loading"
            description="Cache translations at the edge with a lightweight in-memory TTL cache for instant responses."
            code={EDGE_MESSAGE_LOADING_CODE}
            fileName="lib/edge-messages.ts"
          />
          <CodeCard
            label="Edge API Route with i18n"
            description="Return translated API responses from edge functions with minimal cold start."
            code={EDGE_ROUTE_HANDLER_CODE}
            fileName="app/api/translate/route.ts"
          />
        </div>
      </Section>

      {/* ── 3. Rendering: Server Components and ISR ───────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("i18n.nextjs.eyebrow.rendering")}
          title={t("i18n.nextjs.isr.title")}
          subtitle={t("i18n.nextjs.isr.description")}
        />
        <div className="mt-8">
          <IsrFlowVisual />
        </div>
        <div className="mt-10 flex flex-col gap-10">
          <CodeCard
            label={t("i18n.nextjs.codeExample.title")}
            description={t("i18n.nextjs.codeExample.description")}
            code={PAGE_CODE}
            fileName="app/[locale]/page.tsx"
          />
          {/* Titled by this section's header (i18n.nextjs.isr.*). */}
          <CodeCard
            code={ISR_LAYOUT_CODE}
            fileName="app/[locale]/layout.tsx"
          />
          <CodeCard
            label="ISR with generateStaticParams"
            description="Pre-render pages for every locale at build time, then refresh with ISR on a schedule."
            code={ISR_STATIC_PARAMS_CODE}
            fileName="app/[locale]/[slug]/page.tsx"
          />
          <CodeCard
            label="On-Demand Revalidation"
            description="Trigger ISR revalidation when translations are updated — hook into the Better I18N publish webhook."
            code={ISR_ON_DEMAND_CODE}
            fileName="app/api/revalidate/route.ts"
          />
        </div>
      </Section>

      {/* ── 4. Advanced patterns and troubleshooting ──────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("i18n.nextjs.eyebrow.advanced")}
          title={t("i18n.nextjs.advanced.title")}
          subtitle={t("i18n.nextjs.advanced.description")}
        />
        <div className="mt-8 flex flex-col gap-10">
          {/* Titled by this section's header (i18n.nextjs.advanced.*). */}
          <CodeCard
            code={NESTED_LAYOUT_CODE}
            fileName="app/[locale]/dashboard/layout.tsx"
          />
          <CodeCard
            label="Parallel Routes with i18n"
            description="Load translations independently in parallel route slots for modular, locale-aware layouts."
            code={PARALLEL_ROUTES_CODE}
            fileName="app/[locale]/@analytics/page.tsx"
          />
          <CodeCard
            label="Server Actions with Translation"
            description="Return translated validation errors and success messages from server actions."
            code={SERVER_ACTIONS_CODE}
            fileName="app/[locale]/contact/actions.ts"
          />
        </div>

        {/* Troubleshooting keeps its own opening inside this section: it is the
            same topic (getting rendering right) seen from the failure side. */}
        <div className="mt-14 border-t border-black/[0.05] pt-10">
          <h3 className="text-[19px] font-medium tracking-[-0.02em] text-mist-900">
            {t("i18n.nextjs.troubleshooting.title")}
          </h3>
          <p className="section-p mt-2">{t("i18n.nextjs.troubleshooting.description")}</p>
          <div className="mt-8 flex flex-col gap-10">
            {/* Titled by the troubleshooting heading above (i18n.nextjs.troubleshooting.*). */}
            <CodeCard code={HYDRATION_FIX_CODE} />
            <CodeCard
              label="Locale Fallback Chain"
              description="Define fallback chains so regional variants like pt-BR fall back to pt, then en."
              code={FALLBACK_CODE}
              fileName="lib/i18n-config.ts"
            />
            <CodeCard
              label="Consistent Date Formatting"
              description="Avoid server/client date mismatches by explicitly setting timeZone to UTC."
              code={DATE_FORMAT_CODE}
              fileName="components/LocalizedDate.tsx"
            />
          </div>
        </div>
      </Section>

      {/* ── 5. Capabilities ──────────────────────────────────────────── */}
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("i18n.nextjs.eyebrow.capabilities")}
          title={t("i18n.nextjs.featuresTitle")}
        />
        <div className="mt-8">
          <FeatureGrid cols="sm:grid-cols-2 lg:grid-cols-3" inset={16} padY={12}>
            {features.map((feature) => (
              <div
                key={feature}
                className="feat-cell flex items-start gap-2.5"
              >
                <SpriteIcon
                  name="checkmark"
                  className="mt-0.5 size-3.5 shrink-0 text-mist-900"
                  aria-hidden="true"
                />
                <span className="text-[13px] leading-relaxed text-mist-700">{feature}</span>
              </div>
            ))}
          </FeatureGrid>
        </div>
      </Section>

      {/* ── 6. Library integrations (own section + divider) ───────────── */}
      <LibraryIntegration
        title={t("i18n.nextjs.librariesTitle")}
        subtitle={t("i18n.nextjs.librariesSubtitle")}
        libraries={libraries}
      />

      <Divider />
      <PillarBlogPosts posts={pillarPosts} locale={locale} />

      <Divider />
      <ComparisonRelatedTopics
        heading={t("i18n.nextjs.relatedTitle")}
        links={relatedLinks}
        locale={locale}
      />

      <OtherFrameworks
        title={t("i18n.nextjs.otherFrameworks")}
        currentFramework="nextjs"
        locale={locale}
      />

      <Divider />
      <ClosingCta
        title={t("i18n.nextjs.cta.title")}
        subtitle={t("i18n.nextjs.cta.subtitle")}
        primary={{
          label: t("i18n.nextjs.cta.primary"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("i18n.nextjs.cta.secondary"),
          href: "https://docs.better-i18n.com/frameworks/nextjs",
        }}
      />
    </MarketingLayout>
  );
}
