'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * ThemeSync component that sets a data attribute on the document
 * based on the current documentation section (Frameworks, MCP, CLI).
 * This enables CSS to apply section-specific theme colors.
 */
export function ThemeSync() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    // Determine the active section from the URL path
    let section = 'default';
    if (pathname.startsWith('/docs/frameworks')) {
      section = 'frameworks';
    } else if (pathname.startsWith('/docs/mcp')) {
      section = 'mcp';
    } else if (pathname.startsWith('/docs/cli')) {
      section = 'cli';
    }

    // Set the data attribute for CSS targeting
    root.setAttribute('data-docs-section', section);

    return () => {
      root.removeAttribute('data-docs-section');
    };
  }, [pathname]);

  return null;
}
