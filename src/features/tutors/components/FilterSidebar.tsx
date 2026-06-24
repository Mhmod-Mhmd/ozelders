import { type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { SUBJECTS } from '@/data';
import { cn } from '@/utils/cn';
import {
  type AvailabilityPeriod,
  type TutorFilters,
} from '../types/tutor.types';

interface FilterSidebarProps {
  filters: TutorFilters;
  onChange: (next: Partial<TutorFilters>) => void;
  onReset: () => void;
  /** Hide the built-in "Filters" + Reset header (e.g. inside a mobile drawer). */
  hideHeader?: boolean;
}

const PRICE_BRACKETS: {
  id: string;
  label: string;
  min?: number;
  max?: number;
}[] = [
  { id: 'any', label: 'Any price' },
  { id: 'lt15', label: 'Under $15', max: 15 },
  { id: '15-25', label: '$15 – $25', min: 15, max: 25 },
  { id: '25-40', label: '$25 – $40', min: 25, max: 40 },
  { id: 'gt40', label: '$40 and up', min: 40 },
];

const RATING_OPTIONS: { id: string; label: string; value?: number }[] = [
  { id: 'any', label: 'Any rating' },
  { id: '4', label: '4.0 & up', value: 4.0 },
  { id: '45', label: '4.5 & up', value: 4.5 },
  { id: '48', label: '4.8 & up', value: 4.8 },
];

const PERIODS: { value: AvailabilityPeriod; label: string }[] = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
];

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-gray-100 py-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-sm font-bold text-gray-900">{title}</h3>
      {children}
    </div>
  );
}

export function FilterSidebar({
  filters,
  onChange,
  onReset,
  hideHeader = false,
}: FilterSidebarProps) {
  const activeBracket =
    PRICE_BRACKETS.find(
      (b) => b.min === filters.minPrice && b.max === filters.maxPrice,
    )?.id ?? 'any';

  const togglePeriod = (period: AvailabilityPeriod) => {
    const current = filters.availability ?? [];
    const next = current.includes(period)
      ? current.filter((p) => p !== period)
      : [...current, period];
    onChange({ availability: next });
  };

  return (
    <div>
      {!hideHeader && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-600"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      )}

      <FilterGroup title="Subject">
        <select
          value={filters.category ?? ''}
          onChange={(e) => onChange({ category: e.target.value || undefined })}
          className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-800 hover:border-gray-300"
        >
          <option value="">All subjects</option>
          {SUBJECTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.name}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title="Price per hour">
        <div className="space-y-2">
          {PRICE_BRACKETS.map((bracket) => (
            <label
              key={bracket.id}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700"
            >
              <input
                type="radio"
                name="price"
                checked={activeBracket === bracket.id}
                onChange={() =>
                  onChange({ minPrice: bracket.min, maxPrice: bracket.max })
                }
                className="h-4 w-4 accent-brand-500"
              />
              {bracket.label}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        <div className="space-y-2">
          {RATING_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700"
            >
              <input
                type="radio"
                name="rating"
                checked={(filters.minRating ?? undefined) === opt.value}
                onChange={() => onChange({ minRating: opt.value })}
                className="h-4 w-4 accent-brand-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Availability">
        <div className="grid grid-cols-2 gap-2">
          {PERIODS.map((period) => {
            const active = (filters.availability ?? []).includes(period.value);
            return (
              <button
                key={period.value}
                type="button"
                onClick={() => togglePeriod(period.value)}
                className={cn(
                  'rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300',
                )}
              >
                {period.label}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Native speaker">
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm text-gray-700">Native speakers only</span>
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(filters.nativeOnly)}
            onClick={() => onChange({ nativeOnly: !filters.nativeOnly })}
            className={cn(
              'relative h-6 w-11 rounded-full transition-colors',
              filters.nativeOnly ? 'bg-brand-500' : 'bg-gray-200',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                filters.nativeOnly && 'translate-x-5',
              )}
            />
          </button>
        </label>
      </FilterGroup>
    </div>
  );
}
