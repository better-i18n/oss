import SearchDialog from '@/components/search';
import { ThemeSync } from '@/components/theme-provider';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react';
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
};

// Tab descriptions shown in the sidebar dropdown
const tabDescriptions: Record<string, string> = {
  'root:core': 'Platform architecture, CDN delivery, and core utilities',
  'root:frameworks': 'React SDKs for Next.js, Vite, TanStack, Remix & Expo',
  'root:sdk': 'Headless CMS client for fetching content',
  'root:mcp': 'AI-powered translation tools',
  'root:cli': 'Detect and sync translation keys',
};

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
                  const id = node.$id || '';
                  const color = tabColors[id];
                  const description = tabDescriptions[id];

                  return {
                    ...option,
                    ...(description && { description }),
                    ...(color && option.icon && {
                      icon: React.isValidElement(option.icon)
                        ? React.cloneElement(option.icon, {
                            style: { color, width: 20, height: 20 },
                          } as React.HTMLAttributes<HTMLElement>)
                        : option.icon,
                    }),
                  };
                },
              },
            }}
          >
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
