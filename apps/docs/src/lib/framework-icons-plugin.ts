import React, { createElement } from 'react';
import {
  ExpoIcon,
  FlutterIcon,
  NextjsIcon,
  ReactIcon,
  RemixIcon,
  SvelteIcon,
  TanStackIcon,
  ViteIcon,
  VueIcon,
} from '@/components/icons/framework-icons';

const BRAND_ICONS: Record<string, React.FC> = {
  NextjsIcon,
  TanStackIcon,
  ViteIcon,
  RemixIcon,
  ExpoIcon,
  FlutterIcon,
  ReactIcon,
  SvelteIcon,
  VueIcon,
};

function resolveIcon<T extends { icon?: unknown }>(node: T): T {
  if (node.icon === undefined || typeof node.icon === 'string') {
    const Icon = node.icon ? BRAND_ICONS[node.icon] : undefined;
    if (Icon) node.icon = createElement(Icon);
  }
  return node;
}

export function frameworkIconsPlugin() {
  return {
    name: 'framework-icons',
    transformPageTree: {
      file: resolveIcon,
      folder: resolveIcon,
      separator: resolveIcon,
    },
  };
}
