import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";
import { CodeBlock, CodeBlockCode } from "@better-i18n/ui";

interface BlogContentProps {
  html: string;
  className?: string;
}

/**
 * Parses Ghost CMS HTML and replaces code blocks with styled CodeBlock components
 *
 * Ghost outputs <pre><code class="language-xxx"> for code blocks.
 * We intercept these and render them using our CodeBlock component with syntax highlighting.
 */
export default function BlogContent({ html, className }: BlogContentProps) {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      // Only process element nodes
      if (!(domNode instanceof Element)) {
        return;
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
