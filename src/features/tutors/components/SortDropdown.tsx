import { useTranslation } from 'react-i18next';
import { Select } from '@/components/ui/Select';
import { type SortKey } from '../types/tutor.types';

const OPTIONS: { value: SortKey; labelKey: string }[] = [
  { value: 'top-rated', labelKey: 'tutors.sortDropdown.topRated' },
  { value: 'price-asc', labelKey: 'tutors.sortDropdown.priceLowHigh' },
  { value: 'price-desc', labelKey: 'tutors.sortDropdown.priceHighLow' },
  { value: 'most-reviews', labelKey: 'tutors.sortDropdown.mostReviews' },
];

interface SortDropdownProps {
  value: SortKey;
  onChange: (value: SortKey) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const { t } = useTranslation();

  return (
    <label className="flex items-center gap-2">
      <span className="hidden text-sm text-gray-500 sm:inline">
        {t('tutors.sortDropdown.label')}
      </span>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="min-w-44"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {t(o.labelKey)}
          </option>
        ))}
      </Select>
    </label>
  );
}
