import { type ID } from '@/types';

export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type AvailabilityPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

/** Which periods a tutor is available, per weekday. */
export type Availability = Record<Weekday, AvailabilityPeriod[]>;

/** A language the tutor speaks, with proficiency. */
export interface LanguageSkill {
  language: string;
  level: string; // "Native", "C2", "B2", …
}

export interface Tutor {
  id: ID;
  name: string;
  avatarUrl: string;
  country: string;
  countryFlag: string; // emoji flag
  /** Primary subject taught, e.g. "English" or "Mathematics". */
  subject: string;
  /** Category key, matches a Subject.key (e.g. "languages"). */
  category: string;
  /** Specialty tags shown as chips, e.g. "Conversational", "Exam prep". */
  tags: string[];
  speaks: LanguageSkill[];
  isNativeSpeaker: boolean;
  /** Highlighted "super tutor" badge. */
  superTutor: boolean;
  /** Vetted professional with verified teaching certificates. */
  professional: boolean;
  rating: number; // 0–5
  reviewsCount: number;
  pricePerHour: number; // USD
  lessonsCount: number;
  studentsCount: number;
  responseTime: string; // "within an hour"
  headline: string; // short tagline
  bio: string; // longer about text
  availability: Availability;
}

export interface Review {
  id: ID;
  tutorId: ID;
  author: string;
  authorAvatarUrl: string;
  rating: number;
  date: string; // ISO date
  comment: string;
}

/** Sort options for the tutor listing page. */
export type SortKey =
  | 'top-rated'
  | 'price-asc'
  | 'price-desc'
  | 'popularity'
  | 'most-reviews'
  | 'best-rating';

/** Active filters for the tutor listing page. */
export interface TutorFilters {
  category?: string;
  /** Subject/language the student wants to learn, e.g. "English". */
  subject?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  nativeOnly?: boolean;
  /** Only "super tutors". */
  superTutor?: boolean;
  /** Only vetted professional tutors. */
  professional?: boolean;
  /** Specialty tags to include (OR-matched against `Tutor.tags`). */
  specialties?: string[];
  /** Spoken languages to include (OR-matched against `Tutor.speaks`). */
  languages?: string[];
  /** Countries of birth to include (OR-matched). */
  countries?: string[];
  availability?: AvailabilityPeriod[];
  /** Weekdays the tutor must be available on (OR-matched). */
  days?: Weekday[];
}

/** Facet values available for the filter bar, derived from the catalog. */
export interface TutorFacets {
  /** Distinct specialty tags, most common first. */
  specialties: string[];
  /** Distinct spoken languages, most common first. */
  languages: string[];
}

/** Full query for the `GET /tutors` endpoint: filters + sort + pagination. */
export interface TutorListParams extends TutorFilters {
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}
