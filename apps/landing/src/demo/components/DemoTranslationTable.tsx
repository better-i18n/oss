import { useState } from "react";
import { ChevronDown, ChevronRight, Copy } from "lucide-react";
import { MOCK_NAMESPACES, SOURCE_LANGUAGE, TARGET_LANGUAGES } from "../mock-data";
import type { MockTranslation, TranslationStatus } from "../mock-data";

// Status icon component (simplified from apps/app)
function TranslationStatusIcon({ status, size = 16, className = "" }: { status: TranslationStatus; size?: number; className?: string }) {
  const getStatusColor = () => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "draft":
        return "bg-blue-500";
      case "untranslated":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div
      className={`rounded-full ${getStatusColor()} ${className}`}
      style={{ width: size, height: size }}
      title={status}
    />
  );
}

// Progress bar component (simplified from apps/app)
function NamespaceProgress({
  percentage,
  keyCount,
  missingCount,
}: {
  percentage: number;
  keyCount: number;
  missingCount: number;
}) {
  const isCompleted = missingCount === 0;

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isCompleted ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-[11px] text-muted-foreground">
        {keyCount} {keyCount === 1 ? "key" : "keys"}
      </span>
    </div>
  );
}

// Flag emoji display (simplified from apps/app)
function FlagEmoji({ countryCode }: { countryCode?: string | null }) {
  if (!countryCode) return null;

  const getFlagEmoji = (code: string) => {
    const codePoints = code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return <span className="text-base">{getFlagEmoji(countryCode)}</span>;
}

interface DemoTranslationTableProps {
  onCellClick?: (keyId: string, languageCode: string) => void;
}

export function DemoTranslationTable({ onCellClick }: DemoTranslationTableProps) {
  const [expandedNamespaces, setExpandedNamespaces] = useState<Set<string>>(
    new Set(["ns-auth"]) // First namespace expanded by default
  );

  const toggleNamespace = (nsId: string) => {
    setExpandedNamespaces((prev) => {
      const next = new Set(prev);
      if (next.has(nsId)) {
        next.delete(nsId);
      } else {
        next.add(nsId);
      }
      return next;
    });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // In real app, this would show a toast
  };

  return (
    <div className="w-full h-full border border-border rounded-xl bg-card overflow-auto">
      <table className="w-full border-collapse" style={{ minWidth: "max-content" }}>
        {/* Header */}
        <thead className="sticky top-0 z-20 bg-card">
          <tr className="border-b bg-card">
            {/* Expander column */}
            <th
              className="h-10 px-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider bg-card border-b"
              style={{ width: 36, minWidth: 36 }}
            />
            {/* Key column */}
            <th
              className="h-10 px-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider bg-card border-b"
              style={{ width: 320, minWidth: 280 }}
            >
              Key
            </th>
            {/* Source language column */}
            <th
              className="h-10 px-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider bg-card border-b"
              style={{ width: 380, minWidth: 250 }}
            >
              <div className="flex items-center gap-2">
                <FlagEmoji countryCode={SOURCE_LANGUAGE.countryCode} />
                <span className="text-muted-foreground">{SOURCE_LANGUAGE.name}</span>
              </div>
            </th>
            {/* Target language columns */}
            {TARGET_LANGUAGES.map((lang) => (
              <th
                key={lang.code}
                className="h-10 px-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider bg-card border-b"
                style={{ width: 380, minWidth: 250 }}
              >
                <div className="flex items-center gap-2">
                  <FlagEmoji countryCode={lang.countryCode} />
                  <span className="text-muted-foreground">{lang.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {MOCK_NAMESPACES.map((namespace) => {
            const isExpanded = expandedNamespaces.has(namespace.id);

            return (
              <>
                {/* Namespace row */}
                <tr
                  key={namespace.id}
                  className="group/row border-b bg-muted/10 hover:bg-muted/30 font-medium cursor-pointer"
                  onClick={() => toggleNamespace(namespace.id)}
                >
                  {/* Expander */}
                  <td className="py-2.5 px-3 align-middle bg-card">
                    <button
                      className="h-5 w-5 hover:bg-muted/60 rounded flex items-center justify-center cursor-pointer transition-colors"
                      aria-label={isExpanded ? `Collapse ${namespace.name}` : `Expand ${namespace.name}`}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
                      )}
                    </button>
                  </td>
                  {/* Namespace name */}
                  <td className="py-2.5 px-3 align-middle bg-card">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-medium text-foreground">
                        {namespace.name}
                      </span>
                      <NamespaceProgress
                        percentage={namespace.progress}
                        keyCount={namespace.keys.length}
                        missingCount={namespace.missingCount}
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-3 align-middle" colSpan={2} />
                </tr>

                {/* Key rows (if expanded) */}
                {isExpanded &&
                  namespace.keys.map((key: MockTranslation) => (
                    <tr
                      key={key.id}
                      className="group/row border-b last:border-0 hover:bg-muted/40"
                    >
                      {/* Empty expander cell */}
                      <td className="py-2.5 px-3 align-middle bg-card">
                        <div className="w-5 h-5" />
                      </td>

                      {/* Key name */}
                      <td className="py-2.5 px-3 align-middle bg-card">
                        <div className="flex items-center gap-1.5 group/key max-w-[500px]">
                          <span className="font-mono text-[13px] text-foreground/80 truncate">
                            {key.key}
                          </span>
                          <button
                            className="h-4 w-4 p-0 opacity-0 group-hover/key:opacity-100 group-hover/row:opacity-100 hover:bg-muted rounded shrink-0 flex items-center justify-center"
                            aria-label={`Copy key "${key.key}" to clipboard`}
                            onClick={(e) => {
                              e.stopPropagation();
                              copyKey(key.key);
                            }}
                          >
                            <Copy className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                          </button>
                        </div>
                      </td>

                      {/* Source text */}
                      <td className="py-2.5 px-3 align-middle">
                        <div className="w-full max-w-[380px] min-h-[32px] p-1.5 bg-muted/20 rounded flex items-start gap-2">
                          <TranslationStatusIcon status={key.sourceStatus} size={12} className="shrink-0 mt-0.5" />
                          <span className="line-clamp-2 text-sm text-foreground/80">
                            {key.sourceText}
                          </span>
                        </div>
                      </td>

                      {/* Translation cells */}
                      {TARGET_LANGUAGES.map((lang) => {
                        const translation = key.translations[lang.code];
                        const isEmpty = !translation?.text?.trim();

                        return (
                          <td key={lang.code} className="py-2.5 px-3 align-middle">
                            <div
                              className="w-full max-w-[380px] min-h-[32px] p-1.5 cursor-pointer bg-muted/20 hover:bg-muted/40 rounded transition-all flex items-start gap-2"
                              onClick={() => onCellClick?.(key.id, lang.code)}
                              title={isEmpty ? undefined : translation.text}
                            >
                              <TranslationStatusIcon status={translation.status} size={12} className="shrink-0 mt-0.5" />
                              <span
                                className={`line-clamp-2 text-sm ${
                                  isEmpty ? "text-muted-foreground/40" : "text-foreground/80"
                                }`}
                              >
                                {isEmpty ? "—" : translation.text}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
