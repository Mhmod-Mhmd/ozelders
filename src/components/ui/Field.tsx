import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface FieldProps {
  /** Visible label text. */
  label: string;
  /** Associates the label with the control. */
  htmlFor: string;
  required?: boolean;
  /** Optional "Required" / hint text shown beside the label. */
  requiredText?: string;
  /** Inline validation error from form state. */
  error?: string;
  /** Helper text shown below the control when there is no error. */
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Labelled form control wrapper: renders the label (with an optional required
 * marker), the control, and either an inline error or helper text. Keeps every
 * form field consistent and accessible across the app.
 */
export function Field({
  label,
  htmlFor,
  required,
  requiredText,
  error,
  hint,
  children,
  className,
}: FieldProps) {
  let describedBy: string | undefined;
  if (error) {
    describedBy = `${htmlFor}-error`;
  } else if (hint) {
    describedBy = `${htmlFor}-hint`;
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required && requiredText && (
          <span className="ms-1 font-normal text-gray-400">
            • {requiredText}
          </span>
        )}
      </label>

      <div aria-describedby={describedBy}>{children}</div>

      {error ? (
        <p id={`${htmlFor}-error`} className="text-sm text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-gray-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
