import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Bot, FileText, Sparkles } from 'lucide-react';

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

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
        type: 'menu',
        text: 'Agentic AI',
        icon: <Sparkles className="size-4" />,
        items: [
          {
            text: 'MCP Server',
            url: '/mcp/getting-started',
            icon: <Bot className="size-4" />,
            description: 'Translate keys, check coverage, and publish from your editor',
          },
          {
            text: 'Agent Skill',
            url: '/mcp/agent-skill',
            icon: <Sparkles className="size-4" />,
            description: 'Permanent better-i18n knowledge for Cursor, Claude Code & Windsurf',
          },
          {
            text: 'llms.txt',
            url: '/llms.txt',
            icon: <FileText className="size-4" />,
            description: 'Machine-readable documentation for AI assistants',
            external: true,
          },
          {
            text: 'llms-full.txt',
            url: '/llms-full.txt',
            icon: <FileText className="size-4" />,
            description: 'Full context version for AI assistants',
            external: true,
          },
        ],
      },
      {
        type: 'icon',
        label: 'X (Twitter)',
        text: 'X',
        url: 'https://x.com/betteri18n',
        icon: <XIcon />,
        external: true,
        secondary: true,
      },
    ],
  };
}
