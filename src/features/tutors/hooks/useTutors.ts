import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Paginated } from '@/types';
import {
  getSavedTutors,
  getTutorById,
  getTutorFacets,
  getTutorReviews,
  getTutors,
  saveTutor,
  unsaveTutor,
} from '../api/tutors.api';
import { type Tutor, type TutorListParams } from '../types/tutor.types';

/**
 * Query-key factory. Colocating keys with the feature keeps cache
 * invalidation predictable and type-safe, e.g.
 * `queryClient.invalidateQueries({ queryKey: tutorKeys.lists() })`.
 */
export const tutorKeys = {
  all: ['tutors'] as const,
  lists: () => [...tutorKeys.all, 'list'] as const,
  list: (params: TutorListParams) => [...tutorKeys.lists(), params] as const,
  details: () => [...tutorKeys.all, 'detail'] as const,
  detail: (id: string) => [...tutorKeys.details(), id] as const,
  reviews: (id: string) => [...tutorKeys.detail(id), 'reviews'] as const,
  saved: () => [...tutorKeys.all, 'saved'] as const,
  facets: () => [...tutorKeys.all, 'facets'] as const,
};

/** List tutors with optional filters, sort and pagination. */
export function useTutors(params: TutorListParams = {}) {
  return useQuery({
    queryKey: tutorKeys.list(params),
    queryFn: () => getTutors(params),
  });
}

/**
 * Available filter-bar facets (specialties, spoken languages). Rarely changes,
 * so it's cached aggressively — the filter dropdowns read from here instead of
 * hard-coding catalog values.
 */
export function useTutorFacets() {
  return useQuery({
    queryKey: tutorKeys.facets(),
    queryFn: () => getTutorFacets(),
    staleTime: 5 * 60 * 1000,
  });
}

/** Top-rated tutors for the marketing home page. */
export function useFeaturedTutors(count = 4) {
  return useTutors({ sort: 'top-rated', pageSize: count });
}

/** List the student's saved (hearted) tutors. */
export function useSavedTutors() {
  return useQuery({
    queryKey: tutorKeys.saved(),
    queryFn: () => getSavedTutors(),
  });
}

/**
 * Set of saved tutor ids, derived from the same cache as {@link useSavedTutors}
 * (shared query key → no extra request). Use it to light up the heart on any
 * tutor card.
 */
export function useSavedTutorIds() {
  return useQuery({
    queryKey: tutorKeys.saved(),
    queryFn: () => getSavedTutors(),
    select: (data) => new Set(data.data.map((tutor) => tutor.id)),
  });
}

/**
 * Toggle a tutor's saved state. Pass the tutor plus its *current* saved value;
 * the hook calls the right endpoint and optimistically updates the saved-list
 * cache so the heart and the saved page react instantly.
 */
export function useToggleSavedTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tutor, saved }: { tutor: Tutor; saved: boolean }) =>
      saved ? unsaveTutor(tutor.id) : saveTutor(tutor.id),
    onMutate: async ({ tutor, saved }) => {
      await queryClient.cancelQueries({ queryKey: tutorKeys.saved() });
      const previous = queryClient.getQueryData<Paginated<Tutor>>(
        tutorKeys.saved(),
      );

      queryClient.setQueryData<Paginated<Tutor>>(tutorKeys.saved(), (old) => {
        const base: Paginated<Tutor> = old ?? {
          data: [],
          meta: { page: 1, pageSize: 0, total: 0, totalPages: 1 },
        };
        const withoutTutor = base.data.filter((t) => t.id !== tutor.id);
        const data = saved ? withoutTutor : [tutor, ...withoutTutor];
        return { ...base, data, meta: { ...base.meta, total: data.length } };
      });

      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(tutorKeys.saved(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tutorKeys.saved() });
    },
  });
}

/** Fetch a single tutor; disabled until an id is provided. */
export function useTutor(id: string) {
  return useQuery({
    queryKey: tutorKeys.detail(id),
    queryFn: () => getTutorById(id),
    enabled: Boolean(id),
  });
}

/** Fetch a tutor's reviews; disabled until an id is provided. */
export function useTutorReviews(id: string, count = 6) {
  return useQuery({
    queryKey: tutorKeys.reviews(id),
    queryFn: () => getTutorReviews(id, count),
    enabled: Boolean(id),
  });
}
