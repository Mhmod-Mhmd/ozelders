import { useQuery } from '@tanstack/react-query';
import { getSubjects } from '../api/subjects.api';

export const subjectKeys = {
  all: ['subjects'] as const,
  list: () => [...subjectKeys.all, 'list'] as const,
};

/** Fetch the subject catalog (cached for the session). */
export function useSubjects() {
  return useQuery({
    queryKey: subjectKeys.list(),
    queryFn: getSubjects,
    staleTime: Infinity,
  });
}
