/** Drag-and-drop file upload zone with a paste textarea fallback. */

import { useState, useCallback, useRef } from "react";

interface FileUploadZoneProps {
  readonly onFileContent: (content: string, filename: string) => void;
  readonly accept?: string;
  readonly label?: string;
  readonly hint?: string;
  readonly placeholder?: string;
}

export function FileUploadZone({
  onFileContent,
  accept,
  label = "Upload file",
  hint = "Drag and drop a file here, or paste content below",
  placeholder = "Or paste content here...",
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback(
    (file: File) => {
      setError(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === "string") {
          onFileContent(content, file.name);
        } else {
          setError("Could not read file content.");
        }
      };
      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
      };
      reader.readAsText(file);
    },
    [onFileContent]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      readFile(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const handlePaste = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setError(null);
    onFileContent(event.target.value, "pasted-content");
  };

  const handleZoneClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={handleZoneClick}
        onKeyDown={(e) => e.key === "Enter" && handleZoneClick()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          isDragging
            ? "border-mist-400 bg-mist-100"
            : "border-mist-300 bg-mist-50 hover:border-mist-400 hover:bg-mist-100",
        ].join(" ")}
      >
        <svg
          className="h-8 w-8 text-mist-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <div>
          <p className="text-sm font-medium text-mist-700">{label}</p>
          <p className="mt-1 text-xs text-mist-500">{hint}</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleFileChange}
          tabIndex={-1}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-mist-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-mist-500">or paste</span>
        </div>
      </div>

      <textarea
        className="min-h-[160px] w-full resize-y rounded-xl border border-mist-200 bg-white px-4 py-3 font-mono text-sm text-mist-950 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none focus:ring-2 focus:ring-mist-200"
        placeholder={placeholder}
        onChange={handlePaste}
        spellCheck={false}
      />
    </div>
  );
}
