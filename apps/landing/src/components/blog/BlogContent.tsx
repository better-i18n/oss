import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
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

interface BlogContentProps {
  html: string;
  className?: string;
}

/**
 * Parses HTML content and replaces code blocks with styled CodeBlock components.
 *
 * Intercepts <pre><code class="language-xxx"> and renders them
 * using our CodeBlock component with syntax highlighting.
 */
export default function BlogContent({ html, className }: BlogContentProps) {
  const options: HTMLReactParserOptions = {
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

  return <div className={className}>{parse(html, options)}</div>;
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
