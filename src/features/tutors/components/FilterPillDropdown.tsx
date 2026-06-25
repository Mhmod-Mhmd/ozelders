import { type ReactNode } from 'react';
import { BadgeCheck, ChevronDown } from 'lucide-react';
import { usePopover } from '@/hooks';
import { cn } from '@/utils/cn';

/**
 * Compact pill trigger with a popover panel — the shell behind the second-row
 * find-tutor filters (specialties, also-speaks, native speaker, tutor
 * categories). Mirrors {@link FilterDropdown} but renders as a rounded pill with
 * an optional count or check badge. Dismisses on outside click / Escape.
 */

interface FilterPillDropdownProps {
  label: string;
  /** Numeric badge (count of active sub-filters); hidden when 0/undefined. */
  count?: number;
  /** Show a check badge instead of the chevron (a boolean toggle is on). */
  checked?: boolean;
  /** Side the panel aligns to; use `end` near the right edge. */
  align?: 'start' | 'end';
  panelClassName?: string;
  children: ReactNode;
}

export function FilterPillDropdown({
  label,
  count,
  checked,
  align = 'start',
  panelClassName,
  children,
}: FilterPillDropdownProps) {
  const { open, setOpen, containerRef, panelId } = usePopover();
  const active = checked || (count ?? 0) > 0;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-2 text-sm font-medium transition-colors',
          open || active
            ? 'border-brand-400 text-gray-900 ring-1 ring-brand-200'
            : 'border-gray-200 text-gray-800 hover:border-gray-300',
        )}
      >
        {label}
        {count !== undefined && count > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gray-900 px-1 text-xs font-semibold text-white">
            {count}
          </span>
        )}
        {checked ? (
          <span className="grid h-5 w-5 place-items-center rounded-full bg-gray-900 text-white">
            <BadgeCheck className="h-3.5 w-3.5" />
          </span>
        ) : (
          <ChevronDown
            className={cn(
              'h-4 w-4 text-gray-500 transition-transform',
              open && 'rotate-180',
            )}
          />
        )}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className={cn(
            'absolute top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-gray-100 bg-white p-4 shadow-xl ring-1 ring-black/5',
            align === 'end' ? 'end-0' : 'start-0',
            panelClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
