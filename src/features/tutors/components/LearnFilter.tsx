import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * "I want to learn" filter: a labelled dropdown with one language always
 * selected. Clicking the field — or its × icon — opens the language list;
 * picking an option updates the selection and closes the menu. The selected
 * value drives the tutor query (server-side `subject` filter), so the results
 * re-render for the chosen language.
 */

/** Subject values that exist in the tutor data, in display order. */
const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Japanese',
] as const;

interface LearnFilterProps {
  /** Currently selected subject value (e.g. "English"). */
  value: string;
  onChange: (value: string) => void;
}

export function LearnFilter({ value, onChange }: LearnFilterProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Close on outside click or Escape while the menu is open.
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

  const label = (subject: string) => t(`student.languages.${subject}`, subject);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        className={cn(
          'group flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 py-2.5 text-start transition-colors',
          open ? 'border-brand-400 ring-1 ring-brand-200' : 'border-gray-200 hover:border-gray-300',
        )}
      >
        <span className="min-w-0">
          <span className="block text-xs font-medium text-gray-500">
            {t('student.filters.learn')}
          </span>
          <span className="block truncate text-sm font-semibold text-gray-900">
            {label(value)}
          </span>
        </span>
        {/* Clicking the × also opens the list (it's inside the trigger). */}
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gray-900 text-white">
          <X className="h-3.5 w-3.5" />
        </span>
      </button>

      {open && (
        <ul
          id={menuId}
          role="listbox"
          aria-label={t('student.filters.learn')}
          className="absolute start-0 top-full z-50 mt-2 max-h-72 w-full min-w-56 overflow-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5"
        >
          {LANGUAGES.map((lang) => {
            const selected = lang === value;
            return (
              <li key={lang}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(lang);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-start text-sm font-medium transition-colors hover:bg-gray-50',
                    selected ? 'text-brand-600' : 'text-gray-800',
                  )}
                >
                  {label(lang)}
                  {selected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
