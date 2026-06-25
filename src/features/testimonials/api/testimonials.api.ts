import { httpClient } from '@/lib/axios';
import { type Paginated } from '@/types';
import { type Testimonial } from '../types/testimonial.types';

const RESOURCE = '/testimonials';

/** Fetch learner testimonials. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const { data } = await httpClient.get<Paginated<Testimonial>>(RESOURCE);
  return data.data;
}
