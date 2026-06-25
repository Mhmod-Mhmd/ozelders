import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Labelled filter field with a popover panel — the shared shell behind the
 * price / country / availability filters in the find-tutor bar. Clicking the
 * field toggles the panel; it closes on an outside click or Escape. When the
 * filter has a non-default selection an `onClear` × badge is shown (clearing
 * does not open the panel).
 */

interface FilterDropdownProps {
  label: string;
  /** Summary of the current selection shown under the label. */
  value: string;
  /** Whether a non-default value is selected (drives the clear affordance). */
  active?: boolean;
  onClear?: () => void;
  /** Side the panel aligns to; use `end` for the rightmost filter. */
  align?: 'start' | 'end';
  /** Accessible name for the clear button. */
  clearLabel?: string;
  panelClassName?: string;
  children: ReactNode;
}

export function FilterDropdown({
  label,
  value,
  active,
  onClear,
  align = 'start',
  clearLabel,
  panelClassName,
  children,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointer(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'group flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 py-2.5 text-start transition-colors',
          open
            ? 'border-brand-400 ring-1 ring-brand-200'
            : 'border-gray-200 hover:border-gray-300',
        )}
      >
        <span className="min-w-0">
          <span className="block text-xs font-medium text-gray-500">{label}</span>
          <span className="block truncate text-sm font-semibold text-gray-900">
            {value}
          </span>
        </span>
        {active && onClear ? (
          <span
            role="button"
            tabIndex={0}
            aria-label={clearLabel}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
              setOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onClear();
                setOpen(false);
              }
            }}
            className="grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-full bg-gray-900 text-white transition-colors hover:bg-gray-700"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        ) : (
          <ChevronDown
            className={cn(
              'h-5 w-5 shrink-0 text-gray-500 transition-transform',
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
            'absolute top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-gray-100 bg-white p-4 shadow-xl ring-1 ring-black/5',
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
