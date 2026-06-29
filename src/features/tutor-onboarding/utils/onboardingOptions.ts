import { COUNTRIES, WEEKDAYS } from '@/features/tutors/utils/filterOptions';
import { TIMEZONES } from '@/features/account/utils/timezones';
import {
  type CertificateInput,
  type DayAvailability,
  type EducationItemInput,
  type LanguageSkillInput,
  type TimeRange,
  type WeeklySchedule,
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

/* ------------------------------------------------------------------ */
/* Availability — timezone + weekly working hours                      */
/* ------------------------------------------------------------------ */

export { TIMEZONES };

/** Selectable clock times in 30-minute steps ("00:00" … "23:30"). */
export const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

/** Default working block applied to a freshly-enabled day or a new timeslot. */
export const DEFAULT_TIME_RANGE: TimeRange = { from: '09:00', to: '17:00' };

/** The signed-in browser's IANA timezone, narrowed to a value the select
 *  actually lists (so it's always selectable); falls back to Istanbul. */
export function detectTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONES.includes(tz) ? tz : 'Europe/Istanbul';
  } catch {
    return 'Europe/Istanbul';
  }
}

/** A blank week — every day off, no slots. */
export function emptySchedule(): WeeklySchedule {
  return Object.fromEntries(
    WEEKDAYS.map((day) => [day, { enabled: false, slots: [] }]),
  );
}

/** A sensible starting week — every day on, 09:00–17:00 (matches the design). */
export function defaultSchedule(): WeeklySchedule {
  return Object.fromEntries(
    WEEKDAYS.map((day) => [
      day,
      { enabled: true, slots: [{ ...DEFAULT_TIME_RANGE }] } satisfies DayAvailability,
    ]),
  );
}
