import type { BlockInstance } from "./_define-block";

export function getCoverForPost(
  category: string | null,
  _slug: string,
  title?: string,
): BlockInstance {
  return {
    type: "cover-blog",
    params: {
      title: title ?? "Blog Post",
      category: category ?? "default",
    },
  };
}
