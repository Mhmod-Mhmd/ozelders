import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FilterDropdown } from './FilterDropdown';
import { COUNTRIES, type CountryOption } from '../utils/filterOptions';

interface CountryFilterProps {
  /** Selected country names (matching `Tutor.country`). */
  value: string[];
  onChange: (value: string[]) => void;
}

export function CountryFilter({ value, onChange }: CountryFilterProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const name = (c: string) => t(`student.countries.${c}`, c);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => name(c.name).toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, t]);

  const popular = filtered.filter((c) => c.popular);
  const more = filtered.filter((c) => !c.popular);

  const toggle = (country: string) =>
    onChange(
      value.includes(country)
        ? value.filter((c) => c !== country)
        : [...value, country],
    );

  const summary =
    value.length === 0
      ? t('student.filters.anyCountry')
      : value.map((c) => name(c)).join(', ');

  const renderItem = (c: CountryOption) => {
    const selected = value.includes(c.name);
    return (
      <li key={c.name}>
        <button
          type="button"
          role="option"
          aria-selected={selected}
          onClick={() => toggle(c.name)}
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-start transition-colors hover:bg-gray-50"
        >
          <span aria-hidden className="text-xl leading-none">
            {c.flag}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
            {name(c.name)}
          </span>
          <span
            className={cn(
              'grid h-5 w-5 shrink-0 place-items-center rounded border transition-colors',
              selected
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 bg-white',
            )}
          >
            {selected && <Check className="h-3.5 w-3.5" />}
          </span>
        </button>
      </li>
    );
  };

  return (
    <FilterDropdown
      label={t('student.filters.country')}
      value={summary}
      active={value.length > 0}
      clearLabel={t('student.filters.clearCountry')}
      onClear={() => onChange([])}
      panelClassName="p-3"
    >
      <div className="relative mb-2">
        <Search className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('student.filters.countrySearch')}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pe-3 ps-9 text-sm text-gray-800 hover:border-gray-300 focus-visible:border-brand-400"
        />
      </div>

      <div className="max-h-64 overflow-auto">
        {filtered.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-gray-500">
            {t('tutors.noResults')}
          </p>
        ) : (
          <ul role="listbox" aria-label={t('student.filters.country')}>
            {popular.length > 0 && query.trim() === '' && (
              <li className="px-2 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                {t('student.filters.popular')}
              </li>
            )}
            {popular.map(renderItem)}
            {more.length > 0 && query.trim() === '' && (
              <li className="px-2 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                {t('student.filters.moreCountries')}
              </li>
            )}
            {more.map(renderItem)}
          </ul>
        )}
      </div>
    </FilterDropdown>
  );
}
