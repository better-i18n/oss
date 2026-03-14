/** Source and target format dropdowns for the File Converter tool. */

import { FORMATS } from "@/lib/tools/formats";
import type { FormatDefinition } from "@/lib/tools/types";

interface FormatPairSelectorProps {
  readonly sourceId: string;
  readonly targetId: string;
  readonly onSourceChange: (id: string) => void;
  readonly onTargetChange: (id: string) => void;
  readonly sourceLabel?: string;
  readonly targetLabel?: string;
  readonly disabledSourceIds?: readonly string[];
  readonly disabledTargetIds?: readonly string[];
}

function FormatSelect({
  id,
  label,
  value,
  onChange,
  disabledIds = [],
}: {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly disabledIds?: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-mist-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-mist-200 bg-white px-4 py-2.5 pr-10 text-sm text-mist-950 focus:border-mist-400 focus:outline-none focus:ring-2 focus:ring-mist-200"
        >
          {FORMATS.map((format: FormatDefinition) => (
            <option
              key={format.id}
              value={format.id}
              disabled={disabledIds.includes(format.id)}
            >
              {format.name} ({format.extension})
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {FORMATS.find((f) => f.id === value) && (
        <p className="text-xs text-mist-500">
          {FORMATS.find((f) => f.id === value)?.description}
        </p>
      )}
    </div>
  );
}

export function FormatPairSelector({
  sourceId,
  targetId,
  onSourceChange,
  onTargetChange,
  sourceLabel = "Source format",
  targetLabel = "Target format",
  disabledSourceIds = [],
  disabledTargetIds = [],
}: FormatPairSelectorProps) {
  const handleSwap = () => {
    onSourceChange(targetId);
    onTargetChange(sourceId);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr]">
      <FormatSelect
        id="source-format"
        label={sourceLabel}
        value={sourceId}
        onChange={onSourceChange}
        disabledIds={disabledSourceIds}
      />

      <div className="flex items-end pb-[1.75rem] justify-center">
        <button
          type="button"
          onClick={handleSwap}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-mist-200 bg-white text-mist-600 transition-colors hover:border-mist-300 hover:bg-mist-50 hover:text-mist-950"
          aria-label="Swap source and target formats"
          title="Swap formats"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M13.2 2.24a.75.75 0 00.04 1.06l2.1 1.95H6.75a.75.75 0 000 1.5h8.59l-2.1 1.95a.75.75 0 101.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 00-1.06.04zm-6.4 8a.75.75 0 00-1.06-.04l-3.5 3.25a.75.75 0 000 1.1l3.5 3.25a.75.75 0 101.02-1.1l-2.1-1.95h8.59a.75.75 0 000-1.5H4.66l2.1-1.95a.75.75 0 00.04-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <FormatSelect
        id="target-format"
        label={targetLabel}
        value={targetId}
        onChange={onTargetChange}
        disabledIds={disabledTargetIds}
      />
    </div>
  );
}
