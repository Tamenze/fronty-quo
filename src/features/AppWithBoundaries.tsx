/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";

function AppErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="p-4 sm:p-6">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm text-center min-h-[65vh] justify-center">
        {/* Icon + Title */}
        <div className="mx-auto flex w-full max-w-xl flex-col items-center px-6">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border bg-background/60 shadow-inner">
            <svg
              className="h-6 w-6 opacity-80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Something went wrong</h2>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {(error as any)?.message ?? "Unexpected error."}
          </p>
        </div>

        {/* Single action: reset boundary */}
        <div className="mx-auto w-full max-w-xl px-6">
          <button
            className="w-full sm:w-auto rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
            onClick={resetErrorBoundary}
          >
            Try again
          </button>
        </div>

        <span role="status" aria-live="polite" className="sr-only">
          Error content displayed
        </span>
      </div>
    </div>
  );
}

export function AppRouteFallback() {
  const handleHardRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm text-center min-h-[65vh] justify-center">
        {/* Icon + Title */}
        <div className="mx-auto flex w-full max-w-xl flex-col items-center px-6">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border bg-background/60 shadow-inner">
            <svg
              className="h-6 w-6 opacity-80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Something went wrong</h2>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            An unexpected error occurred. You can try a full page reload.
          </p>
        </div>

        {/* Single action: hard refresh */}
        <div className="mx-auto w-full max-w-xl px-6">
          <button
            type="button"
            onClick={handleHardRefresh}
            className="w-full sm:w-auto rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Reload page
          </button>
        </div>

        {/* Subtle meta (non-interactive) */}
        <div className="mx-auto w-full max-w-xl px-6">
          <p className="text-xs text-muted-foreground">
            If the issue persists after reloading, it might be a temporary server or network problem.
          </p>
        </div>

      </div>
    </div>
  );
}


export function AppWithBoundaries({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={AppErrorFallback}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
