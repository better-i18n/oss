import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { FileText } from 'lucide-react';
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <img src="https://better-i18n.com/cdn-cgi/image/width=40,height=40,fit=contain/brand/logo.svg" alt="Better I18N" className="size-5 dark:invert" width={20} height={20} />
          <span>Better I18N</span>
        </>
      ),
      url: '/',
    },
    githubUrl: 'https://github.com/aliosmandev/better-i18n',
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
