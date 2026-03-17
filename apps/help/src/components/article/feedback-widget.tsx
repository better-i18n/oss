import { useState } from "react";
import { useT } from "@/lib/i18n";
import { IconThumbsUp, IconThumbsDown } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { cn } from "@better-i18n/ui/lib/utils";

interface FeedbackWidgetProps {
  articleSlug: string;
}

/**
 * Simple thumbs up/down feedback widget for articles.
 * State is local-only for now; will connect to API in Phase 2.
 */
export function FeedbackWidget({ articleSlug: _articleSlug }: FeedbackWidgetProps) {
  const t = useT("article");
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  if (feedback) {
    return (
      <div className="rounded-xl border border-mist-200 bg-mist-50 p-4 text-center text-sm text-mist-600">
        {t("feedbackThanks")}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-mist-200 bg-[var(--color-card)] p-4 text-center">
      <p className="text-sm font-medium text-mist-700">
        {t("feedbackQuestion")}
      </p>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setFeedback("up")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors",
            "cursor-pointer border-mist-200 text-mist-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700",
          )}
        >
          <IconThumbsUp className="size-4" />
          {t("feedbackYes")}
        </button>
        <button
          type="button"
          onClick={() => setFeedback("down")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors",
            "cursor-pointer border-mist-200 text-mist-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700",
          )}
        >
          <IconThumbsDown className="size-4" />
          {t("feedbackNo")}
        </button>
      </div>
    </div>
  );
}
