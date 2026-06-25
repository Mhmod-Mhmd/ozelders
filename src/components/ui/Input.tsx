import { type InputHTMLAttributes, type Ref } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
  /** Renders the error styling; pair with an inline message via `Field`. */
  invalid?: boolean;
}

/** Styled text input matching the app's `Select` styling. */
export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
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
