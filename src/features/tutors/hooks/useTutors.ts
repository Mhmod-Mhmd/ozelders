import { useQuery } from '@tanstack/react-query';
import { getTutorById, getTutors } from '../api/tutors.api';
import { type TutorFilters } from '../types/tutor.types';

/**
 * Query-key factory. Colocating keys with the feature keeps cache
 * invalidation predictable and type-safe, e.g.
 * `queryClient.invalidateQueries({ queryKey: tutorKeys.lists() })`.
 */
export const tutorKeys = {
  all: ['tutors'] as const,
  lists: () => [...tutorKeys.all, 'list'] as const,
  list: (filters: TutorFilters) => [...tutorKeys.lists(), filters] as const,
  details: () => [...tutorKeys.all, 'detail'] as const,
  detail: (id: string) => [...tutorKeys.details(), id] as const,
};

/** List tutors with optional filters. */
export function useTutors(filters: TutorFilters = {}) {
  return useQuery({
    queryKey: tutorKeys.list(filters),
    queryFn: () => getTutors(filters),
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
