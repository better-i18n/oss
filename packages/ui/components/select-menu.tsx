import * as Select from "@radix-ui/react-select";
import * as React from "react";
import { cn } from "../lib/utils";

export interface SelectMenuItem<T = string> {
  value: T;
  label: string;
}

export interface SelectMenuProps<T = string> {
  items: SelectMenuItem<T>[];
  value?: T;
  onValueChange?: (value: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

function SelectMenuInner<T extends string = string>(
  {
    items,
    value,
    onValueChange,
    placeholder = "Select an option",
    searchPlaceholder = "Search",
    emptyMessage = "Nothing found.",
    className,
    disabled = false,
  }: SelectMenuProps<T>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const [filteredItems, setFilteredItems] =
    React.useState<SelectMenuItem<T>[]>(items);

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    const searchValue = e.currentTarget.value;
    const results = items.filter((item) =>
      item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()),
    );
    setFilteredItems(results);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setFilteredItems(items);
    }
  };

  const selectedItem = items.find((item) => item.value === value);

  return (
    <Select.Root
      value={value}
      onValueChange={onValueChange}
      onOpenChange={handleOpenChange}
      disabled={disabled}
    >
      <div className={cn("w-full", className)}>
        <Select.Trigger
          ref={ref}
          className="w-full inline-flex items-center justify-between px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-offset-2 focus:ring-blue-600 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
        >
          <Select.Value placeholder={placeholder}>
            {selectedItem?.label || placeholder}
          </Select.Value>
          <Select.Icon className="text-gray-400 dark:text-neutral-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            avoidCollisions={false}
            className="w-[var(--radix-select-trigger-width)] overflow-hidden mt-3 bg-white border rounded-lg shadow-sm text-sm dark:bg-background dark:border-neutral-700 z-[5000]"
          >
            <div className="shadow flex items-center border-b border-gray-200 dark:border-neutral-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mx-3 text-gray-400 dark:text-neutral-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="p-2 text-gray-500 w-full rounded-md outline-none bg-transparent dark:text-neutral-400"
                onInput={handleSearch}
              />
            </div>
            <Select.Viewport className="max-h-64 mt-2 overflow-y-auto">
              {filteredItems.length < 1 ? (
                <div className="px-3 py-2 text-gray-600 dark:text-neutral-400">
                  {emptyMessage}
                </div>
              ) : (
                filteredItems.map((item) => (
                  <SelectMenuItem key={String(item.value)} value={item.value}>
                    {item.label}
                  </SelectMenuItem>
                ))
              )}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </div>
    </Select.Root>
  );
}

const SelectMenuItem = React.forwardRef<
  React.ElementRef<typeof Select.Item>,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={cn(
        "flex items-center justify-between px-3 cursor-default py-2 duration-150 text-gray-600 data-[state=checked]:text-blue-600 data-[state=checked]:bg-blue-50 data-[highlighted]:text-blue-600 data-[highlighted]:bg-blue-50 data-[highlighted]:hover:text-blue-600 data-[highlighted]:hover:bg-blue-50 outline-none dark:text-neutral-300 dark:data-[state=checked]:text-blue-400 dark:data-[state=checked]:bg-blue-900/30 dark:data-[highlighted]:text-blue-400 dark:data-[highlighted]:bg-blue-900/30",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>
        <div className="pr-4 line-clamp-1">{children}</div>
      </Select.ItemText>
      <div className="w-6">
        <Select.ItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Select.ItemIndicator>
      </div>
    </Select.Item>
  );
});
SelectMenuItem.displayName = "SelectMenuItem";

export const SelectMenu = React.forwardRef(SelectMenuInner) as <
  T extends string = string,
>(
  props: SelectMenuProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> },
) => ReturnType<typeof SelectMenuInner>;
