import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "~/components/LocaleLink";
import { contentClient } from "~/lib/content.server";
import type { ContentEntryListItem } from "@better-i18n/sdk";

type BlogPost = ContentEntryListItem<{
  excerpt?: string | null;
  category?: string | null;
  read_time?: string | null;
}>;

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.post?.title ?? "Blog Post" },
];

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { locale } = context;
  const { slug } = params;

  if (!slug) throw new Response("Slug required", { status: 400 });

  const { data: post, error } = await contentClient
    .from("blog-posts")
    .language(locale)
    .single(slug);

  if (error || !post) throw new Response("Post not found", { status: 404 });

  return {
    post: post as unknown as BlogPost,
    locale,
    messages: context.messages,
  };
}

const CATEGORY_STYLES: Record<string, string> = {
  guide: "border-blue-100 bg-blue-50 text-blue-600",
  "case-study": "border-emerald-100 bg-emerald-50 text-emerald-700",
  release: "border-violet-100 bg-violet-50 text-violet-700",
  "deep-dive": "border-amber-100 bg-amber-50 text-amber-700",
};

/** Minimal Markdown renderer — handles headings, bold, code blocks, tables, paragraphs */
function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      nodes.push(
        <pre
          key={i}
          className="my-4 overflow-x-auto border border-stone-200 bg-stone-950 p-4 text-[12px] leading-relaxed text-stone-200"
        >
          {lang ? (
            <span className="mb-2 block text-[10px] uppercase tracking-widest text-stone-500">
              {lang}
            </span>
          ) : null}
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      i++;
      continue;
    }

    // Table
    if (line.includes("|") && lines[i + 1]?.includes("---")) {
      const headers = line
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      const tableRows: string[][] = [];
      i += 2; // skip separator
      while (i < lines.length && lines[i].includes("|")) {
        tableRows.push(
          lines[i]
            .split("|")
            .map((c) => c.trim())
            .filter(Boolean),
        );
        i++;
      }
      nodes.push(
        <div key={i} className="my-4 overflow-x-auto">
          <table className="w-full border border-stone-200 text-[13px]">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                {headers.map((h, hi) => (
                  <th
                    key={hi}
                    className="px-4 py-2.5 text-left font-semibold text-stone-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {tableRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-stone-600">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      nodes.push(
        <h2
          key={i}
          className="mb-3 mt-8 text-[1.25rem] font-semibold tracking-tight text-stone-900 first:mt-0"
        >
          {line.slice(3)}
        </h2>,
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      nodes.push(
        <h3
          key={i}
          className="mb-2 mt-6 text-[1rem] font-semibold text-stone-900"
        >
          {line.slice(4)}
        </h3>,
      );
      i++;
      continue;
    }

    // List item
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul
          key={i}
          className="my-3 list-disc space-y-1 pl-5 text-[14px] leading-6 text-stone-600"
        >
          {items.map((item, ii) => (
            <li key={ii}>{inlineMarkdown(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      nodes.push(
        <ol
          key={i}
          className="my-3 list-decimal space-y-1 pl-5 text-[14px] leading-6 text-stone-600"
        >
          {items.map((item, ii) => (
            <li key={ii}>{inlineMarkdown(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Empty line — skip
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    nodes.push(
      <p key={i} className="my-3 text-[14px] leading-7 text-stone-600">
        {inlineMarkdown(line)}
      </p>,
    );
    i++;
  }

  return nodes;
}

/** Handle inline code, bold, and italic */
function inlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="border border-stone-200 bg-stone-100 px-1.5 py-0.5 text-[12px] font-mono text-stone-700"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-stone-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export default function BlogPostPage() {
  const { post, locale } = useLoaderData<typeof loader>();
  const { t: tb } = useTranslation("blog");

  const categoryStyle =
    CATEGORY_STYLES[post.category ?? ""] ??
    "border-stone-200 bg-stone-50 text-stone-500";

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white">
        <div className="page-frame flex items-center gap-2 py-3 text-[12px] text-stone-400">
          <LocaleLink to="/" locale={locale} className="hover:text-stone-700">
            {tb("home", { ns: "common" })}
          </LocaleLink>
          <span>/</span>
          <LocaleLink
            to="/blog"
            locale={locale}
            className="hover:text-stone-700"
          >
            {tb("title")}
          </LocaleLink>
          <span>/</span>
          <span className="truncate max-w-[200px] text-stone-700">
            {post.title}
          </span>
        </div>
      </div>

      {/* Post header */}
      <div className="border-b border-stone-200 bg-white">
        <div className="page-frame py-10 lg:py-16">
          <div className="flex flex-wrap items-center gap-2">
            <span className="source-pill border-blue-100 bg-blue-50 text-blue-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Better i18n CMS
            </span>
            {post.category ? (
              <span className={`source-pill capitalize ${categoryStyle}`}>
                {post.category.replace("-", " ")}
              </span>
            ) : null}
            {post.read_time ? (
              <span className="text-[11px] text-stone-400">
                {post.read_time} {tb("min_read")}
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 max-w-3xl text-[2rem] font-semibold leading-tight tracking-tight text-stone-900 sm:text-[2.75rem]">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-stone-500">
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </div>

      {/* Post body */}
      <div className="page-frame">
        <div className="grid grid-cols-1 border-x border-b border-stone-200 lg:grid-cols-[1fr_280px] lg:divide-x">
          {/* Main content */}
          <article className="min-w-0 p-6 lg:p-10">
            {post.body
              ? renderMarkdown(post.body)
              : null}
          </article>

          {/* Sidebar */}
          <aside className="border-t border-stone-200 lg:border-t-0">
            <div className="sticky top-20 divide-y divide-stone-200">
              {/* Back link */}
              <div className="p-6">
                <LocaleLink
                  to="/blog"
                  locale={locale}
                  className="flex items-center gap-1.5 text-[12px] text-stone-400 transition-colors hover:text-stone-700"
                >
                  <svg
                    className="h-3.5 w-3.5 rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                  {tb("back_to_blog")}
                </LocaleLink>
              </div>

              {/* CMS source info */}
              <div className="p-6">
                <p className="label mb-3">{tb("data_source")}</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="source-pill mt-0.5 border-blue-100 bg-blue-50 text-blue-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      CMS
                    </span>
                    <p className="text-[12px] leading-5 text-stone-400">
                      {tb("source_cms_desc")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Category */}
              {post.category ? (
                <div className="p-6">
                  <p className="label mb-2">{tb("category_label")}</p>
                  <span
                    className={`source-pill capitalize ${categoryStyle}`}
                  >
                    {post.category.replace("-", " ")}
                  </span>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
