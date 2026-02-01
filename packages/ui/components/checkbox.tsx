import React from "react";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const getInputClasses = (
  checked: boolean,
  disabled: boolean,
  indeterminate: boolean,
) => {
  let className =
    "relative border w-4 h-4 duration-200 rounded inline-flex items-center justify-center";

  if (disabled) {
    if (!checked || indeterminate) {
      className += " bg-gray-100 border-gray-500";
      if (indeterminate) {
        className += " stroke-gray-500";
      } else {
        className += " fill-gray-100 stroke-gray-100";
      }
    } else {
      className += " bg-gray-600 border-gray-600 fill-gray-600 stroke-gray-100";
    }
  } else {
    if (!checked || indeterminate) {
      className +=
        " bg-white dark:bg-background border-gray-300 dark:border-neutral-600 group-hover:bg-gray-100 dark:group-hover:bg-neutral-800";
      if (indeterminate) {
        className += " stroke-gray-700 dark:stroke-neutral-400";
      } else {
        className +=
          " fill-white dark:fill-neutral-900 stroke-white dark:stroke-neutral-900 group-hover:stroke-gray-200 group-hover:fill-gray-200";
      }
    } else {
      className +=
        " bg-gray-900 dark:bg-gray-100 border-gray-900 dark:border-gray-100 fill-gray-900 dark:fill-gray-100 stroke-white dark:stroke-gray-900";
    }
  }

  return className;
};

export function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  indeterminate = false,
  children,
  className = "",
}: CheckboxProps) {
  return (
    <div
      className={`flex items-center cursor-pointer text-[13px] font-sans group ${disabled ? "text-gray-500" : "text-gray-900 dark:text-neutral-100"} ${className}`}
      onClick={() => {
        if (disabled || !onChange) return;
        // When indeterminate, clicking should select all (set to checked)
        // When checked, clicking should uncheck
        // When unchecked, clicking should check
        onChange(indeterminate ? true : !checked);
      }}
    >
      <input
        disabled={disabled}
        type="checkbox"
        checked={checked}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
        onChange={() => {}} // Controlled by onClick
        className="absolute w-px h-px p-0 overflow-hidden whitespace-nowrap border-none"
      />
      <span className={getInputClasses(checked, disabled, indeterminate)}>
        <svg className="shrink-0" height="16" viewBox="0 0 20 20" width="16">
          {indeterminate ? (
            <line
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="5"
              x2="15"
              y1="10"
              y2="10"
            />
          ) : (
            <path
              d="M14 7L8.5 12.5L6 10"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          )}
        </svg>
      </span>
      {children && <span className="ml-2">{children}</span>}
    </div>
  );
}
