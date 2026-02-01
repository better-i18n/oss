import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Card, Cards } from './components/icon-card';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Card,
    Cards,
    ...components,
  };
}
