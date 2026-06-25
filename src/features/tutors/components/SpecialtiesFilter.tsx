import { useTranslation } from 'react-i18next';
import { FilterPillDropdown } from './FilterPillDropdown';
import { CheckOption } from './CheckOption';
import { useTutorFacets } from '../hooks/useTutors';

/** Number of most-common specialties shown under the "Popular" group. */
const POPULAR_COUNT = 6;

interface SpecialtiesFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function SpecialtiesFilter({ value, onChange }: SpecialtiesFilterProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useTutorFacets();
  const specialties = data?.specialties ?? [];

  const toggle = (tag: string) =>
    onChange(
      value.includes(tag) ? value.filter((s) => s !== tag) : [...value, tag],
    );

  const popular = specialties.slice(0, POPULAR_COUNT);
  const more = specialties.slice(POPULAR_COUNT);
  const label = (tag: string) => t(`student.specialties.${tag}`, tag);

  return (
    <FilterPillDropdown
      label={t('student.filters.specialties')}
      count={value.length}
      panelClassName="p-3"
    >
      {isLoading ? (
        <p className="px-2 py-6 text-center text-sm text-gray-500">
          {t('common.loading')}
        </p>
      ) : (
        <div className="max-h-72 overflow-auto">
          <p className="px-2 pb-1 pt-1 text-xs font-bold uppercase tracking-wide text-gray-500">
            {t('student.filters.popular')}
          </p>
          {popular.map((tag) => (
            <CheckOption
              key={tag}
              label={label(tag)}
              checked={value.includes(tag)}
              onToggle={() => toggle(tag)}
            />
          ))}

          {more.length > 0 && (
            <>
              <p className="px-2 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                {t('student.filters.moreSpecialties')}
              </p>
              {more.map((tag) => (
                <CheckOption
                  key={tag}
                  label={label(tag)}
                  checked={value.includes(tag)}
                  onToggle={() => toggle(tag)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </FilterPillDropdown>
  );
}
