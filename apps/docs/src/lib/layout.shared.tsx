import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Bot, FileText, Sparkles } from 'lucide-react';
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
        text: 'MCP Server',
        url: '/mcp/getting-started',
        icon: <Bot className="size-4" />,
      },
      {
        text: 'Agent Skill',
        url: '/mcp/agent-skill',
        icon: <Sparkles className="size-4" />,
      },
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
