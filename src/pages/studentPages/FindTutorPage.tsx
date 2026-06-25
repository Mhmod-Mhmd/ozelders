import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { TutorCardSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import {
  AlsoSpeaksFilter,
  AvailabilityFilter,
  CountryFilter,
  LearnFilter,
  NativeSpeakerFilter,
  PriceFilter,
  SortFilter,
  SpecialtiesFilter,
  StudentTutorCard,
  TutorCategoriesFilter,
  VideoPromoCard,
} from '@/features/tutors/components';
import {
  type AvailabilitySelection,
  DEFAULT_PRICE,
  EMPTY_AVAILABILITY,
  EMPTY_CATEGORIES,
  PRICE_MAX,
  PRICE_MIN,
  type PriceRange,
  type TutorCategorySelection,
  slotsToPeriods,
} from '@/features/tutors/utils/filterOptions';
import { type SortKey } from '@/features/tutors/types/tutor.types';
import {
  useSavedTutorIds,
  useToggleSavedTutor,
  useTutors,
} from '@/features/tutors/hooks/useTutors';
import { useDebounce } from '@/hooks/useDebounce';

/** Stable empty set so the saved-ids fallback doesn't change identity each render. */
const NO_SAVED = new Set<string>();

/**
 * Find-a-tutor page shown right after login: a Preply-style discovery view with
 * a live filter bar (language, price, country, availability, specialties, spoken
 * languages, native-speaker and tutor-category toggles, plus sort), a list of
 * tutor cards, and a promo/video rail. Every control feeds the `GET /tutors`
 * query, so changing one re-runs the request and re-renders the results.
 */

export function FindTutorPage() {
  const { t } = useTranslation();

  // Filter state — each piece is a controlled input that feeds the query below.
  const [learn, setLearn] = useState('English');
  const [price, setPrice] = useState<PriceRange>(DEFAULT_PRICE);
  const [countries, setCountries] = useState<string[]>([]);
  const [availability, setAvailability] =
    useState<AvailabilitySelection>(EMPTY_AVAILABILITY);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [nativeOnly, setNativeOnly] = useState(false);
  const [categories, setCategories] =
    useState<TutorCategorySelection>(EMPTY_CATEGORIES);
  const [sort, setSort] = useState<SortKey>('top-rated');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 350);

  const periods = slotsToPeriods(availability.slots);

  const tutorsQuery = useTutors({
    subject: learn,
    sort,
    search: debouncedSearch || undefined,
    minPrice: price.min > PRICE_MIN ? price.min : undefined,
    maxPrice: price.max < PRICE_MAX ? price.max : undefined,
    countries: countries.length ? countries : undefined,
    availability: periods.length ? periods : undefined,
    days: availability.days.length ? availability.days : undefined,
    specialties: specialties.length ? specialties : undefined,
    languages: languages.length ? languages : undefined,
    nativeOnly: nativeOnly || undefined,
    superTutor: categories.superTutor || undefined,
    professional: categories.professional || undefined,
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

      {/* Filter bar — pins to the top of the viewport on scroll (the header
          slides away to make room, see StudentNavbar). */}
      <div className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">

        <Container className="px-3.75 py-5 sm:px-3.75 lg:px-3.75">
          {/* Top row: labelled dropdown filters */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <LearnFilter value={learn} onChange={setLearn} />
            <PriceFilter value={price} onChange={setPrice} />
            <CountryFilter value={countries} onChange={setCountries} />
            <AvailabilityFilter
              value={availability}
              onChange={setAvailability}
            />
          </div>

          {/* Second row: pills + search */}
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <SpecialtiesFilter value={specialties} onChange={setSpecialties} />
            <AlsoSpeaksFilter value={languages} onChange={setLanguages} />
            <NativeSpeakerFilter value={nativeOnly} onChange={setNativeOnly} />
            <TutorCategoriesFilter value={categories} onChange={setCategories} />

            <SortFilter value={sort} onChange={setSort} />

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
