import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { FileText } from 'lucide-react';
import Image from 'next/image';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image src="/logo.png" alt="Better I18N" className="size-5" width={20} height={20} />
          <span>Better I18N</span>
        </>
      ),
      url: '/',
    },
    githubUrl: 'https://github.com/aliosmandev/better-i18n',
    links: [
      {
        text: 'LLM Docs',
        url: '/llms-full.txt',
        external: true,
        icon: <FileText className="size-4" />,
      },
    ],
  };
}
