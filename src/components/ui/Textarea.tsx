import { type TextareaHTMLAttributes, type Ref } from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
  /** Renders the error styling; pair with an inline message via `Field`. */
  invalid?: boolean;
}

/** Styled multi-line input matching the app's `Input`/`Select` controls. */
export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 hover:border-gray-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
        invalid
          ? 'border-red-400 focus-visible:border-red-500'
          : 'border-gray-200 focus-visible:border-brand-400',
        className,
      )}
      {...props}
    />
  );
}
