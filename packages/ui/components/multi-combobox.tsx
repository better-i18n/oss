import { IconCheckmark1, IconChevronBottom, IconCrossMedium, IconMagnifyingGlass } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import * as Select from "@radix-ui/react-select";
import * as React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";

interface Option {
  label: string;
  value: string;
}

interface MultiComboboxContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder: string;
  searchValue: string;
  onChangeSearchValue: (value: string) => void;
  value: string[];
  onChangeValue: (value: string[]) => void;
  disabled?: boolean;
  errored?: boolean;
  size?: "small" | "medium" | "large";
  options: Option[];
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  multiple: boolean;
  renderSelectedValue?: (value: string, label: string) => React.ReactNode;
}

const MultiComboboxContext = createContext<MultiComboboxContextValue | null>(
  null,
);

interface MultiComboboxProps {
  placeholder?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  errored?: boolean;
  width?: "full" | number;
  size?: "small" | "medium" | "large";
  multiple?: boolean;
  children: React.ReactNode;
  className?: string;
  renderSelectedValue?: (value: string, label: string) => React.ReactNode;
}

export const MultiCombobox = ({
  placeholder = "Select...",
  value = [],
  onChange,
  disabled = false,
  errored = false,
  size = "medium",
  multiple = true,
  children,
  className: _className,
  width,
  renderSelectedValue,
}: MultiComboboxProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [_value, set_value] = useState<string[]>(value || []);
  const [options, setOptions] = useState<Option[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Extract options from children (including nested Popover children)
  useEffect(() => {
    const extractText = (node: React.ReactNode): string => {
      if (typeof node === "string" || typeof node === "number") {
        return String(node);
      }
      if (React.isValidElement(node)) {
        const props = node.props as { children?: React.ReactNode };
        if (props?.children) {
          return extractText(props.children);
        }
        return "";
      }
      if (Array.isArray(node)) {
        return node.map(extractText).join("");
      }
      return "";
    };

    const extractOptionsFromChildren = (
      childrenArray: React.ReactNode[],
    ): Option[] => {
      const options: Option[] = [];

      const processChild = (child: React.ReactNode) => {
        if (!React.isValidElement(child)) return;

        const childProps = child.props as {
          children?: React.ReactNode;
          value?: string;
        };

        // If this is a MultiComboboxOption (has value prop), extract it
        if (childProps?.value !== undefined) {
          const label = extractText(childProps.children);
          if (label) {
            options.push({
              value: childProps.value,
              label: label,
            });
          }
        }

        // If this child has children, recursively process them
        // This handles MultiCombobox.Popover which wraps MultiCombobox.Option components
        if (childProps?.children) {
          const nestedChildren = React.Children.toArray(childProps.children);
          nestedChildren.forEach(processChild);
        }
      };

      React.Children.toArray(childrenArray).forEach(processChild);
      return options;
    };

    const newOptions = extractOptionsFromChildren(
      React.Children.toArray(children),
    );
    setOptions(newOptions);
  }, [children]);

  const onChangeSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const onChangeValue = (newValue: string[]) => {
    set_value(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Sync external value changes
  useEffect(() => {
    if (value !== undefined) {
      set_value(value);
    }
  }, [value]);

  // Reset search when popover closes
  useEffect(() => {
    if (!isOpen) {
      setSearchValue("");
    }
  }, [isOpen]);

  return (
    <Select.Root open={isOpen} onOpenChange={setIsOpen} disabled={disabled}>
      <MultiComboboxContext.Provider
        value={{
          isOpen,
          setIsOpen,
          placeholder,
          searchValue,
          onChangeSearchValue,
          value: _value,
          onChangeValue,
          disabled,
          errored,
          size,
          options,
          setOptions,
          triggerRef,
          multiple,
          renderSelectedValue,
        }}
      >
        <div
          className={cn(
            "relative inline-block w-40 text-sm font-sans",
            width === "full" ? "w-full!" : `w-[${width}px]`,
          )}
          style={{ width: width === "full" ? "100%" : width }}
        >
          {children}
        </div>
      </MultiComboboxContext.Provider>
    </Select.Root>
  );
};

const MultiComboboxInput = ({
  showSelectedCount = true,
  className,
}: {
  showSelectedCount?: boolean;
  className?: string;
}) => {
  const context = useContext(MultiComboboxContext);
  if (!context)
    throw new Error("MultiComboboxInput must be used within MultiCombobox");

  const selectedCount = context.value.length;

  // Get display content based on selection
  let displayContent: React.ReactNode;
  if (context.multiple) {
    if (selectedCount === 0) {
      displayContent = context.placeholder;
    } else if (showSelectedCount) {
      displayContent = `${selectedCount} selected`;
    } else {
      // Show first selected option label
      const firstOption = context.options.find(
        (opt) => opt.value === context.value[0],
      );
      if (firstOption && context.renderSelectedValue) {
        displayContent = context.renderSelectedValue(
          firstOption.value,
          firstOption.label,
        );
      } else {
        displayContent = firstOption?.label || context.placeholder;
      }
    }
  } else {
    // Single select
    if (selectedCount > 0) {
      const selectedOption = context.options.find(
        (opt) => opt.value === context.value[0],
      );
      if (selectedOption && context.renderSelectedValue) {
        displayContent = context.renderSelectedValue(
          selectedOption.value,
          selectedOption.label,
        );
      } else {
        displayContent = selectedOption?.label || context.placeholder;
      }
    } else {
      displayContent = context.placeholder;
    }
  }

  return (
    <Select.Trigger
      ref={context.triggerRef}
      className={cn(
        "flex h-10 w-full items-center justify-between gap-2 rounded-2xl border border-input bg-background px-3 py-2 text-start text-sm text-foreground shadow-sm shadow-black/5 focus:border-ring focus:outline-none focus:ring-[3px] focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground/70 [&>span]:min-w-0 cursor-pointer transition-all duration-300",
        context.errored && "border-red-500 focus:ring-red-500/20",
        selectedCount === 0 && "text-muted-foreground",
        className,
      )}
    >
      <span className="flex-1 truncate text-left flex items-center gap-2">
        {displayContent}
      </span>
      <Select.Icon asChild className="shrink-0">
        <IconChevronBottom size={16} className="text-muted-foreground/80" />
      </Select.Icon>
    </Select.Trigger>
  );
};

interface MultiComboboxPopoverProps {
  children?: React.ReactNode;
  maxWidth?: number;
  maxHeight?: string;
  className?: string;
  emptyMessage?: string;
}

const MultiComboboxPopover = ({
  children,
  maxWidth: _maxWidth,
  maxHeight: _maxHeight = "max-h-80",
  className,
  emptyMessage = "No results found",
}: MultiComboboxPopoverProps) => {
  const context = useContext(MultiComboboxContext);
  if (!context)
    throw new Error("MultiComboboxPopover must be used within MultiCombobox");

  const [filteredItems, setFilteredItems] = useState<React.ReactElement[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Helper function to extract text from React node
  const extractText = React.useCallback((node: React.ReactNode): string => {
    if (typeof node === "string" || typeof node === "number") {
      return String(node);
    }
    if (React.isValidElement(node)) {
      const props = node.props as { children?: React.ReactNode };
      if (props?.children) {
        return extractText(props.children);
      }
      return "";
    }
    if (Array.isArray(node)) {
      return node.map(extractText).join("");
    }
    return "";
  }, []);

  // Filter children based on searchValue
  useEffect(() => {
    const allChildren = React.Children.toArray(
      children,
    ) as React.ReactElement[];
    const searchTerm = (context.searchValue?.toLowerCase() || "").trim();

    let filtered: React.ReactElement[] = [];

    if (!searchTerm) {
      filtered = allChildren;
    } else {
      filtered = allChildren.filter((child) => {
        if (React.isValidElement(child)) {
          const childProps = child.props as {
            children?: React.ReactNode;
            value?: string;
          };
          const childText = childProps?.children;
          const label = extractText(childText).toLowerCase();
          return label.includes(searchTerm);
        }
        return false;
      });
    }

    setFilteredItems(filtered);
    setHighlightedIndex(-1);
  }, [children, context.searchValue, extractText]);

  // Focus search input when popover opens
  useEffect(() => {
    if (context.isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [context.isOpen]);

  if (!context.isOpen) return null;

  return (
    <Select.Portal>
      <Select.Content
        position="popper"
        className={cn(
          "relative z-[5000] max-h-[min(24rem,var(--radix-select-content-available-height))] min-w-[8rem] overflow-hidden rounded-2xl border border-input bg-popover text-popover-foreground shadow-lg shadow-black/5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-[var(--radix-select-trigger-width)] data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
      >
        {/* Search Input */}
        <div className="px-2 pt-2 pb-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
              <IconMagnifyingGlass className="h-4 w-4 text-muted-foreground/60" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={context.searchValue}
              onChange={(e) => {
                context.onChangeSearchValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  e.stopPropagation();
                  if (context.searchValue) {
                    context.onChangeSearchValue("");
                  } else {
                    context.setIsOpen(false);
                  }
                  return;
                }

                // Keyboard navigation
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlightedIndex((prev) => {
                    const newIndex = prev < filteredItems.length - 1 ? prev + 1 : 0;
                    return newIndex;
                  });
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightedIndex((prev) => {
                    const newIndex = prev > 0 ? prev - 1 : filteredItems.length - 1;
                    return newIndex;
                  });
                } else if (e.key === "Enter" && highlightedIndex >= 0) {
                  e.preventDefault();
                  const highlightedItem = filteredItems[highlightedIndex];
                  if (highlightedItem && React.isValidElement(highlightedItem)) {
                    const value = (highlightedItem.props as { value?: string })?.value;
                    if (value) {
                      if (context.multiple) {
                        const isSelected = context.value.includes(value);
                        const newValue = isSelected
                          ? context.value.filter((v) => v !== value)
                          : [...context.value, value];
                        context.onChangeValue(newValue);
                      } else {
                        context.onChangeValue([value]);
                        context.setIsOpen(false);
                      }
                    }
                  }
                }
              }}
              placeholder="Search..."
              className={cn(
                "flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 pl-10 pr-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
              )}
            />
            {context.searchValue && (
              <button
                type="button"
                onClick={() => context.onChangeSearchValue("")}
                className="absolute inset-y-0 right-0 flex items-center pr-2 hover:text-muted-foreground rounded transition-colors"
              >
                <IconCrossMedium className="h-4 w-4 text-muted-foreground/60" />
              </button>
            )}
          </div>
        </div>

        {/* Options List */}
        <Select.Viewport className={cn("px-1 pb-1 overflow-y-auto", "h-[var(--radix-select-trigger-height)]")} ref={optionsRef}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={index}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "cursor-pointer",
                  index === highlightedIndex && "bg-accent/20"
                )}
              >
                {React.cloneElement(item, {
                  ...(item.props || {}),
                  isHighlighted: index === highlightedIndex,
                } as React.Attributes & { isHighlighted?: boolean })}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-muted-foreground text-sm">
              {emptyMessage}
            </div>
          )}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  );
};

interface MultiComboboxOptionProps {
  value: string;
  children: React.ReactNode;
  isHighlighted?: boolean;
}

const MultiComboboxOption = ({ value, children, isHighlighted }: MultiComboboxOptionProps) => {
  const context = useContext(MultiComboboxContext);
  if (!context)
    throw new Error("MultiComboboxOption must be used within MultiCombobox");

  const isSelected = context.value.includes(value);

  const onClick = () => {
    if (context.multiple) {
      const newValue = isSelected
        ? context.value.filter((v) => v !== value)
        : [...context.value, value];
      context.onChangeValue(newValue);
    } else {
      context.onChangeValue([value]);
      context.setIsOpen(false);
    }
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 px-3 text-sm outline-none transition-colors",
        isHighlighted && "bg-accent text-accent-foreground",
        isSelected && !isHighlighted && "bg-accent/30",
        !isHighlighted && !isSelected && "hover:bg-accent/20",
      )}
    >
      <span className="flex-1">{children}</span>
      {/* Modern checkbox on the right */}
      <span
        className={cn(
          "ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all duration-200",
          isSelected
            ? "bg-gray-900 dark:bg-gray-100 border-gray-900 dark:border-gray-100"
            : "bg-white dark:bg-background border-gray-300 dark:border-neutral-600"
        )}
      >
        {isSelected && (
          <IconCheckmark1 size={14} className="text-white dark:text-gray-900" />
        )}
      </span>
    </div>
  );
};

const MultiComboboxSelected = ({
  onRemove,
  renderBadge,
}: {
  onRemove?: (value: string) => void;
  renderBadge?: (value: string, label: string) => React.ReactNode;
}) => {
  const context = useContext(MultiComboboxContext);
  if (!context)
    throw new Error("MultiComboboxSelected must be used within MultiCombobox");

  if (context.value.length === 0) return null;

  if (renderBadge) {
    return (
      <div className="flex flex-wrap gap-2">
        {context.value.map((val) => {
          const option = context.options.find((opt) => opt.value === val);
          return (
            <React.Fragment key={val}>
              {renderBadge(val, option?.label || val)}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {context.value.map((val) => {
        const option = context.options.find((opt) => opt.value === val);
        return (
          <span
            key={val}
            className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md dark:bg-blue-900/30 dark:text-blue-400"
          >
            {option?.label || val}
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(val)}
                className="hover:text-blue-900 dark:hover:text-blue-300"
                aria-label={`Remove ${option?.label || val}`}
              >
                <IconCrossMedium className="h-3 w-3" />
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
};

MultiCombobox.Input = MultiComboboxInput;
MultiCombobox.Popover = MultiComboboxPopover;
MultiCombobox.Option = MultiComboboxOption;
MultiCombobox.Selected = MultiComboboxSelected;
