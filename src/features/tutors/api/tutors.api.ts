import { httpClient } from '@/lib/axios';
import { type Paginated } from '@/types';
import { type Tutor, type TutorFilters } from '../types/tutor.types';

const RESOURCE = '/tutors';

/** Fetch a paginated, filterable list of tutors. */
export async function getTutors(
  filters: TutorFilters = {},
): Promise<Paginated<Tutor>> {
  const { data } = await httpClient.get<Paginated<Tutor>>(RESOURCE, {
    params: filters,
  });
  return data;
}

/** Fetch a single tutor by id. */
export async function getTutorById(id: string): Promise<Tutor> {
  const { data } = await httpClient.get<Tutor>(`${RESOURCE}/${id}`);
  return data;
}
