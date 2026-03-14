/** Error boundary for lazy-loaded tools. Catches render errors and shows a retry button. */

import { Component, type ReactNode, type ErrorInfo } from "react";

interface ToolErrorBoundaryProps {
  readonly children: ReactNode;
  readonly toolName?: string;
}

interface ToolErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}

export class ToolErrorBoundary extends Component<
  ToolErrorBoundaryProps,
  ToolErrorBoundaryState
> {
  constructor(props: ToolErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ToolErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ToolErrorBoundary] Tool render error:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError) {
      const { toolName } = this.props;
      return (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-6 rounded-xl border border-mist-200 bg-mist-50 px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mist-100">
            <svg
              className="h-6 w-6 text-mist-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-lg font-medium text-mist-950">
              {toolName ? `${toolName} failed to load` : "Something went wrong"}
            </h3>
            <p className="mt-2 text-sm text-mist-600">
              An unexpected error occurred. Try refreshing or click retry below.
            </p>
            {this.state.error?.message && (
              <p className="mt-2 font-mono text-xs text-mist-400">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                clipRule="evenodd"
              />
            </svg>
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
