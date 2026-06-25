import { httpClient } from '@/lib/axios';
import { type Paginated } from '@/types';
import { type Subject } from '../types/subject.types';

const RESOURCE = '/subjects';

/** Fetch the subject catalog. */
export async function getSubjects(): Promise<Subject[]> {
  const { data } = await httpClient.get<Paginated<Subject>>(RESOURCE);
  return data.data;
}
