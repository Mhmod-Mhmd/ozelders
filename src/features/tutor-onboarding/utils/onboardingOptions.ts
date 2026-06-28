import { COUNTRIES, WEEKDAYS } from '@/features/tutors/utils/filterOptions';
import { type Availability } from '@/features/tutors/types/tutor.types';
import {
  type CertificateInput,
  type EducationItemInput,
  type LanguageSkillInput,
} from '../types/onboarding.types';

/**
 * Static option lists for the onboarding selects. Reuses the tutor filter data
 * for countries/weekdays so the picker, the photo-preview flag and the public
 * catalog stay in agreement. Display labels are resolved with `t()` from the
 * `onboarding.*` / `student.*` namespaces, so values here are locale-agnostic.
 */

export { COUNTRIES, WEEKDAYS };

/** Flag emoji for a country name (used in the photo-preview card). */
export function countryFlag(name: string): string {
  return COUNTRIES.find((c) => c.name === name)?.flag ?? '';
}

/** Languages a tutor can list — values match the `student.languages.*` keys. */
export const LANGUAGE_OPTIONS = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Japanese',
  'Mandarin',
  'Hindi',
  'Portuguese',
  'Russian',
  'Urdu',
] as const;

/** Proficiency levels, strongest first — labels via `onboarding.levels.*`. */
export const LEVELS = ['native', 'c2', 'c1', 'b2', 'b1', 'a2', 'a1'] as const;

/** Higher-education degree types — labels via `onboarding.degreeTypes.*`. */
export const DEGREE_TYPES = [
  'bachelor',
  'master',
  'phd',
  'associate',
  'other',
] as const;

/** Teaching certificates — labels via `onboarding.certificates.*`. */
export const CERTIFICATES = [
  'tefl',
  'tesol',
  'celta',
  'delta',
  'dele',
  'other',
] as const;

/** Descending year list for the "Years of study" selects. */
export function yearOptions(): number[] {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let y = current + 6; y >= 1980; y--) years.push(y);
  return years;
}

/** Blank repeatable-row templates used when adding a new entry. */
export const EMPTY_LANGUAGE: LanguageSkillInput = { language: '', level: 'native' };

export const EMPTY_CERTIFICATE: CertificateInput = {
  subject: '',
  certificate: '',
  description: '',
  issuedBy: '',
  yearFrom: '',
  yearTo: '',
};

export const EMPTY_EDUCATION: EducationItemInput = {
  university: '',
  degree: '',
  degreeType: '',
  specialization: '',
  yearFrom: '',
  yearTo: '',
};

/** A fully-empty weekly availability grid. */
export const EMPTY_AVAILABILITY: Availability = {
  Mon: [],
  Tue: [],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
  Sun: [],
};
