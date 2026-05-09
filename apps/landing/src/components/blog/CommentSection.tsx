import { useState, useEffect, useRef } from "react";
import { useT } from "@/lib/i18n";

interface Comment {
  id: number;
  name: string;
  body: string;
  created_at: string;
  parent_id: number | null;
}

export default function CommentSection({ slug }: { slug: string }) {
  const t = useT("blog");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formOpen, setFormOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json() as Promise<{ comments: Comment[] }>)
      .then((data) => setComments(data.comments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("submitting");

    const fd = new FormData(formRef.current);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name: fd.get("name"),
          email: fd.get("email"),
          body: fd.get("body"),
          website: fd.get("website"),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      formRef.current.reset();
    } catch {
      setStatus("error");
    }
  };

  const topLevel = comments.filter((c) => !c.parent_id);
  const replies = (parentId: number) =>
    comments.filter((c) => c.parent_id === parentId);

  return (
    <section className="mt-12 border-t border-mist-100 pt-10">
      <h3 className="text-lg font-medium text-mist-950 mb-6">
        {t("comments.title", "Comments")}
        {!loading && topLevel.length > 0 && (
          <span className="ml-2 text-sm font-normal text-mist-500">
            ({topLevel.length})
          </span>
        )}
      </h3>

      {/* Comment list */}
      {loading ? (
        <div className="flex gap-2 items-center text-sm text-mist-500 mb-8">
          <span className="size-4 border-2 border-mist-200 border-t-mist-500 rounded-full animate-spin" />
          {t("comments.loading", "Loading comments...")}
        </div>
      ) : topLevel.length === 0 ? (
        <p className="text-sm text-mist-500 mb-8">
          {t("comments.empty", "No comments yet. Be the first to share your thoughts.")}
        </p>
      ) : (
        <div className="space-y-5 mb-10">
          {topLevel.map((c) => (
            <CommentBubble key={c.id} comment={c}>
              {replies(c.id).map((r) => (
                <CommentBubble key={r.id} comment={r} nested />
              ))}
            </CommentBubble>
          ))}
        </div>
      )}

      {/* Submission form */}
      {status === "success" ? (
        <p className="text-[14px] text-emerald-600">
          {t("comments.submitted", "Thanks! Your comment will appear after review.")}
        </p>
      ) : !formOpen ? (
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="text-[14px] font-medium text-mist-950 hover:text-mist-600 transition-colors"
        >
          {t("comments.addComment", "Add a comment →")}
        </button>
      ) : (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-mist-100 bg-mist-50/60 p-5 sm:p-6"
        >
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] opacity-0" aria-hidden="true" />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="comment-name" className="block text-[13px] font-medium text-mist-700 mb-1.5">
                {t("comments.nameLabel", "Name")}
                <span className="text-mist-400">*</span>
              </label>
              <input
                id="comment-name"
                type="text"
                name="name"
                required
                placeholder={t("comments.namePlaceholder", "Your name")}
                className="block w-full rounded-md border border-mist-200 bg-white px-3 py-2 text-[14px] text-mist-950 placeholder:text-mist-300 focus:border-mist-400 focus:ring-1 focus:ring-mist-200 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="comment-email" className="block text-[13px] font-medium text-mist-700 mb-1.5">
                {t("comments.emailLabel", "Email")}
                <span className="ml-1 text-[12px] font-normal text-mist-400">{t("comments.optional", "(optional)")}</span>
              </label>
              <input
                id="comment-email"
                type="email"
                name="email"
                placeholder={t("comments.emailPlaceholder", "you@example.com")}
                className="block w-full rounded-md border border-mist-200 bg-white px-3 py-2 text-[14px] text-mist-950 placeholder:text-mist-300 focus:border-mist-400 focus:ring-1 focus:ring-mist-200 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="comment-body" className="block text-[13px] font-medium text-mist-700 mb-1.5">
              {t("comments.commentLabel", "Comment")}
              <span className="text-mist-400">*</span>
            </label>
            <textarea
              id="comment-body"
              name="body"
              required
              rows={4}
              maxLength={2000}
              placeholder={t("comments.bodyPlaceholder", "Share your thoughts...")}
              className="block w-full rounded-md border border-mist-200 bg-white px-3 py-2 text-[14px] text-mist-950 placeholder:text-mist-300 focus:border-mist-400 focus:ring-1 focus:ring-mist-200 focus:outline-none transition-colors resize-none"
            />
          </div>

          {status === "error" && (
            <p className="text-[13px] text-red-600">
              {t("comments.error", "Failed to submit. Please try again.")}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-md bg-mist-950 px-4 py-2 text-[13px] font-medium text-white hover:bg-mist-800 transition-colors disabled:opacity-50"
            >
              {status === "submitting"
                ? t("comments.submitting", "Posting...")
                : t("comments.submit", "Post comment")}
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="text-[13px] text-mist-400 hover:text-mist-600 transition-colors"
            >
              {t("comments.cancel", "Cancel")}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function CommentBubble({
  comment,
  nested,
  children,
}: {
  comment: Comment;
  nested?: boolean;
  children?: React.ReactNode;
}) {
  const date = new Date(comment.created_at);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={nested ? "ml-8 mt-3" : ""}>
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium text-mist-900">
          {comment.name}
        </span>
        <time className="text-xs text-mist-400" dateTime={comment.created_at}>
          {formatted}
        </time>
      </div>
      <p className="mt-1 text-sm text-mist-700 leading-relaxed whitespace-pre-line">
        {comment.body}
      </p>
      {children}
    </div>
  );
}
