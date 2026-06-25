import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { FilterPillDropdown } from './FilterPillDropdown';
import { CheckOption } from './CheckOption';
import { useTutorFacets } from '../hooks/useTutors';

/** Number of most-common languages shown under the "Popular" group. */
const POPULAR_COUNT = 5;

interface AlsoSpeaksFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function AlsoSpeaksFilter({ value, onChange }: AlsoSpeaksFilterProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const { data, isLoading } = useTutorFacets();
  const languages = useMemo(() => data?.languages ?? [], [data]);

  const label = (lang: string) => t(`student.languages.${lang}`, lang);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter((l) => label(l).toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languages, query, t]);

  const searching = query.trim() !== '';
  const popular = searching ? [] : filtered.slice(0, POPULAR_COUNT);
  const rest = searching ? filtered : filtered.slice(POPULAR_COUNT);

  const toggle = (lang: string) =>
    onChange(
      value.includes(lang)
        ? value.filter((l) => l !== lang)
        : [...value, lang],
    );

  return (
    <FilterPillDropdown
      label={t('student.filters.alsoSpeaks')}
      count={value.length}
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

      {isLoading ? (
        <p className="px-2 py-6 text-center text-sm text-gray-500">
          {t('common.loading')}
        </p>
      ) : filtered.length === 0 ? (
        <p className="px-2 py-6 text-center text-sm text-gray-500">
          {t('tutors.noResults')}
        </p>
      ) : (
        <div className="max-h-64 overflow-auto">
          {popular.length > 0 && (
            <p className="px-2 pb-1 pt-1 text-xs font-bold uppercase tracking-wide text-gray-500">
              {t('student.filters.popular')}
            </p>
          )}
          {popular.map((lang) => (
            <CheckOption
              key={lang}
              label={label(lang)}
              checked={value.includes(lang)}
              onToggle={() => toggle(lang)}
            />
          ))}
          {rest.length > 0 && !searching && (
            <p className="px-2 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-gray-500">
              {t('student.filters.allLanguages')}
            </p>
          )}
          {rest.map((lang) => (
            <CheckOption
              key={lang}
              label={label(lang)}
              checked={value.includes(lang)}
              onToggle={() => toggle(lang)}
            />
          ))}
        </div>
      )}
    </FilterPillDropdown>
  );
}
