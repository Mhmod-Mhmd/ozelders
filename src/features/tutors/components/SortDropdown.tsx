import { Select } from '@/components/ui/Select';
import { type SortKey } from '../types/tutor.types';

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'top-rated', label: 'Top rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'most-reviews', label: 'Most reviews' },
];

interface SortDropdownProps {
  value: SortKey;
  onChange: (value: SortKey) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <label className="flex items-center gap-2">
      <span className="hidden text-sm text-gray-500 sm:inline">Sort by</span>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="min-w-44"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </label>
  );
}
