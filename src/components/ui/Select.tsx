import { type SelectHTMLAttributes, type Ref } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  ref?: Ref<HTMLSelectElement>;
}

/** Styled native `<select>` with a custom chevron. */
export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pr-9 pl-3.5 text-sm font-medium text-gray-800 transition-colors hover:border-gray-300 focus-visible:border-brand-400',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
}
