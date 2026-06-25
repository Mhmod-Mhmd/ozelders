import {
  type SortKey,
  type Tutor,
  type TutorFilters,
  type Weekday,
} from '../types/tutor.types';

const WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Apply the active filters to a list of tutors. */
export function filterTutors(tutors: Tutor[], f: TutorFilters): Tutor[] {
  return tutors.filter((t) => {
    if (f.category && t.category !== f.category) return false;
    if (f.subject && t.subject.toLowerCase() !== f.subject.toLowerCase())
      return false;

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

    if (f.countries && f.countries.length > 0 && !f.countries.includes(t.country))
      return false;

    // Availability is matched per-day: the tutor must offer at least one of the
    // selected periods on at least one of the selected days. When only days are
    // given, the tutor must be available (any period) on one of them; when only
    // periods are given, on any day.
    const periods = f.availability?.length ? f.availability : undefined;
    const days = f.days?.length ? f.days : undefined;
    if (periods || days) {
      const checkDays = days ?? WEEKDAYS;
      const ok = checkDays.some((day) => {
        const offered = t.availability[day] ?? [];
        return periods ? periods.some((p) => offered.includes(p)) : offered.length > 0;
      });
      if (!ok) return false;
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
