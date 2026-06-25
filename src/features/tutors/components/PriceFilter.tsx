import { useTranslation } from 'react-i18next';
import { FilterDropdown } from './FilterDropdown';
import {
  DEFAULT_PRICE,
  PRICE_MAX,
  PRICE_MIN,
  formatPriceRange,
  isDefaultPrice,
  type PriceRange,
} from '../utils/filterOptions';

interface PriceFilterProps {
  value: PriceRange;
  onChange: (value: PriceRange) => void;
}

export function PriceFilter({ value, onChange }: PriceFilterProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const span = PRICE_MAX - PRICE_MIN;
  const minPct = ((value.min - PRICE_MIN) / span) * 100;
  const maxPct = ((value.max - PRICE_MIN) / span) * 100;

  return (
    <FilterDropdown
      label={t('student.filters.price')}
      value={formatPriceRange(value, locale)}
      active={!isDefaultPrice(value)}
      clearLabel={t('student.filters.clearPrice')}
      onClear={() => onChange(DEFAULT_PRICE)}
    >
      <p className="text-center text-lg font-bold text-gray-900">
        {formatPriceRange(value, locale)}
      </p>

      <div className="range-dual relative mx-1 mt-5 mb-2 h-6">
        {/* Rail + active segment (rendered behind the inputs). */}
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-200" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-900"
          style={{ insetInlineStart: `${minPct}%`, insetInlineEnd: `${100 - maxPct}%` }}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={value.min}
          aria-label={t('student.filters.minPrice')}
          onChange={(e) =>
            onChange({ ...value, min: Math.min(Number(e.target.value), value.max) })
          }
          className="z-20"
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={value.max}
          aria-label={t('student.filters.maxPrice')}
          onChange={(e) =>
            onChange({ ...value, max: Math.max(Number(e.target.value), value.min) })
          }
          className="z-10"
        />
      </div>
    </FilterDropdown>
  );
}
