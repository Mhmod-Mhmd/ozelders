import {
  type SortKey,
  type Tutor,
  type TutorFilters,
} from '../types/tutor.types';

/** Apply the active filters to a list of tutors. */
export function filterTutors(tutors: Tutor[], f: TutorFilters): Tutor[] {
  return tutors.filter((t) => {
    if (f.category && t.category !== f.category) return false;

    if (f.search) {
      const q = f.search.toLowerCase();
      const haystack =
        `${t.name} ${t.subject} ${t.tags.join(' ')} ` +
        t.speaks.map((s) => s.language).join(' ');
      if (!haystack.toLowerCase().includes(q)) return false;
    }

    if (f.minPrice !== undefined && t.pricePerHour < f.minPrice) return false;
    if (f.maxPrice !== undefined && t.pricePerHour > f.maxPrice) return false;
    if (f.minRating !== undefined && t.rating < f.minRating) return false;
    if (f.nativeOnly && !t.isNativeSpeaker) return false;

    if (f.availability && f.availability.length > 0) {
      const offered = new Set(Object.values(t.availability).flat());
      if (!f.availability.some((period) => offered.has(period))) return false;
    }

    return true;
  });
}

/** Return a new, sorted copy of the tutor list. */
export function sortTutors(tutors: Tutor[], sort: SortKey): Tutor[] {
  const copy = [...tutors];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.pricePerHour - b.pricePerHour);
    case 'price-desc':
      return copy.sort((a, b) => b.pricePerHour - a.pricePerHour);
    case 'most-reviews':
      return copy.sort((a, b) => b.reviewsCount - a.reviewsCount);
    case 'top-rated':
    default:
      return copy.sort(
        (a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount,
      );
  }
}
