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

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: {
    template: '%s - Better I18N',
    default: 'Documentation - Better I18N',
  },
  description: 'Better I18N documentation - CLI, MCP Server, and Next.js SDK for translation management',
};

// Tab icon colors (CSS variable names)
const tabColors: Record<string, string> = {
  'root:frameworks': 'var(--color-frameworks)',
  'root:sdk': 'var(--color-sdk)',
  'root:mcp': 'var(--color-mcp)',
  'root:cli': 'var(--color-cli)',
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
              tabs: {
                transform: (option, node) => {
                  const color = tabColors[node.$id || ''];
                  if (!color || !option.icon) return option;

                  return {
                    ...option,
                    icon: React.isValidElement(option.icon)
                      ? React.cloneElement(option.icon, {
                          style: { color, width: 20, height: 20 },
                        } as React.HTMLAttributes<HTMLElement>)
                      : option.icon,
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
