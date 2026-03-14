/** Multi-select locale picker with search filtering. */

import { useState, useMemo } from "react";
import { LOCALE_DATABASE } from "@/lib/tools/locales";
import type { LocaleData } from "@/lib/tools/types";

interface LocaleSelectorProps {
  readonly selected: readonly string[];
  readonly onChange: (selected: readonly string[]) => void;
  readonly label?: string;
  readonly maxSelections?: number;
  readonly placeholder?: string;
}

export function LocaleSelector({
  selected,
  onChange,
  label = "Select locales",
  maxSelections,
  placeholder = "Search locales...",
}: LocaleSelectorProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo<readonly LocaleData[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) return LOCALE_DATABASE;
    return LOCALE_DATABASE.filter(
      (locale) =>
        locale.code.toLowerCase().includes(q) ||
        locale.englishName.toLowerCase().includes(q) ||
        locale.nativeName.toLowerCase().includes(q)
    );
  }, [query]);

  const handleToggle = (code: string) => {
    if (selected.includes(code)) {
      onChange(selected.filter((s) => s !== code));
    } else {
      if (maxSelections !== undefined && selected.length >= maxSelections) return;
      onChange([...selected, code]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-mist-700">{label}</label>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-mist-500 hover:text-mist-700"
          >
            Clear all ({selected.length})
          </button>
        )}
      </div>

      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-mist-200 bg-white py-2 pl-9 pr-4 text-sm text-mist-950 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none focus:ring-2 focus:ring-mist-200"
        />
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((code) => {
            const locale = LOCALE_DATABASE.find((l) => l.code === code);
            return (
              <span
                key={code}
                className="inline-flex items-center gap-1 rounded-full bg-mist-950 px-2.5 py-0.5 text-xs font-medium text-white"
              >
                {locale?.englishName ?? code}
                <button
                  type="button"
                  onClick={() => handleToggle(code)}
                  className="ml-0.5 rounded-full text-mist-300 hover:text-white"
                  aria-label={`Remove ${locale?.englishName ?? code}`}
                >
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                    <path d="M4.22 4.22a.75.75 0 011.06 0L6 4.94l.72-.72a.75.75 0 111.06 1.06L7.06 6l.72.72a.75.75 0 11-1.06 1.06L6 7.06l-.72.72a.75.75 0 01-1.06-1.06L4.94 6l-.72-.72a.75.75 0 010-1.06z" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      )}

      <div className="max-h-60 overflow-y-auto rounded-xl border border-mist-200 bg-white">
        {filtered.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-mist-500">
            No locales match your search.
          </p>
        ) : (
          <ul role="listbox" aria-multiselectable="true" aria-label={label}>
            {filtered.map((locale) => {
              const isSelected = selected.includes(locale.code);
              const isDisabled =
                !isSelected &&
                maxSelections !== undefined &&
                selected.length >= maxSelections;

              return (
                <li
                  key={locale.code}
                  role="option"
                  aria-selected={isSelected}
                >
                  <label
                    className={[
                      "flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                      isSelected
                        ? "bg-mist-50 text-mist-950"
                        : "text-mist-700 hover:bg-mist-50",
                      isDisabled ? "cursor-not-allowed opacity-50" : "",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => handleToggle(locale.code)}
                      className="h-4 w-4 rounded border-mist-300 text-mist-950 focus:ring-mist-400"
                    />
                    <span className="font-mono text-xs text-mist-400 w-16 flex-shrink-0">
                      {locale.code}
                    </span>
                    <span className="flex-1 truncate">{locale.englishName}</span>
                    {locale.direction === "rtl" && (
                      <span className="rounded bg-mist-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-mist-500">
                        RTL
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {maxSelections !== undefined && (
        <p className="text-xs text-mist-500">
          {selected.length} of {maxSelections} selected
        </p>
      )}
    </div>
  );
}
