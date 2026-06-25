/**
 * Curated IANA timezone list for the timezone select. The GMT offset shown to
 * the user is computed per-locale via `Intl`, so labels stay correct across
 * DST and never need hard-coded offsets.
 */
export const TIMEZONES: string[] = [
  'Europe/Istanbul',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Europe/Madrid',
  'Europe/Moscow',
  'Africa/Cairo',
  'Asia/Dubai',
  'Asia/Riyadh',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Australia/Sydney',
  'UTC',
];

/** The GMT offset for a timezone (e.g. `GMT+3`) in the given locale. */
export function timezoneOffset(timeZone: string, locale: string): string {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      timeZone,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date());
    const name = parts.find((p) => p.type === 'timeZoneName')?.value;
    return name && name !== 'GMT' ? name : 'GMT+0';
  } catch {
    return 'GMT';
  }
}

/** Human label for a timezone option, e.g. `Europe/Istanbul (GMT+3)`. */
export function timezoneLabel(timeZone: string, locale: string): string {
  const city = timeZone.replace(/_/g, ' ');
  if (timeZone === 'UTC') return 'UTC (GMT+0)';
  return `${city} (${timezoneOffset(timeZone, locale)})`;
}
