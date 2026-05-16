'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const SECTIONS = ['core', 'frameworks', 'sdk', 'mcp', 'cli', 'admin', 'oauth', 'api'] as const;

export function ThemeSync() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const segments = pathname.split('/').filter(Boolean);
    const section = SECTIONS.find(s => segments.includes(s)) ?? 'default';
    root.setAttribute('data-docs-section', section);

    return () => {
      root.removeAttribute('data-docs-section');
    };
  }, [pathname]);

  return null;
}
