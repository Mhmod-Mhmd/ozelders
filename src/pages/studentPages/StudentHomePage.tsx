import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BadgeCheck, ChevronDown, Search, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { TutorCardSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import {
  LearnFilter,
  StudentTutorCard,
  VideoPromoCard,
} from '@/features/tutors/components';
import {
  useSavedTutorIds,
  useToggleSavedTutor,
  useTutors,
} from '@/features/tutors/hooks/useTutors';
import { useDebounce } from '@/hooks/useDebounce';

/** Stable empty set so the saved-ids fallback doesn't change identity each render. */
const NO_SAVED = new Set<string>();

/**
 * Student landing page shown right after login: a Preply-style tutor discovery
 * view with a filter bar, a list of tutor cards, and a promo/video rail.
 */

/* -------------------------------------------------------------------------- */
/* Filter bar                                                                 */
/* -------------------------------------------------------------------------- */

interface FilterFieldProps {
  label: string;
  value: string;
  /** Show a clear (×) affordance like the active filters in the design. */
  clearable?: boolean;
}

/** Large labelled dropdown control (top row of the filter bar). */
function FilterField({ label, value, clearable }: FilterFieldProps) {
  return (
    <button
      type="button"
      className="group flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-start transition-colors hover:border-gray-300"
    >
      <span className="min-w-0">
        <span className="block text-xs font-medium text-gray-500">{label}</span>
        <span className="block truncate text-sm font-semibold text-gray-900">
          {value}
        </span>
      </span>
      {clearable ? (
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gray-900 text-white">
          <X className="h-3.5 w-3.5" />
        </span>
      ) : (
        <ChevronDown className="h-5 w-5 shrink-0 text-gray-500" />
      )}
    </button>
  );
}

interface FilterPillProps {
  label: string;
  /** Numeric badge (count of active sub-filters). */
  count?: number;
  /** Render a check badge instead of a chevron (toggle is on). */
  checked?: boolean;
}

/** Compact pill control (second row of the filter bar). */
function FilterPill({ label, count, checked }: FilterPillProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-gray-300"
    >
      {label}
      {count !== undefined && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gray-900 px-1 text-xs font-semibold text-white">
          {count}
        </span>
      )}
      {checked ? (
        <span className="grid h-5 w-5 place-items-center rounded-full bg-gray-900 text-white">
          <BadgeCheck className="h-3.5 w-3.5" />
        </span>
      ) : (
        <ChevronDown className="h-4 w-4 text-gray-500" />
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

const SORT_OPTION_KEYS = [
  'topPicks',
  'priceLowHigh',
  'priceHighLow',
  'mostReviews',
] as const;

export function StudentHomePage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [learn, setLearn] = useState('English');
  const debouncedSearch = useDebounce(search.trim(), 350);

  const tutorsQuery = useTutors({
    subject: learn,
    search: debouncedSearch || undefined,
  });
  const tutors = tutorsQuery.data?.data ?? [];
  const total = tutorsQuery.data?.meta.total ?? 0;
  const featured = tutors[0];

  const savedIds = useSavedTutorIds().data ?? NO_SAVED;
  const toggleSave = useToggleSavedTutor();

  return (
    <div className="bg-gray-50">
      {/* Heading */}
      <Container className="px-3.75 pt-8 pb-2 sm:px-3.75 lg:px-3.75">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {t('student.heading')}
          </h1>
          <span aria-hidden className="hidden text-4xl sm:block">
            📈
          </span>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-600">
          {tutorsQuery.isLoading
            ? t('common.loading')
            : t('tutors.availableCount', { count: total })}
        </p>
      </Container>

      {/* Filter bar */}
      <div className="border-b border-gray-100 bg-white">
        <Container className="px-3.75 py-5 sm:px-3.75 lg:px-3.75">
          {/* Top row: labelled dropdowns */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <LearnFilter value={learn} onChange={setLearn} />
            <FilterField
              label={t('student.filters.price')}
              value={t('student.filters.priceValue')}
              clearable
            />
            <FilterField
              label={t('student.filters.country')}
              value={t('student.filters.countryValue')}
              clearable
            />
            <FilterField
              label={t('student.filters.available')}
              value={t('student.filters.availableValue')}
              clearable
            />
          </div>

          {/* Second row: pills + search */}
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <FilterPill label={t('student.filters.specialties')} count={1} />
            <FilterPill label={t('student.filters.alsoSpeaks')} count={2} />
            <FilterPill label={t('student.filters.nativeSpeaker')} checked />
            <FilterPill label={t('student.filters.tutorCategories')} />

            <label className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800">
              <span className="text-gray-500">{t('student.sortBy')}</span>
              <select className="cursor-pointer appearance-none bg-transparent font-semibold text-gray-900 focus:outline-none">
                {SORT_OPTION_KEYS.map((key) => (
                  <option key={key}>{t(`student.sort.${key}`)}</option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </label>

            <div className="relative ms-auto w-full sm:w-64">
              <Search className="absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('student.searchPlaceholder')}
                className="w-full rounded-full border border-gray-200 bg-white py-2 pe-3 ps-9 text-sm text-gray-800 hover:border-gray-300 focus-visible:border-brand-400"
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Results + rail */}
      <Container className="px-3.75 py-6 sm:px-3.75 lg:px-3.75">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
          <div className="space-y-5">
            {tutorsQuery.isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TutorCardSkeleton key={i} />
              ))
            ) : tutorsQuery.isError ? (
              <ErrorState onRetry={() => tutorsQuery.refetch()} />
            ) : tutors.length > 0 ? (
              tutors.map((tutor) => {
                const saved = savedIds.has(tutor.id);
                return (
                  <StudentTutorCard
                    key={tutor.id}
                    tutor={tutor}
                    saved={saved}
                    onToggleSave={(t) => toggleSave.mutate({ tutor: t, saved })}
                  />
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                <Search className="mx-auto h-10 w-10 text-gray-300" />
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  {t('tutors.noResults')}
                </h3>
                <p className="mt-1 text-gray-500">{t('tutors.noResultsHint')}</p>
              </div>
            )}
          </div>

          {/* Right rail */}
          <aside className="mt-6 hidden lg:mt-0 lg:block">
            {featured && (
              <div className="sticky top-20">
                <VideoPromoCard tutor={featured} />
              </div>
            )}
          </aside>
        </div>
      </Container>
    </div>
  );
}
