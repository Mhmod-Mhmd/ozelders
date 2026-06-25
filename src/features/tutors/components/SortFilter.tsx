import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FilterPillDropdown } from './FilterPillDropdown';
import { type SortKey } from '../types/tutor.types';

/** Sort options in display order, mapped to their i18n label keys. */
const SORT_OPTIONS: { value: SortKey; key: string }[] = [
  { value: 'price-asc', key: 'priceLowHigh' },
  { value: 'price-desc', key: 'priceHighLow' },
  { value: 'popularity', key: 'popularity' },
  { value: 'most-reviews', key: 'mostReviews' },
  { value: 'best-rating', key: 'bestRating' },
  { value: 'top-rated', key: 'topPicks' },
];

interface SortFilterProps {
  value: SortKey;
  onChange: (value: SortKey) => void;
}

export function SortFilter({ value, onChange }: SortFilterProps) {
  const { t } = useTranslation();
  const selected = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[5];

  return (
    <FilterPillDropdown
      label={`${t('student.sortBy')} ${t(`student.sort.${selected.key}`)}`}
      align="end"
      panelClassName="p-2"
    >
      <ul role="listbox" aria-label={t('student.sortBy')}>
        {SORT_OPTIONS.map((option) => {
          const isSelected = option.value === value;
          return (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => onChange(option.value)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-start text-sm font-medium transition-colors hover:bg-gray-50',
                  isSelected ? 'text-brand-600' : 'text-gray-800',
                )}
              >
                {t(`student.sort.${option.key}`)}
                {isSelected && <Check className="h-4 w-4 shrink-0" />}
              </button>
            </li>
          );
        })}
      </ul>
    </FilterPillDropdown>
  );
}
