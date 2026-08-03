import * as React from "react";
// `html-react-parser` ships as CJS. Vite's client pre-bundler is told to
// EXCLUDE it (vite.config.ts) to keep its DOM-based browser build out of
// the SSR import graph. As a side-effect, the client gets the raw CJS
// module whose ESM `default` export isn't synthesized — `import parse from`
// throws "does not provide an export named 'default'".
//
// Workaround: namespace import + manual default unwrap. Works on both
// SSR (real ESM via noExternal) and client (CJS namespace).
import * as htmlReactParser from "html-react-parser";
import type { DOMNode, HTMLReactParserOptions } from "html-react-parser";
import { HighlightedCode, type CodeLang } from "@/components/CodeBlock";
type HRPElement = import("html-react-parser").Element;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parserModule = htmlReactParser as any;
const parse: (
  html: string,
  options?: HTMLReactParserOptions,
) => React.ReactNode = parserModule.default ?? parserModule;
const domToReact: typeof import("html-react-parser").domToReact =
  parserModule.domToReact ?? parserModule.default?.domToReact;
// `Element` is a runtime constructor used in instanceof checks. Renamed
// to `HRPElementCtor` to avoid colliding with lib.dom's global `Element`.
const HRPElementCtor = (parserModule.Element ??
  parserModule.default?.Element) as new (...args: unknown[]) => HRPElement;

function isHRPElement(node: unknown): node is HRPElement {
  return node instanceof HRPElementCtor;
}

/**
 * The same HTML parser this component renders with, exported so the table of
 * contents can read headings from the parsed tree instead of re-deriving them.
 *
 * It used to match `<h[123]>(.*?)</h\1>` with a regex and strip tags from the
 * capture. That yields the raw source text, entities and all: a heading written
 * as `&quot;I need this&quot;` reached the sidebar as the literal characters
 * `&quot;…&quot;`, because React escapes the ampersand on the way out. Decoding
 * those by hand would only move the guesswork — the parser already knows how,
 * and sharing it means the sidebar and the article can never disagree about
 * what a heading says.
 *
 * The CJS unwrap above is why this is re-exported rather than imported directly
 * at the call site: doing that dance twice invites the two copies to drift.
 */
export const parseHtmlToDom: typeof import("html-react-parser").htmlToDOM =
  parserModule.htmlToDOM ?? parserModule.default?.htmlToDOM;

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
      type="button"
      onClick={handleCopy}
      className="p-1.5 rounded-md text-mist-400 hover:text-mist-600 dark:hover:text-mist-200 hover:bg-black/[0.06] dark:hover:bg-mist-800 transition-colors"
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

/**
 * Maps a `language-xxx` class from the CMS to one of the four grammars the
 * highlighter knows. Anything else renders as escaped plaintext rather than
 * being guessed at — a mis-highlighted snippet is worse than a plain one.
 */
function toCodeLang(className: string | undefined): CodeLang {
  const raw = /language-([\w+-]+)/.exec(className ?? "")?.[1]?.toLowerCase();
  switch (raw) {
    case "tsx":
    case "jsx":
      return "tsx";
    case "ts":
    case "typescript":
      return "ts";
    case "js":
    case "javascript":
    case "mjs":
      return "js";
    case "json":
    case "jsonc":
      return "json";
    case "bash":
    case "sh":
    case "shell":
    case "zsh":
      return "bash";
    default:
      return "text";
  }
}

function BlogCodeBlock({ code, lang }: { code: string; lang: CodeLang }) {
  return (
    <div className="not-prose group relative my-6 overflow-hidden rounded-xl border border-black/[0.07] bg-mist-50 dark:border-mist-800 dark:bg-mist-950">
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton code={code} />
      </div>
      <div className="overflow-x-auto">
        {/* Highlighting is synchronous and dependency-free (see CodeBlock.tsx):
            these pages are SSG, so the tokens are computed at build time and the
            browser downloads no highlighter at all. */}
        <HighlightedCode
          code={code}
          lang={lang}
          className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed whitespace-pre text-mist-800"
        />
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
      if (!isHRPElement(domNode)) {
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
          (child): child is HRPElement =>
            isHRPElement(child) && child.name === "code",
        );

        if (codeNode) {
          const codeContent = getTextContent(codeNode as DOMNode);
          const lang = toCodeLang(
            codeNode.attribs?.class ?? domNode.attribs?.class,
          );

          return <BlogCodeBlock code={codeContent} lang={lang} />;
        }
      }

      return;
    },
  };

  return <div className={className}>{parse(html, parserOptions)}</div>;
}

/**
 * Recursively extract text content from a DOM node.
 *
 * Exported because the table of contents must slugify a heading the *same* way
 * this component does — the sidebar link and the `id` it jumps to are the same
 * string or the anchor is dead. Two implementations of "the text of a heading"
 * is one implementation too many.
 */
export function getTextContent(node: DOMNode): string {
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
