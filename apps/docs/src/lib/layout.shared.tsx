import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { FileText } from 'lucide-react';
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <img src="https://better-i18n.com/brand/logo-light.svg" alt="Better I18N" className="size-5 dark:invert" width={20} height={20} />
          <span>Better I18N</span>
        </>
      ),
      url: '/',
    },
    githubUrl: 'https://github.com/better-i18n/oss',
    links: [
      {
        text: 'llms.txt',
        url: '/llms.txt',
        external: true,
        icon: <FileText className="size-4" />,
      },
      {
        text: 'llms-full.txt',
        url: '/llms-full.txt',
        external: true,
        icon: <FileText className="size-4" />,
      },
    ],
  };
}
