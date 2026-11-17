import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { Button } from "./Button";

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
        <Icon name={icon} className="size-5" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon="alert"
      title="Something went wrong"
      description={message}
      action={
        onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <Icon name="refresh" />
            Try again
          </Button>
        )
      }
    />
  );
}

export function Alert({
  tone = "error",
  children,
  onDismiss,
}: {
  tone?: "error" | "success";
  children: ReactNode;
  onDismiss?: () => void;
}) {
  const styles =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-emerald-200 bg-emerald-50 text-emerald-800";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${styles}`}>
      <Icon name={tone === "error" ? "alert" : "check"} className="mt-0.5 size-4 shrink-0" />
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button onClick={onDismiss} className="-m-1 rounded p-1 opacity-60 hover:opacity-100" aria-label="Dismiss">
          <Icon name="x" />
        </button>
      )}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-zinc-200/70 ${className}`} />;
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-lg border border-zinc-200 bg-white ${className}`}>{children}</div>;
}
