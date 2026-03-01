import { useState } from "react";
import { Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useT } from "@/lib/i18n";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const t = useT("blog");
  const [copied, setCopied] = useState(false);

  function shareOnTwitter() {
    const text = encodeURIComponent(title);
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function shareOnLinkedIn() {
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const buttonClass =
    "inline-flex items-center justify-center w-9 h-9 rounded-full bg-mist-50 text-mist-500 hover:bg-mist-100 hover:text-mist-700 transition-colors";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-mist-400 mr-1">
        {t("share", { defaultValue: "Share" })}
      </span>
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
        aria-label={copied ? t("linkCopied", { defaultValue: "Copied!" }) : "Copy link"}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Link2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
