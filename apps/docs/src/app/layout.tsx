import { BetterSupportWidget } from '@/components/better-support-widget';
import SearchDialog from '@/components/search';
import { ThemeSync } from '@/components/theme-provider';
import { baseOptions } from '@/lib/layout.shared';
import { cn } from '@/lib/cn';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import React, { type CSSProperties } from 'react';
import './global.css';

function SidebarFooter() {
  return (
    <div className="border-t border-fd-border pt-3 mt-2">
      <a
        href="https://help.better-i18n.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent transition-colors"
      >
        <svg className="size-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
        </svg>
        Help Center
      </a>
    </div>
  );
}

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.better-i18n.com'),
  title: {
    template: '%s - Better I18N',
    default: 'Documentation - Better I18N',
  },
  description: 'Better I18N documentation - CLI, MCP Server, and Next.js SDK for translation management',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-32x32-dark.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon-16x16-dark.png', sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

// Tab icon colors (CSS variable names)
const tabColors: Record<string, string> = {
  'root:core': 'var(--color-core)',
  'root:frameworks': 'var(--color-frameworks)',
  'root:sdk': 'var(--color-sdk)',
  'root:mcp': 'var(--color-mcp)',
  'root:cli': 'var(--color-cli)',
  'root:admin': 'var(--color-admin)',
  'root:oauth': 'var(--color-oauth)',
};

// Tab descriptions shown in the sidebar dropdown
const tabDescriptions: Record<string, string> = {
  'root:core': 'Platform architecture, CDN delivery, and core utilities',
  'root:frameworks': 'React SDKs for Next.js, Vite, TanStack, Remix & Expo',
  'root:sdk': 'Headless CMS client for fetching content',
  'root:mcp': 'AI-powered translation tools',
  'root:cli': 'Detect and sync translation keys',
  'root:admin': 'Server-side SDK for managing projects, keys, translations, content, and analytics',
  'root:oauth': 'Partner integrations with scoped OAuth 2.0 tokens',
};

const tabSectionAliases: Record<string, string> = {
  core: 'root:core',
  frameworks: 'root:frameworks',
  sdk: 'root:sdk',
  mcp: 'root:mcp',
  cli: 'root:cli',
  admin: 'root:admin',
  oauth: 'root:oauth',
};

type IconElementProps = {
  className?: string;
  style?: CSSProperties;
};

function renderSidebarTabIcon(icon: React.ReactNode, color: string) {
  if (!icon) return icon;

  return (
    <span
      className="docs-sidebar-tab-icon"
      style={{ '--docs-sidebar-tab-icon-color': color } as CSSProperties}
    >
      {React.isValidElement<IconElementProps>(icon)
        ? React.cloneElement(icon, {
            className: cn('docs-sidebar-tab-icon-svg', icon.props.className),
            style: {
              ...icon.props.style,
              color: 'var(--docs-sidebar-tab-icon-color)',
            },
          })
        : icon}
    </span>
  );
}

function resolveSidebarTabId(id: string | undefined, url: string | undefined) {
  if (id && tabColors[id]) return id;

  const section = url?.split('/').filter(Boolean)[0];
  if (section && tabSectionAliases[section]) {
    return tabSectionAliases[section];
  }

  return id ?? '';
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} font-sans`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeSync />
        <RootProvider search={{ SearchDialog }}>
          <DocsLayout
            tree={source.getPageTree()}
            {...baseOptions()}
            sidebar={{
              footer: <SidebarFooter />,
              tabs: {
                transform: (option, node) => {
                  const id = resolveSidebarTabId(node.$id, option.url);
                  const color = tabColors[id];
                  const description = tabDescriptions[id];

                  return {
                    ...option,
                    ...(description && { description }),
                    ...(color && option.icon && {
                      icon: renderSidebarTabIcon(option.icon, color),
                    }),
                  };
                },
              },
            }}
          >
            {children}
          </DocsLayout>
        </RootProvider>
        <BetterSupportWidget />
      </body>
    </html>
  );
}
