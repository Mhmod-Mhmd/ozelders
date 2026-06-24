/**
 * Locale-aware formatting helpers. Defaults target Turkey (tr-TR / TRY) since
 * Ozelders is a Turkish tutoring platform — override the locale per call where
 * needed.
 */

const DEFAULT_LOCALE = 'tr-TR';

export function formatCurrency(
  amount: number,
  currency = 'TRY',
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}

export function formatNumber(value: number, locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale).format(value);
}
