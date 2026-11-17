import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export const inputClass =
  "block w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 shadow-xs placeholder:text-zinc-400 transition-colors focus:outline-none focus:ring-1 disabled:bg-zinc-50";

const stateClass = (invalid?: boolean) =>
  invalid
    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
    : "border-zinc-300 focus:border-zinc-900 focus:ring-zinc-900";

type FieldProps = {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  aside?: ReactNode;
  children: ReactNode;
};

export function Field({ id, label, hint, error, optional, aside, children }: FieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-zinc-900">
          {label}
          {optional && <span className="ml-1 font-normal text-zinc-400">(optional)</span>}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>
      )}
    </div>
  );
}

type Invalid = { invalid?: boolean };

export function TextInput({ invalid, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & Invalid) {
  return (
    <input
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${props.id}-error` : undefined}
      className={`${inputClass} ${stateClass(invalid)} ${className}`}
      {...props}
    />
  );
}

export function TextArea({ invalid, className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & Invalid) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${props.id}-error` : undefined}
      className={`${inputClass} ${stateClass(invalid)} resize-y ${className}`}
      {...props}
    />
  );
}

export function Select({ invalid, className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement> & Invalid) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={`${inputClass} ${stateClass(invalid)} cursor-pointer pr-8 ${className}`}
      {...props}
    />
  );
}

export function CharCount({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={`text-xs tabular-nums ${over ? "text-red-600" : "text-zinc-400"}`}>
      {value.length}/{max}
    </span>
  );
}
