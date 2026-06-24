import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X, RotateCcw, SearchX } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { TutorCard } from '@/features/tutors/components/TutorCard';
import { FilterSidebar } from '@/features/tutors/components/FilterSidebar';
import { SortDropdown } from '@/features/tutors/components/SortDropdown';
import { filterTutors, sortTutors } from '@/features/tutors/utils/filterTutors';
import {
  type SortKey,
  type TutorFilters,
} from '@/features/tutors/types/tutor.types';
import { TUTORS, getSubjectByKey } from '@/data';

export function TutorsPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<TutorFilters>(() => ({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('q') || undefined,
  }));
  const [sort, setSort] = useState<SortKey>('top-rated');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Keep category/search in sync with the URL (e.g. arriving from the homepage).
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      category: searchParams.get('category') || undefined,
      search: searchParams.get('q') || undefined,
    }));
  }, [searchParams]);

  const results = useMemo(
    () => sortTutors(filterTutors(TUTORS, filters), sort),
    [filters, sort],
  );

  const updateFilters = (next: Partial<TutorFilters>) =>
    setFilters((f) => ({ ...f, ...next }));
  const resetFilters = () => setFilters({});

  const activeCategory = filters.category
    ? getSubjectByKey(filters.category)
    : undefined;

  return (
    <div className="bg-gray-50">
      {/* Page header */}
      <div className="border-b border-gray-100 bg-white">
        <Container className="py-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {activeCategory
              ? `${activeCategory.name} tutors`
              : 'Find your tutor'}
          </h1>
          <p className="mt-2 text-gray-600">
            Browse expert tutors, compare prices and reviews, and book a free
            trial lesson.
          </p>
        </Container>
      </div>

      <Container className="py-8">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
              <FilterSidebar
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
              />
            </div>
          </aside>

          {/* Results column */}
          <div>
            {/* Toolbar */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={filters.search ?? ''}
                  onChange={(e) =>
                    updateFilters({ search: e.target.value || undefined })
                  }
                  placeholder="Search by name or subject"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-3 pl-9 text-sm text-gray-800 hover:border-gray-300 focus-visible:border-brand-400"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
                <SortDropdown value={sort} onChange={setSort} />
              </div>
            </div>

            <p className="mb-4 text-sm text-gray-500">
              <span className="font-semibold text-gray-900">
                {results.length}
              </span>{' '}
              {results.length === 1 ? 'tutor' : 'tutors'} available
            </p>

            {results.length > 0 ? (
              <div className="space-y-5">
                {results.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                <SearchX className="mx-auto h-10 w-10 text-gray-300" />
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  No tutors match your filters
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting or resetting your filters.
                </p>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="mt-5"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterSidebar
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
                hideHeader
              />
            </div>
            <div className="border-t border-gray-100 p-4">
              <Button className="w-full" onClick={() => setMobileOpen(false)}>
                Show {results.length}{' '}
                {results.length === 1 ? 'result' : 'results'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
