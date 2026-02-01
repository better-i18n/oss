import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import type { MockTranslation } from "../mock-data";
import { MOCK_NAMESPACES, SOURCE_LANGUAGE, TARGET_LANGUAGES } from "../mock-data";

interface DemoEditPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  keyId: string;
  languageCode: string;
  onAskAI?: () => void;
}

export function DemoEditPopover({
  isOpen,
  onClose,
  keyId,
  languageCode,
  onAskAI,
}: DemoEditPopoverProps) {
  const [value, setValue] = useState("");

  // Find the translation key and current value
  const findTranslation = (): MockTranslation | null => {
    for (const ns of MOCK_NAMESPACES) {
      const key = ns.keys.find((k) => k.id === keyId);
      if (key) return key;
    }
    return null;
  };

  const translation = findTranslation();
  const targetLang = TARGET_LANGUAGES.find((l) => l.code === languageCode);

  useEffect(() => {
    if (isOpen && translation) {
      const currentTranslation = translation.translations[languageCode];
      setValue(currentTranslation?.text || "");
    }
  }, [isOpen, keyId, languageCode, translation]);

  if (!isOpen || !translation || !targetLang) return null;

  const displayKey = translation.namespace
    ? `${translation.namespace} / ${translation.key}`
    : translation.key;

  // Get flag emoji
  const getFlagEmoji = (code?: string | null) => {
    if (!code) return null;
    const codePoints = code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/20"
        onClick={onClose}
      />

      {/* Popover */}
      <div
        className="fixed z-50 w-96 bg-white rounded-xl border border-border shadow-xl"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-border">
          <div className="flex-1">
            <div className="font-mono text-[13px] text-foreground/80 mb-1">
              {displayKey}
            </div>
            <div className="text-xs text-muted-foreground">
              Translating to {getFlagEmoji(targetLang.countryCode)} {targetLang.name}
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-6 w-6 rounded hover:bg-muted flex items-center justify-center"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Source text */}
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            {getFlagEmoji(SOURCE_LANGUAGE.countryCode)} {SOURCE_LANGUAGE.name}
          </div>
          <div className="text-sm text-foreground/80">
            {translation.sourceText}
          </div>
        </div>

        {/* Editor */}
        <div className="p-4">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-24 px-3 py-2 text-sm bg-muted/20 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter translation..."
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <button
            onClick={() => {
              onAskAI?.();
              onClose();
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Ask AI
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // In real app, this would save the translation
                onClose();
              }}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="px-4 pb-3 text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">⌘</kbd>
          {" + "}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd>
          {" to save"}
        </div>
      </div>
    </>
  );
}
