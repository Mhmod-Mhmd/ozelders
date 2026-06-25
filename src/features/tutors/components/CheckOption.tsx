import { type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CheckOptionProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  /** Optional leading element, e.g. a flag or icon. */
  leading?: ReactNode;
}

/** A single checkbox row used inside the multi-select filter panels. */
export function CheckOption({ label, checked, onToggle, leading }: CheckOptionProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={checked}
      onClick={onToggle}
      className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-start transition-colors hover:bg-gray-50"
    >
      {leading}
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
        {label}
      </span>
      <span
        className={cn(
          'grid h-5 w-5 shrink-0 place-items-center rounded border transition-colors',
          checked
            ? 'border-gray-900 bg-gray-900 text-white'
            : 'border-gray-300 bg-white',
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
