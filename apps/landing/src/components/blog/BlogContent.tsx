import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  domToReact,
} from "html-react-parser";
import { CodeBlock, CodeBlockCode } from "@better-i18n/ui";

/**
 * Convert a text string into a URL-friendly slug for anchor linking.
 * Exported for reuse by TableOfContents component.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ─── Internal link rewriting helpers ─────────────────────────────────

const SITE_DOMAIN = "better-i18n.com";
const LOCALE_PREFIX_REGEX = /^\/[a-z]{2}(-[a-z]+)?\//;

function isInternalLink(href: string): boolean {
  if (href.startsWith("/")) return true;
  try {
    const url = new URL(href);
    return url.hostname === SITE_DOMAIN || url.hostname === `www.${SITE_DOMAIN}`;
  } catch {
    return false;
  }
}

function rewritePath(path: string, locale: string): string {
  // If path already has a locale prefix, replace it
  if (LOCALE_PREFIX_REGEX.test(path)) {
    return path.replace(LOCALE_PREFIX_REGEX, `/${locale}/`);
  }
  // If no locale prefix, add one
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

function rewriteInternalLink(href: string, locale: string): string {
  // Handle absolute URLs
  if (href.startsWith("http")) {
    try {
      const url = new URL(href);
      const rewritten = rewritePath(url.pathname, locale);
      return `${url.origin}${rewritten}${url.search}${url.hash}`;
    } catch {
      return href;
    }
  }
  // Handle relative paths
  return rewritePath(href, locale);
}

// ─── Component ───────────────────────────────────────────────────────

interface BlogContentProps {
  readonly html: string;
  readonly className?: string;
  readonly locale?: string;
}

/**
 * Parses HTML content and replaces code blocks with styled CodeBlock components.
 *
 * Intercepts <pre><code class="language-xxx"> and renders them
 * using our CodeBlock component with syntax highlighting.
 *
 * When `locale` is provided, rewrites internal links to include the
 * correct locale prefix so readers stay in their language context.
 */
export default function BlogContent({ html, className, locale }: BlogContentProps) {
  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      // Only process element nodes
      if (!(domNode instanceof Element)) {
        return;
      }

      // Add id attributes to h2/h3 for anchor linking
      if (domNode.name === "h2" || domNode.name === "h3") {
        const text = getTextContent(domNode);
        const id = slugify(text);
        domNode.attribs = { ...domNode.attribs, id };
        return; // Return undefined to keep the element but with the modified attribs
      }

      // Rewrite internal links to include current locale prefix
      if (domNode.name === "a" && locale) {
        const href = domNode.attribs?.href;
        if (href && isInternalLink(href)) {
          const rewrittenHref = rewriteInternalLink(href, locale);
          return (
            <a {...domNode.attribs} href={rewrittenHref}>
              {domToReact(domNode.children as DOMNode[], parserOptions)}
            </a>
          );
        }
      }

      // Add alt fallback, lazy loading, and async decoding to images
      if (domNode.name === "img") {
        const attribs = { ...domNode.attribs };

        // Add alt fallback if missing or empty
        if (!attribs.alt || attribs.alt.trim() === "") {
          attribs.alt = attribs.title || "Blog post image";
        }

        // Add loading="lazy" if not present
        if (!attribs.loading) {
          attribs.loading = "lazy";
        }

        // Add decoding="async" if not present
        if (!attribs.decoding) {
          attribs.decoding = "async";
        }

        domNode.attribs = attribs;
        return; // Return undefined to keep the element with modified attribs
      }

      // Find <pre> tags that contain <code> tags
      if (domNode.name === "pre") {
        const codeNode = domNode.children.find(
          (child): child is Element =>
            child instanceof Element && child.name === "code",
        );

        if (codeNode) {
          // Extract language from class name (e.g., "language-typescript" -> "typescript")
          const className = codeNode.attribs?.class || "";
          const languageMatch = className.match(/language-(\w+)/);
          const language = languageMatch?.[1] || "typescript";

          // Extract code content
          const codeContent = getTextContent(codeNode);

          // Replace with our CodeBlock component
          return (
            <CodeBlock className="my-6">
              <CodeBlockCode
                code={codeContent}
                language={language}
                theme="github-light"
              />
            </CodeBlock>
          );
        }
      }

      return;
    },
  };

  return <div className={className}>{parse(html, parserOptions)}</div>;
}

/**
 * Recursively extract text content from a DOM node
 */
function getTextContent(node: DOMNode): string {
  // Text nodes have a 'data' property
  if ("data" in node && typeof node.data === "string") {
    return node.data;
  }

  // Element nodes have children
  if ("children" in node && Array.isArray(node.children)) {
    return node.children
      .map((child) => getTextContent(child as DOMNode))
      .join("");
  }

  return "";
}
