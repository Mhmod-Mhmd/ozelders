import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { FilterDropdown } from './FilterDropdown';
import {
  type AvailabilitySelection,
  EMPTY_AVAILABILITY,
  TIME_GROUPS,
  WEEKDAYS,
} from '../utils/filterOptions';
import { type Weekday } from '../types/tutor.types';

interface AvailabilityFilterProps {
  value: AvailabilitySelection;
  onChange: (value: AvailabilitySelection) => void;
}

export function AvailabilityFilter({ value, onChange }: AvailabilityFilterProps) {
  const { t } = useTranslation();

  const day = (d: Weekday) => t(`weekdays.${d}`);

  const summary =
    value.slots.length === 0 && value.days.length === 0
      ? t('student.filters.anyTime')
      : [
          value.slots.join(', '),
          value.days.length ? value.days.map(day).join(', ') : '',
        ]
          .filter(Boolean)
          .join(' · ');

  const toggleSlot = (slot: string) =>
    onChange({
      ...value,
      slots: value.slots.includes(slot)
        ? value.slots.filter((s) => s !== slot)
        : [...value.slots, slot],
    });

  const toggleDay = (d: Weekday) =>
    onChange({
      ...value,
      days: value.days.includes(d)
        ? value.days.filter((x) => x !== d)
        : [...value.days, d],
    });

  const active = value.slots.length > 0 || value.days.length > 0;

  return (
    <FilterDropdown
      label={t('student.filters.available')}
      value={summary}
      active={active}
      align="end"
      clearLabel={t('student.filters.clearAvailability')}
      onClear={() => onChange(EMPTY_AVAILABILITY)}
    >
      <p className="text-sm font-bold text-gray-900">
        {t('student.availability.times')}
      </p>
      <div className="mt-3 space-y-4">
        {TIME_GROUPS.map((group) => (
          <div key={group.key}>
            <p className="mb-2 text-xs font-semibold text-gray-500">
              {t(`student.availability.${group.key}`)}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {group.slots.map((slot) => {
                const selected = value.slots.includes(slot.value);
                return (
                  <button
                    key={slot.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleSlot(slot.value)}
                    className={cn(
                      'rounded-xl border px-2 py-2.5 text-sm font-semibold transition-colors',
                      selected
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 text-gray-800 hover:border-gray-300',
                    )}
                  >
                    {slot.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm font-bold text-gray-900">
        {t('student.availability.days')}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {WEEKDAYS.map((d) => {
          const selected = value.days.includes(d);
          return (
            <button
              key={d}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleDay(d)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors',
                selected
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 text-gray-800 hover:border-gray-300',
              )}
            >
              {day(d)}
            </button>
          );
        })}
      </div>
    </FilterDropdown>
  );
}
