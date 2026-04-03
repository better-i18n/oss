import * as React from "react";
import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  domToReact,
} from "html-react-parser";

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

// ─── Blog Code Block ────────────────────────────────────────────────

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md text-mist-400 hover:text-mist-600 dark:hover:text-mist-200 hover:bg-mist-200 dark:hover:bg-mist-800 transition-colors"
      title="Copy code"
      aria-label="Copy code"
    >
      {copied ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

const LANG_LABELS: Record<string, { label: string; icon: string }> = {
  typescript: { label: "TypeScript", icon: "TS" },
  ts: { label: "TypeScript", icon: "TS" },
  tsx: { label: "React TSX", icon: "⚛" },
  javascript: { label: "JavaScript", icon: "JS" },
  js: { label: "JavaScript", icon: "JS" },
  jsx: { label: "React JSX", icon: "⚛" },
  bash: { label: "Terminal", icon: "▶" },
  sh: { label: "Terminal", icon: "▶" },
  shell: { label: "Terminal", icon: "▶" },
  terminal: { label: "Terminal", icon: "▶" },
  json: { label: "JSON", icon: "{}" },
  css: { label: "CSS", icon: "#" },
  html: { label: "HTML", icon: "<>" },
  swift: { label: "Swift", icon: "🐦" },
  dart: { label: "Dart", icon: "🎯" },
  python: { label: "Python", icon: "🐍" },
  go: { label: "Go", icon: "Go" },
};

function BlogCodeBlock({ language, code }: { language: string; code: string }) {
  const langInfo = LANG_LABELS[language];

  return (
    <div className="not-prose my-6 rounded-xl overflow-hidden border border-mist-200 dark:border-mist-800 shadow-sm bg-mist-50 dark:bg-mist-950">
      <div className="flex items-center justify-between px-4 py-2 border-b border-mist-200 dark:border-mist-800">
        {langInfo ? (
          <span className="flex items-center gap-1.5 text-xs text-mist-400 dark:text-mist-500 font-mono">
            <span className="text-[10px]">{langInfo.icon}</span>
            {langInfo.label}
          </span>
        ) : (
          <span />
        )}
        <CopyButton code={code} />
      </div>
      <div className="p-5 overflow-x-auto">
        <pre className="text-[13px] leading-relaxed text-mist-800 dark:text-mist-200 font-mono whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────

interface BlogContentProps {
  readonly html: string;
  readonly className?: string;
  readonly locale?: string;
}

/**
 * Parses HTML content and replaces code blocks with dark-themed code blocks.
 *
 * Intercepts <pre><code class="language-xxx"> and renders them
 * using the same dark code block style as the landing page.
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

      // Downlevel h1 → h2 to prevent multiple H1 tags on the page
      // (the page template already renders the post title as H1)
      if (domNode.name === "h1") {
        const text = getTextContent(domNode);
        const id = slugify(text);
        return (
          <h2 {...domNode.attribs} id={id}>
            {domToReact(domNode.children as DOMNode[], parserOptions)}
          </h2>
        );
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
          const language = languageMatch?.[1] || "";

          // Extract code content
          const codeContent = getTextContent(codeNode);

          return <BlogCodeBlock language={language} code={codeContent} />;
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
