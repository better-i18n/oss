import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import {
  FrameworkHero,
  FeatureList,
  CodeExample,
  SetupGuide,
  FrameworkCTA,
  LibraryIntegration,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { getPageHead } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/i18n/nextjs")({
  loader: ({ context }) => ({ messages: context.messages, locale: context.locale, locales: context.locales }),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
      pageKey: "i18nNextjs",
      pathname: "/i18n/nextjs",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Next.js",
        frameworkDescription: "Next.js internationalization with App Router, Server Components, ISR, and edge CDN delivery.",
        dependencies: ["next", "react", "@better-i18n/use-intl"],
        proficiencyLevel: "Expert",
      },
    });
  },
  component: NextjsI18nPage,
});

function NextjsI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

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

  const nextjsSetupSteps = [
    {
      step: 1,
      title: "Install",
      description:
        "Add @better-i18n/use-intl, use-intl, and the Next.js adapter to your project.",
      code: "npm install @better-i18n/use-intl use-intl",
      fileName: "terminal",
    },
    {
      step: 2,
      title: "Add middleware for locale detection",
      description:
        "The middleware reads the Accept-Language header and URL prefix to detect the user's locale and redirect accordingly.",
      code: `import { betterI18nMiddleware } from '@better-i18n/next';
export const middleware = betterI18nMiddleware;
export const config = { matcher: ['/((?!api|_next).*)'] };`,
      fileName: "middleware.ts",
    },
    {
      step: 3,
      title: "Load messages in a Server Component",
      description:
        "Use getMessages() in your root layout to fetch translations server-side and pass them to BetterI18nProvider.",
      code: `// app/[locale]/layout.tsx
import { BetterI18nProvider } from '@better-i18n/use-intl';
import { getMessages } from '@better-i18n/use-intl/server';

export default async function RootLayout({ children, params }) {
  const messages = await getMessages({
    project: 'your-org/your-project',
    locale: params.locale,
  });
  return (
    <html lang={params.locale}>
      <body>
        <BetterI18nProvider messages={messages} locale={params.locale} project="your-org/your-project">
          {children}
        </BetterI18nProvider>
      </body>
    </html>
  );
}`,
      fileName: "app/[locale]/layout.tsx",
    },
    {
      step: 4,
      title: "Use translations in Client Components",
      description:
        "Call useTranslations() in any Client Component. Messages are already hydrated from the server — no extra fetch.",
      code: `'use client';
import { useTranslations } from '@better-i18n/use-intl';

export function HeroSection() {
  const t = useTranslations('home');
  return <h1>{t('title')}</h1>;
}`,
      fileName: "components/HeroSection.tsx",
    },
  ];

  const middlewareCode = `// middleware.ts — locale detection
import { betterI18nMiddleware } from '@better-i18n/next'
export const middleware = betterI18nMiddleware
export const config = { matcher: ['/((?!api|_next).*)'] }`;

  const codeExample = `// app/[locale]/page.tsx
import { getTranslations } from '@better-i18n/next';

export default async function Page({ params }: { params: { locale: string } }) {
  const t = await getTranslations(params.locale, 'home');

  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </main>
  );
}`;

  const isrLayoutCode = `// app/[locale]/layout.tsx — ISR with i18n
import { getMessages } from '@better-i18n/use-intl/server';
import { BetterI18nProvider } from '@better-i18n/use-intl';

export const revalidate = 3600; // Revalidate every hour

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({
    project: 'your-org/your-project',
    locale: params.locale,
  });

  return (
    <BetterI18nProvider messages={messages} locale={params.locale}>
      {children}
    </BetterI18nProvider>
  );
}`;

  const isrStaticParamsCode = `// app/[locale]/[slug]/page.tsx — Generate static pages per locale
import { getMessages } from '@better-i18n/use-intl/server';

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
  params: { locale: string; slug: string };
}) {
  const t = await getMessages({
    project: 'your-org/your-project',
    locale: params.locale,
    namespace: 'blog',
  });
  return <article><h1>{t[params.slug + '.title']}</h1></article>;
}`;

  const isrOnDemandCode = `// app/api/revalidate/route.ts — On-demand ISR for translation updates
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { locale, path, secret } = await request.json();

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  // Revalidate the specific locale path
  revalidatePath(\`/\${locale}\${path}\`);
  return NextResponse.json({ revalidated: true, locale, path });
}`;

  const edgeMiddlewareCode = `// middleware.ts — Edge-based locale detection
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

  const edgeMessageLoadingCode = `// lib/edge-messages.ts — Edge-compatible message loading
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

  const edgeRouteHandlerCode = `// app/api/translate/route.ts — Edge API route with i18n
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

  const hydrationFixCode = `// Fix: Hydration mismatch with date/number formatting
// Problem: Server renders "1,000" but client renders "1.000"
// Solution: Ensure the same locale is used on both server and client

// app/[locale]/layout.tsx
import { getFormatter } from '@better-i18n/use-intl/server';

export default async function Layout({ children, params }: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Pre-format on server with the explicit locale
  const formatter = await getFormatter(params.locale);

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

// components/Price.tsx — Client component
'use client';
import { useFormatter } from '@better-i18n/use-intl';

export function Price({ amount }: { amount: number }) {
  const format = useFormatter();
  // useFormatter automatically uses the locale from the provider
  // ensuring server and client render the same output
  return <span>{format.number(amount, { style: 'currency', currency: 'USD' })}</span>;
}`;

  const fallbackCode = `// lib/i18n-config.ts — Locale fallback chain
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

  const dateFormatCode = `// components/LocalizedDate.tsx — Consistent date formatting
'use client';
import { useFormatter, useLocale } from '@better-i18n/use-intl';

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

  const nestedLayoutCode = `// app/[locale]/dashboard/layout.tsx — Nested layout with namespace
import { getMessages } from '@better-i18n/use-intl/server';
import { BetterI18nProvider } from '@better-i18n/use-intl';
import { DashboardNav } from '@/components/DashboardNav';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Load dashboard-specific namespace alongside common messages
  const [commonMessages, dashMessages] = await Promise.all([
    getMessages({ project: 'your-org/your-project', locale: params.locale, namespace: 'common' }),
    getMessages({ project: 'your-org/your-project', locale: params.locale, namespace: 'dashboard' }),
  ]);

  const messages = { ...commonMessages, ...dashMessages };

  return (
    <BetterI18nProvider messages={messages} locale={params.locale}>
      <DashboardNav />
      <main>{children}</main>
    </BetterI18nProvider>
  );
}`;

  const parallelRoutesCode = `// app/[locale]/@analytics/page.tsx — Parallel route with i18n
import { getTranslations } from '@better-i18n/next';

export default async function AnalyticsSlot({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations(params.locale, 'analytics');

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

  const serverActionsCode = `// app/[locale]/contact/actions.ts — Server action with i18n
'use server';
import { getTranslations } from '@better-i18n/next';
import { headers } from 'next/headers';

export async function submitContactForm(formData: FormData) {
  const headersList = headers();
  const locale = headersList.get('x-locale') ?? 'en';
  const t = await getTranslations(locale, 'contact');

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
import { useTranslations } from '@better-i18n/use-intl';
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
      <FrameworkHero
        title={t("i18n.nextjs.hero.title")}
        subtitle={t("i18n.nextjs.hero.subtitle")}
        badgeText="Next.js i18n"
      />

      <SetupGuide title="Set up in 4 steps" steps={nextjsSetupSteps} />

      <FeatureList title={t("i18n.nextjs.featuresTitle")} features={features} />

      <CodeExample
        title="Middleware Setup"
        description="Add locale detection and routing to your Next.js app with a single middleware file."
        code={middlewareCode}
      />

      <CodeExample
        title={t("i18n.nextjs.codeExample.title")}
        description={t("i18n.nextjs.codeExample.description")}
        code={codeExample}
      />

      <CodeExample
        title={t("i18n.nextjs.isr.title")}
        description={t("i18n.nextjs.isr.description")}
        code={isrLayoutCode}
      />

      <CodeExample
        title="ISR with generateStaticParams"
        description="Pre-render pages for every locale at build time, then refresh with ISR on a schedule."
        code={isrStaticParamsCode}
      />

      <CodeExample
        title="On-Demand Revalidation"
        description="Trigger ISR revalidation when translations are updated — hook into the Better i18n publish webhook."
        code={isrOnDemandCode}
      />

      <CodeExample
        title={t("i18n.nextjs.edge.title")}
        description={t("i18n.nextjs.edge.description")}
        code={edgeMiddlewareCode}
      />

      <CodeExample
        title="Edge-Compatible Message Loading"
        description="Cache translations at the edge with a lightweight in-memory TTL cache for instant responses."
        code={edgeMessageLoadingCode}
      />

      <CodeExample
        title="Edge API Route with i18n"
        description="Return translated API responses from edge functions with minimal cold start."
        code={edgeRouteHandlerCode}
      />

      <CodeExample
        title={t("i18n.nextjs.troubleshooting.title")}
        description={t("i18n.nextjs.troubleshooting.description")}
        code={hydrationFixCode}
      />

      <CodeExample
        title="Locale Fallback Chain"
        description="Define fallback chains so regional variants like pt-BR fall back to pt, then en."
        code={fallbackCode}
      />

      <CodeExample
        title="Consistent Date Formatting"
        description="Avoid server/client date mismatches by explicitly setting timeZone to UTC."
        code={dateFormatCode}
      />

      <CodeExample
        title={t("i18n.nextjs.advanced.title")}
        description={t("i18n.nextjs.advanced.description")}
        code={nestedLayoutCode}
      />

      <CodeExample
        title="Parallel Routes with i18n"
        description="Load translations independently in parallel route slots for modular, locale-aware layouts."
        code={parallelRoutesCode}
      />

      <CodeExample
        title="Server Actions with Translation"
        description="Return translated validation errors and success messages from server actions."
        code={serverActionsCode}
      />

      <LibraryIntegration
        title={t("i18n.nextjs.librariesTitle")}
        subtitle={t("i18n.nextjs.librariesSubtitle")}
        libraries={libraries}
      />

      <ComparisonRelatedTopics heading={t("i18n.nextjs.relatedTitle")} links={relatedLinks} locale={locale} />

      <OtherFrameworks
        title={t("i18n.nextjs.otherFrameworks")}
        currentFramework="nextjs"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.nextjs.cta.title")}
        subtitle={t("i18n.nextjs.cta.subtitle")}
        primaryCTA={t("i18n.nextjs.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.nextjs.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com/frameworks/nextjs"
      />
    </MarketingLayout>
  );
}
