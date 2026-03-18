import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Card, Cards } from './components/icon-card';
import { LocaleDropdownDemo } from './components/locale-dropdown-demo';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Card,
    Cards,
    LocaleDropdownDemo,
    ...components,
  };
}
