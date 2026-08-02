import { useState } from "react";
import { Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useT } from "@/lib/i18n";
import { trackBlogShare } from "@/lib/analytics-events";

interface ShareButtonsProps {
  url: string;
  title: string;
  slug?: string;
}

export default function ShareButtons({ url, title, slug }: ShareButtonsProps) {
  const t = useT("blog");
  const [copied, setCopied] = useState(false);

  function shareOnTwitter() {
    if (slug) trackBlogShare({ slug, method: "twitter" });
    const text = encodeURIComponent(title);
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function shareOnLinkedIn() {
    if (slug) trackBlogShare({ slug, method: "linkedin" });
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function copyLink() {
    if (slug) trackBlogShare({ slug, method: "clipboard" });
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Hairline tiles, not filled circles: these sit in the rail next to the TOC,
  // where three grey discs would out-weigh the navigation they sit beside. The
  // "Share" label is supplied by the caller's eyebrow, so it is not repeated here.
  const buttonClass =
    "inline-flex size-8 items-center justify-center rounded-md border border-black/[0.07] text-mist-500 transition-colors hover:bg-black/[0.02] hover:text-mist-900";

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={shareOnTwitter}
        className={buttonClass}
        aria-label="Share on X (Twitter)"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={shareOnLinkedIn}
        className={buttonClass}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={copyLink}
        className={buttonClass}
        aria-label={copied ? t("linkCopied") : "Copy link"}
      >
        {copied ? (
          <Check className="size-4 text-mist-900" />
        ) : (
          <Link2 className="size-4" />
        )}
      </button>
    </div>
  );
}
