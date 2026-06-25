import { useQuery } from '@tanstack/react-query';
import { getTestimonials } from '../api/testimonials.api';

export const testimonialKeys = {
  all: ['testimonials'] as const,
  list: () => [...testimonialKeys.all, 'list'] as const,
};

/** Fetch learner testimonials. */
export function useTestimonials() {
  return useQuery({
    queryKey: testimonialKeys.list(),
    queryFn: getTestimonials,
    staleTime: Infinity,
  });
}
