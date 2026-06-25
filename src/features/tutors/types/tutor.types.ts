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
export type SortKey = 'top-rated' | 'price-asc' | 'price-desc' | 'most-reviews';

/** Active filters for the tutor listing page. */
export interface TutorFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  nativeOnly?: boolean;
  availability?: AvailabilityPeriod[];
}

/** Full query for the `GET /tutors` endpoint: filters + sort + pagination. */
export interface TutorListParams extends TutorFilters {
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}
