import { type AvailabilityPeriod, type Weekday } from '../types/tutor.types';

/**
 * Static reference data for the find-tutor filter bar. Kept out of components so
 * the option lists, flags, and slot→period mapping live in one place. The
 * country `name` values intentionally match the `country` field on tutors so a
 * selection filters the real list; extra (no-tutor) countries are still offered
 * for a realistic picker, exactly like a production country selector.
 */

export interface CountryOption {
  /** Matches `Tutor.country`; also the i18n key under `student.countries.*`. */
  name: string;
  flag: string;
  /** Surfaced in the "Popular" group at the top of the picker. */
  popular?: boolean;
}

export const COUNTRIES: CountryOption[] = [
  { name: 'United States', flag: '🇺🇸', popular: true },
  { name: 'United Kingdom', flag: '🇬🇧', popular: true },
  { name: 'Türkiye', flag: '🇹🇷', popular: true },
  { name: 'France', flag: '🇫🇷', popular: true },
  { name: 'Germany', flag: '🇩🇪', popular: true },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Russia', flag: '🇷🇺' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Pakistan', flag: '🇵🇰' },
];

export interface TimeSlot {
  /** Stored/display value, e.g. "9-12". */
  value: string;
  /** Coarse availability bucket used for server-side filtering. */
  period: AvailabilityPeriod;
}

export interface TimeGroup {
  /** i18n key under `student.availability.*`. */
  key: 'daytime' | 'eveningNight' | 'morning';
  slots: TimeSlot[];
}

export const TIME_GROUPS: TimeGroup[] = [
  {
    key: 'daytime',
    slots: [
      { value: '9-12', period: 'morning' },
      { value: '12-15', period: 'afternoon' },
      { value: '15-18', period: 'afternoon' },
    ],
  },
  {
    key: 'eveningNight',
    slots: [
      { value: '18-21', period: 'evening' },
      { value: '21-24', period: 'night' },
      { value: '0-3', period: 'night' },
    ],
  },
  {
    key: 'morning',
    slots: [
      { value: '3-6', period: 'night' },
      { value: '6-9', period: 'morning' },
    ],
  },
];

const SLOT_PERIOD = new Map(
  TIME_GROUPS.flatMap((g) => g.slots).map((s) => [s.value, s.period]),
);

/** Map selected time-slot values to the unique periods they cover. */
export function slotsToPeriods(slots: string[]): AvailabilityPeriod[] {
  return [...new Set(slots.map((s) => SLOT_PERIOD.get(s)).filter(Boolean) as AvailabilityPeriod[])];
}

export const WEEKDAYS: Weekday[] = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

/** Inclusive price-per-lesson bounds (USD). The max behaves as "and up". */
export const PRICE_MIN = 3;
export const PRICE_MAX = 40;

/** Inclusive price range, in USD per lesson. */
export interface PriceRange {
  min: number;
  max: number;
}

export const DEFAULT_PRICE: PriceRange = { min: PRICE_MIN, max: PRICE_MAX };

/** True when the range is the full default span (no real filter applied). */
export function isDefaultPrice(p: PriceRange): boolean {
  return p.min <= PRICE_MIN && p.max >= PRICE_MAX;
}

/** Localized "$3 – $40+" summary; the max shows a "+" when it's the ceiling. */
export function formatPriceRange(p: PriceRange, locale: string): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);
  const max = p.max >= PRICE_MAX ? `${fmt(p.max)}+` : fmt(p.max);
  return `${fmt(p.min)} – ${max}`;
}

/** Selected availability: time slots plus weekdays. */
export interface AvailabilitySelection {
  slots: string[];
  days: Weekday[];
}

export const EMPTY_AVAILABILITY: AvailabilitySelection = { slots: [], days: [] };
