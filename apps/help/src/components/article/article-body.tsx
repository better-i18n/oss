import { addHeadingIds } from "@/lib/utils";

interface ArticleBodyProps {
  html: string;
}

/**
 * Renders the article body with heading IDs for TOC anchor linking.
 * Uses the help-prose class for consistent typography styling.
 *
 * Note: Content is trusted — it comes from the Better i18n Content CMS,
 * which only allows authenticated admin users to create/edit content.
 * The HTML is generated from markdown via the `marked` library on the server.
 */
export function ArticleBody({ html }: ArticleBodyProps) {
  const processedHtml = addHeadingIds(html);

  // Content is from our own CMS (trusted source), rendered from markdown
  return (
    <div
      className="help-prose"
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
