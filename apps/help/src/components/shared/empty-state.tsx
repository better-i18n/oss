import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-mist-200 bg-mist-50/50 px-6 py-12 text-center">
      {icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-mist-100 text-mist-500">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-medium text-mist-950">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-mist-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
