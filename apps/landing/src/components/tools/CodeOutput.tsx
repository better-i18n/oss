/** Syntax-highlighted code output block with a copy-to-clipboard button. */

import { useState } from "react";

interface CodeOutputProps {
  readonly code: string;
  readonly language?: string;
  readonly label?: string;
  readonly maxHeight?: string;
}

export function CodeOutput({
  code,
  language = "text",
  label,
  maxHeight = "400px",
}: CodeOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-mist-200 bg-mist-950">
      <div className="flex items-center justify-between border-b border-mist-800 px-4 py-2.5">
        <span className="text-xs font-medium text-mist-400">
          {label ?? language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-mist-400 transition-colors hover:bg-mist-800 hover:text-mist-200"
          aria-label={copied ? "Copied" : "Copy to clipboard"}
        >
          {copied ? (
            <>
              <svg
                className="h-3.5 w-3.5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre
        className="overflow-auto p-4 text-sm leading-6 text-mist-100"
        style={{ maxHeight }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
