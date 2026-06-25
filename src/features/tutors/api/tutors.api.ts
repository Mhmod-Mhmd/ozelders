import { httpClient } from '@/lib/axios';
import { type Paginated } from '@/types';
import {
  type Review,
  type Tutor,
  type TutorFacets,
  type TutorListParams,
} from '../types/tutor.types';

const RESOURCE = '/tutors';

/** Fetch a paginated, filterable, sortable list of tutors. */
export async function getTutors(
  params: TutorListParams = {},
): Promise<Paginated<Tutor>> {
  const { data } = await httpClient.get<Paginated<Tutor>>(RESOURCE, { params });
  return data;
}

/** Fetch the available filter facets (specialties, spoken languages). */
export async function getTutorFacets(): Promise<TutorFacets> {
  const { data } = await httpClient.get<TutorFacets>(`${RESOURCE}/facets`);
  return data;
}

/** Fetch the student's saved (hearted) tutors. */
export async function getSavedTutors(
  params: { page?: number; pageSize?: number } = {},
): Promise<Paginated<Tutor>> {
  const { data } = await httpClient.get<Paginated<Tutor>>(`${RESOURCE}/saved`, {
    params,
  });
  return data;
}

/** Save (heart) a tutor; returns the saved tutor. */
export async function saveTutor(id: string): Promise<Tutor> {
  const { data } = await httpClient.post<Tutor>(`${RESOURCE}/${id}/save`);
  return data;
}

/** Remove a tutor from the saved list; returns the removed tutor. */
export async function unsaveTutor(id: string): Promise<Tutor> {
  const { data } = await httpClient.delete<Tutor>(`${RESOURCE}/${id}/save`);
  return data;
}

/** Fetch a single tutor by id. */
export async function getTutorById(id: string): Promise<Tutor> {
  const { data } = await httpClient.get<Tutor>(`${RESOURCE}/${id}`);
  return data;
}

/** Fetch a page of reviews for a tutor. */
export async function getTutorReviews(
  id: string,
  count = 6,
): Promise<Paginated<Review>> {
  const { data } = await httpClient.get<Paginated<Review>>(
    `${RESOURCE}/${id}/reviews`,
    { params: { count } },
  );
  return data;
}
