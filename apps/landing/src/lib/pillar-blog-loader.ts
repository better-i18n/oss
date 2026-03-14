/**
 * Shared server function for loading keyword-matched blog posts on pillar pages.
 */

import { createServerFn } from "@tanstack/react-start";
import { getPostsByKeywords, type BlogPostListItem } from "@/lib/content";

export const loadPillarBlogPosts = createServerFn({ method: "GET" })
  .inputValidator(
    (data: { locale: string; keywords: readonly string[] }) => data,
  )
  .handler(async ({ data }): Promise<BlogPostListItem[]> => {
    return getPostsByKeywords(data.locale, data.keywords, 3);
  });
