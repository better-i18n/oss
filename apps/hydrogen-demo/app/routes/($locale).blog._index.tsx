import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "~/components/LocaleLink";
import { contentClient } from "~/lib/content.server";
import type { ContentEntryListItem } from "@better-i18n/sdk";

export const meta: MetaFunction = () => [{ title: "Blog" }];

type BlogPost = ContentEntryListItem<{
  excerpt?: string | null;
  category?: string | null;
  read_time?: string | null;
}>;

export async function loader({ context }: LoaderFunctionArgs) {
  const { locale } = context;

  const { data: posts, error } = await contentClient
    .from("blog-posts")
    .eq("status", "published")
    .order("publishedAt", { ascending: false })
    .language(locale)
    .limit(20);

  if (error) {
    console.error("Blog posts fetch error:", error);
  }

  return {
    posts: (posts ?? []) as unknown as BlogPost[],
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

export default function BlogIndexPage() {
  const { posts, locale } = useLoaderData<typeof loader>();
  const { t: tb } = useTranslation("blog");

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white">
        <div className="page-frame flex items-center gap-2 py-3 text-[12px] text-stone-400">
          <LocaleLink to="/" locale={locale} className="hover:text-stone-700">
            Home
          </LocaleLink>
          <span>/</span>
          <span className="text-stone-700">{tb("title")}</span>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-stone-200 bg-white">
        <div className="page-frame grid grid-cols-1 divide-y divide-stone-200 py-0 lg:grid-cols-[1fr_auto] lg:divide-x lg:divide-y-0">
          <div className="py-10 lg:pr-12">
            <div className="flex items-center gap-2">
              <span className="source-pill border-blue-100 bg-blue-50 text-blue-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Better i18n CMS
              </span>
            </div>
            <h1 className="mt-4 text-[2.5rem] font-semibold leading-tight tracking-tight text-stone-900 sm:text-[3.5rem]">
              {tb("title")}
            </h1>
            <p className="mt-3 max-w-xl text-[14px] leading-6 text-stone-500">
              {tb("description")}
            </p>
          </div>

          <div className="flex flex-col justify-center gap-1 py-10 lg:pl-12">
            <p className="label">{tb("articles_label")}</p>
            <p className="text-[2rem] font-semibold tracking-tight text-stone-900">
              {posts.length}
            </p>
            <p className="text-[12px] text-stone-400">{tb("powered_by_cms")}</p>
          </div>
        </div>
      </div>

      {/* Posts grid */}
      {posts.length > 0 ? (
        <div className="page-frame">
          <div className="grid grid-cols-1 divide-y divide-stone-200 border-x border-b border-stone-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {posts.map((post) => {
              const categoryStyle =
                CATEGORY_STYLES[post.category ?? ""] ??
                "border-stone-200 bg-stone-50 text-stone-500";

              return (
                <LocaleLink
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  locale={locale}
                  className="group flex flex-col bg-white p-6 transition-colors hover:bg-stone-50 lg:p-8"
                >
                  <div className="flex items-start justify-between gap-3">
                    {post.category ? (
                      <span
                        className={`source-pill ${categoryStyle} capitalize`}
                      >
                        {post.category.replace("-", " ")}
                      </span>
                    ) : null}
                    {post.read_time ? (
                      <span className="shrink-0 text-[11px] text-stone-400">
                        {post.read_time} {tb("min_read")}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-4 text-[15px] font-semibold leading-snug text-stone-900 group-hover:underline group-hover:underline-offset-2">
                    {post.title}
                  </h2>

                  {post.excerpt ? (
                    <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-stone-500">
                      {post.excerpt}
                    </p>
                  ) : null}

                  <div className="mt-auto pt-6 flex items-center gap-1.5 text-[12px] font-medium text-stone-400 transition-colors group-hover:text-stone-700">
                    {tb("read_more")}
                    <svg
                      className="h-3.5 w-3.5"
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
                  </div>
                </LocaleLink>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="page-frame py-20 text-center">
          <p className="text-[15px] font-medium text-stone-900">
            {tb("no_posts_title")}
          </p>
          <p className="mt-2 text-[13px] text-stone-400">
            {tb("no_posts_desc")}
          </p>
        </div>
      )}

      {/* CMS attribution */}
      <div className="page-frame py-8">
        <div className="border border-stone-200 bg-stone-50 p-6">
          <p className="text-[12px] font-medium text-stone-600">
            {tb("cms_note_title")}
          </p>
          <p className="mt-1 text-[12px] text-stone-400">
            {tb("cms_note_desc")}
          </p>
        </div>
      </div>
    </div>
  );
}
